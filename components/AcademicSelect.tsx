"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";

export default function AcademicSelect({
  label,
  value,
  onChange,
  options,
  disabled = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();
  const selected = options.find((option) => option.value === value);
  useEffect(() => {
    const outside = (event: PointerEvent) => {
      if (!ref.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, []);
  const show = () => {
    setActive(
      Math.max(
        0,
        options.findIndex((option) => option.value === value),
      ),
    );
    setOpen(true);
  };
  const choose = (index: number) => {
    if (options[index]) onChange(options[index].value);
    setOpen(false);
  };
  return (
    <div className="academic-select" ref={ref}>
      <button
        type="button"
        className="select-trigger"
        role="combobox"
        aria-label={label}
        aria-expanded={open}
        aria-controls={`${id}-list`}
        aria-haspopup="listbox"
        aria-activedescendant={open ? `${id}-${active}` : undefined}
        disabled={disabled}
        onClick={() => (open ? setOpen(false) : show())}
        onKeyDown={(event) => {
          if (event.key === "Escape" && open) {
            event.preventDefault();
            event.stopPropagation();
            setOpen(false);
            return;
          }
          if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
            event.preventDefault();
            if (!open) {
              show();
              return;
            }
            setActive((i) =>
              event.key === "Home"
                ? 0
                : event.key === "End"
                  ? options.length - 1
                  : (i +
                      (event.key === "ArrowDown" ? 1 : -1) +
                      options.length) %
                    options.length,
            );
          }
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            if (open) choose(active);
            else show();
          }
          if (event.key === "Tab") setOpen(false);
        }}
      >
        <span title={selected?.label}>{selected?.label ?? "Seleccionar…"}</span>
        <ChevronDown
          size={17}
          className={open ? "select-chevron open" : "select-chevron"}
        />
      </button>
      {open && (
        <div
          className="select-options"
          id={`${id}-list`}
          role="listbox"
          aria-label={label}
        >
          {options.map((option, index) => (
            <div
              key={option.value}
              role="option"
              id={`${id}-${index}`}
              aria-selected={option.value === value}
              className={`select-option ${index === active ? "highlighted" : ""}`}
              title={option.label}
              onPointerMove={() => setActive(index)}
              onClick={() => choose(index)}
            >
              <span>{option.label}</span>
              {option.value === value && <Check size={16} />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
