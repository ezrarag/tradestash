import type { Metadata } from "next";
import { Bricolage_Grotesque, Space_Grotesk } from "next/font/google";
import type { ReactNode } from "react";

import "./globals.css";
import { AppProviders } from "@/components/auth/app-providers";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "TradeStash",
  description:
    "Gamified peer-to-peer campus trading for students who would rather swap than buy.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${bricolage.variable} ${spaceGrotesk.variable}`}>
        <AppProviders>
          <div className="relative min-h-screen overflow-hidden">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(123,255,72,0.12),transparent_30%),radial-gradient(circle_at_top_right,rgba(255,106,0,0.14),transparent_28%),linear-gradient(180deg,#06080c_0%,#0a0f15_35%,#06080c_100%)]" />
            <div className="relative flex min-h-screen flex-col">
              <SiteHeader />
              <main className="flex-1">{children}</main>
              <SiteFooter />
            </div>
          </div>
        </AppProviders>
      </body>
    </html>
  );
}
