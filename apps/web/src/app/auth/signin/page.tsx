"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { publicFetch } from "@/lib/api";
import { useAuthStore } from "@/store/auth";

const signInFormSchema = z.object({
  email: z
    .string({
      required_error: "email is required",
      invalid_type_error: "email must be string",
    })
    .email({ message: "email is not valid" })
    .min(4, { message: "email minimum character length is 4" })
    .max(255, { message: "email maximum character length is 255" }),
  password: z
    .string({
      required_error: "password is required",
      invalid_type_error: "password must be string",
    })
    .min(6, { message: "password minimum character length is 6" })
    .max(32, { message: "password maximum character length is 32" }),
});

export default function SignInPage() {
  const form = useForm<z.infer<typeof signInFormSchema>>({
    resolver: zodResolver(signInFormSchema),
  });
  const updateAccessToken = useAuthStore((state) => state.updateAccessToken);
  const updateRefreshToken = useAuthStore((state) => state.updateRefreshToken);
  const mutation = useMutation({
    mutationFn: async (values: z.infer<typeof signInFormSchema>) => {
      return await publicFetch<{ access_token: string; refresh_token: string }>(
        "/auth/signin",
        {
          method: "POST",
          body: values,
        },
      );
    },
    onSuccess(data) {
      console.log("data", data);
      updateAccessToken(data.data?.access_token || "");
      updateRefreshToken(data.data?.refresh_token || "");
      toast.success("Sign in successfully");
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });
  const onSubmit = (values: z.infer<typeof signInFormSchema>) => {
    console.log("form submitted");
    mutation.mutate(values);
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Card className="w-full max-w-sm">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader>
              <CardTitle className="text-2xl">Sign In</CardTitle>
              <CardDescription>
                Enter your email below to login to your account.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="email">Email</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="m@example.com" />
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
                    <FormLabel htmlFor="password">Password</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button className="w-full" type="submit">
                Sign in
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
