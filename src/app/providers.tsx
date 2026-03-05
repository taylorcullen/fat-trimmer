"use client";

import { SessionProvider } from "next-auth/react";
import { UnitProvider } from "@/lib/unit-context";
import { ThemeProvider } from "@/lib/theme-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <UnitProvider>
        <ThemeProvider>{children}</ThemeProvider>
      </UnitProvider>
    </SessionProvider>
  );
}
