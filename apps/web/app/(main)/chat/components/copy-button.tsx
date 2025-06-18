import { Button } from "@workspace/ui/components/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip";
import { cn } from "@workspace/ui/lib/utils";
import { Copy, CopySuccess } from "iconsax-react";
import { type ComponentProps, useState } from "react";
import { useCopyToClipboard } from "usehooks-ts";

export const CopyToClipboardButton = ({
  copyContent,
  className,
}: { copyContent: string } & ComponentProps<"button">) => {
  const [isCopied, setIsCopied] = useState(false);
  const [, copy] = useCopyToClipboard();

  const handleCopyToClipboard = () => {
    console.log("Copying code to clipboard:", copyContent);
    copy(copyContent)
      .then(() => {
        setIsCopied(true);

        setTimeout(() => {
          setIsCopied(false);
        }, 2000);
      })
      .catch((error) => {
        console.error("Failed to copy!", error);
      });
  };

  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild={true}>
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={handleCopyToClipboard}
            className={cn("relative text-muted-foreground", className)}
            title="Copy to clipboard"
            aria-label="Copy code to clipboard"
          >
            {isCopied ? (
              <>
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-background-2 px-2 rounded-md text-muted-foreground select-none">
                  copied
                </div>
                <CopySuccess color="currentColor" className="size-4" />
              </>
            ) : (
              <Copy color="currentColor" className="size-4" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>Copy to clipboard</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
