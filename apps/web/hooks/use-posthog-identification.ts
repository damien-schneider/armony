"use client";
import { envClient } from "@/env/client";
import { useSession } from "@/hooks/queries/use-session";
import posthog from "posthog-js";
import { useEffect } from "react";

export function usePosthogUserIdentification(): void {
  const { session, isLoading } = useSession();
  const user = session?.user;
  useEffect(() => {
    if (envClient.NEXT_PUBLIC_NODE_ENV !== "production") {
      // Disable PostHog in development mode
      return;
    }
    if (!isLoading && user) {
      posthog.identify(user.id, { email: user.email });
    }
  }, [user, isLoading]);
}
