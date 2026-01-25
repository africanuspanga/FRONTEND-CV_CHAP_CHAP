import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CV Chap Chap - Create Professional CVs in Minutes",
  description: "Build stunning, professional CVs tailored for the East African job market. Fast, easy, and mobile-friendly.",
  keywords: ["CV", "Resume", "Tanzania", "East Africa", "Job", "Career", "Professional"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
