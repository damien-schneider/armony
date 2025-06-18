import { keyEmpty, keySnippet } from "@/lib/query-key-factory";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@workspace/supabase/client";
import type { Tables } from "@workspace/supabase/types/database";

export const useSnippetsSearchList = ({
  idUser,
  search,
  limit = 8,
}: {
  idUser: Tables<"snippets">["id_user"] | undefined;
  search: string;
  limit?: number;
}) => {
  return useQuery({
    queryKey: idUser ? keySnippet.search({ idUser, search }) : keyEmpty,
    queryFn: async () => {
      const supabase = createClient();
      if (!idUser) {
        throw new Error("idUser is required");
      }
      const { data } = await supabase
        .from("snippets")
        .select("id, title, content, created_at")
        .eq("id_user", idUser)
        .textSearch("content", search) //TODO: when working try adding `or` to search in title
        .or(`title.ilike.%${search}%,content.ilike.%${search}%`)
        .limit(limit)
        .order("created_at", { ascending: true })
        .throwOnError();
      return data;
    },
    enabled: !!idUser,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useAllUserSnippets = (idUser: string | undefined) => {
  return useQuery({
    queryKey: idUser ? keySnippet.list({ idUser }) : keyEmpty,
    queryFn: async () => {
      const supabase = createClient();
      if (!idUser) {
        throw new Error("idUser is required");
      }
      const { data } = await supabase
        .from("snippets")
        .select("id, title, content, created_at")
        .eq("id_user", idUser)
        .order("created_at", { ascending: false })
        .throwOnError();
      return data;
    },
    enabled: !!idUser,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
