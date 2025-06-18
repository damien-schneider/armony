"use client";
import { envClient } from "@/env/client";
import { type Stripe, loadStripe } from "@stripe/stripe-js";

let stripePromise: Promise<Stripe | null>;

export const getStripeClient = () => {
  if (stripePromise === undefined) {
    stripePromise = loadStripe(envClient.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
  }

  return stripePromise;
};
