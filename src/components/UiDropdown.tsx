"use client";
import { useEffect, useId, useRef, useState } from "react";
import "@/styles/ui-dropdown.css";

export type Option = { id: string; label: string; disabled?: boolean };

type Props = {
  label?: string;
  options: Option[];
  value?: string;
  onChange?: (id: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string; // เพิ่มคลาสให้ wrapper ภายนอก
};

export default function UiDropdown({
  label,
  options,
  value,
  onChange,
  placeholder = "เลือก...",
  disabled,
  className = "",
}: Props) {
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState<number>(-1);
  const id = useId();
  const btnRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const selected = options.find(o => o.id === value);

  // ปิดเมนูเมื่อคลิกนอก
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!open) return;
      const target = e.target as Node;
      if (!btnRef.current?.contains(target) && !listRef.current?.contains(target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  // คีย์บอร์ดนำทาง
  function onKeyDown(e: React.KeyboardEvent) {
    if (!open) {
      if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setOpen(true);
        setActiveIdx(0);
      }
      return;
    }
    if (e.key === "Escape") {
      setOpen(false);
      btnRef.current?.focus();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx(i => Math.min(i + 1, options.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx(i => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const pick = options[activeIdx];
      if (pick && !pick.disabled) {
        onChange?.(pick.id);
        setOpen(false);
        btnRef.current?.focus();
      }
    }
  }

  return (
    <div className={`ui-dd ${className}`}>
      {label && <label className="ui-dd__label" htmlFor={id}>{label}</label>}

      <button
        ref={btnRef}
        id={id}
        type="button"
        className={`ui-dd__button ${disabled ? "is-disabled" : ""} ${open ? "is-open" : ""} ${selected ? "has-value" : ""}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => !disabled && setOpen(o => !o)}
        onKeyDown={onKeyDown}
        disabled={disabled}
      >
        <span className={`ui-dd__value ${selected ? "text-accent" : "text-placeholder"}`}>
          {selected ? selected.label : placeholder}
        </span>
        <span className="ui-dd__chevron" aria-hidden />
      </button>

      {open && (
        <div
          ref={listRef}
          className="ui-dd__menu" role="listbox"
          aria-activedescendant={activeIdx >= 0 ? `opt-${id}-${activeIdx}` : undefined}
          tabIndex={-1}
          onKeyDown={onKeyDown}
        >
          {options.map((op, i) => (
            <div
              id={`opt-${id}-${i}`}
              key={op.id}
              role="option"
              aria-selected={op.id === value}
              className={`ui-dd__item ${i === activeIdx ? "is-active" : ""} ${op.id === value ? "is-selected" : ""} ${op.disabled ? "is-disabled" : ""}`}
              onMouseEnter={() => setActiveIdx(i)}
              onClick={() => {
                if (op.disabled) return;
                onChange?.(op.id);
                setOpen(false);
                btnRef.current?.focus();
              }}
            >
              {op.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}