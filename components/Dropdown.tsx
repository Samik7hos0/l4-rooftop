"use client";

import { useEffect, useRef, useState } from "react";

type Option<T> = {
  label: string;
  value: T;
};

type Props<T> = {
  value: T | null;
  onChange: (v: T) => void;
  options: Option<T>[];
  placeholder: string;
};

export default function Dropdown<T extends string | number>({
  value,
  onChange,
  options,
  placeholder,
}: Props<T>) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  const selectedIndex = options.findIndex(o => o.value === value);

  useEffect(() => {
    if (open) setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0);
  }, [open]);

  useEffect(() => {
    function close(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    window.addEventListener("mousedown", close);
    return () => window.removeEventListener("mousedown", close);
  }, []);

  function handleKey(e: React.KeyboardEvent) {
    if (!open) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex(i => Math.min(i + 1, options.length - 1));
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex(i => Math.max(i - 1, 0));
    }

    if (e.key === "Enter") {
      e.preventDefault();
      onChange(options[activeIndex].value);
      setOpen(false);
    }

    if (e.key === "Escape") {
      setOpen(false);
    }
  }

  const selected = options.find(o => o.value === value);

  return (
    <div ref={ref} className="relative">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        onKeyDown={handleKey}
        className="
          w-full min-h-[44px]
          rounded-xl
          bg-neutral-950
          border border-neutral-800
          px-4 py-3
          text-left text-white
          flex items-center justify-between
          transition-premium
          hover:border-neutral-700
        "
      >
        <span className={selected ? "text-white" : "text-neutral-500"}>
          {selected ? selected.label : placeholder}
        </span>
        <span className="text-neutral-500">▾</span>
      </button>

      {/* Menu */}
      {open && (
        <div
          className="
            absolute z-50 mt-2 w-full
            rounded-xl
            bg-neutral-950
            border border-neutral-800
            shadow-2xl
            overflow-hidden
            motion motion-1
          "
        >
          {options.map((o, i) => (
            <button
              key={String(o.value)}
              type="button"
              onMouseEnter={() => setActiveIndex(i)}
              onClick={() => {
                onChange(o.value);
                setOpen(false);
              }}
              className={`
  w-full px-4 py-2.5 text-left text-sm transition
  ${
    i === activeIndex
      ? "bg-white/15 text-white dropdown-selected"
      : "text-white/80 hover:bg-white/10"
  }
`}

            >
              {o.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
