"use client";
import type { ReactNode } from "react";

export default function LayoutAuthWebsite({
  children,
}: { children: ReactNode }) {
  return (
    <section className="max-w-lg mx-auto mt-[10dvh] px-4">{children}</section>
  );
}
