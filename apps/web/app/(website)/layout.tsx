import type { ReactNode } from "react";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";

export default function LayoutWebsite({ children }: { children: ReactNode }) {
  return (
    <section className="flex min-h-screen flex-col">
      <Navbar />
      <div className="flex-grow">{children}</div>
      <Footer />
    </section>
  );
}
