"use server";

import { createServerClient } from "@workspace/supabase/server";
import type { Tables } from "@workspace/supabase/types/database";
import type Stripe from "stripe";

import { createOrRetrieveCustomer } from "@/app/api/stripe/webhook/supabase-admin-stripe-handler";
import {
  calculateTrialEndUnixTimestamp,
  getErrorRedirect,
  getURL,
} from "@/utils/helpers";
import { stripe } from "@/utils/stripe/config";

type Price = Tables<"prices">;

type CheckoutResponse = {
  errorRedirect?: string;
  sessionId?: string;
};

export async function checkoutWithStripe(
  price: Price,
  redirectPath = "/account",
): Promise<CheckoutResponse> {
  try {
    // Get the user from Supabase auth
    const supabase = await createServerClient();
    const {
      error,
      data: { user },
    } = await supabase.auth.getUser();

    if (error || !user?.email) {
      console.error(error);
      throw new Error("Could not get user session.");
    }

    // Retrieve or create the customer in Stripe
    let customer: string;
    try {
      customer = await createOrRetrieveCustomer({
        uuid: user.id,
        email: user.email,
      });
    } catch (err) {
      console.error(err);
      throw new Error("Unable to access customer record.");
    }

    let params: Stripe.Checkout.SessionCreateParams = {
      allow_promotion_codes: true,
      billing_address_collection: "required",
      customer,
      customer_update: {
        address: "auto",
      },
      line_items: [
        {
          price: price.id,
          quantity: 1,
        },
      ],
      cancel_url: getURL(),
      success_url: getURL(redirectPath),
    };

    console.log(
      "Trial end:",
      calculateTrialEndUnixTimestamp(price.trial_period_days),
    );
    if (price.type === "recurring") {
      params = {
        ...params,
        mode: "subscription",
        subscription_data: {
          trial_end: calculateTrialEndUnixTimestamp(price.trial_period_days),
        },
      };
    } else if (price.type === "one_time") {
      params = {
        ...params,
        mode: "payment",
      };
    }

    // Create a checkout session in Stripe
    try {
      const session = await stripe.checkout.sessions.create(params);
      if (session) {
        return { sessionId: session.id };
      }
    } catch (err) {
      console.error(err);
      throw new Error("Unable to create checkout session.");
    }

    // Instead of returning a Response, just return the data or error.
    throw new Error("Unable to create checkout session.");
  } catch (error) {
    if (error instanceof Error) {
      return {
        errorRedirect: getErrorRedirect(
          redirectPath,
          error.message,
          "Please try again later or contact a system administrator.",
        ),
      };
    }
    return {
      errorRedirect: getErrorRedirect(
        redirectPath,
        "An unknown error occurred.",
        "Please try again later or contact a system administrator.",
      ),
    };
  }
}

export async function createStripePortal(currentPath: string) {
  try {
    const supabase = await createServerClient();
    const {
      error,
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      if (error) {
        console.error(error);
      }
      throw new Error("Could not get user session.");
    }
    if (!user.email) {
      throw new Error("User email is missing.");
    }

    try {
      const customer = await createOrRetrieveCustomer({
        uuid: user.id,
        email: user.email,
      });
      if (!customer) {
        throw new Error("Could not get customer.");
      }
      const { url } = await stripe.billingPortal.sessions.create({
        customer,
        return_url: getURL("/account"),
      });
      if (!url) {
        throw new Error("Could not create billing portal");
      }
      return url;
    } catch (err) {
      console.error(err);
      throw new Error("Unable to create billing portal session.");
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(error);
      return getErrorRedirect(
        currentPath,
        error.message,
        "Please try again later or contact a system administrator.",
      );
    }
    return getErrorRedirect(
      currentPath,
      "An unknown error occurred.",
      "Please try again later or contact a system administrator.",
    );
  }
}
