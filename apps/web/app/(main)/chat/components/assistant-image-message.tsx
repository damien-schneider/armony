import { useQuery } from "@tanstack/react-query";
import { createClient } from "@workspace/supabase/client";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { motion } from "motion/react";
import Image from "next/image";
import { toast } from "sonner";
export function AssistantImageMessage({
  imagePath,
  alt,
}: { imagePath: string; alt?: string }) {
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
      className="rounded-3xl border p-1.5 mb-4 bg-background-2 overflow-hidden shadow-md w-full"
    >
      {isLoading && (
        <Skeleton className="animate-pulse w-full h-64 bg-gray-200 rounded-3xl" />
      )}
      {!isLoading && src && (
        <Image
          src={src}
          alt={alt || "Generated image"}
          width={512}
          height={512}
          className="object-contain w-full h-fit p-0! m-0! transition-transform hover:scale-99 rounded-2xl"
        />
      )}
    </motion.div>
  );
}
