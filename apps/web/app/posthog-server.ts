import { envClient } from "@/env/client";
import { PostHog } from "posthog-node";

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
let posthogInstance: any = null;

export function getPostHogServer() {
  if (envClient.NEXT_PUBLIC_NODE_ENV !== "production") {
    return null;
  }
  if (!posthogInstance) {
    posthogInstance = new PostHog(envClient.NEXT_PUBLIC_POSTHOG_KEY, {
      host: envClient.NEXT_PUBLIC_POSTHOG_HOST,
      flushAt: 1,
      flushInterval: 0,
    });
  }
  return posthogInstance;
}
