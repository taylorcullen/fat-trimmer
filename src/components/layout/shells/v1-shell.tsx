"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useTheme } from "@/lib/theme-context";
import Image from "next/image";
import { navItems, DASHBOARD_ROUTES } from "@/lib/nav-items";

export function V1Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { dashboardPath } = useTheme();

  return (
    <div className="min-h-screen bg-[#0b0e1a]">
      {/* Decorative top edge — brass accent line */}
      <div className="h-[3px] bg-gradient-to-r from-transparent via-[#f0a500] to-transparent" />

      <header className="bg-[#0f1420] border-b-2 border-[#f0a500]/20 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo with art deco diamond */}
            <div className="flex items-center gap-10">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-[#f0a500] rotate-45" />
                <h1 className="text-lg font-bold uppercase tracking-[0.25em] text-[#f0a500] font-mono">
                  Fat Trimmer
                </h1>
                <div className="w-3 h-3 bg-[#f0a500] rotate-45" />
              </div>

              {/* Desktop nav — angular art deco tabs */}
              <nav aria-label="Main navigation" className="hidden md:flex items-center gap-0">
                {navItems.map((item) => {
                  const href = item.isDashboard ? dashboardPath : item.href;
                  const isActive = item.isDashboard
                    ? DASHBOARD_ROUTES.includes(pathname)
                    : pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={href}
                      aria-current={isActive ? "page" : undefined}
                      className={`
                        relative px-5 py-2 text-xs font-bold uppercase tracking-[0.2em] font-mono
                        transition-all duration-200 border-b-2
                        ${
                          isActive
                            ? "text-[#f0a500] border-[#f0a500] bg-[#f0a500]/10"
                            : "text-[#6b7394] border-transparent hover:text-[#c4985a] hover:border-[#c4985a]/40"
                        }
                      `}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* User avatar with brass ring */}
            {session?.user?.image && (
              <div className="relative">
                <div className="absolute -inset-[3px] border-2 border-[#f0a500]/40 rounded-full" />
                <Image
                  src={session.user.image}
                  alt={session.user.name || "User"}
                  width={34}
                  height={34}
                  className="rounded-full"
                />
              </div>
            )}
          </div>
        </div>

        {/* Mobile nav — scrollable brass-accented bar */}
        <nav
          aria-label="Main navigation"
          className="md:hidden flex overflow-x-auto px-4 pb-3 pt-1 gap-1 scrollbar-none"
        >
          {navItems.slice(0, 5).map((item) => {
            const href = item.isDashboard ? dashboardPath : item.href;
            const isActive = item.isDashboard
              ? DASHBOARD_ROUTES.includes(pathname)
              : pathname === item.href;
            return (
              <Link
                key={item.href}
                href={href}
                aria-current={isActive ? "page" : undefined}
                className={`
                  px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em] font-mono
                  whitespace-nowrap transition-all border border-[#f0a500]/20
                  ${
                    isActive
                      ? "bg-[#f0a500] text-[#0b0e1a] border-[#f0a500]"
                      : "text-[#6b7394] hover:text-[#f0a500] hover:border-[#f0a500]/40"
                  }
                `}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </header>

      {/* Main content area with subtle geometric background pattern */}
      <main className="max-w-5xl mx-auto px-4 py-6 md:px-8 md:py-10">
        {children}
      </main>

      {/* Bottom brass accent line */}
      <div className="h-px bg-gradient-to-r from-transparent via-[#f0a500]/20 to-transparent" />
    </div>
  );
}
