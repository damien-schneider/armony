import { Button } from "@workspace/ui/components/button";
import { Shortcut, ShortcutItem } from "@workspace/ui/components/shortcut";
import { cn } from "@workspace/ui/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import AddSnippetDialog from "@/app/(main)/chat/components/snippets/add-snippet-dialog";
import { useChatContext } from "@/app/(main)/contexts/chat-context";

export function AddSnippetButton() {
  const { inputValue } = useChatContext();
  return (
    <AnimatePresence mode="popLayout">
      {inputValue.length > 12 && (
        <motion.div
          initial={{ opacity: 0, filter: "blur(10px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, filter: "blur(10px)" }}
          transition={{ duration: 0.3 }}
          className={cn("z-10 inline-flex items-center justify-between")}
        >
          <AddSnippetDialog content={inputValue}>
            <Button variant="outline" size="xs">
              Save prompt
              <Shortcut variant="secondary">
                <ShortcutItem>cmd</ShortcutItem>
                <ShortcutItem>maj</ShortcutItem>
                <ShortcutItem>enter</ShortcutItem>
              </Shortcut>
            </Button>
          </AddSnippetDialog>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
