"use client";

import { useEffect, useId, useRef, useState } from "react";
import { CaretDown } from "@phosphor-icons/react";
import { twMerge } from "tailwind-merge";

// Precisa casar com o max-h-60 do painel — é a medida usada pra decidir o flip.
const PANEL_MAX_HEIGHT = 240;

export default function Select({
  label,
  options = [],
  value,
  onChange,
  placeholder = "Selecione",
  helperText,
  error,
  disabled = false,
  className,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [dropUp, setDropUp] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);

  const wrapperRef = useRef(null);
  const triggerRef = useRef(null);
  const listRef = useRef(null);

  const id = useId();
  const selected = options.find((option) => option.value === value) ?? null;
  const descriptionId = error || helperText ? `${id}-description` : undefined;

  useEffect(() => {
    if (!isOpen) return;

    function place() {
      const rect = triggerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      setDropUp(spaceBelow < PANEL_MAX_HEIGHT && rect.top > spaceBelow);
    }

    place();
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);

    return () => {
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    function handlePointerDown(event) {
      if (!wrapperRef.current.contains(event.target)) setIsOpen(false);
    }

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || highlighted < 0) return;
    listRef.current?.children[highlighted]?.scrollIntoView({ block: "nearest" });
  }, [isOpen, highlighted]);

  function open() {
    if (disabled) return;
    const current = options.findIndex((option) => option.value === value);
    setHighlighted(current >= 0 ? current : nextEnabled(-1, 1));
    setIsOpen(true);
  }

  function close() {
    setIsOpen(false);
    setHighlighted(-1);
  }

  function nextEnabled(from, step) {
    const total = options.length;
    let index = from;

    for (let attempt = 0; attempt < total; attempt++) {
      index = (index + step + total) % total;
      if (!options[index].disabled) return index;
    }

    return from;
  }

  function pick(index) {
    const option = options[index];
    if (!option || option.disabled) return;
    onChange?.(option.value);
    close();
    triggerRef.current.focus();
  }

  function handleKeyDown(event) {
    if (disabled) return;

    if (event.key === "Escape" || event.key === "Tab") {
      close();
      return;
    }

    if (!isOpen) {
      if (["Enter", " ", "ArrowDown", "ArrowUp"].includes(event.key)) {
        event.preventDefault();
        open();
      }
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setHighlighted(nextEnabled(highlighted, 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlighted(nextEnabled(highlighted, -1));
    } else if (event.key === "Home") {
      event.preventDefault();
      setHighlighted(nextEnabled(-1, 1));
    } else if (event.key === "End") {
      event.preventDefault();
      setHighlighted(nextEnabled(0, -1));
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      pick(highlighted);
    }
  }

  return (
    <div ref={wrapperRef} className={twMerge("flex w-full flex-col gap-2", className)}>
      {label && (
        <label htmlFor={`${id}-trigger`} className="text-sm font-medium text-heading">
          {label}
        </label>
      )}

      <div className="relative">
        <button
          ref={triggerRef}
          id={`${id}-trigger`}
          type="button"
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-controls={`${id}-listbox`}
          aria-activedescendant={isOpen && highlighted >= 0 ? `${id}-option-${highlighted}` : undefined}
          aria-describedby={descriptionId}
          aria-invalid={error ? true : undefined}
          disabled={disabled}
          onClick={() => (isOpen ? close() : open())}
          onKeyDown={handleKeyDown}
          className={twMerge(
            "flex h-11 w-full items-center justify-between gap-2 rounded-lg border border-border bg-background px-4 text-left text-sm transition-colors",
            "hover:border-primary focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:outline-none",
            "disabled:cursor-not-allowed disabled:text-disabled disabled:hover:border-border",
            error && "border-danger hover:border-danger focus-visible:border-danger focus-visible:ring-danger/30",
          )}
        >
          <span className={twMerge("truncate", selected ? "text-body" : "text-muted")}>
            {selected ? selected.label : placeholder}
          </span>
          <CaretDown
            size={16}
            aria-hidden="true"
            className={twMerge("shrink-0 text-muted transition-transform", isOpen && "rotate-180")}
          />
        </button>

        {isOpen && (
          <ul
            ref={listRef}
            id={`${id}-listbox`}
            role="listbox"
            aria-label={label}
            className={twMerge(
              "absolute z-50 max-h-60 w-full overflow-y-auto rounded-lg border border-border bg-background p-1 shadow-lg",
              dropUp ? "bottom-full mb-2" : "top-full mt-2",
            )}
          >
            {options.map((option, index) => (
              <li
                key={option.value}
                id={`${id}-option-${index}`}
                role="option"
                aria-selected={option.value === value}
                aria-disabled={option.disabled || undefined}
                onMouseEnter={() => !option.disabled && setHighlighted(index)}
                onClick={() => pick(index)}
                className={twMerge(
                  "cursor-pointer rounded-md px-3 py-2.5 text-sm text-body",
                  index === highlighted && "bg-surface-hover",
                  option.value === value && "font-medium text-primary",
                  option.disabled && "cursor-not-allowed text-disabled",
                )}
              >
                {option.label}
              </li>
            ))}

            {options.length === 0 && (
              <li className="px-3 py-2.5 text-sm text-muted">Nenhuma opção disponível</li>
            )}
          </ul>
        )}
      </div>

      {(error || helperText) && (
        <p id={descriptionId} className={twMerge("text-xs text-muted", error && "text-danger")}>
          {error || helperText}
        </p>
      )}
    </div>
  );
}
