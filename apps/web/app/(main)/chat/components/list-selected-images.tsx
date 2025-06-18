"use client";
import { Button } from "@workspace/ui/components/button";
import { CloseCircle } from "iconsax-react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";

interface ImagePreview {
  id: string;
  file: File;
  preview: string;
}

interface ListSelectedImagesProps {
  images: ImagePreview[];
  onRemove: (index: number) => void;
}

export function ListSelectedImages({
  images,
  onRemove,
}: ListSelectedImagesProps) {
  if (!images || images.length === 0) {
    return null;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{
          opacity: 1,
          height: "auto",
          transition: {
            height: { duration: 0.2, ease: "easeOut" },
            opacity: { duration: 0.15 },
          },
        }}
        exit={{
          opacity: 0,
          height: 0,
          transition: {
            height: { duration: 0.15, ease: "easeIn" },
            opacity: { duration: 0.1 },
          },
        }}
        className="relative border-b overflow-hidden"
      >
        <motion.div
          className="flex flex-wrap gap-2 p-2"
          layout={true}
          transition={{
            layout: { duration: 0.15, ease: "easeOut" },
          }}
        >
          {images.map((image, index) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
              animate={{
                opacity: 1,
                scale: 1,
                rotate: 0,
                transition: {
                  type: "spring",
                  stiffness: 400,
                  damping: 30,
                  mass: 0.8,
                },
              }}
              exit={{
                opacity: 0,
                scale: 0.9,
                rotate: 2,
                transition: {
                  duration: 0.15,
                },
              }}
              className="relative w-24 h-24 rounded-lg overflow-hidden group"
            >
              <Image
                src={image.preview}
                alt={`Preview ${image.id}`}
                fill={true}
                className="object-cover"
                sizes="96px"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute -top-1 -right-1 bg-background/80 hover:bg-background/90 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => onRemove(index)}
              >
                <CloseCircle
                  color="currentColor"
                  className="size-5 text-destructive"
                />
              </Button>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
