import * as React from "react";
import { Card } from "@/components/ui/card";
import { SignInForm } from "./_components/signin-form";

export default function SignInPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Card className="w-full max-w-sm">
        <SignInForm />
      </Card>
    </div>
  );
}
