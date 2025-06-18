"use client";
import { keyEmpty, keySpace } from "@/lib/query-key-factory";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@workspace/supabase/client";
import type { Tables } from "@workspace/supabase/types/database";

export const useSpaceById = (idSpace: string) => {
  return useQuery({
    queryKey: keySpace.detail({ id: idSpace }),
    queryFn: async () => {
      const supabase = createClient();

      const { data } = await supabase
        .from("spaces")
        .select("*")
        .eq("id", idSpace)
        .single()
        .throwOnError();

      return data as Tables<"spaces">;
    },
    enabled: !!idSpace,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useSpaceListByIdUser = (idUser: string | undefined) => {
  return useQuery({
    queryKey: idUser ? keySpace.list({ idUser }) : keyEmpty,
    queryFn: async () => {
      const supabase = createClient();
      if (!idUser) {
        throw new Error("idUser is required");
      }

      const { data } = await supabase
        .from("spaces")
        .select("*")
        .eq("id_user", idUser)
        .order("created_at", { ascending: false })
        .throwOnError();

      return data as Tables<"spaces">[];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
