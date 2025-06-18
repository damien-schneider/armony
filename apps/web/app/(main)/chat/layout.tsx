import { ChatContextProvider } from "@/app/(main)/contexts/chat-context";
import { SnippetsProvider } from "@/app/(main)/contexts/snippets-context";
import type { ReactNode } from "react";

export default function LayoutChat({ children }: { children: ReactNode }) {
  return (
    <ChatContextProvider>
      <SnippetsProvider>{children}</SnippetsProvider>
    </ChatContextProvider>
  );
}
