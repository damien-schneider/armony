import { Card, CardContent } from "@workspace/ui/components/card";
import { H2, P } from "@workspace/ui/components/typography";
import { cn } from "@workspace/ui/lib/utils";
import type { ComponentProps } from "react";

export function HomeTestimonials() {
  return (
    <section className="py-16 md:py-32">
      <div className="mx-auto max-w-6xl space-y-8 px-6 md:space-y-16">
        <div className="relative z-10 mx-auto space-y-6 md:space-y-12">
          <H2 className="">Trusted by developers and teams worldwide</H2>
          <P className="max-w-xl" variant="body-xl">
            See how Armony is helping people accelerate their AI workflows,
            boost productivity, and deliver real results.
          </P>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2">
          <TestimonialCard
            className="md:col-span-2 lg:row-span-2 shadow-none"
            name="Jane"
            companyRole="Lead Engineer"
            text="Armony streamlined my AI workflow, saving me over 10 hours a week. The intuitive interface and powerful integrations let me focus on building great products."
            aria-label="Testimonial from Jane, Lead Engineer"
          />
          <TestimonialCard
            className="md:col-span-2 shadow-none"
            name="Carlos"
            companyRole="CTO"
            text="Switching to Armony cut my onboarding time in half. I was productive from day one, and I love the seamless model switching."
            aria-label="Testimonial from Carlos, CTO"
          />
          <TestimonialCard
            className=" shadow-none"
            name="Priya"
            companyRole="Product Manager"
            text="The analytics and team management features in Armony are top-notch. I've seen a 30% increase in project delivery speed."
            aria-label="Testimonial from Priya, Product Manager"
          />
          <TestimonialCard
            className="card variant-mixed  shadow-none"
            name="Elena"
            companyRole="Head of Data Science"
            text="Reliable, secure, and always up-to-date. Armony is the backbone of my AI operations."
            aria-label="Testimonial from Elena, Head of Data Science"
          />
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({
  name,
  companyRole,
  text,
  className,
  ...props
}: {
  name: string;
  companyRole: string;
  text: string;
} & ComponentProps<"div">) {
  return (
    <Card className={cn("", className)} {...props}>
      <CardContent className="h-full pt-6">
        <blockquote className="grid h-full grid-rows-[1fr_auto] gap-6">
          <p className="text-xl font-medium" itemProp="reviewBody">
            {text}
          </p>
          <div>
            <cite className="text-sm font-medium" itemProp="author">
              <span itemProp="name">{name}</span>
            </cite>
            <span className="text-muted-foreground block text-sm">
              {companyRole}
            </span>
          </div>
        </blockquote>
      </CardContent>
    </Card>
  );
}
