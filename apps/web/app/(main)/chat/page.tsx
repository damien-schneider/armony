import Chat from "@/app/(main)/chat/chat";
import CreateSpaceDialog from "@/app/(main)/components/create-space-dialog";
import { createServerClient } from "@workspace/supabase/server";
import { Button } from "@workspace/ui/components/button";
import { P } from "@workspace/ui/components/typography";
import { Add } from "iconsax-react";

export default async function PageChat() {
  const supabase = await createServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user?.id) {
    throw new Error("User not authenticated and should be redirected");
  }

  const { data: spaces } = await supabase
    .from("spaces")
    .select("*")
    .eq("id_user", session.user.id)
    .order("created_at", { ascending: false })
    .throwOnError();

  if (!spaces || spaces.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <P className="text-muted-foreground text-center">
          You don&apos;t have any spaces yet.
          <br />
          Create one to get started!
        </P>
        <CreateSpaceDialog>
          <Button variant="secondary" className="gap-2">
            <Add color="currentColor" className="size-4" />
            Create Space
          </Button>
        </CreateSpaceDialog>
      </div>
    );
  }

  return (
    <Chat
      initialChat={null}
      // initialMessages={null}
      // initialModel={null}
      // initialTone={"friendly"}
    />
  );
}
