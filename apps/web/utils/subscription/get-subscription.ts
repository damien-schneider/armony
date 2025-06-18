import { createServerClient } from "@workspace/supabase/server";

import type { Tables } from "@workspace/supabase/types/database";

export const getSubscriptionByUser = async (idUser: string) => {
  const supabase = await createServerClient();
  if (!idUser) {
    throw new Error("idUser is required");
  }
  const { data } = await supabase
    .from("subscriptions")
    .select("status, prices!inner(products!inner(name))")
    .eq("user_id", idUser)
    .maybeSingle()
    .throwOnError();

  return {
    status: (data?.status as Tables<"subscriptions">["status"]) ?? null,
    name: data?.prices.products.name ?? null,
  };
};
