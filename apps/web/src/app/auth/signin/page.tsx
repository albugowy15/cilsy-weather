"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { SignInForm } from "./_components/signin-form";
import { useSession } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const router = useRouter();
  const session = useSession();
  if (session.isAuthenticated) {
    router.replace("/dashboard/home");
  }
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Card className="w-full max-w-sm">
        <SignInForm />
      </Card>
    </div>
  );
}
