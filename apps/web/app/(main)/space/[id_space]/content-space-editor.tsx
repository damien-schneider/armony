import { useUpdateSpace } from "@/hooks/queries/client/use-spaces.mutation";
import { useState } from "react";

import {
  convertHtmlToMarkdown,
  convertMarkdownToHtml,
} from "@/lib/html-to-markdown";
import Highlight from "@tiptap/extension-highlight";
import Placeholder from "@tiptap/extension-placeholder";
import Typography from "@tiptap/extension-typography";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import type { Tables } from "@workspace/supabase/types/database";
import { Button } from "@workspace/ui/components/button";
import { Label } from "@workspace/ui/components/label";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import { cn } from "@workspace/ui/lib/utils";
import { toast } from "sonner";

export const ContentSpaceEditor = ({ space }: { space: Tables<"spaces"> }) => {
  const { mutateAsync: updateSpace, isPending } = useUpdateSpace();
  const [markdownContent, setMarkdownContent] = useState<string>(
    space.content ?? "",
  );
  const editor = useEditor({
    extensions: [
      StarterKit,
      Highlight,
      Typography,
      Placeholder.configure({
        placeholder: "Start typing your space content here...",
        emptyEditorClass: "is-editor-empty",
      }),
    ],
    onUpdate: ({ editor }) => {
      const htmlContent = editor.getHTML();
      const markdownContent = convertHtmlToMarkdown(htmlContent);
      setMarkdownContent(markdownContent);
    },
    content: space.content ? convertMarkdownToHtml(space.content) : "",
  });

  const handleSaveContent = async () => {
    if (!editor) {
      return;
    }

    try {
      const htmlContent = editor.getHTML();
      const markdownContent = convertHtmlToMarkdown(htmlContent);
      await updateSpace({
        id: space.id,
        content: markdownContent,
      });
      toast.success("Content saved successfully");
    } catch (error) {
      console.error("Failed to save content:", error);
      toast.error("Failed to save content");
    }
  };

  return (
    <div className="mt-12">
      <div className="flex gap-2 items-center pl-2 min-h-11">
        <Label className="">Space context</Label>
        {markdownContent !== space.content && (
          <Button
            size="xs"
            variant="secondary"
            onClick={handleSaveContent}
            disabled={isPending}
          >
            Save Changes
          </Button>
        )}
      </div>
      <div
        className={cn(
          "relative prose prose-neutral dark:prose-invert max-w-none p-1 border border-border rounded-[20px] before:absolute before:inset-1 hover:before:bg-background-2 before:transition before:duration-150 before:rounded-2xl",
        )}
      >
        <ScrollArea className="h-full w-full min-h-1 *:max-h-[40dvh]">
          <EditorContent
            editor={editor}
            className="h-full *:min-h-[40dvh] rounded-2xl *:outline-none *:px-6 *:py-2 cursor-text"
          />
        </ScrollArea>
      </div>
    </div>
  );
};
