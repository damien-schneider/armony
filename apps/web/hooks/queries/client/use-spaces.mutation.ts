"use client";
import { keySpace } from "@/lib/query-key-factory";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@workspace/supabase/client";

export const useCreateSpace = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      title,
      emoji,
      idUser,
    }: { title: string; emoji: string; idUser: string }) => {
      const supabase = createClient();

      const { data } = await supabase
        .from("spaces")
        .insert({
          id_user: idUser,
          title,
          emoji,
        })
        .select("*")
        .single()
        .throwOnError();

      return data;
    },
    onSuccess: () => {
      // Invalidate related queries to refresh the UI
      queryClient.invalidateQueries({ queryKey: keySpace.lists() });
    },
  });
};

export const useUpdateSpace = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      title,
      emoji,
      content,
    }: {
      id: string;
      title?: string;
      emoji?: string;
      content?: string;
    }) => {
      const supabase = createClient();

      const { data } = await supabase
        .from("spaces")
        .update({
          title,
          emoji,
          content,
        })
        .eq("id", id)
        .select("*")
        .single()
        .throwOnError();

      return data;
    },
    onSuccess: (data) => {
      // Invalidate both the list and the specific space detail
      queryClient.invalidateQueries({ queryKey: keySpace.lists() });
      queryClient.invalidateQueries({
        queryKey: keySpace.detail({ id: data.id }),
      });
    },
  });
};

export const useDeleteSpace = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      const supabase = createClient();

      await supabase.from("spaces").delete().eq("id", id).throwOnError();

      return id;
    },
    onSuccess: (id) => {
      // Invalidate the space lists to refresh the UI
      queryClient.invalidateQueries({ queryKey: keySpace.lists() });
      // Remove the specific space detail from cache
      queryClient.removeQueries({
        queryKey: keySpace.detail({ id }),
      });
    },
  });
};
