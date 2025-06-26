import { ScrollArea } from "@workspace/ui/components/scroll-area";
import { UpdateSpaceForm } from "@/app/(main)/space/[id_space]/update-space-form";

export default async function SpacePage({
  params,
}: {
  params: Promise<{ id_space: string }>;
}) {
  const { id_space } = await params;
  return (
    <ScrollArea className="h-full min-h-1 w-full px-4 pt-12">
      <UpdateSpaceForm idSpace={id_space} />
    </ScrollArea>
  );
}
