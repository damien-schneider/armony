"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from "@workspace/supabase/client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@workspace/ui/components/alert-dialog";
import { Button } from "@workspace/ui/components/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { H1, H2, P } from "@workspace/ui/components/typography";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useCustomerPortal } from "@/hooks/queries/client/use-customer-portal.query";
import { useAuthUser } from "@/hooks/queries/use-session";

const UpdateProfileSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
});

interface ProfileData {
  full_name: string | null;
}

export default function AccountPage() {
  const router = useRouter();
  const supabase = createClient();
  const { user, isLoading } = useAuthUser();
  const [isUpdating, setIsUpdating] = useState(false);
  const { data: customerPortalUrl } = useCustomerPortal();
  const form = useForm<z.infer<typeof UpdateProfileSchema>>({
    resolver: zodResolver(UpdateProfileSchema),
    defaultValues: {
      fullName: "",
    },
  });

  // Fetch current profile data
  useEffect(() => {
    if (user?.id) {
      const fetchProfile = async () => {
        const { data, error } = await supabase
          .from("users")
          .select("full_name")
          .eq("id", user.id)
          .single();

        if (error) {
          toast.error("Failed to load profile data");
          return;
        }

        if (data) {
          form.reset({
            fullName: (data as ProfileData).full_name ?? "",
          });
        }
      };

      fetchProfile();
    }
  }, [user, form, supabase]);

  // Update profile function
  async function onUpdateProfile(data: z.infer<typeof UpdateProfileSchema>) {
    if (!user?.id) {
      return;
    }

    setIsUpdating(true);
    // Using type assertion to fix TypeScript error with incomplete Database type
    const { error } = await supabase
      .from("users")
      .update({ full_name: data.fullName })
      .eq("id", user.id);

    if (error) {
      toast.error("Failed to update profile");
    } else {
      toast.success("Profile updated successfully");
    }

    setIsUpdating(false);
  }

  // Delete account function
  async function handleDeleteAccount() {
    try {
      const { error } = await supabase.auth.admin.deleteUser(
        user?.id as string,
      );

      if (error) {
        throw error;
      }

      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) {
        throw signOutError;
      }

      toast.success("Account deleted successfully");
      router.push("/signin");
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      toast.error(`Failed to delete account: ${errorMessage}`);
    }
  }

  // Logout function
  async function handleLogout() {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        throw error;
      }

      toast.success("Logged out successfully");
      router.push("/signin");
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      toast.error(`Failed to logout: ${errorMessage}`);
    }
  }

  if (isLoading) {
    return <P>Loading...</P>;
  }

  if (!user) {
    return <P>Please sign in to access this page.</P>;
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <H1 className="mb-8">Account Settings</H1>

      <div className="space-y-10">
        {/* Profile Section */}
        <section>
          <H2 className="mb-6">Profile Information</H2>
          <Form {...form}>
            <form
              className="space-y-4"
              onSubmit={form.handleSubmit(onUpdateProfile)}
            >
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter your full name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button disabled={isUpdating} type="submit">
                {isUpdating ? "Updating..." : "Save Changes"}
              </Button>
            </form>
          </Form>
        </section>

        {/* Email Section - Read only */}
        <section>
          <H2 className="mb-6">Email Address</H2>
          <div>
            <Label>
              Email
              <Input disabled={true} value={user.email ?? ""} />
              <P className="mt-1">
                This is the email address associated with your account.
              </P>
            </Label>
          </div>
        </section>
        <section>
          {/* TODO: Fix this billing portal link before going to production */}
          <H2 className="mb-6">Manage Billing</H2>
          {customerPortalUrl && (
            <Button asChild={true} variant="outline">
              <Link href={customerPortalUrl} target="_blank">
                Manage Billing
              </Link>
            </Button>
          )}
        </section>

        {/* Security Section */}
        <section>
          <H2 className="mb-6">Security</H2>
          <div className="flex flex-col gap-4">
            <div>
              <Button
                onClick={() => router.push("/account/update-password")}
                variant="outline"
              >
                Change Password
              </Button>
            </div>
          </div>
        </section>

        {/* Account Actions Section */}
        <section>
          <H2 className="mb-6">Account Actions</H2>
          <div className="flex flex-col gap-4 sm:flex-row">
            {/* Logout Alert Dialog */}
            <AlertDialog>
              <AlertDialogTrigger asChild={true}>
                <Button variant="outline">Log Out</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Are you sure you want to log out?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    You will need to sign in again to access your account.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleLogout}>
                    Log Out
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            {/* Delete Account Alert Dialog */}
            <AlertDialog>
              <AlertDialogTrigger asChild={true}>
                <Button variant="destructive">Delete Account</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your account and remove all your data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    onClick={handleDeleteAccount}
                  >
                    Delete Account
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </section>
      </div>
    </div>
  );
}
