import { createServerClient } from "@workspace/supabase/server";

export const getAuthenticatedUserOrThrowError = async () => {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    console.error("User not found");
    throw new Error("Unautharized");
  }
  return user;
};
