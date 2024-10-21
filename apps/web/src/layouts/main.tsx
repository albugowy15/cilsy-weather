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
import { LayoutDashboard, LogOut, Moon, Sun, User } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import * as React from "react";

export function ModeToggle() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
export const Navigations = () => {
  const session = useSession();
  return (
    <nav className="ml-auto flex gap-2 items-center">
      <ModeToggle />
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
