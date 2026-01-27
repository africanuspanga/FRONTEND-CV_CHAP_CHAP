import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const plusJakarta = Plus_Jakarta_Sans({ 
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
});

const spaceGrotesk = Space_Grotesk({ 
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  title: "CV Chap Chap - Create Professional CVs in Minutes",
  description: "Build stunning, professional CVs tailored for the East African job market. Fast, easy, and mobile-friendly.",
  keywords: ["CV", "Tanzania", "East Africa", "Job", "Career", "Professional"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${plusJakarta.variable} ${spaceGrotesk.variable} font-body`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
