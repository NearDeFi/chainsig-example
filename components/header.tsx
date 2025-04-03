"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { ModeToggle } from "@/components/mode-toggle";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2 font-bold">
          <span>Sig Network Examples</span>
        </Link>
        <div className="flex items-center space-x-4">
          <ModeToggle />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
