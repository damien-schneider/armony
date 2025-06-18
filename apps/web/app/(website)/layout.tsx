import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import type { ReactNode } from "react";

export default function LayoutWebsite({ children }: { children: ReactNode }) {
  return (
    <section className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-grow">{children}</div>
      <Footer />
    </section>
  );
}
