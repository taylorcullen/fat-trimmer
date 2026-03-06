"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useTheme } from "@/lib/theme-context";
import Image from "next/image";
import { navItems, DASHBOARD_ROUTES } from "@/lib/nav-items";

export function V6Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { dashboardPath } = useTheme();

  return (
    <div className="min-h-screen bg-[#f5f5f0]">
      {/* Thick black top bar */}
      <div className="h-2 bg-black" />

      <header className="bg-[#ffdb58] border-b-4 border-black sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo -- blocky brutalist type */}
            <div className="flex items-center gap-10">
              <h1 className="text-xl font-black uppercase tracking-wider text-black">
                FAT TRIMMER
              </h1>

              {/* Desktop nav -- thick bordered tabs */}
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
                        px-5 py-2 text-xs font-black uppercase tracking-widest
                        border-2 border-black -ml-[2px] first:ml-0
                        transition-colors duration-100
                        ${
                          isActive
                            ? "bg-black text-[#ffdb58]"
                            : "bg-[#ffdb58] text-black hover:bg-black hover:text-[#ffdb58]"
                        }
                      `}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* User avatar with thick black border */}
            {session?.user?.image && (
              <div className="border-2 border-black shadow-[3px_3px_0_0_black]">
                <Image
                  src={session.user.image}
                  alt={session.user.name || "User"}
                  width={36}
                  height={36}
                  className="block"
                />
              </div>
            )}
          </div>
        </div>

        {/* Mobile nav -- scrollable chunky bar */}
        <nav
          aria-label="Main navigation"
          className="md:hidden flex overflow-x-auto px-4 pb-3 pt-1 gap-2 scrollbar-none"
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
                  px-4 py-1.5 text-[10px] font-black uppercase tracking-widest
                  whitespace-nowrap border-2 border-black
                  transition-colors duration-100
                  ${
                    isActive
                      ? "bg-black text-[#ffdb58]"
                      : "bg-[#ffdb58] text-black hover:bg-black hover:text-[#ffdb58]"
                  }
                `}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </header>

      {/* Main content -- off-white canvas */}
      <main className="max-w-5xl mx-auto px-4 py-8 md:px-8 md:py-12">
        {children}
      </main>

      {/* Bottom black bar */}
      <div className="h-2 bg-black" />
    </div>
  );
}
