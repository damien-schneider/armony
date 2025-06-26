"use client";

import type { Tables } from "@workspace/supabase/types/database";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { H3 } from "@workspace/ui/components/typography";
import { cn } from "@workspace/ui/lib/utils";
import { TickSquare, Timer } from "iconsax-react";

const featureListPremium = {
  available: [
    "Access to the best LLMs",
    "Unlimited messages*",
    "Reasoning model (CoT)",
    "5 spaces with contextual data",
    "Documents and files up to 10k chars (~3 pages)",
    "Unlimited snippets",
    "Priority Support",
  ],
  comingSoon: ["Generate images"],
};

type Product = Tables<"products">;
type Price = Tables<"prices">;
interface ProductWithPrices extends Product {
  prices: Price[];
}

type BillingInterval = Tables<"prices">["interval"];

export function ProductCard({
  product,
  price,
  billingInterval,
  isRecommended,
  currentPlan,
  priceIdLoading,
  onCheckout,
}: {
  product: ProductWithPrices;
  price: Price;
  billingInterval: BillingInterval;
  isRecommended: boolean;
  currentPlan: boolean;
  priceIdLoading: string | undefined;
  onCheckout: (price: Price) => void;
}) {
  // Format price for display
  const priceString = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: price.currency ?? "USD",
    minimumFractionDigits: 0,
  }).format((price?.unit_amount ?? 0) / 100);

  // Get button text based on loading state and plan status
  const getButtonText = (priceId: string, isCurrentPlan: boolean) => {
    if (priceIdLoading === priceId) {
      return "Loading...";
    }

    if (isCurrentPlan) {
      return "Manage Subscription";
    }

    return "Get Started";
  };

  return (
    <article
      className={cn(
        "relative w-full max-w-96 rounded-xl border",
        currentPlan && "border-primary",
        isRecommended && "border-primary",
      )}
    >
      {/* Recommended Banner */}
      {isRecommended && (
        <Badge variant="neutral" className="absolute top-2 left-2 border">
          Recommended
        </Badge>
      )}

      {/* Header Section */}
      <header className="p-4 sm:p-6 xl:pt-8">
        <div className="mb-6 md:flex md:items-center xl:block">
          <div className="mb-1 flex md:flex-1 md:flex-row-reverse md:items-center xl:mb-6 xl:flex-col-reverse xl:items-start xl:gap-y-4">
            <div className="flex-1 md:ml-6 xl:ml-0">
              <p
                className={cn(
                  "mb-1 font-medium text-xl sm:text-2xl",
                  currentPlan && "text-primary",
                )}
              >
                {product.name}
              </p>
              <p className="text-muted-foreground text-xs sm:text-sm">
                {product.description}
              </p>
            </div>
          </div>
          <div>
            <h2
              className={cn(
                "mb-1 flex items-start font-medium text-2xl md:text-3xl 2xl:text-4xl",
                currentPlan && "text-primary",
              )}
            >
              {priceString}
            </h2>
            <p className="font-medium text-muted-foreground text-xs">
              / {billingInterval}
            </p>
          </div>
        </div>
        <Button
          variant={currentPlan ? "default" : "outline"}
          disabled={priceIdLoading === price.id}
          onClick={() => onCheckout(price)}
          className="w-full"
        >
          {getButtonText(price.id, currentPlan)}
        </Button>
      </header>

      {/* Main Content Section */}
      <main
        className={cn(
          "block space-y-6 border-border border-t p-4 sm:p-6",
          isRecommended && "border-primary",
        )}
      >
        <div>
          <H3 className="mb-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
            Highlights features
          </H3>
          <ul className="space-y-3">
            {featureListPremium.available.map((feature) => (
              <li
                key={feature}
                className="flex items-center gap-x-2 font-medium text-muted-foreground text-xs"
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
        {/* Add Fair Use text */}
        <p className="mt-4 text-muted-foreground text-xs">
          *Subject to fair use
        </p>

        <div>
          <H3 className="mb-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
            Coming soon
          </H3>
          <ul className="space-y-3">
            {featureListPremium.comingSoon.map((feature) => (
              <li
                key={feature}
                className="flex items-center gap-x-2 font-medium text-muted-foreground text-xs"
              >
                <Timer
                  color="currentColor"
                  className="size-4 min-w-4 text-primary"
                />
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </main>

      {/* Current Plan Badge */}
      {currentPlan && (
        <div className="-translate-y-3 absolute top-0 right-0 z-10 translate-x-2">
          <Badge
            variant="default"
            className="flex items-center gap-1 px-3 py-1 font-semibold text-xs"
          >
            Active Plan
          </Badge>
        </div>
      )}
    </article>
  );
}
