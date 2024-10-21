import { Card } from "@/components/ui/card";
import { SignUpForm } from "./_components/signup-form";

export default function SignUpPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Card className="w-full max-w-sm">
        <SignUpForm />
      </Card>
    </div>
  );
}
