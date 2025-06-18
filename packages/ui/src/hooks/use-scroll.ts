"use client";
import { useEventListener } from "@workspace/ui/hooks/use-event-listner";
import { type RefObject, useRef, useState } from "react";

interface UseScrollReturn {
  scrollAreaRef: RefObject<HTMLDivElement | null>;
  scrollAreaContentRef: RefObject<HTMLDivElement | null>;
  isAtBottom: boolean;
  scrollToBottom: () => void;
}

/**
 * Custom hook to manage scrolling behavior in containers
 * Provides functionality to:
 * - Track if scroll area is at the bottom
 * - Scroll to bottom smoothly
 * - Get refs for scroll container and content
 */
export function useScroll(bottomThreshold = 50): UseScrollReturn {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const scrollAreaContentRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);

  // Smoothly scroll to the bottom of the container
  const scrollToBottom = () => {
    scrollAreaContentRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  };

  // Check if the scroll container is near the bottom
  const handleScroll = () => {
    const scrollElement = scrollAreaRef.current;
    if (!scrollElement) {
      return;
    }
    const { scrollTop, scrollHeight, clientHeight } = scrollElement;
    // Consider near-bottom if within threshold px of the end
    const atBottom = scrollTop + clientHeight >= scrollHeight - bottomThreshold;
    setIsAtBottom(atBottom);
  };

  useEventListener("scroll", handleScroll, scrollAreaRef);

  return {
    scrollAreaRef,
    scrollAreaContentRef,
    isAtBottom,
    scrollToBottom,
  };
}
