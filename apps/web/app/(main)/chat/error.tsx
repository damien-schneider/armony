"use client";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/alert";
import { Button } from "@workspace/ui/components/button";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ErrorChat({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center h-full p-4">
      <Alert variant="destructive" className="max-w-xl mb-4">
        <AlertTitle>Something went wrong</AlertTitle>
        <AlertDescription>
          {error.message ||
            "An unexpected error occurred while loading the chat."}
        </AlertDescription>
      </Alert>

      <div className="flex gap-4 mt-4">
        <Button variant="outline" onClick={() => router.push("/chat")}>
          Go back to chat
        </Button>
        <Button onClick={() => reset()}>Try again</Button>
      </div>
    </div>
  );
}
