"use client";

import { Button } from "@/components/ui/button";
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useSignIn } from "@/lib/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

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

const SignInForm = () => {
  const router = useRouter();
  const form = useForm<z.infer<typeof signInFormSchema>>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const authSignIn = useSignIn({
    onError(error) {
      toast.error(error.message);
    },
    onSuccess() {
      toast.success("Sign in successfully");
      router.replace("/dashboard/home");
    },
  });
  const onSubmit = (values: z.infer<typeof signInFormSchema>) => {
    authSignIn.signIn(values);
  };
  return (
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
                  <Input {...field} type="email" placeholder="m@example.com" />
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
                  <Input type="password" placeholder="*******" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
        <CardFooter className="flex flex-col">
          <Button
            disabled={authSignIn.isPending}
            className="w-full"
            type="submit"
          >
            Sign In
          </Button>
          <div className="pt-4">
            Don't have an account,{" "}
            <Link
              href="/auth/signup"
              className="text-blue-400 font-bold hover:underline"
            >
              Sign Up
            </Link>
          </div>
        </CardFooter>
      </form>
    </Form>
  );
};

export { SignInForm };
