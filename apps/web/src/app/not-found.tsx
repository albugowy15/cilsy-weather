import * as React from "react";
import Link from "next/link";
import { Home } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export default function Custom404() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <p className="text-2xl font-medium text-gray-600 mb-8">
          Oops! Page not found
        </p>
        <p className="text-lg text-gray-500 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <Link
          href="/"
          className={buttonVariants({ variant: "destructive", size: "lg" })}
        >
          <Home className="w-5 h-5 mr-2" />
          Go back home
        </Link>
      </div>
    </div>
  );
}
