"use client";
import type { ReactNode } from "react";

export default function LayoutLegalWebsite({
  children,
}: { children: ReactNode }) {
  return (
    <section className="max-w-2xl mx-auto py-20 px-4">
      <div className="prose prose-neutral dark:prose-invert">{children}</div>
    </section>
  );
}
