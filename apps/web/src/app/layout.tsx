import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Navigations } from "@/layouts/main";
import { ReactQueryProvider } from "@/providers/react-query";
import { Toaster } from "@/components/ui/sonner";
import Link from "next/link";
import { Cloud } from "lucide-react";
import { ThemeProvider } from "@/providers/theme";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Cilsy Weather",
  description: "Cilsy weather app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang="en" className={inter.className}>
      <head />
      <body className="relative flex min-h-screen flex-col bg-background font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ReactQueryProvider>
            <Toaster closeButton richColors expand={false} />
            <header className="px-4 lg:px-6 h-14 flex items-center">
              <Link className="flex items-center justify-center" href="/">
                <Cloud className="h-6 w-6 text-blue-500" />
                <span className="ml-2 text-2xl font-bold">Cilsy Weather</span>
              </Link>
              <Navigations />
            </header>
            <div className="px-5 py-5 mb-10">{children}</div>
            <footer className="absolute bottom-0 flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
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
          </ReactQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
