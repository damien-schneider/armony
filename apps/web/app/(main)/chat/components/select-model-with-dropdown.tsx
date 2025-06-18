import { useChatContext } from "@/app/(main)/contexts/chat-context";
import type { AiModelKey } from "@/app/api/chat/ai-models.type";
import {
  availableModels,
  modelCategories,
  modelCategoryList,
} from "@/app/api/chat/lib/ai-models-client.lib";
import { IconAiProvider } from "@/lib/provider-icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { cn } from "@workspace/ui/lib/utils";
import { ArrowDown2 } from "iconsax-react";

export function SelectModelWithDropdown({
  children,
  onSelect,
  imageInput = false,
  dropdownAlign = "start",
}: {
  children: string;
  onSelect: (model: AiModelKey) => void;
  imageInput: boolean;
  dropdownAlign?: "center" | "start" | "end";
}) {
  const { model: selectedModel } = useChatContext();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="group inline-flex transform-gpu items-center gap-1 rounded-md px-2 py-1 transition-colors hover:bg-background-2 cursor-pointer select-none">
        <IconAiProvider provider={selectedModel.provider} className="size-4" />
        <span className="w-fit max-w-0 transform-gpu overflow-hidden transition-all duration-500 group-hover:max-w-28">
          <span className="transform-gpu whitespace-nowrap text-muted-foreground tracking-tighter font-medium text-sm opacity-0 transition-opacity duration-500 group-hover:opacity-100">
            {children}
          </span>
        </span>
        <ArrowDown2
          color="currentColor"
          className="size-4 text-neutral-400 mt-px"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align={dropdownAlign}>
        {modelCategoryList.map((category) => {
          const categoryInfo = modelCategories[category];
          const filteredModels = Object.values(availableModels).filter(
            (model) =>
              model.specificity === category &&
              (!imageInput || model.options.imageInput),
          );
          if (filteredModels.length === 0) {
            return null;
          }
          return (
            <DropdownMenuGroup key={categoryInfo.slug}>
              <DropdownMenuLabel>{categoryInfo.name}</DropdownMenuLabel>
              {filteredModels.map((model) => (
                <DropdownMenuItem
                  key={model.slug}
                  onClick={() => onSelect(model.slug)}
                  className={cn(
                    "flex items-center gap-2",
                    selectedModel.slug === model.slug && "bg-accent",
                  )}
                >
                  <IconAiProvider
                    provider={model.provider}
                    className="size-4"
                  />
                  {model.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
