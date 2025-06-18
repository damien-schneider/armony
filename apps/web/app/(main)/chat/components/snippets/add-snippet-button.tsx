import AddSnippetDialog from "@/app/(main)/chat/components/snippets/add-snippet-dialog";
import { useChatContext } from "@/app/(main)/contexts/chat-context";
import { Button } from "@workspace/ui/components/button";
import { Shortcut, ShortcutItem } from "@workspace/ui/components/shortcut";
export default function AddSnippetButton() {
  const { inputValue } = useChatContext();
  if (inputValue.length < 12) {
    return null;
  }
  return (
    <div className="z-10 inline-flex items-center justify-between p-2 pb-0">
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
    </div>
  );
}
