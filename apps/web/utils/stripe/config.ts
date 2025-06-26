import Stripe from "stripe";
import { envServer } from "@/env/server";

export const stripe = new Stripe(envServer.NEXT_PRIVATE_STRIPE_SECRET_KEY, {
  // https://github.com/stripe/stripe-node#configuration
  // https://stripe.com/docs/api/versioning
  apiVersion: "2025-05-28.basil",
  // Register this as an official Stripe plugin.
  // https://stripe.com/docs/building-plugins#setappinfo
  appInfo: {
    name: "Armony AI",
    version: "0.0.0",
    url: "https://armony.ai",
  },
});
