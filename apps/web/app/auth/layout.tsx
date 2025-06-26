import type { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <section className=" mx-auto mt-[20dvh] max-w-2xl px-4">{children}</section>
  );
}
