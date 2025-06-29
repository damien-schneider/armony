import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";
export const envServer = createEnv({
  server: {
    NEXT_PRIVATE_SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
    OPENAI_API_KEY: z.string().min(1),
    ANTHROPIC_API_KEY: z.string().min(1),
    DEEPSEEK_API_KEY: z.string().min(1),
    GOOGLE_GENERATIVE_AI_API_KEY: z.string().min(1),
    GROQ_API_KEY: z.string().min(1),
    XAI_API_KEY: z.string().min(1),
    NEXT_PRIVATE_OPENROUTER_API_KEY: z.string().min(1),
    NEXT_PRIVATE_STRIPE_SECRET_KEY: z.string().min(1),
    NEXT_PRIVATE_STRIPE_WEBHOOK_SECRET: z.string().min(1),
    // DATABASE_URL: z.string().url(),
    // OPENAI_API_KEY: z.string().min(1),
  },
  // If you're using Next.js < 13.4.4, you'll need to specify the runtimeEnv manually
  // runtimeEnv: {
  //   DATABASE_URL: process.env.DATABASE_URL,
  //   OPEN_AI_API_KEY: process.env.OPEN_AI_API_KEY,
  // },
  // For Next.js >= 13.4.4, you can just reference process.env:
  experimental__runtimeEnv: process.env,
});
