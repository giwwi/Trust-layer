import type { Metadata } from "next";
import type { ReactNode } from "react";

import { SiteChrome } from "@/components/site-chrome";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Trust Layer",
    template: "%s | Trust Layer"
  },
  description: "A bounded review overlay for analytical texts in the age of AI overproduction."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
