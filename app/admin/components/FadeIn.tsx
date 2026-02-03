"use client";

import { ReactNode } from "react";

export default function FadeIn({
  children,
  delay = 0,
}: {
  children: ReactNode;
  delay?: number;
}) {
  return (
    <div
      className="opacity-0 translate-y-2 animate-fade-in"
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
