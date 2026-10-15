import { z } from "zod";
import { CHALLENGES, cycleDays, todayBogota } from "./instruments";

const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(v => { const d = new Date(v + "T00:00:00Z"); return !Number.isNaN(d.getTime()) && d.toISOString().slice(0,10) === v && v >= "2020-01-01" && v <= todayBogota(); }, "Usa una fecha válida entre 2020 y hoy.");
const household = z.string().trim().toUpperCase().regex(/^[A-Z][A-Z0-9-]{2,15}$/, "Usa un código de 3 a 16 caracteres; empieza con letra y usa solo letras, números o guiones.");
const trialConfirmed = z.literal(true, { errorMap: () => ({ message: "Confirma que usarás únicamente datos ficticios en esta prueba." }) });
const base = { household, trialConfirmed };
const action = z.object({ dataset: z.literal("actions"), ...base, date, week: z.number().int().min(1).max(12), setting: z.enum(["hogar", "colegio"]), action: z.enum(CHALLENGES.map(c => c.id) as [string, ...string[]]), applies: z.boolean(), completed: z.boolean().nullable(), barrier: z.string().trim().max(240), minutes: z.number().int().min(0).max(1440).nullable(), isExample: z.boolean().optional().default(false) }).strict().refine(v => v.applies ? v.completed !== null : v.completed === null, "Indica si la acción se realizó cuando aplica; si no aplica, no se registra como realizada.").refine(v => !v.applies || v.completed || v.barrier.length > 0, "Si no se realizó, registra una dificultad breve sin datos personales.");
const survey = z.object({ dataset: z.literal("surveys"), ...base, date, moment: z.enum(["pre", "post"]), knowledge: z.array(z.enum(["a", "b", "c", "no_se", "sin_respuesta"])).length(10), habits: z.array(z.union([z.number().int().min(0).max(7), z.enum(["no_aplica", "no_recuerdo", "sin_respuesta"])] )).length(5), attitudes: z.array(z.union([z.number().int().min(1).max(5), z.literal("sin_respuesta")])).length(3) }).strict();
const bill = z.object({ dataset: z.literal("bills"), ...base, start: date, end: date, days: z.number().int().min(1).max(366), kwh: z.number().finite().min(0).max(1000000), occupants: z.number().int().min(1).max(50).nullable(), event: z.string().trim().max(240) }).strict().refine(v => v.end >= v.start && [cycleDays(v.start, v.end), cycleDays(v.start, v.end) - 1].includes(v.days), "Las fechas deben estar en orden y los días facturados deben corresponder a la diferencia entre fechas o a esa diferencia más un día.");

export const recordSchema = z.union([action, survey, bill]);
export const deleteSchema = z.object({ dataset: z.enum(["actions", "surveys", "bills"]), id: z.string().uuid() }).strict();
export type ValidatedRecord = z.infer<typeof recordSchema>;
