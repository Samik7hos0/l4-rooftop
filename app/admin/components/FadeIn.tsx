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
      style={{ animationDelay: `${delay}s` }}
      className="fade-in"
    >
      {children}
    </div>
  );
}
