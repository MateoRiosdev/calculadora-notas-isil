import { CalculatorMode, GradeRow } from "@/types/calculator";
import { defaultRows } from "./grade-presets";

export interface AcademicEvent {
  id: string;
  title: string;
  rowId?: string;
  start: string;
  end: string;
  originalStart: string;
  originalEnd: string;
  done: boolean;
}
export interface Course {
  id: string;
  name: string;
  code: string;
  color: string;
  mode: CalculatorMode;
  rows: GradeRow[];
  events: AcademicEvent[];
}
export interface AcademicPage {
  id: string;
  name: string;
  courses: Course[];
}
export const STORAGE_KEY = "isil-academic-v1";
export const colors = [
  "#0284c7",
  "#7c3aed",
  "#0d9488",
  "#d97706",
  "#db2777",
  "#4f46e5",
];
export const uid = () => crypto.randomUUID();
export function newPage(name = "Mi ciclo"): AcademicPage {
  return { id: uid(), name, courses: [] };
}
export function newCourse(name: string, code: string, color: string): Course {
  return {
    id: uid(),
    name,
    code,
    color,
    mode: "actual",
    rows: defaultRows("actual"),
    events: [],
  };
}
export function weighted(rows: GradeRow[]) {
  return rows.reduce(
    (sum, r) =>
      sum + ((Number(r.grade) || 0) * (Number(r.percentage) || 0)) / 100,
    0,
  );
}
export function validPeriod(start: string, end: string) {
  return (
    Number.isFinite(new Date(start).getTime()) &&
    Number.isFinite(new Date(end).getTime()) &&
    new Date(end) > new Date(start)
  );
}
export function localDate(date: Date) {
  const pad = (v: number) => String(v).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}
export function calendarWeeks(month: Date): Date[][] {
  const first = new Date(month.getFullYear(), month.getMonth(), 1);
  first.setDate(first.getDate() - ((first.getDay() + 6) % 7));
  const last = new Date(month.getFullYear(), month.getMonth() + 1, 0);
  const weeks: Date[][] = [];
  while (first <= last) {
    weeks.push(
      Array.from(
        { length: 7 },
        (_, i) =>
          new Date(first.getFullYear(), first.getMonth(), first.getDate() + i),
      ),
    );
    first.setDate(first.getDate() + 7);
  }
  return weeks;
}
export function eventSegment(event: AcademicEvent, week: Date[]) {
  if (!validPeriod(event.start, event.end)) return null;
  const start = event.start.slice(0, 10),
    end = localDate(new Date(new Date(event.end).getTime() - 1));
  const visible = week
    .map(localDate)
    .map((date, i) => (date >= start && date <= end ? i : -1))
    .filter((i) => i >= 0);
  return visible.length
    ? { start: visible[0] + 1, span: visible.length }
    : null;
}
export function eventTitle(course: Course, event: AcademicEvent) {
  return `${course.code ? course.code + " · " : ""}${course.name} — ${event.title}`;
}
const stamp = (value: string | Date) =>
  new Date(value)
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}/, "");
const escapeICS = (value: string) =>
  value
    .replace(/\\/g, "\\\\")
    .replace(/\r\n|\r|\n/g, "\\n")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,");
function fold(line: string) {
  const lines: string[] = [];
  let part = "";
  let size = 0;
  for (const c of line) {
    const bytes = new TextEncoder().encode(c).length;
    if (size + bytes > 75) {
      lines.push(part);
      part = " ";
      size = 1;
    }
    part += c;
    size += bytes;
  }
  lines.push(part);
  return lines.join("\r\n");
}
export function makeICS(
  items: { course: Course; event: AcademicEvent }[],
  now = new Date(),
) {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//MateoRiosdev//Agenda ISIL//ES",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
  ];
  items
    .filter(({ event }) => validPeriod(event.start, event.end))
    .forEach(({ course, event }) =>
      lines.push(
        "BEGIN:VEVENT",
        `UID:${event.id}@calculadora-notas-isil`,
        `DTSTAMP:${stamp(now)}`,
        `DTSTART:${stamp(event.start)}`,
        `DTEND:${stamp(event.end)}`,
        `SUMMARY:${escapeICS(eventTitle(course, event))}`,
        `DESCRIPTION:${escapeICS("Organizado con Calculadora de Notas ISIL. " + (event.done ? "Entregado." : "Pendiente."))}`,
        "END:VEVENT",
      ),
    );
  lines.push("END:VCALENDAR");
  return lines.map(fold).join("\r\n") + "\r\n";
}
export function googleCalendarURL(course: Course, event: AcademicEvent) {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: eventTitle(course, event),
    dates: `${stamp(event.start)}/${stamp(event.end)}`,
    details: "Organizado con Calculadora de Notas ISIL.",
  });
  return `https://calendar.google.com/calendar/render?${params}`;
}
export function parseSaved(raw: string): AcademicPage[] {
  const data: unknown = JSON.parse(raw);
  if (!Array.isArray(data) || !data.length) throw new Error("Datos no válidos");
  const ids = new Set<string>();
  const id = (value: unknown) => {
    if (typeof value !== "string" || !value || ids.has(value))
      throw new Error("Identificador no válido");
    ids.add(value);
  };
  for (const page of data) {
    id(page.id);
    if (typeof page.name !== "string" || !Array.isArray(page.courses))
      throw new Error("Página no válida");
    for (const course of page.courses) {
      id(course.id);
      if (
        typeof course.name !== "string" ||
        typeof course.code !== "string" ||
        !/^#[0-9a-f]{6}$/i.test(course.color) ||
        !["actual", "antiguo", "english"].includes(course.mode) ||
        !Array.isArray(course.rows) ||
        !course.rows.length ||
        !Array.isArray(course.events)
      )
        throw new Error("Curso no válido");
      const rowIds = new Set<string>();
      for (const row of course.rows) {
        if (
          typeof row.id !== "string" ||
          rowIds.has(row.id) ||
          typeof row.description !== "string" ||
          typeof row.grade !== "string" ||
          typeof row.percentage !== "string" ||
          (row.section !== undefined && typeof row.section !== "string")
        )
          throw new Error("Nota no válida");
        rowIds.add(row.id);
      }
      for (const event of course.events) {
        id(event.id);
        if (
          typeof event.title !== "string" ||
          typeof event.done !== "boolean" ||
          typeof event.start !== "string" ||
          typeof event.end !== "string" ||
          !validPeriod(event.start, event.end) ||
          typeof event.originalStart !== "string" ||
          typeof event.originalEnd !== "string" ||
          !validPeriod(event.originalStart, event.originalEnd) ||
          (event.rowId !== undefined && typeof event.rowId !== "string")
        )
          throw new Error("Evento no válido");
      }
    }
  }
  return data as AcademicPage[];
}
