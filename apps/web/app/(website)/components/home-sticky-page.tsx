import { Button } from "@workspace/ui/components/button";
import { H2, P } from "@workspace/ui/components/typography";
import { cn } from "@workspace/ui/lib/utils";
import Image, { type StaticImageData } from "next/image";

interface StickyPageProps {
  number: string;
  title: string;
  description: string;
  image: StaticImageData;
  buttonText?: string;
}

export function StickyPage({
  number,
  title,
  description,
  image,
  buttonText,
}: StickyPageProps) {
  return (
    <div
      className={cn(
        "group sticky top-0 h-dvh overflow-hidden even:bg-background odd:bg-foreground even:text-foreground odd:text-background",
        // Padding top to avoid content being cut off by the navbar
        "pt-20",
      )}
    >
      <div className="max-w-7xl w-full h-full grid grid-cols-1 md:grid-cols-2 place-items-start place-content-start gap-6 md:gap-16 rounded-lg p-6">
        <p className="text-[10rem] md:text-[15rem] font-bold leading-[100%]">
          {number}
        </p>

        <div className="space-y-8 text-start">
          <div className="pt-10">
            <H2 className="mb-6 group-even:text-foreground group-odd:text-background">
              {title}
            </H2>
            <P
              variant="body-xl"
              className="max-w-xl group-even:text-foreground/65 group-odd:text-background/65"
            >
              {description}
            </P>
          </div>

          {image && (
            <div className="relative w-full max-w-xl rounded-xl overflow-hidden border border-neutral-400/20">
              <Image
                src={image}
                alt={title}
                width={600}
                height={400}
                className="object-contain"
              />
            </div>
          )}

          {buttonText && <Button className="mt-6">{buttonText}</Button>}
        </div>
      </div>
    </div>
  );
}
