import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/lib/auth/context";
import { ReferralTracker } from "@/components/referral-tracker";
import { Suspense } from "react";

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
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </head>
      <body className={`${plusJakarta.variable} ${spaceGrotesk.variable} font-body`}>
        <AuthProvider>
          <Suspense fallback={null}>
            <ReferralTracker />
          </Suspense>
          {children}
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
