"use client";

import { buttonVariants } from "@/components/ui/button";
import { useSession } from "@/store/auth";
import { Cloud } from "lucide-react";
import Link from "next/link";
import * as React from "react";

type NavigationLink = {
  title: string;
  href: string;
  highlight?: boolean;
};

const NAVIGATION_LINKS: NavigationLink[] = [
  {
    title: "Home",
    href: "/",
  },
  {
    title: "Features",
    href: "/features",
  },
];

const Navigations = () => {
  const session = useSession();
  return (
    <nav className="ml-auto flex gap-2 items-center">
      {NAVIGATION_LINKS.map((item) => (
        <Link
          key={item.title}
          className={buttonVariants({ variant: "link" })}
          href={item.href}
        >
          {item.title}
        </Link>
      ))}
      {session.isAuthenticated ? (
        <>
          <p>Authenticated</p>
        </>
      ) : (
        <>
          <Link
            className={buttonVariants({ variant: "secondary" })}
            href="/auth/signin"
          >
            Sign In
          </Link>
          <Link
            className={buttonVariants({ variant: "default" })}
            href="/auth/signup"
          >
            Sign Up
          </Link>
        </>
      )}
    </nav>
  );
};

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <div className="flex flex-col min-h-screen">
        <header className="px-4 lg:px-6 h-14 flex items-center">
          <Link className="flex items-center justify-center" href="#">
            <Cloud className="h-6 w-6 text-blue-500" />
            <span className="ml-2 text-2xl font-bold text-gray-900">
              Cilsy Weather
            </span>
          </Link>
          <Navigations />
        </header>
        {children}
        <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            © 2024 Cilsy Weather. All rights reserved.
          </p>
          <nav className="sm:ml-auto flex gap-4 sm:gap-6">
            <Link
              className="text-xs hover:underline underline-offset-4"
              href="#"
            >
              Terms of Service
            </Link>
            <Link
              className="text-xs hover:underline underline-offset-4"
              href="#"
            >
              Privacy
            </Link>
          </nav>
        </footer>
      </div>
    </>
  );
};

export { MainLayout };
