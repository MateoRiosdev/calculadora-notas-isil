"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  CalendarDays,
  ListChecks,
  Calculator as CalculatorIcon,
  Plus,
  Download,
  ExternalLink,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle2,
  RotateCcw,
} from "lucide-react";
import Calculator from "./Calculator";
import Image from "next/image";
import { useTheme } from "./ThemeProvider";
import CourseColorPicker from "./CourseColorPicker";
import AcademicSelect from "./AcademicSelect";
import AcademicDateTime from "./AcademicDateTime";
import AcademicDialog from "./AcademicDialog";
import {
  AcademicEvent,
  AcademicPage,
  Course,
  STORAGE_KEY,
  calendarWeeks,
  colors,
  eventSegment,
  eventTitle,
  googleCalendarURL,
  localDate,
  makeICS,
  newCourse,
  newPage,
  parseSaved,
  uid,
  validPeriod,
  weighted,
} from "@/lib/academic";
import { CalculatorMode, GradeRow } from "@/types/calculator";

type Tab = "calendar" | "schedule" | "grades";
type Item = { course: Course; event: AcademicEvent };
type Editor = { courseId: string; event?: AcademicEvent };
const dateLabel = (v: string) =>
  new Date(v).toLocaleString("es-PE", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

function download(content: string, filename: string, type: string) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export default function AcademicPlanner() {
  const { theme } = useTheme();
  const restoreInput = useRef<HTMLInputElement>(null);
  const [pages, setPages] = useState<AcademicPage[]>([]);
  const [pageId, setPageId] = useState("");
  const [courseId, setCourseId] = useState("");
  const [filter, setFilter] = useState("all");
  const [tab, setTab] = useState<Tab>("grades");
  const [save, setSave] = useState(false);
  const [ready, setReady] = useState(false);
  const [revision, setRevision] = useState(0);
  const [message, setMessage] = useState("");
  const [month, setMonth] = useState(new Date());
  const [now, setNow] = useState(new Date());
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [courseEditor, setCourseEditor] = useState<Course | "new" | null>(null);
  const [pageEditor, setPageEditor] = useState<"new" | "rename" | null>(null);
  const [eventEditor, setEventEditor] = useState<Editor | null>(null);
  const [deletion, setDeletion] = useState<{
    title: string;
    run: () => void;
  } | null>(null);

  useEffect(() => {
    let initial = [newPage()];
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        initial = parseSaved(raw);
        setSave(true);
      }
    } catch {
      setMessage(
        "No se pudieron leer los datos guardados. Puedes trabajar en esta sesión; el guardado está desactivado.",
      );
    }
    setPages(initial);
    setPageId(initial[0].id);
    setCourseId(initial[0].courses[0]?.id ?? "");
    setReady(true);
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);
  useEffect(() => {
    if (!ready || !save) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(pages));
    } catch {
      setSave(false);
      setMessage(
        "No se pudieron guardar los cambios. Descarga un respaldo para conservarlos.",
      );
    }
  }, [pages, ready, save]);

  useEffect(() => {
    if (
      !ready ||
      save ||
      !(
        pages.length > 1 ||
        pages.some((p) => p.courses.length > 0 || p.name !== "Mi ciclo")
      )
    )
      return;
    const warn = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [ready, save, pages]);

  const page = pages.find((p) => p.id === pageId) ?? pages[0];
  const courses = useMemo(() => page?.courses ?? [], [page]);
  const selected = courses.find((c) => c.id === courseId) ?? courses[0];
  const updateCourse = useCallback(
    (id: string, update: (course: Course) => Course) => {
      setPages((list) =>
        list.map((p) =>
          p.id === pageId
            ? {
                ...p,
                courses: p.courses.map((c) => (c.id === id ? update(c) : c)),
              }
            : p,
        ),
      );
    },
    [pageId],
  );
  const selectedId = selected?.id;
  const updateGrades = useCallback(
    (rows: GradeRow[], mode: CalculatorMode) => {
      if (selectedId) updateCourse(selectedId, (c) => ({ ...c, rows, mode }));
    },
    [selectedId, updateCourse],
  );
  const allItems = useMemo(
    () =>
      courses
        .flatMap((course) => course.events.map((event) => ({ course, event })))
        .sort(
          (a, b) =>
            new Date(a.event.end).getTime() - new Date(b.event.end).getTime(),
        ),
    [courses],
  );
  const items = allItems.filter(
    ({ course }) => filter === "all" || course.id === filter,
  );
  const next = items.find(
    ({ event }) => !event.done && new Date(event.end) >= now,
  );
  const completed = items.filter(({ event }) => event.done).length;
  const shown = items.filter(
    ({ course, event }) =>
      (status === "all" || (status === "done" ? event.done : !event.done)) &&
      `${course.name} ${course.code} ${event.title}`
        .toLocaleLowerCase()
        .includes(search.toLocaleLowerCase()),
  );
  const changed = allItems.filter(
    ({ event: e }) => e.start !== e.originalStart || e.end !== e.originalEnd,
  ).length;
  const exportICS = (list: Item[]) => {
    if (!list.length) {
      setMessage("Añade evaluaciones con fecha para exportar el calendario.");
      return;
    }
    download(
      makeICS(list),
      "calendario-isil.ics",
      "text/calendar;charset=utf-8",
    );
  };
  const selectPage = (id: string) => {
    setPageId(id);
    setCourseId(pages.find((p) => p.id === id)?.courses[0]?.id ?? "");
    setFilter("all");
    setSearch("");
    setStatus("all");
  };
  const openGrade = (id: string) => {
    setCourseId(id);
    setFilter(id);
    setTab("grades");
  };
  const toggleSaving = (enabled: boolean) => {
    if (!enabled) {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        setMessage(
          "No se pudo desactivar el guardado. Revisa los permisos del navegador.",
        );
        return;
      }
    }
    setSave(enabled);
  };
  const removeEvent = (course: Course, event: AcademicEvent) =>
    setDeletion({
      title: `Eliminar «${event.title}»`,
      run: () =>
        updateCourse(course.id, (c) => ({
          ...c,
          events: c.events.filter((e) => e.id !== event.id),
        })),
    });
  if (!ready)
    return (
      <div className="p-8 text-center">Cargando tu espacio académico…</div>
    );

  return (
    <div className="academic">
      <section className="planner-top a-panel">
        <div className="planner-title">
          <span className="planner-logo">
            <Image
              src={theme === "light" ? "/isil2.jpg" : "/isil1.jpg"}
              alt="ISIL"
              width={64}
              height={64}
              priority
              unoptimized
            />
          </span>
          <div>
            <p className="eyebrow">TU ESPACIO DE ESTUDIO</p>
            <h1>
              Mi gestor académico <span>ISIL</span>
            </h1>
            <p className="muted">
              Tus cursos, entregas y notas, en un solo lugar.
            </p>
          </div>
        </div>
        <div className="top-actions">
          <button
            className="a-btn"
            onClick={() => setEventEditor({ courseId: selected?.id ?? "" })}
            disabled={!courses.length}
          >
            <Plus size={17} /> Nueva tarea o examen
          </button>
          <button
            className="a-btn primary"
            onClick={() => setCourseEditor("new")}
          >
            <Plus size={17} /> Agregar curso
          </button>
        </div>
        <div className="page-toolbar">
          <div className="page-select">
            <strong>Página:</strong>
            <AcademicSelect
              label="Página académica"
              value={page?.id ?? ""}
              onChange={selectPage}
              options={pages.map((p) => ({ value: p.id, label: p.name }))}
            />
          </div>
          <button className="a-btn" onClick={() => setPageEditor("new")}>
            <Plus size={16} /> Nueva página
          </button>
          <button
            className="a-icon"
            onClick={() => setPageEditor("rename")}
            title="Renombrar página"
            aria-label="Renombrar página"
          >
            <Pencil size={17} />
          </button>
          <button
            className="a-icon danger"
            title="Eliminar página"
            aria-label="Eliminar página"
            onClick={() =>
              setDeletion({
                title: `Eliminar la página «${page.name}» y todos sus cursos`,
                run: () => {
                  const rest = pages.filter((p) => p.id !== page.id);
                  const nextPages = rest.length ? rest : [newPage()];
                  setPages(nextPages);
                  setPageId(nextPages[0].id);
                  setCourseId("");
                  setFilter("all");
                },
              })
            }
          >
            <Trash2 size={17} />
          </button>
          <label className="save-choice">
            <input
              type="checkbox"
              checked={save}
              onChange={(e) => toggleSaving(e.target.checked)}
            />{" "}
            Guardar automáticamente en este navegador
          </label>
        </div>
        <p className="storage-note">
          {save ? (
            "Guardado local activado."
          ) : (
            <>
              <strong>Modo sesión:</strong> Los cambios se perderán al recargar.
            </>
          )}{" "}
          Al desactivar el guardado se elimina la copia local.{" "}
          <button
            className="backup-button"
            type="button"
            onClick={() =>
              download(
                JSON.stringify(pages, null, 2),
                "mis-cursos-isil.json",
                "application/json",
              )
            }
          >
            Descargar respaldo
          </button>{" "}
          <button
            className="backup-button"
            type="button"
            onClick={() => restoreInput.current?.click()}
          >
            Restaurar respaldo
          </button>
          <input
            ref={restoreInput}
            hidden
            aria-label="Archivo de respaldo"
            type="file"
            accept=".json,application/json"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              e.target.value = "";
              if (!file) return;
              try {
                const parsed = parseSaved(await file.text());
                setDeletion({
                  title: "Reemplazar todas las páginas con este respaldo",
                  run: () => {
                    setPages(parsed);
                    setRevision((r) => r + 1);
                    setPageId(parsed[0].id);
                    setCourseId("");
                    setFilter("all");
                    setMessage("Respaldo restaurado.");
                  },
                });
              } catch {
                setMessage(
                  "El archivo no es un respaldo válido. Tus datos siguen intactos.",
                );
              }
            }}
          />
        </p>
      </section>
      {!save && (
        <div className="unsaved-warning" role="alert">
          <AlertTriangle size={20} />
          <div>
            <strong>Los cambios no se están guardando.</strong>
            <p>
              Activa «Guardar automáticamente en este navegador» para conservar
              tus páginas, cursos y notas al cerrar o recargar.
            </p>
          </div>
          <button
            type="button"
            className="a-btn"
            onClick={() => toggleSaving(true)}
          >
            Activar guardado
          </button>
        </div>
      )}

      {message && (
        <div className="a-notice" role="status">
          <span>{message}</span>
          <button className="a-btn" onClick={() => setMessage("")}>
            Cerrar
          </button>
        </div>
      )}

      <div className="view-toolbar">
        <div
          className="view-tabs"
          role="tablist"
          aria-label="Vistas académicas"
          onKeyDown={(event) => {
            const keys = ["ArrowLeft", "ArrowRight", "Home", "End"];
            if (!keys.includes(event.key)) return;
            event.preventDefault();
            const buttons = Array.from(
              event.currentTarget.querySelectorAll<HTMLButtonElement>(
                '[role="tab"]',
              ),
            );
            const index = buttons.findIndex(
              (button) => button === document.activeElement,
            );
            const nextIndex =
              event.key === "Home"
                ? 0
                : event.key === "End"
                  ? buttons.length - 1
                  : (index +
                      (event.key === "ArrowRight" ? 1 : -1) +
                      buttons.length) %
                    buttons.length;
            buttons[nextIndex]?.focus();
            buttons[nextIndex]?.click();
          }}
        >
          {(
            [
              { id: "calendar", label: "Calendario", Icon: CalendarDays },
              { id: "schedule", label: "Cronograma", Icon: ListChecks },
              {
                id: "grades",
                label: "Calculadora de Notas",
                Icon: CalculatorIcon,
              },
            ] as const
          ).map(({ id, label, Icon }) => (
            <button
              role="tab"
              aria-selected={tab === id}
              tabIndex={tab === id ? 0 : -1}
              aria-controls={`panel-${id}`}
              id={`tab-${id}`}
              key={id}
              className={tab === id ? "active" : ""}
              onClick={() => setTab(id)}
            >
              <Icon size={18} />
              <span className="view-tab-label">{label}</span>
            </button>
          ))}
        </div>
        <button
          className="a-btn"
          onClick={() => exportICS(items)}
          disabled={!items.length}
        >
          <Download size={17} /> Exportar .ICS
        </button>
      </div>
      {courses.length > 0 && (
        <div className="course-filters">
          <strong className="muted filter-label">Filtrar Curso:</strong>
          <button
            className={`course-chip ${filter === "all" ? "selected" : ""}`}
            onClick={() => setFilter("all")}
          >
            Todos ({courses.length})
          </button>
          {courses.map((c) => (
            <button
              key={c.id}
              className={`course-chip ${filter === c.id ? "selected" : ""}`}
              onClick={() => {
                setFilter(c.id);
                setCourseId(c.id);
              }}
            >
              <i style={{ background: c.color }} />
              <span className="course-chip-label" title={`${c.code} ${c.name}`}>
                {c.code} {c.name}
              </span>
            </button>
          ))}
        </div>
      )}

      {items.length > 0 && (
        <section className="a-panel next-delivery">
          <span className="clock-badge">
            <Clock size={25} />
          </span>
          <div>
            <p className="eyebrow">
              {next ? "PRÓXIMA ENTREGA" : "RESUMEN DE ENTREGAS"}
            </p>
            <strong>
              {next
                ? next.event.title
                : "No tienes próximas entregas programadas"}
            </strong>
            {next && (
              <>
                <span className="muted">
                  {" "}
                  · {next.course.code} {next.course.name}
                </span>
                <p className="deadline">Cierre: {dateLabel(next.event.end)}</p>
              </>
            )}
          </div>
          <div className="delivery-progress">
            <strong>
              {completed} de {items.length} entregadas
            </strong>
            <progress max={items.length} value={completed} />
          </div>
        </section>
      )}

      <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`}>
        {tab === "calendar" && (
          <section className="a-panel calendar-panel">
            <div className="calendar-heading">
              <div className="inline-actions">
                <button
                  className="a-icon"
                  aria-label="Mes anterior"
                  onClick={() =>
                    setMonth(
                      new Date(month.getFullYear(), month.getMonth() - 1, 1),
                    )
                  }
                >
                  <ChevronLeft size={19} />
                </button>
                <button
                  className="a-icon"
                  aria-label="Mes siguiente"
                  onClick={() =>
                    setMonth(
                      new Date(month.getFullYear(), month.getMonth() + 1, 1),
                    )
                  }
                >
                  <ChevronRight size={19} />
                </button>
                <h2>
                  {month.toLocaleDateString("es-PE", {
                    month: "long",
                    year: "numeric",
                  })}
                </h2>
              </div>
              <button className="a-btn" onClick={() => setMonth(new Date())}>
                Mes actual
              </button>
            </div>
            <p className="muted calendar-help">
              Los períodos se muestran como barras continuas. Pulsa una barra
              para modificar sus fechas. Horas según tu dispositivo.
            </p>
            <div className="calendar-scroll">
              <div className="calendar-grid">
                <div className="weekdays">
                  {[
                    "Lunes",
                    "Martes",
                    "Miércoles",
                    "Jueves",
                    "Viernes",
                    "Sábado",
                    "Domingo",
                  ].map((d) => (
                    <span key={d}>{d}</span>
                  ))}
                </div>
                {calendarWeeks(month).map((week) => (
                  <div className="calendar-week" key={localDate(week[0])}>
                    <div className="day-background">
                      {week.map((day) => (
                        <div
                          key={localDate(day)}
                          className={`${day.getMonth() !== month.getMonth() ? "outside" : ""} ${localDate(day) === localDate(now) ? "today" : ""}`}
                        >
                          <span>{day.getDate()}</span>
                        </div>
                      ))}
                    </div>
                    <div className="week-events">
                      {items
                        .map((item) => ({
                          ...item,
                          segment: eventSegment(item.event, week),
                        }))
                        .filter((i) => i.segment)
                        .map(({ course, event, segment }) => (
                          <button
                            key={event.id}
                            className={`calendar-event ${event.done ? "is-done" : ""}`}
                            style={{
                              gridColumn: `${segment!.start} / span ${segment!.span}`,
                              borderColor: course.color,
                              color: course.color,
                            }}
                            title={`${eventTitle(course, event)}\n${dateLabel(event.start)} — ${dateLabel(event.end)}`}
                            onClick={() =>
                              setEventEditor({ courseId: course.id, event })
                            }
                          >
                            {event.done ? "✓ " : ""}
                            {course.code || course.name} · {event.title}
                          </button>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="calendar-legend">
              {courses
                .filter((c) => filter === "all" || filter === c.id)
                .map((c) => (
                  <span key={c.id}>
                    <i style={{ background: c.color }} />
                    {c.code} {c.name}
                  </span>
                ))}
            </div>
            {!items.length && (
              <p className="empty-inline">
                Todavía no hay fechas. Añade una tarea o examen para verlo en tu
                calendario.
              </p>
            )}
          </section>
        )}

        {tab === "schedule" && (
          <>
            <div className="a-panel schedule-tools">
              <div className="inline-actions">
                {[
                  ["all", "Todas"],
                  ["pending", "Pendientes"],
                  ["done", "Entregadas"],
                ].map(([id, label]) => (
                  <button
                    key={id}
                    className={`a-btn ${status === id ? "active" : ""}`}
                    onClick={() => setStatus(id)}
                  >
                    {label} (
                    {id === "all"
                      ? items.length
                      : items.filter(({ event }) =>
                          id === "done" ? event.done : !event.done,
                        ).length}
                    )
                  </button>
                ))}
              </div>
              <input
                className="a-input search-input"
                aria-label="Buscar tarea o curso"
                placeholder="Buscar tarea o curso…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="schedule-list">
              {shown.map(({ course, event }) => (
                <article
                  className={`a-panel schedule-item ${event.done ? "done" : ""}`}
                  key={event.id}
                >
                  <label className="done-checkbox">
                    <input
                      type="checkbox"
                      aria-label={`Marcar ${event.title} como ${event.done ? "pendiente" : "entregada"}`}
                      checked={event.done}
                      onChange={() =>
                        updateCourse(course.id, (c) => ({
                          ...c,
                          events: c.events.map((e) =>
                            e.id === event.id ? { ...e, done: !e.done } : e,
                          ),
                        }))
                      }
                    />
                  </label>
                  <div className="event-content">
                    <p className="event-course">
                      <i style={{ background: course.color }} />
                      {course.code} · {course.name}
                      {course.rows.find((r) => r.id === event.rowId) && (
                        <span className="a-tag">
                          Peso:{" "}
                          {
                            course.rows.find((r) => r.id === event.rowId)
                              ?.percentage
                          }
                          %
                        </span>
                      )}
                      {(event.start !== event.originalStart ||
                        event.end !== event.originalEnd) && (
                        <span className="a-tag edited">Fecha editada</span>
                      )}
                    </p>
                    <h3>{event.title}</h3>
                    <div className="event-dates">
                      <span>Apertura: {dateLabel(event.start)}</span>
                      <span className="deadline">
                        Cierre: {dateLabel(event.end)}
                      </span>
                    </div>
                  </div>
                  <div className="event-actions">
                    <span className="a-tag">
                      {event.done
                        ? "Entregada"
                        : new Date(event.end) < now
                          ? "Vencida"
                          : `En ${Math.ceil((new Date(event.end).getTime() - now.getTime()) / 86400000)} días`}
                    </span>
                    <button
                      className="a-icon"
                      aria-label={`Modificar fechas de ${event.title}`}
                      title="Modificar fechas"
                      onClick={() =>
                        setEventEditor({ courseId: course.id, event })
                      }
                    >
                      <CalendarDays size={18} />
                    </button>
                    <a
                      className="a-icon"
                      href={googleCalendarURL(course, event)}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Agendar en Google Calendar"
                      aria-label={`Agendar ${event.title} en Google Calendar`}
                    >
                      <ExternalLink size={18} />
                    </a>
                    <button
                      className="a-icon"
                      title="Descargar archivo .ICS para calendario"
                      aria-label={`Descargar ${event.title} en .ICS`}
                      onClick={() => exportICS([{ course, event }])}
                    >
                      <Download size={18} />
                    </button>
                    <button
                      className="a-btn primary"
                      onClick={() => openGrade(course.id)}
                    >
                      <CalculatorIcon size={16} /> Nota
                    </button>
                    <button
                      className="a-icon danger"
                      title="Eliminar tarea"
                      aria-label={`Eliminar ${event.title}`}
                      onClick={() => removeEvent(course, event)}
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </article>
              ))}
            </div>
            {!shown.length && (
              <div className="a-panel empty-state">
                <ListChecks size={32} />
                <h2>
                  {items.length
                    ? "No hay coincidencias"
                    : "Tu cronograma empieza aquí"}
                </h2>
                <p>
                  Añade tareas o exámenes y organiza sus fechas de apertura y
                  cierre.
                </p>
                <button
                  className="a-btn primary"
                  disabled={!courses.length}
                  onClick={() =>
                    setEventEditor({ courseId: selected?.id ?? "" })
                  }
                >
                  Añadir tarea o examen
                </button>
              </div>
            )}
          </>
        )}

        {tab === "grades" && (
          <>
            {courses.length > 0 ? (
              <>
                <div className="grade-course-list">
                  {courses
                    .filter((c) => filter === "all" || filter === c.id)
                    .map((c) => (
                      <button
                        key={c.id}
                        className={`a-panel grade-course ${selected?.id === c.id ? "active" : ""}`}
                        onClick={() => setCourseId(c.id)}
                      >
                        <i style={{ background: c.color }} />
                        <span>
                          <strong title={c.code || "Curso"}>
                            {c.code || "Curso"}
                          </strong>
                          <span className="muted" title={c.name}>
                            {c.name}
                          </span>
                        </span>
                        <b>{weighted(c.rows).toFixed(2)}</b>
                      </button>
                    ))}
                </div>
                {selected && (
                  <>
                    <div className="selected-course-heading">
                      <div>
                        <p className="eyebrow">CALCULADORA DEL CURSO</p>
                        <h2>
                          {selected.code} {selected.name}
                        </h2>
                      </div>
                      <div className="inline-actions">
                        <button
                          className="a-btn"
                          onClick={() => setCourseEditor(selected)}
                        >
                          <Pencil size={16} /> Editar curso
                        </button>
                        <button
                          className="a-icon danger"
                          aria-label="Eliminar curso"
                          title="Eliminar curso"
                          onClick={() =>
                            setDeletion({
                              title: `Eliminar «${selected.name}» y todas sus tareas y notas`,
                              run: () => {
                                setPages((ps) =>
                                  ps.map((p) =>
                                    p.id === page.id
                                      ? {
                                          ...p,
                                          courses: p.courses.filter(
                                            (c) => c.id !== selected.id,
                                          ),
                                        }
                                      : p,
                                  ),
                                );
                                setCourseId("");
                                setFilter("all");
                              },
                            })
                          }
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                    <div className="grade-layout">
                      <div>
                        <Calculator
                          key={`${page.id}-${selected.id}-${revision}`}
                          initialRows={selected.rows}
                          initialMode={selected.mode}
                          onChange={updateGrades}
                        />
                      </div>
                      <aside>
                        <GradeSummary course={selected} />
                        <section className="a-panel course-agenda">
                          <h3>Evaluaciones del curso</h3>
                          <p className="muted">
                            Programa las filas de la calculadora o añade una
                            tarea independiente. Cambiar el modo de cálculo
                            conserva las tareas ya programadas.
                          </p>
                          {selected.rows.map((row) => (
                            <div className="row-agenda" key={row.id}>
                              <span>{row.description}</span>
                              <button
                                className="a-icon"
                                title={`Programar ${row.description}`}
                                aria-label={`Programar ${row.description}`}
                                onClick={() => {
                                  const existing = selected.events.find(
                                    (e) => e.rowId === row.id,
                                  );
                                  setEventEditor({
                                    courseId: selected.id,
                                    event: existing ?? {
                                      id: "",
                                      title: row.description,
                                      rowId: row.id,
                                      start: "",
                                      end: "",
                                      originalStart: "",
                                      originalEnd: "",
                                      done: false,
                                    },
                                  });
                                }}
                              >
                                <CalendarDays size={17} />
                              </button>
                            </div>
                          ))}
                          <button
                            className="a-btn"
                            onClick={() =>
                              setEventEditor({ courseId: selected.id })
                            }
                          >
                            <Plus size={16} /> Otra tarea o examen
                          </button>
                        </section>
                      </aside>
                    </div>
                  </>
                )}
              </>
            ) : (
              <>
                <div className="a-panel intro-card">
                  <div>
                    <p className="eyebrow">CALCULA A TU RITMO</p>
                    <h2>Una calculadora. Todos tus cursos.</h2>
                    <p className="muted">
                      Puedes usar la calculadora libre o agregar tu primer curso
                      para conservar sus notas y organizar tus entregas.
                    </p>
                  </div>
                  <button
                    className="a-btn primary"
                    onClick={() => setCourseEditor("new")}
                  >
                    <Plus size={18} /> Mi primer curso
                  </button>
                </div>
                <Calculator />
              </>
            )}
          </>
        )}
      </div>
      <p className="planner-footnote">
        <strong>
          <span>
            {page?.name} · {courses.length} cursos · {allItems.length} tareas y
            exámenes{changed > 0 ? ` · ${changed} fechas modificadas` : ""}.
          </span>
          <span>
            La agenda y Google Calendar no se sincronizan automáticamente.
          </span>
        </strong>
      </p>

      {pageEditor && (
        <AcademicDialog
          title={pageEditor === "new" ? "Nueva página" : "Renombrar página"}
          onClose={() => setPageEditor(null)}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const name = String(
                new FormData(e.currentTarget).get("name") ?? "",
              ).trim();
              if (!name) return;
              if (pageEditor === "new") {
                const p = newPage(name);
                setPages((ps) => [...ps, p]);
                setPageId(p.id);
                setCourseId("");
                setFilter("all");
              } else
                setPages((ps) =>
                  ps.map((p) => (p.id === page.id ? { ...p, name } : p)),
                );
              setPageEditor(null);
            }}
          >
            <label className="form-field">
              Nombre de la página
              <input
                className="a-input"
                name="name"
                defaultValue={pageEditor === "rename" ? page.name : ""}
                placeholder="Ej. Ciclo 2026-2"
                required
                maxLength={80}
              />
            </label>
            <button className="a-btn primary" type="submit">
              Guardar página
            </button>
          </form>
        </AcademicDialog>
      )}
      {courseEditor && (
        <AcademicDialog
          title={courseEditor === "new" ? "Agregar curso" : "Editar curso"}
          onClose={() => setCourseEditor(null)}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget),
                name = String(fd.get("name") ?? "").trim(),
                code = String(fd.get("code") ?? "").trim(),
                color = String(fd.get("color"));
              if (!name) return;
              if (courseEditor === "new") {
                const c = newCourse(name, code, color);
                setPages((ps) =>
                  ps.map((p) =>
                    p.id === page.id ? { ...p, courses: [...p.courses, c] } : p,
                  ),
                );
                setCourseId(c.id);
                setFilter("all");
                setTab("grades");
              } else
                updateCourse(courseEditor.id, (c) => ({
                  ...c,
                  name,
                  code,
                  color,
                }));
              setCourseEditor(null);
            }}
          >
            <label className="form-field">
              Nombre del curso
              <input
                className="a-input"
                name="name"
                required
                maxLength={150}
                placeholder="Ej. Desarrollo de Aplicaciones"
                defaultValue={courseEditor === "new" ? "" : courseEditor.name}
              />
            </label>
            <div className="form-columns">
              <label className="form-field">
                Código (opcional)
                <input
                  className="a-input"
                  name="code"
                  maxLength={30}
                  placeholder="Ej. 3703"
                  defaultValue={courseEditor === "new" ? "" : courseEditor.code}
                />
              </label>
              <CourseColorPicker
                initialColor={
                  courseEditor === "new"
                    ? colors[courses.length % colors.length]
                    : courseEditor.color
                }
              />
            </div>
            <button type="submit" className="a-btn primary">
              Guardar curso
            </button>
          </form>
        </AcademicDialog>
      )}
      {eventEditor && (
        <EventForm
          editor={eventEditor}
          courses={courses}
          onClose={() => setEventEditor(null)}
          onSave={(id, event) => {
            updateCourse(id, (c) => ({
              ...c,
              events: c.events.some((e) => e.id === event.id)
                ? c.events.map((e) => (e.id === event.id ? event : e))
                : [...c.events, event],
            }));
            setEventEditor(null);
          }}
        />
      )}
      {deletion && (
        <AcademicDialog
          title={deletion.title}
          onClose={() => setDeletion(null)}
        >
          <p className="muted">
            Esta acción reemplaza o elimina los datos indicados. Puedes
            descargar un respaldo antes de continuar.
          </p>
          <div className="dialog-actions">
            <button className="a-btn" onClick={() => setDeletion(null)}>
              Cancelar
            </button>
            <button
              className="a-btn primary"
              onClick={() => {
                deletion.run();
                setDeletion(null);
              }}
            >
              Confirmar
            </button>
          </div>
        </AcademicDialog>
      )}
    </div>
  );
}

function GradeSummary({ course }: { course: Course }) {
  const total = weighted(course.rows);
  const percentage = course.rows.reduce(
    (s, r) => s + (Number(r.percentage) || 0),
    0,
  );
  const graded = course.rows
    .filter((r) => r.grade !== "")
    .reduce((s, r) => s + (Number(r.percentage) || 0), 0);
  const complete = course.rows.every((r) => r.grade !== "");
  const valid =
    course.rows.every(
      (r) =>
        Number.isFinite(Number(r.grade)) &&
        Number(r.grade) >= 0 &&
        Number(r.grade) <= 100 &&
        Number.isFinite(Number(r.percentage)) &&
        Number(r.percentage) >= 0 &&
        Number(r.percentage) <= 100,
    ) && Math.abs(percentage - 100) < 0.000001;
  return (
    <section className="a-panel grade-summary">
      <h3>
        <CheckCircle2 size={20} /> Resultado de calificación
      </h3>
      <div className="grade-number">
        <p className="eyebrow">
          {complete ? "PROMEDIO PONDERADO" : "PUNTOS ACUMULADOS"}
        </p>
        <strong>{valid ? total.toFixed(2) : "—"}</strong>
        {valid && (
          <p>
            Nota redondeada: <b>{Math.round(total)}</b>
          </p>
        )}
        <span className="a-tag">
          {!valid
            ? "Revisa notas y porcentajes"
            : !complete
              ? "En progreso"
              : total >= 12.5
                ? "Aprobado"
                : "Desaprobado"}
        </span>
      </div>
      <p className="muted">
        Ponderación calificada: {graded}% de {percentage}%
      </p>
      <progress max={100} value={Math.min(100, graded)} />
      <p className="muted">
        Las notas vacías aportan 0 al acumulado. Se considera aprobado desde
        12.50. Revisa la escala y ponderación de tu curso.
      </p>
    </section>
  );
}

function EventForm({
  editor,
  courses,
  onClose,
  onSave,
}: {
  editor: Editor;
  courses: Course[];
  onClose: () => void;
  onSave: (id: string, event: AcademicEvent) => void;
}) {
  const [id, setId] = useState(editor.courseId || courses[0]?.id || "");
  const [start, setStart] = useState(
    editor.event?.start || `${localDate(new Date())}T08:00`,
  );
  const [end, setEnd] = useState(
    editor.event?.end || `${localDate(new Date())}T23:59`,
  );
  const [error, setError] = useState("");
  const [rowId, setRowId] = useState(editor.event?.rowId ?? "");
  const [title, setTitle] = useState(editor.event?.title ?? "");
  const course = courses.find((c) => c.id === id);
  return (
    <AcademicDialog
      title={
        editor.event?.id ? "Modificar tarea y período" : "Nueva tarea o examen"
      }
      onClose={onClose}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!course || !title.trim()) {
            setError("Selecciona un curso e indica el nombre.");
            return;
          }
          if (!validPeriod(start, end)) {
            setError("La fecha de cierre debe ser posterior a la apertura.");
            return;
          }
          onSave(id, {
            id: editor.event?.id || uid(),
            title: title.trim(),
            rowId: rowId || undefined,
            start,
            end,
            originalStart: editor.event?.originalStart || start,
            originalEnd: editor.event?.originalEnd || end,
            done: editor.event?.done ?? false,
          });
        }}
      >
        <div className="form-field">
          <span>Curso</span>
          <AcademicSelect
            label="Curso"
            value={id}
            disabled={!!editor.event?.id}
            onChange={(value) => {
              setId(value);
              setRowId("");
            }}
            options={courses.map((c) => ({
              value: c.id,
              label: `${c.code} ${c.name}`,
            }))}
          />
        </div>
        <div className="form-field">
          <span>Evaluación vinculada</span>
          <AcademicSelect
            label="Evaluación vinculada"
            value={rowId}
            onChange={(value) => {
              setRowId(value);
              if (value)
                setTitle(
                  course?.rows.find((r) => r.id === value)?.description ?? "",
                );
            }}
            options={[
              { value: "", label: "Tarea independiente (sin nota)" },
              ...(rowId && !course?.rows.some((r) => r.id === rowId)
                ? [{ value: rowId, label: "Evaluación anterior" }]
                : []),
              ...(course?.rows.map((r) => ({
                value: r.id,
                label: `${r.description} (${r.percentage}%)`,
              })) ?? []),
            ]}
          />
        </div>
        <label className="form-field">
          Nombre
          <input
            className="a-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            maxLength={150}
            placeholder="Ej. Prueba 2 o entrega del proyecto"
          />
        </label>
        <div className="form-columns">
          <AcademicDateTime
            label="Apertura"
            value={start}
            onChange={setStart}
          />
          <AcademicDateTime label="Cierre" value={end} onChange={setEnd} />
        </div>
        <p className="muted">
          Zona horaria del dispositivo:{" "}
          {Intl.DateTimeFormat().resolvedOptions().timeZone}. Las barras
          cubrirán todo el período.
        </p>
        <div className="inline-actions stretch-actions">
          {[3, 7, 14].map((days) => (
            <button
              type="button"
              className="a-btn"
              key={days}
              onClick={() => {
                if (!Number.isFinite(new Date(start).getTime())) return;
                const d = new Date(start);
                d.setDate(d.getDate() + days);
                setEnd(`${localDate(d)}T${start.slice(11, 16)}`);
              }}
            >
              +{days} días
            </button>
          ))}
          {editor.event?.id && (
            <button
              type="button"
              className="a-btn"
              onClick={() => {
                setStart(editor.event!.originalStart);
                setEnd(editor.event!.originalEnd);
              }}
            >
              <RotateCcw size={16} /> Fechas originales
            </button>
          )}
        </div>
        {error && (
          <p className="deadline" role="alert">
            {error}
          </p>
        )}
        <div className="dialog-actions">
          <button type="button" className="a-btn" onClick={onClose}>
            Cancelar
          </button>
          <button className="a-btn primary" type="submit">
            Guardar fechas
          </button>
        </div>
      </form>
    </AcademicDialog>
  );
}
