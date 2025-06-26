"use client";

import { createClient } from "@workspace/supabase/client";
import { Button } from "@workspace/ui/components/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@workspace/ui/components/command";
import { useKeyPress } from "@workspace/ui/hooks/use-key-press";
import { format } from "date-fns";
import {
  Card,
  LogoutCurve,
  MessageText,
  SearchNormal,
  SidebarLeft,
  User,
} from "iconsax-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSpaceContext } from "@/app/(main)/contexts/space-context";
import { useChatListByIdSpace } from "@/hooks/queries/client/use-chats.query";
import { useCustomerPortal } from "@/hooks/queries/client/use-customer-portal.query";
import { useSpaceListByIdUser } from "@/hooks/queries/client/use-spaces.query";
import { useSession } from "@/hooks/queries/use-session";

export function SearchMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { activeSpace, changeSpaceById } = useSpaceContext();
  const { idUser } = useSession();
  const { data: chats } = useChatListByIdSpace(activeSpace?.id);
  const { data: spaces } = useSpaceListByIdUser(idUser);
  const { data: customerPortalUrl } = useCustomerPortal();

  // Determine if dialog is open (either controlled externally or internally)

  // Handle open state changes
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
  };

  // Handle keyboard shortcut
  useKeyPress({
    keyPressItems: [
      {
        keys: ["Meta", "KeyK"],
        event: (event) => {
          event.preventDefault();
          setIsOpen((prev) => !prev);
        },
      },
    ],
  });

  // Handle space switching
  const handleSpaceChange = (spaceId: string) => {
    changeSpaceById(spaceId);
    handleOpenChange(false);
  };

  // Handle navigation
  const handleNavigation = (path: string) => {
    router.push(path);
    handleOpenChange(false);
  };

  // Handle sign out
  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/signin");
    handleOpenChange(false);
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => handleOpenChange(!isOpen)}
      >
        <SearchNormal color="currentColor" className="size-5" />
      </Button>
      <CommandDialog open={isOpen} onOpenChange={handleOpenChange}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>

          {/* Spaces navigation */}
          <CommandGroup heading="Spaces">
            {spaces?.map((space) => (
              <CommandItem
                key={space.id}
                onSelect={() => handleSpaceChange(space.id)}
              >
                <div className="mr-2">{space.emoji || "🪐"}</div>
                <span>{space.title}</span>
                {activeSpace?.id === space.id && (
                  <CommandShortcut className="text-foreground/50 text-xs tracking-normal">
                    Active
                  </CommandShortcut>
                )}
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandSeparator />

          {/* Chats navigation */}
          <CommandGroup heading="Recent Chats">
            {chats?.map((chat) => (
              <CommandItem
                key={`chat-${chat.id}`}
                onSelect={() => handleNavigation(`/chat/${chat.id}`)}
                className="flex items-center justify-between"
                value={chat.id}
                keywords={[chat.title ?? ""]}
              >
                <div className="inline-flex w-fit items-center">
                  <MessageText className="mr-2 h-4 w-4" color="currentColor" />
                  <span>{chat.title ?? "Untitled Chat"}</span>
                </div>
                <span className="text-foreground/50 text-xs">
                  {format(new Date(chat.created_at), "MMMM, dd")}
                </span>
              </CommandItem>
            ))}
            <CommandItem onSelect={() => handleNavigation("/chat")}>
              <MessageText className="mr-2 h-4 w-4" color="currentColor" />
              <span>New Chat</span>
            </CommandItem>
          </CommandGroup>

          <CommandSeparator />

          {/* Pages navigation */}
          <CommandGroup heading="Pages">
            {activeSpace?.id && (
              <CommandItem
                onSelect={() => handleNavigation(`/space/${activeSpace?.id}`)}
                keywords={[activeSpace.title || ""]}
              >
                <SidebarLeft className="mr-2 h-4 w-4" color="currentColor" />
                <span>Current Space</span>
              </CommandItem>
            )}
            <CommandItem onSelect={() => handleNavigation("/account")}>
              <User className="mr-2 h-4 w-4" color="currentColor" />
              <span>My account</span>
              <CommandShortcut>⌘P</CommandShortcut>
            </CommandItem>
          </CommandGroup>

          <CommandSeparator />

          {/* Settings and account */}
          <CommandGroup heading="Settings">
            {customerPortalUrl && (
              <CommandItem onSelect={() => handleNavigation(customerPortalUrl)}>
                <Card className="mr-2 h-4 w-4" color="currentColor" />
                <span>Billing</span>
                <CommandShortcut>⌘B</CommandShortcut>
              </CommandItem>
            )}
            {/* <CommandItem onSelect={() => handleNavigation("/account/settings")}>
              <Setting2 className="mr-2 h-4 w-4" color="currentColor" />
              <span>Settings</span>
              <CommandShortcut>⌘S</CommandShortcut>
            </CommandItem> */}
            {/* <CommandItem onSelect={() => handleNavigation("/account/archives")}>
              <ArchiveBox className="mr-2 h-4 w-4" color="currentColor" />
              <span>Archives</span>
            </CommandItem> */}
            <CommandItem onSelect={handleSignOut} className="text-destructive">
              <LogoutCurve className="mr-2 h-4 w-4" color="currentColor" />
              <span>Sign Out</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
