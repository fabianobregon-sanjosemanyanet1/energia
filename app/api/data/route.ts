import { and, eq, desc } from "drizzle-orm";
import { getChatGPTUser } from "../../chatgpt-auth";
import { getDb } from "../../../db";
import { actions, surveys, bills } from "../../../db/schema";
import { recordSchema, deleteSchema } from "../../../lib/validation";
import { KNOWLEDGE, HABITS, ATTITUDES, knowledgeScore } from "../../../lib/instruments";

export const dynamic = "force-dynamic";
const privateHeaders = { "Cache-Control": "no-store, private" };
function json(value: unknown, status = 200) { return Response.json(value, { status, headers: privateHeaders }); }
function clean<T extends { ownerId: string }>(row: T): Omit<T, "ownerId"> { const { ownerId: _ownerId, ...safe } = row; void _ownerId; return safe; }
function csvCell(value: unknown): string { let s = value == null ? "" : String(value); if (/^[\s]*[=+\-@]/.test(s) || /^[\t\r\n]/.test(s)) s = "'" + s; return '"' + s.replace(/"/g, '""') + '"'; }
function isSameOrigin(request: Request) { const origin = request.headers.get("origin"); return !origin || origin === new URL(request.url).origin; }
function problem(error: unknown) { const msg = error instanceof Error ? error.message + (error.cause instanceof Error ? error.cause.message : "") : ""; if (msg.includes("UNIQUE constraint failed")) return json({ error: "Ya existe un cuestionario de ese momento o una factura de ese periodo para este código. Revisa el registro existente." }, 409); console.error("Record request failed", error instanceof Error ? error.name : "unknown"); return json({ error: "No se pudo completar la operación. Tus registros anteriores se conservan. Inténtalo de nuevo." }, 500); }

export async function GET(request: Request) {
  const user = await getChatGPTUser();
  if (!user) return json({ error: "Inicia sesión para consultar tus registros." }, 401);
  try {
    const db = getDb();
    const [a, s, b] = await Promise.all([
      db.select().from(actions).where(eq(actions.ownerId, user.userId)).orderBy(desc(actions.date), desc(actions.createdAt)),
      db.select().from(surveys).where(eq(surveys.ownerId, user.userId)).orderBy(desc(surveys.date), desc(surveys.createdAt)),
      db.select().from(bills).where(eq(bills.ownerId, user.userId)).orderBy(desc(bills.end), desc(bills.createdAt)),
    ]);
    const data = { actions: a.map(clean), surveys: s.map(r => ({ ...clean(r), knowledge: JSON.parse(r.knowledge) as string[], habits: JSON.parse(r.habits) as (number | string)[], attitudes: JSON.parse(r.attitudes) as (number | string)[] })), bills: b.map(clean) };
    const url = new URL(request.url); const format = url.searchParams.get("format"); const dataset = url.searchParams.get("dataset");
    if (!format) return json(data);
    if (!["csv", "json"].includes(format) || !["actions", "surveys", "bills"].includes(dataset ?? "")) return json({ error: "Selecciona una tabla y un formato válido." }, 400);
    const rows = data[dataset as keyof typeof data];
    const filenames: Record<string, string> = { actions: "acciones", surveys: "cuestionarios", bills: "consumos" };
    const headers = { ...privateHeaders, "Content-Disposition": `attachment; filename="energia-${filenames[dataset!]}.${format}"` };
    if (format === "json") return new Response(JSON.stringify({ version: "1.0", mode: "prueba_ficticia", dataset, exportedAt: new Date().toISOString(), records: rows }, null, 2), { headers: { ...headers, "Content-Type": "application/json; charset=utf-8" } });
    let columns: string[]; let flat: Record<string, unknown>[];
    if (dataset === "surveys") {
      columns = ["id", "household", "date", "moment", ...KNOWLEDGE.map(q => q.id), ...HABITS.map(q => q.id), ...ATTITUDES.map(q => q.id), "knowledge_score", "createdAt"];
      flat = data.surveys.map(r => ({ id: r.id, household: r.household, date: r.date, moment: r.moment, ...Object.fromEntries(KNOWLEDGE.map((q,i) => [q.id, r.knowledge[i]])), ...Object.fromEntries(HABITS.map((q,i) => [q.id, r.habits[i]])), ...Object.fromEntries(ATTITUDES.map((q,i) => [q.id, r.attitudes[i]])), knowledge_score: knowledgeScore(r.knowledge), createdAt: r.createdAt }));
    } else if (dataset === "bills") { columns = ["id","household","start","end","days","kwh","kwh_day","occupants","event","createdAt"]; flat = data.bills.map(r => ({ ...r, kwh_day: Number((r.kwh / r.days).toFixed(6)) })); }
    else { columns = ["id","household","date","week","setting","action","applies","completed","barrier","minutes","isExample","createdAt"]; flat = data.actions; }
    const body = "\uFEFF" + [columns.map(csvCell).join(","), ...flat.map(r => columns.map(c => csvCell(r[c])).join(","))].join("\r\n");
    return new Response(body, { headers: { ...headers, "Content-Type": "text/csv; charset=utf-8" } });
  } catch (error) { return problem(error); }
}

export async function POST(request: Request) {
  const user = await getChatGPTUser(); if (!user) return json({ error: "Inicia sesión para guardar registros." }, 401);
  if (!isSameOrigin(request)) return json({ error: "Solicitud no permitida." }, 403);
  if (!request.headers.get("content-type")?.includes("application/json")) return json({ error: "Formato no admitido." }, 415);
  const raw = await request.text(); if (raw.length > 10000) return json({ error: "El registro es demasiado largo." }, 413);
  let input: unknown; try { input = JSON.parse(raw); } catch { return json({ error: "Revisa el formulario." }, 400); }
  const result = recordSchema.safeParse(input); if (!result.success) return json({ error: result.error.issues.map(i => i.message).join(" ") }, 400);
  try {
    const v = result.data;
    const common = { id: crypto.randomUUID(), ownerId: user.userId, createdAt: new Date().toISOString() };
    const db = getDb();
    if (v.dataset === "actions") { const { dataset: _d, trialConfirmed: _t, ...fields } = v; void _d; void _t; const [row] = await db.insert(actions).values({ ...fields, ...common }).returning(); return json({ record: clean(row) }, 201); }
    if (v.dataset === "surveys") { const { dataset: _d, trialConfirmed: _t, ...fields } = v; void _d; void _t; const [row] = await db.insert(surveys).values({ ...fields, knowledge: JSON.stringify(v.knowledge), habits: JSON.stringify(v.habits), attitudes: JSON.stringify(v.attitudes), ...common }).returning(); return json({ record: { ...clean(row), knowledge: v.knowledge, habits: v.habits, attitudes: v.attitudes } }, 201); }
    const [row] = await db.insert(bills).values({ household: v.household, start: v.start, end: v.end, days: v.days, kwh: v.kwh, occupants: v.occupants, event: v.event, ...common }).returning();
    return json({ record: clean(row) }, 201);
  } catch (error) { return problem(error); }
}

export async function DELETE(request: Request) {
  const user = await getChatGPTUser(); if (!user) return json({ error: "Inicia sesión para eliminar un registro." }, 401);
  if (!isSameOrigin(request)) return json({ error: "Solicitud no permitida." }, 403);
  try {
    const parsed = deleteSchema.safeParse(await request.json()); if (!parsed.success) return json({ error: "Registro no válido." }, 400);
    const { dataset, id } = parsed.data; const table = dataset === "actions" ? actions : dataset === "surveys" ? surveys : bills;
    const removed = await getDb().delete(table).where(and(eq(table.id, id), eq(table.ownerId, user.userId))).returning({ id: table.id });
    if (!removed.length) return json({ error: "El registro no está disponible en esta cuenta." }, 404);
    return json({ deleted: id });
  } catch (error) { return problem(error); }
}
