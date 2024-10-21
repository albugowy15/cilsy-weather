"use client";

import { Card } from "@/components/ui/card";
import { SignUpForm } from "./_components/signup-form";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth";

export default function SignUpPage() {
  const router = useRouter();
  const session = useSession();
  if (session.isAuthenticated) {
    router.replace("/dashboard/home");
  }
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Card className="w-full max-w-sm">
        <SignUpForm />
      </Card>
    </div>
  );
}
