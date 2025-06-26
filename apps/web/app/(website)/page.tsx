import { cn } from "@workspace/ui/lib/utils";
import { HomeHeroSection } from "@/app/(website)/components/home-hero-section";
import { HomeSection1 } from "@/app/(website)/components/home-section1";
import { StickyPagesSection } from "@/app/(website)/components/home-sticky-pages-section";
import { HomeTestimonials } from "@/app/(website)/components/home-testimonials";
import { ProgressiveBlur } from "@/components/motion-primitives/progressive-blur";
export default function PageHome() {
  return (
    <div className="space-y-32">
      <ProgressiveBlur
        className={cn(
          "pointer-events-none fixed bottom-0 left-0 z-40 m-0! h-20 w-full",
          // "bg-gradient-to-b from-background to-transparent",
        )}
        blurIntensity={2}
        blurLayers={6}
        direction="bottom"
      />
      <HomeHeroSection />
      <HomeSection1 />
      <StickyPagesSection />
      <HomeTestimonials />
    </div>
  );
}
