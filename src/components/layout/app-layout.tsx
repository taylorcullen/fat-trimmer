"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { MobileNav, Sidebar } from "./navigation";
import { useTheme } from "@/lib/theme-context";
import { V1Shell } from "./shells/v1-shell";
import { V2Shell } from "./shells/v2-shell";
import { V3Shell } from "./shells/v3-shell";
import Image from "next/image";
import Link from "next/link";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { theme } = useTheme();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500" />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  if (theme === "v1") return <V1Shell>{children}</V1Shell>;
  if (theme === "v2") return <V2Shell>{children}</V2Shell>;
  if (theme === "v3") return <V3Shell>{children}</V3Shell>;

  return (
    <div className="min-h-screen bg-slate-900">
      <Sidebar />

      {/* Mobile Header */}
      <header className="md:hidden fixed top-0 left-0 right-0 bg-slate-900 border-b border-slate-700 z-30 h-14 flex items-center justify-between px-4">
        <h1 className="text-lg font-bold gradient-text">Fat Trimmer</h1>
        <Link href="/settings" className="flex items-center gap-2">
          {session.user?.image && (
            <Image
              src={session.user.image}
              alt={session.user.name || "User"}
              width={32}
              height={32}
              className="rounded-full"
            />
          )}
        </Link>
      </header>

      {/* Main Content */}
      <main className="md:ml-64 pt-14 md:pt-0 pb-20 md:pb-0 min-h-screen">
        <div className="p-4 md:p-6 max-w-6xl mx-auto">{children}</div>
      </main>

      <MobileNav />
    </div>
  );
}
