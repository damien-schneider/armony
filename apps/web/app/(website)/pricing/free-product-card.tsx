"use client";

import { Button } from "@workspace/ui/components/button";
import { H3 } from "@workspace/ui/components/typography";
import { CloseSquare, TickSquare } from "iconsax-react";

const freeFeatures = [
  "Access to limited models",
  "10 messages per 3 days",
  "Basic chat interface",
];

const notIncludedFeatures = [
  "Advanced models (like Claude)",
  "Unlimited messages",
  "Reasoning model (CoT)",
  "Document uploads",
  "Priority support",
];

export function FreeProductCard({
  onGetStarted,
}: {
  onGetStarted: () => void;
}) {
  return (
    <article className="relative rounded-xl border w-full max-w-96">
      {/* Header Section */}
      <header className="p-4 sm:p-6 xl:pt-8">
        <div className="mb-6 md:flex md:items-center xl:block">
          <div className="mb-1 flex md:flex-1 md:flex-row-reverse md:items-center xl:mb-6 xl:flex-col-reverse xl:items-start xl:gap-y-4">
            <div className="flex-1 md:ml-6 xl:ml-0">
              <p className="mb-1 text-xl font-medium sm:text-2xl">Free</p>
              <p className="text-xs text-muted-foreground sm:text-sm">
                Try Armony with basic features
              </p>
            </div>
          </div>
          <div>
            <h2 className="mb-1 flex items-start text-2xl font-medium md:text-3xl 2xl:text-4xl">
              $0
            </h2>
            <p className="text-xs font-medium text-muted-foreground">forever</p>
          </div>
        </div>
        <Button variant="outline" onClick={onGetStarted} className="w-full">
          Get Started
        </Button>
      </header>

      {/* Main Content Section */}
      <main className="space-y-6 border-t border-border p-4 sm:p-6 block">
        <div>
          <H3 className="mb-3 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            Free tier includes
          </H3>
          <ul className="space-y-3">
            {freeFeatures.map((feature) => (
              <li
                key={feature}
                className="flex items-center gap-x-2 text-xs font-medium text-muted-foreground"
              >
                <TickSquare
                  color="currentColor"
                  className="size-4 min-w-4 text-primary"
                />
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <H3 className="mb-3 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            Not included
          </H3>
          <ul className="space-y-3">
            {notIncludedFeatures.map((feature) => (
              <li
                key={feature}
                className="flex items-center gap-x-2 text-xs font-medium text-muted-foreground opacity-70"
              >
                <CloseSquare
                  color="currentColor"
                  className="size-4 min-w-4 text-muted-foreground"
                />
                <span className="line-through">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </article>
  );
}
