"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Check, ChevronUp, Palette, X } from "lucide-react";

const swatches = [
  "#00D4F4",
  "#0284C7",
  "#2563EB",
  "#4F46E5",
  "#7C3AED",
  "#DB2777",
  "#E11D48",
  "#EA580C",
  "#D97706",
  "#16A34A",
  "#0D9488",
  "#475569",
];

export default function CourseColorPicker({
  initialColor,
}: {
  initialColor: string;
}) {
  const [color, setColor] = useState(initialColor.toUpperCase());
  const [draft, setDraft] = useState(color);
  const [position, setPosition] = useState<{
    left: number;
    top: number;
    width: number;
  } | null>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const id = useId();
  const close = () => {
    setPosition(null);
    trigger.current?.focus();
  };
  useEffect(() => {
    if (!position) return;
    panel.current?.querySelector<HTMLButtonElement>("button")?.focus();
    const outside = (event: PointerEvent) => {
      if (
        !panel.current?.contains(event.target as Node) &&
        !trigger.current?.contains(event.target as Node)
      )
        setPosition(null);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopImmediatePropagation();
        setPosition(null);
        trigger.current?.focus();
      }
    };
    const reposition = () => setPosition(null);
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape, true);
    window.addEventListener("resize", reposition);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", escape, true);
      window.removeEventListener("resize", reposition);
    };
  }, [position]);
  const choose = (value: string) => {
    setColor(value.toUpperCase());
    setDraft(value.toUpperCase());
  };
  return (
    <div className="form-field course-color-field">
      <span id={`${id}-label`}>Color</span>
      <input type="hidden" name="color" value={color} />
      <button
        ref={trigger}
        type="button"
        className="course-color-trigger"
        aria-labelledby={`${id}-label ${id}-value`}
        aria-expanded={!!position}
        aria-controls={position ? `${id}-palette` : undefined}
        onClick={() => {
          if (position) {
            close();
            return;
          }
          const rect = trigger.current!.getBoundingClientRect(),
            width = Math.min(304, window.innerWidth - 24),
            height = 260;
          setPosition({
            width,
            left: Math.max(
              12,
              Math.min(rect.right - width, window.innerWidth - width - 12),
            ),
            top: Math.max(12, rect.top - height - 8),
          });
        }}
      >
        <span className="color-preview" style={{ background: color }} />
        <span id={`${id}-value`}>{color}</span>
        <Palette size={16} />
        <ChevronUp size={16} />
      </button>
      {position &&
        createPortal(
          <div
            className="academic color-palette-shell"
            style={{
              position: "fixed",
              left: position.left,
              top: position.top,
              width: position.width,
              zIndex: 100,
            }}
            ref={panel}
            id={`${id}-palette`}
            role="group"
            aria-label="Paleta de colores del curso"
            onKeyDown={(event) => {
              if (event.key === "Tab") {
                const controls = Array.from(
                    panel.current?.querySelectorAll<HTMLElement>(
                      "button,input",
                    ) ?? [],
                  ),
                  first = controls[0],
                  last = controls[controls.length - 1];
                if (event.shiftKey && document.activeElement === first) {
                  event.preventDefault();
                  last?.focus();
                } else if (!event.shiftKey && document.activeElement === last) {
                  event.preventDefault();
                  first?.focus();
                }
              }
            }}
          >
            <div className="color-palette-heading">
              <strong>Personaliza tu curso</strong>
              <button type="button" aria-label="Cerrar paleta" onClick={close}>
                <X size={17} />
              </button>
            </div>
            <p>Elige un color o escribe su código HEX.</p>
            <div className="color-swatches">
              {swatches.map((value) => (
                <button
                  type="button"
                  key={value}
                  aria-label={`Color ${value}`}
                  aria-pressed={color === value}
                  style={{ background: value }}
                  onClick={() => choose(value)}
                >
                  {color === value && <Check size={17} strokeWidth={3} />}
                </button>
              ))}
            </div>
            <div className="color-custom">
              <span className="color-preview" style={{ background: color }} />
              <label>
                Código HEX
                <input
                  aria-label="Código HEX"
                  maxLength={7}
                  value={draft}
                  spellCheck={false}
                  onChange={(event) => {
                    const value = event.target.value.toUpperCase();
                    setDraft(value);
                    if (/^#[0-9A-F]{6}$/.test(value)) setColor(value);
                  }}
                  onBlur={() => {
                    if (!/^#[0-9A-F]{6}$/.test(draft)) setDraft(color);
                  }}
                />
              </label>
              <button type="button" className="a-btn primary" onClick={close}>
                Listo
              </button>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
