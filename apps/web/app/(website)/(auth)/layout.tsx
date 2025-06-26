"use client";
import type { ReactNode } from "react";

export default function LayoutAuthWebsite({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <section className="mx-auto mt-[10dvh] max-w-lg px-4">{children}</section>
  );
}
