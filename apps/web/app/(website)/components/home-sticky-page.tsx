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
        "group sticky top-0 h-dvh overflow-hidden odd:bg-foreground odd:text-background even:bg-background even:text-foreground",
        // Padding top to avoid content being cut off by the navbar
        "pt-20",
      )}
    >
      <div className="grid h-full w-full max-w-7xl grid-cols-1 place-content-start place-items-start gap-6 rounded-lg p-6 md:grid-cols-2 md:gap-16">
        <p className="font-bold text-[10rem] leading-[100%] md:text-[15rem]">
          {number}
        </p>

        <div className="space-y-8 text-start">
          <div className="pt-10">
            <H2 className="mb-6 group-odd:text-background group-even:text-foreground">
              {title}
            </H2>
            <P
              variant="body-xl"
              className="max-w-xl group-odd:text-background/65 group-even:text-foreground/65"
            >
              {description}
            </P>
          </div>

          {image && (
            <div className="relative w-full max-w-xl overflow-hidden rounded-xl border border-neutral-400/20">
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
