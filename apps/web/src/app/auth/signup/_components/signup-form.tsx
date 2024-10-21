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
import { useToastMutation } from "@/lib/query";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

const signUpFormSchema = z
  .object({
    fullname: z
      .string({
        required_error: "fullname is required",
        invalid_type_error: "fullname must be string",
      })
      .min(10, { message: "fullname minimum character length is 10" })
      .max(255, { message: "fullname maximum character length is 255" }),
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
    confirm_password: z
      .string({
        required_error: "confirm password is required",
        invalid_type_error: "confirm password must be string",
      })
      .min(6, { message: "confirm password minimum character length is 6" })
      .max(32, { message: "confirm password maximum character length is 32" }),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords don't match",
    path: ["confirm_password"],
  });

type SignUpFormSchema = z.infer<typeof signUpFormSchema>;
type SignUpRequest = Omit<SignUpFormSchema, "confirm_password">;
const SignUpForm = () => {
  const router = useRouter();
  const form = useForm<z.infer<typeof signUpFormSchema>>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const registerMutation = useToastMutation<SignUpRequest>("/auth/signup", {
    success: "Register success",
    onSuccess() {
      router.replace("/auth/signin");
    },
  });

  const onSubmit = (values: z.infer<typeof signUpFormSchema>) => {
    registerMutation.mutate(values);
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardHeader>
          <CardTitle className="text-2xl">Sign Up</CardTitle>
          <CardDescription>
            Complete all below data to create your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <FormField
            control={form.control}
            name="fullname"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="fullname">Fullname</FormLabel>
                <FormControl>
                  <Input {...field} type="text" placeholder="John Doe" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
                  <Input type="password" placeholder="********" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirm_password"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="confirm_password">
                  Confirm Password
                </FormLabel>
                <FormControl>
                  <Input type="password" placeholder="********" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
        <CardFooter className="flex flex-col">
          <Button
            disabled={registerMutation.isPending}
            className="w-full"
            type="submit"
          >
            Sign Up
          </Button>
          <div className="pt-4">
            Already have an account,{" "}
            <Link
              href="/auth/signin"
              className="text-blue-400 font-bold hover:underline"
            >
              Sign In
            </Link>
          </div>
        </CardFooter>
      </form>
    </Form>
  );
};

export { SignUpForm };
