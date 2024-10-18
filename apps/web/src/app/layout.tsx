import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { MainLayout } from "@/layouts/main";
import { ReactQueryProvider } from "@/providers/react-query";
import { Toaster } from "@/components/ui/sonner";

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
    <html lang="en">
      <body className={inter.className}>
        <ReactQueryProvider>
          <MainLayout>{children}</MainLayout>
        </ReactQueryProvider>
        <Toaster />
      </body>
    </html>
  );
}
