"use client";

import { SessionProvider } from "next-auth/react";
import { UnitProvider } from "@/lib/unit-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <UnitProvider>{children}</UnitProvider>
    </SessionProvider>
  );
}
