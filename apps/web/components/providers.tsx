"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import type { ReactNode } from "react";
import { useEffect } from "react";
import SuspendedPostHogPageView from "@/components/posthog-page-view";
import { envClient } from "@/env/client";
import { usePosthogUserIdentification } from "@/hooks/use-posthog-identification";

export function Providers({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <PosthogProviderWrapper>
        <SuspendedPostHogPageView />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem={true}
          disableTransitionOnChange={true}
          enableColorScheme={true}
        >
          {children}
        </ThemeProvider>
      </PosthogProviderWrapper>
    </QueryClientProvider>
  );
}

const PosthogProviderWrapper = ({ children }: { children: ReactNode }) => {
  useEffect(() => {
    if (envClient.NEXT_PUBLIC_NODE_ENV !== "production") {
      // Disable PostHog in development mode
      return;
    }
    posthog.init(envClient.NEXT_PUBLIC_POSTHOG_KEY, {
      api_host: envClient.NEXT_PUBLIC_POSTHOG_HOST,
      capture_pageview: false, // Disable automatic pageview capture, as we capture manually
      capture_pageleave: true,
    });
  }, []);

  usePosthogUserIdentification();
  if (envClient.NEXT_PUBLIC_NODE_ENV !== "production") {
    // Disable PostHog in development mode
    return <>{children}</>;
  }
  return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
};
