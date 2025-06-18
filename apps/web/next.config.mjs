/** @type {import('next').NextConfig} */

import { fileURLToPath } from "node:url";
import createMDX from "@next/mdx";
import { createJiti } from "jiti";

const jiti = createJiti(fileURLToPath(import.meta.url));

// Import env here to validate during build. Using jiti we can import .ts files :)
await jiti.import("./env/client.ts");
await jiti.import("./env/server.ts");

// eslint-disable-next-line no-undef
const isDevelopmentEnv = process.env.NODE_ENV !== "production";

// eslint-disable-next-line no-undef
const supabaseHost = process.env.NEXT_PUBLIC_SUPABASE_URL.replace(
  "https://",
  "",
);

const remotePatterns = [
  {
    protocol: "https",
    hostname: supabaseHost,
    port: "",
    search: "",
  },
];

if (isDevelopmentEnv) {
  remotePatterns.push({
    protocol: "http",
    hostname: "localhost",
    port: "54321",
    search: "",
  });
}

const nextConfig = {
  experimental: {
    reactCompiler: true,
  },
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  output: "standalone",
  transpilePackages: [
    "@workspace/ui",
    // "@t3-oss/env-nextjs",
    // "@t3-oss/env-core"
  ],
  images: {
    remotePatterns,
  },
};
const withMDX = createMDX({
  // Add markdown plugins here, as desired
});

export default withMDX(nextConfig);
