import { keyEmpty, keySubscription } from "@/lib/query-key-factory";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@workspace/supabase/client";
import type { Tables } from "@workspace/supabase/types/database";

export const useSubscriptionByUser = (idUser: string | null | undefined) => {
  return useQuery({
    queryKey: idUser ? keySubscription.detail({ idUser }) : keyEmpty,
    queryFn: async () => {
      const supabase = createClient();
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
    },
    enabled: !!idUser,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};
