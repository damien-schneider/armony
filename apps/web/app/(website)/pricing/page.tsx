import Pricing from "@/app/(website)/pricing/pricing-component";

export default async function PricingPage() {
  const supabase = await createServerClient();
  const [user, products, subscription] = await Promise.all([
    getUser(supabase),
    getProducts(supabase),
    getSubscription(supabase),
  ]);

  return (
    <Pricing
      user={user}
      products={products ?? []}
      subscription={subscription}
    />
  );
}

import type { SupabaseClient } from "@supabase/supabase-js";
import { createServerClient } from "@workspace/supabase/server";
import { cache } from "react";

const getUser = cache(async (supabase: SupabaseClient) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
});

const getSubscription = cache(async (supabase: SupabaseClient) => {
  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("*, prices(*, products(*))")
    .in("status", ["trialing", "active"])
    .maybeSingle()
    .throwOnError();

  return subscription;
});

const getProducts = cache(async (supabase: SupabaseClient) => {
  const { data: products } = await supabase
    .from("products")
    .select("*, prices(*)")
    .eq("active", true)
    .eq("prices.active", true)
    .order("metadata->index")
    .order("unit_amount", { referencedTable: "prices" })
    .throwOnError();

  return products;
});

// export const getUserDetails = cache(async (supabase: SupabaseClient) => {
//   const { data: userDetails } = await supabase
//     .from("users")
//     .select("*")
//     .single();
//   return userDetails;
// });
