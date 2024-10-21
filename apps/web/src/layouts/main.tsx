"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSession } from "@/lib/auth";
import { Cloud, LayoutDashboard, LogOut, User } from "lucide-react";
import Link from "next/link";
import * as React from "react";

export const Navigations = () => {
  const session = useSession();
  return (
    <nav className="ml-auto flex gap-2 items-center">
      {session.isAuthenticated ? (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <User className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/home">
                    <LayoutDashboard className="w-4 h-4 mr-2" />
                    <span>Dashboard</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => session.signOut()}>
                  <LogOut className="w-4 h-4 mr-2" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
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
  return <></>;
};

export { MainLayout };
