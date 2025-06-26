// import { Geist, Geist_Mono } from "next/font/google";
import "@workspace/ui/globals.css";
import { cn } from "@workspace/ui/lib/utils";
import type { Metadata } from "next";
import {
  Funnel_Sans,
  //  Lexend
} from "next/font/google";
import type { ReactNode } from "react";
import { Toaster } from "sonner";
import { Providers } from "@/components/providers";
import { envClient } from "@/env/client";

// const fontLexend = Lexend({
//   subsets: ["latin"],
//   variable: "--font-sans",
// });
const fontFunnelSans = Funnel_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

// const fontMono = Geist_Mono({
//   subsets: ["latin"],
//   variable: "--font-mono",
// });

export const metadata: Metadata = {
  title: "Armony",
  description:
    "Access the latest AI technologies instantly. Whether you're generating images or harnessing advanced reasoning, remove workflow friction and boost productivity every time.",
  icons: {
    icon: [
      {
        media: "(prefers-color-scheme: light)",
        url: "/images/favicon-light.png",
        href: "/images/favicon-light.png",
      },
      {
        media: "(prefers-color-scheme: dark)",
        url: "/images/favicon-dark.png",
        href: "/images/favicon-dark.png",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <head>
        <meta name="apple-mobile-web-app-title" content="Armony" />
        {envClient.NEXT_PUBLIC_NODE_ENV === "development" && (
          // eslint-disable-next-line @next/next/no-sync-scripts
          <script
            crossOrigin="anonymous"
            src="//unpkg.com/react-scan/dist/auto.global.js"
          />
        )}
        {/* rest of your scripts go under */}
      </head>

      <body
        className={cn(
          "bg-background",
          // fontLexend.variable,
          fontFunnelSans.variable,
          "font-sans antialiased",
        )}
      >
        <Toaster
          richColors={true}
          // It creates problems because the "!" on the toast overwrites the specified colors

          // toastOptions={{
          //   classNames: {
          //     toast:
          //       "bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-50 border border-gray-200 dark:border-gray-800",
          //     success:
          //       "bg-green-100 dark:bg-green-900/30 text-green-900 dark:text-green-200 border-green-200 dark:border-green-700/50",
          //     info: "bg-blue-100! dark:bg-blue-700! text-blue-900! dark:text-blue-200! border-blue-200! dark:border-blue-700/50!",
          //     warning:
          //       "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-900 dark:text-yellow-200 border-yellow-200 dark:border-yellow-700/50",
          //     error:
          //       "bg-red-100 dark:bg-red-900/30 text-red-900 dark:text-red-200 border-red-200 dark:border-red-700/50",
          //   },
          // }}
        />

        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
