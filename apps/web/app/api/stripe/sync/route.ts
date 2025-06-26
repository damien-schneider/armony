import { NextResponse } from "next/server";
import {
  upsertPriceRecord,
  upsertProductRecord,
} from "@/app/api/stripe/webhook/supabase-admin-stripe-handler";
import { stripe } from "@/utils/stripe/config";

export async function POST() {
  try {
    // Fetch all products from Stripe
    const products = await stripe.products.list({ limit: 100 });

    // Sync each product to Supabase
    const productPromises = products.data.map(async (product) => {
      await upsertProductRecord(product);
      return product.id;
    });

    // Wait for all products to be synced
    const syncedProductIds = await Promise.all(productPromises);

    // Fetch all prices from Stripe
    const prices = await stripe.prices.list({ limit: 100 });

    // Sync each price to Supabase
    const pricePromises = prices.data.map(async (price) => {
      await upsertPriceRecord(price);
      return price.id;
    });

    // Wait for all prices to be synced
    const syncedPriceIds = await Promise.all(pricePromises);

    // Return the synced data
    return NextResponse.json(
      {
        success: true,
        syncedProducts: syncedProductIds.length,
        syncedPrices: syncedPriceIds.length,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error syncing Stripe data:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      },
      { status: 500 },
    );
  }
}
