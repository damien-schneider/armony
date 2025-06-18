"use client";
import {
  useSpaceById,
  useSpaceListByIdUser,
} from "@/hooks/queries/client/use-spaces.query";
import { useSession } from "@/hooks/queries/use-session";
import { localStorageKeys } from "@/lib/local-storage-keys";
import type { Tables } from "@workspace/supabase/types/database";
import { type ReactNode, createContext, use, useEffect } from "react";
import { useLocalStorage } from "usehooks-ts";

type SpaceContextType = {
  activeIdSpace: string | null;
  changeSpaceById: (id: Tables<"spaces">["id"]) => void;
  activeSpace: Tables<"spaces"> | null;
  isLoadingActiveSpace: boolean;
  spaceContent: string | null;
  resetSpace: () => void;
};

const SpaceContext = createContext<SpaceContextType | null>(null);

const SpaceContextProvider = ({ children }: { children: ReactNode }) => {
  const [activeIdSpace, setActiveIdSpace] = useLocalStorage<
    Tables<"spaces">["id"] | null
  >(localStorageKeys.activeSpaceId, null);

  const { idUser } = useSession();
  const { data: spaceList } = useSpaceListByIdUser(idUser);
  const { data: activeSpace, isLoading: isLoadingActiveSpace } = useSpaceById(
    activeIdSpace ?? "",
  );

  const spaceContent = activeSpace?.content || null;

  const changeSpaceById = (id: Tables<"spaces">["id"]) => {
    setActiveIdSpace(id);
  };

  const resetSpace = () => {
    setActiveIdSpace(null);
  };

  // Set the first space as active if there's no active space and space list is available
  useEffect(() => {
    if (!spaceList || isLoadingActiveSpace) {
      return;
    }
    const firstSpace = spaceList[0];
    if (!activeIdSpace && firstSpace) {
      changeSpaceById(firstSpace.id);
    }
    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  }, [activeIdSpace, spaceList, changeSpaceById, isLoadingActiveSpace]);

  return (
    <SpaceContext
      value={{
        activeIdSpace,
        changeSpaceById,
        resetSpace,
        activeSpace: activeSpace || null,
        isLoadingActiveSpace,
        spaceContent,
      }}
    >
      {children}
    </SpaceContext>
  );
};

export { SpaceContextProvider };

export const useSpaceContext = () => {
  const context = use(SpaceContext);
  if (!context) {
    throw new Error("SpaceSwitcher must be used within a SpaceProvider");
  }
  return context;
};
