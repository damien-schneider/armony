import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@workspace/supabase/client";
import { keySnippet } from "@/lib/query-key-factory";

export const useCreateSnippet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      title,
      content,
      idUser,
    }: {
      title: string;
      content: string;
      emoji: string;
      idUser: string;
    }) => {
      const supabase = createClient();

      const { data } = await supabase
        .from("snippets")
        .insert({
          id_user: idUser,
          title,
          content,
          updated_at: new Date().toISOString(),
        })
        .select("*")
        .single()
        .throwOnError();

      return data;
    },
    onSuccess: () => {
      // Invalidate related queries to refresh the UI
      queryClient.invalidateQueries({ queryKey: keySnippet.lists() });
    },
  });
};

export const useUpdateSnippet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      title,
      content,
      idUser,
    }: {
      id: string;
      title: string;
      content: string;
      idUser: string;
    }) => {
      const supabase = createClient();

      const { data } = await supabase
        .from("snippets")
        .update({
          title,
          content,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .eq("id_user", idUser) // Security check
        .select("*")
        .single()
        .throwOnError();

      return data;
    },
    onSuccess: () => {
      // Invalidate related queries to refresh the UI
      queryClient.invalidateQueries({ queryKey: keySnippet.lists() });
    },
  });
};

export const useDeleteSnippet = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, idUser }: { id: string; idUser: string }) => {
      const supabase = createClient();

      await supabase
        .from("snippets")
        .delete()
        .eq("id", id)
        .eq("id_user", idUser) // Security check
        .throwOnError();

      return id;
    },
    onSuccess: () => {
      // Invalidate related queries to refresh the UI
      queryClient.invalidateQueries({ queryKey: keySnippet.lists() });
    },
  });
};
