"use server";
import { createServerClient } from "@workspace/supabase/server";
import type { Provider } from "@workspace/supabase/types";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { envClient } from "@/env/client";

const signInWithPassword = async (formData: FormData) => {
  const supabase = await createServerClient();
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };
  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    console.error(error);
    return error.message;
  }

  return redirect("/");
};

const signInWithOAuth = async (provider: Provider) => {
  const baseUrl = envClient.NEXT_PUBLIC_BASE_URL;
  const redirectTo = `${baseUrl}/auth/callback`;
  const supabase = await createServerClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo,
    },
  });

  if (error) {
    console.error(error);
    redirect("/signup");
  }

  if (data?.url) {
    return redirect(data.url);
  }

  return redirect("/chat");
};

const signOut = async () => {
  const supabase = await createServerClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    redirect("/error");
  }

  return redirect("/signin");
};

const signUpWithPassword = async (formData: FormData) => {
  const supabase = await createServerClient();
  const dataToSignUp = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };
  const { error } = await supabase.auth.signUp(dataToSignUp);
  if (error) {
    console.error("Error signing up:", error);
    redirect("/error");
  }

  revalidatePath("/", "layout");
  return redirect("/signin");
};

export { signInWithPassword, signInWithOAuth, signUpWithPassword, signOut };
