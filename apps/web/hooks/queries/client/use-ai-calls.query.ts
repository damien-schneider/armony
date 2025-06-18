"use client";
import { useSubscriptionByUser } from "@/hooks/queries/client/use-subscriptions.query";
import { keyEmpty, keyMessageUsage } from "@/lib/query-key-factory";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@workspace/supabase/client";

export const useMessageQuotas = (idUser: string | undefined | null) => {
  const { data: subscription } = useSubscriptionByUser(idUser);
  return useQuery({
    queryKey: idUser ? keyMessageUsage.detail({ userId: idUser }) : keyEmpty,
    queryFn: async () => {
      if (!idUser) {
        return null;
      }
      const supabase = createClient();

      // Calculate date 3 days ago
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

      // Get count of messages in the last 3 days
      const { count, error } = await supabase
        .from("ai-calls")
        .select("*", { count: "exact" })
        .eq("id_user", idUser)
        .gte("created_at", threeDaysAgo.toISOString());

      if (error) {
        console.error("Error fetching message quotas:", error);
        throw new Error("Failed to fetch message quotas");
      }

      // Free users have limit of 10 messages per 3 days
      const messagesUsed = count ?? 0;
      const messagesLimit = subscription?.status === "active" ? 200 : 10;
      const percentageUsed = Math.min(
        100,
        (messagesUsed / messagesLimit) * 100,
      );
      const isMessageQuotaExceeded = messagesUsed >= messagesLimit;
      return {
        messagesUsed,
        messagesLimit,
        percentageUsed,
        isMessageQuotaExceeded,
      };
    },
    enabled: !!idUser && !!subscription,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
