"use client";
import { keyChat, keyEmpty } from "@/lib/query-key-factory";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@workspace/supabase/client";
import type { Tables } from "@workspace/supabase/types/database";

export const useChatById = (id: Tables<"chats">["id"]) => {
  return useQuery({
    queryKey: keyChat.detail({ id: id }),
    queryFn: async () => {
      const supabase = createClient();

      const { data } = await supabase
        .from("chats")
        .select("*")
        .eq("id", id)
        .single()
        .throwOnError();
      return data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useChatListByIdSpace = (
  idSpace: Tables<"chats">["id_space"] | undefined | null,
) => {
  return useQuery({
    queryKey: idSpace ? keyChat.list({ idSpace: idSpace }) : keyEmpty,
    queryFn: async () => {
      const supabase = createClient();
      if (!idSpace) {
        throw new Error("idSpace is required");
      }
      const { data } = await supabase
        .from("chats")
        .select("*")
        .eq("id_space", idSpace)
        .order("created_at", { ascending: false })
        .throwOnError();
      return data;
    },
    enabled: !!idSpace,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
