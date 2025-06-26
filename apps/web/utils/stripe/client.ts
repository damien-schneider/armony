"use client";
import { loadStripe, type Stripe } from "@stripe/stripe-js";
import { envClient } from "@/env/client";

let stripePromise: Promise<Stripe | null>;

export const getStripeClient = () => {
  if (stripePromise === undefined) {
    stripePromise = loadStripe(envClient.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
  }

  return stripePromise;
};
