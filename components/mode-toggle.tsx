"use client";

import * as React from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

export function ModeToggle() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const currentMode = searchParams.get("mode") || "near";
  const isNearMode = currentMode === "near";

  const toggleMode = () => {
    const params = new URLSearchParams(searchParams);
    params.set("mode", isNearMode ? "evm" : "near");
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleMode}
      className="rounded-full px-4"
    >
      Switch to {isNearMode ? "EVM" : "NEAR"} Mode
    </Button>
  );
}
