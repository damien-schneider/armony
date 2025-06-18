"use client";
import { keyChat } from "@/lib/query-key-factory";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@workspace/supabase/client";

export const useUpdateChat = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      title,
    }: {
      id: string;
      title: string;
    }) => {
      const supabase = createClient();

      const { data } = await supabase
        .from("chats")
        .update({
          title,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select("*")
        .single()
        .throwOnError();

      return data;
    },
    onSuccess: (data) => {
      // Invalidate both the list and the specific chat detail
      queryClient.invalidateQueries({ queryKey: keyChat.lists() });
      queryClient.invalidateQueries({
        queryKey: keyChat.detail({ id: data.id }),
      });
    },
  });
};

export const useDeleteChat = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      const supabase = createClient();

      await supabase.from("chats").delete().eq("id", id).throwOnError();

      return { id };
    },
    onSuccess: () => {
      // Invalidate chat lists to refresh the UI
      queryClient.invalidateQueries({ queryKey: keyChat.lists() });
    },
  });
};
