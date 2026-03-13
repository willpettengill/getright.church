"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const NAV_LINKS = [
  { href: "/", label: "Pulse" },
  { href: "/politicians", label: "Politicians" },
  { href: "/endorsements", label: "Endorsements" },
  { href: "/geography", label: "Geography" },
  { href: "/blunch", label: "Blunch" },
];

export function SiteNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 group"
          onClick={() => setOpen(false)}
        >
          <span className="font-mono text-xs text-muted-foreground group-hover:text-primary transition-colors">
            ✦
          </span>
          <span className="font-sans font-semibold text-foreground tracking-tight">
            Get Right
          </span>
          <span className="font-mono text-xs text-primary">.church</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "px-3 py-1.5 font-mono text-xs uppercase tracking-widest transition-colors rounded",
                pathname === link.href
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              )}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/admin"
            className={cn(
              "ml-3 px-3 py-1.5 font-mono text-xs uppercase tracking-widest transition-colors rounded border",
              pathname.startsWith("/admin")
                ? "border-primary text-primary"
                : "border-border text-muted-foreground hover:border-primary hover:text-primary"
            )}
          >
            Admin
          </Link>
        </nav>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-muted-foreground hover:text-foreground"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden absolute top-14 left-0 right-0 bg-background border-b border-border py-3 px-4 flex flex-col gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={cn(
                "px-3 py-2 font-mono text-xs uppercase tracking-widest rounded transition-colors",
                pathname === link.href
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              )}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/admin"
            onClick={() => setOpen(false)}
            className="mt-1 px-3 py-2 font-mono text-xs uppercase tracking-widest border border-border rounded text-muted-foreground hover:border-primary hover:text-primary transition-colors"
          >
            Admin
          </Link>
        </div>
      )}
    </header>
  );
}
