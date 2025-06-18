// error.tsx
"use client";

import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Home2, Refresh, Warning2 } from "iconsax-react";
import Link from "next/link";
import posthog from "posthog-js";
import { useEffect } from "react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    posthog.captureException(error);
  }, [error]);

  return (
    <div className="flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-2">
            <Warning2
              color="currentColor"
              size={42}
              className="text-destructive"
            />
          </div>
          <CardTitle className="text-2xl">Something went wrong</CardTitle>
          <CardDescription className="text-muted-foreground">
            {error.message || "We've encountered an unexpected error"}
          </CardDescription>
          {error.digest && (
            <div className="mt-2 rounded-md bg-muted p-2 text-xs font-mono">
              Error digest: {error.digest}
            </div>
          )}
        </CardHeader>
        <CardContent className="text-center text-sm text-muted-foreground">
          <p>
            Please try again or return to the home page. If the problem
            persists, contact our support team.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Button
            variant="default"
            onClick={() => reset()}
            className="w-full sm:w-auto"
          >
            <Refresh color="currentColor" className="mr-2 h-4 w-4" />
            Try again
          </Button>
          <Button variant="default" asChild={true} className="w-full sm:w-auto">
            <Link href="/">
              <Home2 color="currentColor" className="mr-2 h-4 w-4" />
              Return Home
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
