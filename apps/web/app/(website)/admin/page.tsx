"use client";
import { Button } from "@workspace/ui/components/button";
import { useState } from "react";
import { toast } from "sonner";

export default function Page() {
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateProductsAndPrices = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/stripe/sync", {
        method: "POST",
      });

      const data = await response.json();

      if (data.success) {
        toast.success(
          `Successfully synchronized ${data.syncedProducts} products and ${data.syncedPrices} prices from Stripe to Supabase.`,
        );
      } else {
        toast.error(
          `Error synchronizing data: ${data.error || "Unknown error"}`,
        );
      }
    } catch (error) {
      console.error("Error synchronizing Stripe data:", error);
      toast.error(
        "Failed to synchronize Stripe data. Please check the console for details.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-8">Admin Dashboard</h1>

      <div className="space-y-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Stripe Integration</h2>
          <Button onClick={handleUpdateProductsAndPrices} disabled={isLoading}>
            {isLoading ? "Syncing..." : "Update Stripe Product & Prices"}
          </Button>
        </div>
      </div>
    </div>
  );
}
