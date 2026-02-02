"use client";

import { useState } from "react";

type Status = "idle" | "sending" | "success" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMessage("");
    setStatus("sending");

    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: (data.get("name") as string)?.trim() || "",
      phone: (data.get("phone") as string)?.trim() || "",
      message: (data.get("message") as string)?.trim() || "",
    };

    if (!payload.name || !payload.phone) {
      setStatus("error");
      setErrorMessage("Name and phone are required.");
      return;
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setStatus("error");
        setErrorMessage((data.error as string) || "Something went wrong.");
        return;
      }

      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
      setErrorMessage("Network error. Please try again.");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
      aria-label="Contact form"
      noValidate
    >
      <div>
        <label htmlFor="contact-name" className="premium-label">
          Name
        </label>
        <input
          id="contact-name"
          name="name"
          type="text"
          required
          autoComplete="name"
          placeholder="Your name"
          className="premium-input"
          disabled={status === "sending"}
          aria-invalid={status === "error" && !!errorMessage}
        />
      </div>
      <div>
        <label htmlFor="contact-phone" className="premium-label">
          Phone
        </label>
        <input
          id="contact-phone"
          name="phone"
          type="tel"
          required
          autoComplete="tel"
          placeholder="Your phone number"
          className="premium-input"
          disabled={status === "sending"}
          aria-invalid={status === "error" && !!errorMessage}
        />
      </div>
      <div>
        <label htmlFor="contact-message" className="premium-label">
          Message (optional)
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={4}
          placeholder="How can we help?"
          className="premium-input min-h-[120px] resize-y"
          disabled={status === "sending"}
          aria-invalid={false}
        />
      </div>

      {status === "error" && errorMessage && (
        <p className="text-sm text-red-400" role="alert">
          {errorMessage}
        </p>
      )}

      {status === "success" && (
        <p className="text-sm text-emerald-400" role="status">
          Thank you. We&apos;ll get back to you soon.
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full min-h-[48px] rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] font-semibold hover:opacity-90 transition-premium focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === "sending" ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
