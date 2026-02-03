"use client";

import { useEffect, useState } from "react";

const DEFAULT_TEMPLATE = `Hello {{name}}, your reservation at L4 Rooftop is confirmed.

📅 {{date}}
⏰ {{time}}
👥 Guests: {{guests}}

{{note}}`;

export default function WhatsAppTemplateEditor() {
  const [template, setTemplate] = useState(DEFAULT_TEMPLATE);

  useEffect(() => {
    const saved = localStorage.getItem("wa_template");
    if (saved) setTemplate(saved);
  }, []);

  function save() {
    localStorage.setItem("wa_template", template);
    alert("WhatsApp template saved");
  }

  return (
    <section className="space-y-4">
      <h2 className="text-sm uppercase tracking-wide text-white/40">
        WhatsApp Message Template
      </h2>

      <textarea
        value={template}
        onChange={(e) => setTemplate(e.target.value)}
        rows={8}
        className="
          w-full rounded-xl
          bg-neutral-950
          border border-neutral-800
          px-4 py-3
          text-sm text-white
          focus:outline-none focus:ring-1 focus:ring-white/20
        "
      />

      <button
        onClick={save}
        className="px-5 py-2 rounded-lg bg-white text-black font-medium hover:opacity-90 transition"
      >
        Save Template
      </button>

      {/* ✅ JSX-SAFE VARIABLE HINTS */}
      <p className="text-xs text-white/40">
        Variables:
        <span className="ml-1 font-mono">
          {"{{name}}"}, {"{{date}}"}, {"{{time}}"}, {"{{guests}}"}, {"{{note}}"}
        </span>
      </p>
    </section>
  );
}
