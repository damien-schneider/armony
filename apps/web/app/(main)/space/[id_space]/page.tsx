import { UpdateSpaceForm } from "@/app/(main)/space/[id_space]/update-space-form";
import { ScrollArea } from "@workspace/ui/components/scroll-area";

export default async function SpacePage({
  params,
}: { params: Promise<{ id_space: string }> }) {
  const { id_space } = await params;
  return (
    <ScrollArea className="h-full w-full min-h-1 pt-12 px-4">
      <UpdateSpaceForm idSpace={id_space} />
    </ScrollArea>
  );
}
