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
        "relative rounded-xl border max-w-96 w-full",
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
                  "mb-1 text-xl font-medium sm:text-2xl",
                  currentPlan && "text-primary",
                )}
              >
                {product.name}
              </p>
              <p className="text-xs text-muted-foreground sm:text-sm">
                {product.description}
              </p>
            </div>
          </div>
          <div>
            <h2
              className={cn(
                "mb-1 flex items-start text-2xl font-medium md:text-3xl 2xl:text-4xl",
                currentPlan && "text-primary",
              )}
            >
              {priceString}
            </h2>
            <p className="text-xs font-medium text-muted-foreground">
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
          "space-y-6 border-t border-border p-4 sm:p-6 block",
          isRecommended && "border-primary",
        )}
      >
        <div>
          <H3 className="mb-3 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            Highlights features
          </H3>
          <ul className="space-y-3">
            {featureListPremium.available.map((feature) => (
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
        {/* Add Fair Use text */}
        <p className="text-xs text-muted-foreground mt-4">
          *Subject to fair use
        </p>

        <div>
          <H3 className="mb-3 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            Coming soon
          </H3>
          <ul className="space-y-3">
            {featureListPremium.comingSoon.map((feature) => (
              <li
                key={feature}
                className="flex items-center gap-x-2 text-xs font-medium text-muted-foreground"
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
        <div className="absolute top-0 right-0 translate-x-2 -translate-y-3 z-10">
          <Badge
            variant="default"
            className="px-3 py-1 text-xs font-semibold flex items-center gap-1"
          >
            Active Plan
          </Badge>
        </div>
      )}
    </article>
  );
}
