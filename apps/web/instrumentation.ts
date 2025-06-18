//@ts-nocheck
/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable turbo/no-undeclared-env-vars */

import { envClient } from "@/env/client";

// instrumentation.js
export function register() {
  // No-op for initialization
}

// biome-ignore lint/correctness/noUnusedVariables: <explanation>
// biome-ignore lint/correctness/noUnusedFunctionParameters: <explanation>
export const onRequestError = async (err, request, context) => {
  if (envClient.NEXT_PUBLIC_NODE_ENV !== "production") {
    console.error("Error in request:", err);
    return;
  }
  if (process.env.NEXT_RUNTIME === "nodejs") {
    // biome-ignore lint/correctness/useImportExtensions: <explanation>
    const { getPostHogServer } = require("./app/posthog-server");
    const posthog = await getPostHogServer();

    // biome-ignore lint/suspicious/noEvolvingTypes: <explanation>
    let distinctId = null;
    if (request.headers.cookie) {
      const cookieString = request.headers.cookie;
      const postHogCookieMatch = cookieString.match(
        // biome-ignore lint/performance/useTopLevelRegex: <explanation>
        /ph_phc_.*?_posthog=([^;]+)/,
      );

      if (postHogCookieMatch?.[1]) {
        try {
          const decodedCookie = decodeURIComponent(postHogCookieMatch[1]);
          const postHogData = JSON.parse(decodedCookie);
          distinctId = postHogData.distinct_id;
        } catch (e) {
          console.error("Error parsing PostHog cookie:", e);
        }
      }
    }

    await posthog.captureException(err, distinctId ?? undefined);
  }
};
