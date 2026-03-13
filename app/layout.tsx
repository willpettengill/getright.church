import type { Metadata, Viewport } from "next";
import { Inter, Space_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { SiteNav } from "@/components/nav/site-nav";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
});

export const metadata: Metadata = {
  title: "Get Right Church — Political Accountability",
  description:
    "Track politicians, their records, and hold them accountable. Endorsed. Anti-endorsed. Watching.",
  openGraph: {
    title: "Get Right Church",
    description: "Political accountability for the people.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={cn("dark", inter.variable, spaceMono.variable)}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-background text-foreground">
        <SiteNav />
        <main className="pt-14">{children}</main>
      </body>
    </html>
  );
}
