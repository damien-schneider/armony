"use client";
import type { ReactNode } from "react";

export default function LayoutLegalWebsite({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <section className="mx-auto max-w-3xl px-4 py-20">
      <div className="prose prose-neutral dark:prose-invert">{children}</div>
    </section>
  );
}
