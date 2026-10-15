export const CHALLENGES = [
  { id: "luz_natural", title: "Dale paso al sol", short: "Luz natural", text: "Aprovecha la luz natural para estudiar o realizar una actividad, cuando sea suficiente y cómodo.", tip: "Acércate a una ventana y comprueba que puedes ver bien sin forzar la vista.", icon: "sun" },
  { id: "apagar_luces", title: "La última persona apaga", short: "Apagar luces", text: "Apaga las luces que no se necesitan al salir de un espacio.", tip: "Acuerden una señal sencilla para recordar apagar. Conserva la iluminación necesaria para la seguridad.", icon: "bulb" },
  { id: "espera_segura", title: "Una pausa de verdad", short: "Equipos en espera", text: "Con un adulto, identifica equipos que pueden apagarse o desconectarse de forma segura cuando no se usan.", tip: "No manipules cables ni enchufes. No desconectes neveras, equipos médicos o dispositivos que deban permanecer encendidos.", icon: "power" },
  { id: "uso_equipos", title: "Usa solo lo que necesitas", short: "Uso de equipos", text: "Evita dejar televisión, computador u otros equipos de entretenimiento encendidos sin utilizarlos.", tip: "La familia puede acordar cuándo encender y apagar. No cambies las condiciones de equipos esenciales.", icon: "screen" },
  { id: "leer_consumo", title: "Conoce tu consumo", short: "Leer consumo", text: "Con un adulto, ubica los kWh y las fechas del periodo en una factura, si está disponible.", tip: "No subas fotos ni escribas dirección, número de contrato, nombres o datos de pago.", icon: "chart" },
  { id: "conversar", title: "Hagamos un acuerdo", short: "Conversar en familia", text: "Conversen sobre una práctica de consumo responsable y una dificultad para mantenerla.", tip: "Escucha a cada persona. Elijan una acción posible sin culpas ni competencia.", icon: "talk" },
] as const;

export const KNOWLEDGE = [
  { id: "K1", question: "¿En qué unidad se suele expresar el consumo de energía eléctrica de una factura?", options: ["Kilovatios hora (kWh)", "Litros", "Grados Celsius"], answer: "a" },
  { id: "K2", question: "Si una habitación queda vacía y la luz no se necesita, ¿qué acción es adecuada?", options: ["Dejar todas las luces encendidas", "Apagar la luz", "Encender otra lámpara"], answer: "b" },
  { id: "K3", question: "¿Qué puede ocurrir con algunos equipos cuando quedan en modo de espera?", options: ["Siempre dejan de consumir por completo", "Producen energía para la vivienda", "Pueden seguir consumiendo energía"], answer: "c" },
  { id: "K4", question: "¿Quién debe revisar y realizar una desconexión de equipos eléctricos en casa?", options: ["Un adulto que verifique que sea seguro y que el equipo no deba seguir encendido", "Un menor que tire del cable", "Cualquier persona sin revisar el equipo"], answer: "a" },
  { id: "K5", question: "¿Cuál es un uso responsable de la luz natural?", options: ["Usarla aunque no permita ver bien", "Aprovecharla cuando ilumina de forma suficiente y cómoda", "Cerrar siempre las cortinas y encender lámparas"], answer: "b" },
  { id: "K6", question: "¿Qué información ayuda a comparar dos periodos de consumo eléctrico?", options: ["Solo el valor pagado en pesos", "Solo el color de la factura", "Los kWh y la cantidad de días de cada periodo"], answer: "c" },
  { id: "K7", question: "¿Por qué el valor pagado no equivale directamente a la energía consumida?", options: ["Porque puede depender de tarifas y otros cobros", "Porque siempre es igual a los kWh", "Porque nunca cambia"], answer: "a" },
  { id: "K8", question: "Si el consumo baja después de una actividad escolar, ¿qué conclusión es prudente?", options: ["La actividad fue la única causa de la reducción", "Se observa una variación y deben revisarse otros factores", "Todas las familias ahorraron la misma cantidad"], answer: "b" },
  { id: "K9", question: "¿Qué situación puede cambiar el consumo de una vivienda?", options: ["Solo el nombre del estudiante", "Solo la fecha de la encuesta", "Cambios en ocupantes, clima o uso de equipos"], answer: "c" },
  { id: "K10", question: "¿Cuál es una forma útil de sostener una práctica ambiental?", options: ["Acordar acciones posibles, registrar y revisar las dificultades", "Culpar a quien olvida", "Competir sin revisar las condiciones del hogar"], answer: "a" },
] as const;

export const HABITS = [
  { id: "H1", question: "Apagué luces que no se necesitaban al salir de un espacio." },
  { id: "H2", question: "Aproveché la luz natural cuando era suficiente y cómoda." },
  { id: "H3", question: "Apagué equipos de entretenimiento que no estaban en uso." },
  { id: "H4", question: "Con un adulto, observé la revisión o el apagado seguro de equipos en espera." },
  { id: "H5", question: "Conversé con mi familia sobre el uso responsable de la electricidad." },
] as const;

export const ATTITUDES = [
  { id: "A1", question: "Considero importante usar la energía eléctrica de manera responsable." },
  { id: "A2", question: "Me siento capaz de proponer una acción segura y posible para mi hogar." },
  { id: "A3", question: "Estoy dispuesto/a a revisar mis prácticas y escuchar a mi familia." },
] as const;

export function todayBogota() { return new Date(Date.now() - 5 * 3600000).toISOString().slice(0, 10); }
export function cycleDays(start: string, end: string) { return Math.round((Date.parse(end + "T00:00:00Z") - Date.parse(start + "T00:00:00Z")) / 86400000) + 1; }
export function knowledgeScore(values: string[]) { if (values.length !== 10 || values.some(v => v === "sin_respuesta")) return null; return values.reduce((n, v, i) => n + (v === KNOWLEDGE[i]?.answer ? 1 : 0), 0); }
export type ActionRow = { id: string; household: string; date: string; week: number; setting: string; action: string; applies: boolean; completed: boolean | null; barrier: string; minutes: number | null; isExample: boolean; createdAt: string };
export type SurveyRow = { id: string; household: string; date: string; moment: string; knowledge: string[]; habits: (number | "no_aplica" | "no_recuerdo" | "sin_respuesta")[]; attitudes: (number | "sin_respuesta")[]; createdAt: string };
export type BillRow = { id: string; household: string; start: string; end: string; days: number; kwh: number; occupants: number | null; event: string; createdAt: string };
export type AccountData = { actions: ActionRow[]; surveys: SurveyRow[]; bills: BillRow[] };
