import { useCallback, useEffect, useRef, useState } from "react";

interface UseSwipeOptions {
  threshold?: number; // Minimum px needed to trigger swipe action
  onSwipeLeft?: () => void; // Callback for left swipe
  onSwipeRight?: () => void; // Callback for right swipe
}

export function useSwipe({
  threshold = 50,
  onSwipeLeft,
  onSwipeRight,
}: UseSwipeOptions = {}) {
  const [swiping, setSwiping] = useState(false);
  const [distance, setDistance] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  // Use refs to avoid unnecessary re-renders
  const startXRef = useRef<number | null>(null);
  const swipingRef = useRef(swiping);
  const distanceRef = useRef(distance);

  // Keep refs in sync with state
  useEffect(() => {
    swipingRef.current = swiping;
    distanceRef.current = distance;
  }, [swiping, distance]);

  // Handle swipe start
  const handleStart = useCallback((clientX: number) => {
    setSwiping(true);
    startXRef.current = clientX;
    setDistance(0);
  }, []);

  // Handle movement during swipe
  const handleMove = useCallback((clientX: number) => {
    if (!swipingRef.current || startXRef.current === null) {
      return;
    }
    const newDistance = clientX - startXRef.current;
    setDistance(newDistance);
  }, []);

  // Handle swipe end and trigger actions
  const handleEnd = useCallback(() => {
    if (!swipingRef.current) {
      return;
    }

    if (Math.abs(distanceRef.current) >= threshold) {
      if (distanceRef.current > 0) {
        onSwipeRight?.();
      } else {
        onSwipeLeft?.();
      }
    }

    setSwiping(false);
    startXRef.current = null;
    setDistance(0);
  }, [threshold, onSwipeLeft, onSwipeRight]);

  // Set up event listeners
  useEffect(() => {
    const element = ref.current;
    if (!element) {
      return;
    }

    // Touch events
    const handleTouchStart = (e: TouchEvent) => {
      handleStart(e.touches[0]?.clientX ?? 0);
    };

    const handleTouchMove = (e: TouchEvent) => {
      handleMove(e.touches[0]?.clientX ?? 0);
    };

    // Mouse events
    const handleMouseDown = (e: MouseEvent) => {
      handleStart(e.clientX);
    };

    const handleMouseMove = (e: MouseEvent) => {
      handleMove(e.clientX);
    };

    // Attach all event listeners
    element.addEventListener("touchstart", handleTouchStart);
    element.addEventListener("touchmove", handleTouchMove);
    element.addEventListener("touchend", handleEnd);

    element.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleEnd);

    // Clean up
    return () => {
      element.removeEventListener("touchstart", handleTouchStart);
      element.removeEventListener("touchmove", handleTouchMove);
      element.removeEventListener("touchend", handleEnd);

      element.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleEnd);
    };
  }, [handleStart, handleMove, handleEnd]);

  return { ref, distance, swiping };
}
