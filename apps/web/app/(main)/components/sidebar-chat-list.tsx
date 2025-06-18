"use client";
import { SidebarChatItem } from "@/app/(main)/components/sidebar-chat-item";
import { useSpaceContext } from "@/app/(main)/contexts/space-context";
import { useChatListByIdSpace } from "@/hooks/queries/client/use-chats.query";
import {
  ScrollArea,
  ScrollAreaViewport,
} from "@workspace/ui/components/scroll-area";
import { AnimatePresence, motion } from "motion/react";
export default function SidebarChatList() {
  const { activeIdSpace } = useSpaceContext();
  const { data: chatList } = useChatListByIdSpace(activeIdSpace);

  return (
    <ScrollArea className="h-full min-h-1 w-full max-h-full relative">
      <ScrollAreaViewport className="*:block!">
        <AnimatePresence mode="popLayout">
          {chatList?.map((chat) => {
            return (
              <motion.div
                key={chat.id}
                id={chat.id}
                layoutId={chat.id}
                initial={{ opacity: 0, x: 200 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -200 }}
                layout={true}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                }}
                className="w-full"
              >
                <SidebarChatItem chat={chat} />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </ScrollAreaViewport>
    </ScrollArea>
  );
}
