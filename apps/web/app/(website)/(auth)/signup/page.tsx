"use client";
import { signUpWithPassword } from "@/app/auth/actions";
import { OrSeparator } from "@/app/auth/components/or-separator";
import { OAuthButton } from "@/app/auth/components/provider-button";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@workspace/ui/components/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { Input, PasswordInput } from "@workspace/ui/components/input";
import { H1, P } from "@workspace/ui/components/typography";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const signUpSchema = z
  .object({
    email: z.string().email({ message: "Please enter a valid email address" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
    passwordConfirmation: z.string().min(8),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords do not match",
    path: ["passwordConfirmation"],
  });

type SignUpValues = z.infer<typeof signUpSchema>;

export default function SignUpPage() {
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const form = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
      passwordConfirmation: "",
    },
  });

  const onSubmit = async (values: SignUpValues) => {
    setLoading(true);

    const formData = new FormData();
    formData.append("email", values.email);
    formData.append("password", values.password);

    const result = await signUpWithPassword(formData);
    setErrorMessage(result);
    setLoading(false);
  };

  return (
    <>
      <div className="my-8 text-center">
        <H1>Create account</H1>
        <p className="text-sm mt-2 text-foreground">
          Sign Up to Armony to experience the tool completely.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        <div className="grid gap-4 w-full">
          {/* <OAuthButton provider="notion">Sign Up with</OAuthButton> */}
          <OAuthButton provider="google">Sign Up with</OAuthButton>
        </div>

        <OrSeparator />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {errorMessage && (
              <P className="text-red-500 text-sm text-center">{errorMessage}</P>
            )}

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="mail@example.com"
                      autoComplete="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <PasswordInput
                      autoComplete="new-password"
                      placeholder="Password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="passwordConfirmation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <PasswordInput
                      autoComplete="new-password"
                      placeholder="Confirm password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full mt-8"
              variant="default"
              disabled={loading}
            >
              Sign Up
            </Button>
          </form>
        </Form>
      </div>

      <P variant="caption" className="text-balance text-center w-full mt-4">
        By joining, you agree to our{" "}
        <Link href="/terms-of-use" className="link-secondary">
          Terms of use
        </Link>{" "}
        and{" "}
        <Link href="/privacy-policy" className="link-secondary">
          Privacy Policy
        </Link>
        .
      </P>
      <P className="text-center mt-2">
        Already have an account?{" "}
        <Link href="/signin" className="link-primary">
          Log in
        </Link>
      </P>
    </>
  );
}
