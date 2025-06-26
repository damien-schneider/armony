"use client";
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
import { signInWithPassword } from "@/app/auth/actions";
import { OrSeparator } from "@/app/auth/components/or-separator";
import { OAuthButton } from "@/app/auth/components/provider-button";

const signInSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

type SignInValues = z.infer<typeof signInSchema>;

export default function SignInPage() {
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const form = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const onSubmit = async (values: SignInValues) => {
    setLoading(true);

    const formData = new FormData();
    formData.append("email", values.email);
    formData.append("password", values.password);

    const result = await signInWithPassword(formData);
    setErrorMessage(result);
    setLoading(false);
  };

  return (
    <>
      <H1 className="my-8 text-center">Login to your Account</H1>
      <div className="flex flex-col gap-6">
        <div className="grid w-full gap-4">
          {/* <OAuthButton provider="notion" /> */}
          <OAuthButton provider="google" />
        </div>
        <OrSeparator />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {errorMessage && (
              <P className="text-center text-red-500 text-sm">{errorMessage}</P>
            )}

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="m@example.com"
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
                      autoComplete="current-password"
                      placeholder="Password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                  <div className="flex justify-end">
                    <Link
                      href="/forgot-password"
                      className="link-primary text-sm"
                    >
                      Forgot password?
                    </Link>
                  </div>
                </FormItem>
              )}
            />

            <Button
              type="submit"
              variant="default"
              className="mt-8 w-full"
              disabled={loading}
            >
              Sign In
            </Button>
          </form>
        </Form>
      </div>

      <P className="mt-2 text-center">
        New to Armony?{" "}
        <Link className="link-primary" href="/signup">
          Sign up
        </Link>
      </P>
    </>
  );
}
