import { useQuery } from "@tanstack/react-query";
import { createClient } from "@workspace/supabase/client";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { motion } from "motion/react";
import Image from "next/image";
import { toast } from "sonner";
export function AssistantImageMessage({
  imagePath,
  alt,
}: {
  imagePath: string;
  alt?: string;
}) {
  const { data: src, isLoading } = useQuery({
    queryKey: ["image", imagePath],
    queryFn: async () => {
      const supabase = createClient();
      const { data, error } = await supabase.storage
        .from("generated-images")
        .download(imagePath, {
          // transform: {
          //   width: 512,
          //   height: 512,
          //   quality: 80, // Def
          // },
        });
      if (error) {
        toast.error("Error downloading image");
        console.error("Error downloading image:", error);
        throw new Error("Error downloading image");
      }

      return URL.createObjectURL(data);
    },
    enabled: !!imagePath, // This!
  });

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="mb-4 w-full overflow-hidden rounded-3xl border bg-background-2 p-1.5 shadow-md"
    >
      {isLoading && (
        <Skeleton className="h-64 w-full animate-pulse rounded-3xl bg-gray-200" />
      )}
      {!isLoading && src && (
        <Image
          src={src}
          alt={alt || "Generated image"}
          width={512}
          height={512}
          className="m-0! h-fit w-full rounded-2xl object-contain p-0! transition-transform hover:scale-99"
        />
      )}
    </motion.div>
  );
}
