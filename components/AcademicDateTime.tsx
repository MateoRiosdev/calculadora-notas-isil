"use client";

import { useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { calendarWeeks, localDate } from "@/lib/academic";

export default function AcademicDateTime({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [month, setMonth] = useState(() => new Date(value || new Date()));
  const chooseDay = (day: Date) =>
    onChange(`${localDate(day)}T${value.slice(11, 16) || "08:00"}`);
  return (
    <div className="form-field date-time-field">
      <span>{label}</span>
      <div className="date-input-wrap">
        <input
          type="datetime-local"
          aria-label={label}
          className="a-input"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          required
        />
        <button
          type="button"
          className="date-trigger"
          aria-label={`Elegir fecha de ${label.toLowerCase()}`}
          aria-expanded={open}
          onClick={() => {
            if (!open) setMonth(new Date(value || new Date()));
            setOpen(!open);
          }}
        >
          <CalendarDays size={19} />
        </button>
      </div>
      {open && (
        <section
          className="date-picker-popup"
          aria-label={`Calendario de ${label.toLowerCase()}`}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              event.stopPropagation();
              event.preventDefault();
              setOpen(false);
            }
          }}
        >
          <div className="date-picker-header">
            <button
              type="button"
              className="a-icon"
              aria-label={`Mes anterior de ${label.toLowerCase()}`}
              onClick={() =>
                setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))
              }
            >
              <ChevronLeft size={16} />
            </button>
            <strong>
              {month.toLocaleDateString("es-PE", {
                month: "long",
                year: "numeric",
              })}
            </strong>
            <button
              type="button"
              className="a-icon"
              aria-label={`Mes siguiente de ${label.toLowerCase()}`}
              onClick={() =>
                setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))
              }
            >
              <ChevronRight size={16} />
            </button>
          </div>
          <div className="date-picker-days">
            {["L", "M", "M", "J", "V", "S", "D"].map((day, index) => (
              <span key={index}>{day}</span>
            ))}
            {calendarWeeks(month)
              .flat()
              .map((day) => (
                <button
                  key={localDate(day)}
                  type="button"
                  aria-label={day.toLocaleDateString("es-PE", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                  aria-pressed={value.slice(0, 10) === localDate(day)}
                  className={`${day.getMonth() !== month.getMonth() ? "other-month" : ""} ${value.slice(0, 10) === localDate(day) ? "chosen" : ""}`}
                  onClick={() => chooseDay(day)}
                >
                  {day.getDate()}
                </button>
              ))}
          </div>
          <label className="date-picker-time">
            Hora
            <input
              type="time"
              aria-label={`Hora de ${label.toLowerCase()}`}
              className="a-input"
              value={value.slice(11, 16)}
              onChange={(event) => {
                if (event.target.value)
                  onChange(
                    `${value.slice(0, 10) || localDate(new Date())}T${event.target.value}`,
                  );
              }}
            />
          </label>
          <div className="date-picker-footer">
            <button
              type="button"
              className="a-btn"
              onClick={() => {
                const today = new Date();
                setMonth(today);
                chooseDay(today);
              }}
            >
              Hoy
            </button>
            <button
              type="button"
              className="a-btn primary"
              onClick={() => setOpen(false)}
            >
              Listo
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
