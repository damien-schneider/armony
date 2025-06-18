"use client";

import { getErrorRedirect } from "@/utils/helpers";
import { getStripeClient } from "@/utils/stripe/client";
import { checkoutWithStripe, createStripePortal } from "@/utils/stripe/server";

import { FreeProductCard } from "@/app/(website)/pricing/free-product-card";
import { ProductCard } from "@/app/(website)/pricing/product-card";
import type { User } from "@supabase/supabase-js";
import type { Tables } from "@workspace/supabase/types/database";
import { Button } from "@workspace/ui/components/button";
import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";

type Subscription = Tables<"subscriptions">;
type Product = Tables<"products">;
type Price = Tables<"prices">;
interface ProductWithPrices extends Product {
  prices: Price[];
}
interface PriceWithProduct extends Price {
  products: Product | null;
}
interface SubscriptionWithProduct extends Subscription {
  prices: PriceWithProduct | null;
}

type BillingInterval = Tables<"prices">["interval"];

export default function Pricing({
  user,
  products,
  subscription,
}: {
  user: User | null | undefined;
  products: ProductWithPrices[];
  subscription: SubscriptionWithProduct | null;
}) {
  const intervals = Array.from(
    new Set(
      products.flatMap((product) =>
        product?.prices?.map((price) => price?.interval),
      ),
    ),
  ).filter(Boolean);

  // Default to "month" if available, otherwise use the first available interval
  const defaultInterval = intervals.includes("month")
    ? "month"
    : (intervals[0] ?? "year");

  const router = useRouter();
  const [billingInterval, setBillingInterval] =
    useState<BillingInterval>(defaultInterval);
  const [priceIdLoading, setPriceIdLoading] = useState<string>();
  const pathname = usePathname();

  // Determine which product corresponds to the current subscription (if any)
  const currentProductId = useMemo(() => {
    if (!subscription?.prices?.products) {
      // If no subscription or free tier
      return null;
    }
    return subscription.prices.products.id;
  }, [subscription]);

  // Check if a price corresponds to the current plan
  const isCurrentPlan = (price: Price) => {
    if (price.product_id && currentProductId) {
      return price.product_id === currentProductId;
    }
    return false;
  };

  const handleStripeCheckout = async (price: Price) => {
    setPriceIdLoading(price.id);

    if (!user) {
      setPriceIdLoading(undefined);
      return router.push("/signup?redirect=pricing");
    }

    const currentPlan = isCurrentPlan(price);

    toast.info(
      currentPlan
        ? "Managing your current subscription..."
        : "Redirecting to checkout...",
    );

    if (currentPlan) {
      // For active subscriptions, redirect to the customer portal
      console.log("Redirecting to customer portal");
      const portalUrl = await createStripePortal(pathname);
      if (typeof portalUrl === "string") {
        // If we got a URL, navigate to the portal
        window.location.href = portalUrl;
      } else {
        // If we got an error redirect, use the router
        router.push(portalUrl);
      }
      setPriceIdLoading(undefined);
      return;
    }

    // For new subscriptions or plan changes, use the checkout
    const { errorRedirect, sessionId } = await checkoutWithStripe(
      price,
      pathname,
    );

    if (errorRedirect) {
      setPriceIdLoading(undefined);
      return router.push(errorRedirect);
    }

    if (!sessionId) {
      setPriceIdLoading(undefined);
      return router.push(
        getErrorRedirect(
          pathname,
          "An unknown error occurred.",
          "Please try again later or contact a system administrator.",
        ),
      );
    }

    const stripe = await getStripeClient();
    stripe?.redirectToCheckout({ sessionId });

    setPriceIdLoading(undefined);
  };

  if (products.length === 0) {
    return (
      <section className="text-center py-12">
        <p className="text-lg">No subscription pricing plans found.</p>
      </section>
    );
  }

  return (
    <section className="w-full">
      <div className="max-w-6xl px-4 py-8 mx-auto sm:py-24 sm:px-6 lg:px-8">
        {/* Only show billing interval selector if we have multiple intervals */}
        {intervals.length > 1 && (
          <div className="flex justify-center mb-12">
            <div className="inline-flex rounded-lg border p-0.5">
              {intervals.includes("month") && (
                <Button
                  onClick={() => setBillingInterval("month")}
                  variant={billingInterval === "month" ? "default" : "outline"}
                  className="rounded-r-none"
                >
                  Monthly billing
                </Button>
              )}
              {intervals.includes("year") && (
                <Button
                  onClick={() => setBillingInterval("year")}
                  variant={billingInterval === "year" ? "default" : "outline"}
                  className="rounded-l-none"
                >
                  Yearly billing
                </Button>
              )}
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-6 justify-center">
          {/* Free Tier Card */}
          <FreeProductCard onGetStarted={() => router.push("/signup")} />

          {/* Paid Subscription Cards */}
          {products.map((product, index) => {
            const price = product?.prices?.find(
              (price) => price.interval === billingInterval,
            );

            // Using optional chaining to simplify the condition
            if (!price?.currency) {
              return null; // Skip products without a price for the current interval or missing currency
            }

            const currentPlan = isCurrentPlan(price);
            // Set recommended badge for the first paid subscription
            const isRecommended = index === 0;

            return (
              <ProductCard
                key={product.id}
                product={product}
                price={price}
                billingInterval={billingInterval}
                isRecommended={isRecommended}
                currentPlan={currentPlan}
                priceIdLoading={priceIdLoading}
                onCheckout={handleStripeCheckout}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
