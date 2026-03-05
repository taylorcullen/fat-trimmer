"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useTheme } from "@/lib/theme-context";
import Image from "next/image";
import { getNavItemsWithIcons } from "@/lib/nav-items";

const navItems = getNavItemsWithIcons();

export function V2Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { dashboardPath } = useTheme();

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Glassmorphic Sidebar */}
      <aside className="hidden md:flex flex-col w-20 hover:w-64 group/sidebar transition-all duration-300 bg-white/5 backdrop-blur-xl border-r border-white/10 h-screen fixed left-0 top-0 z-40 overflow-hidden">
        <div className="p-4 flex items-center gap-3 h-16">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-lg">F</span>
          </div>
          <span className="text-white font-semibold opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-300 whitespace-nowrap">Fat Trimmer</span>
        </div>

        <nav aria-label="Main navigation" className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const href = item.isDashboard ? dashboardPath : item.href;
            const isActive = item.isDashboard
              ? ["/dashboard", "/v1", "/v2", "/v3"].includes(pathname)
              : pathname === item.href;
            return (
              <Link
                key={item.href}
                href={href}
                aria-current={isActive ? "page" : undefined}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-teal-500/20 to-emerald-500/20 text-teal-400 shadow-lg shadow-teal-500/10"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                <span className="text-sm font-medium opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {session?.user?.image && (
          <div className="p-3 border-t border-white/10">
            <div className="flex items-center gap-3 px-3 py-2">
              <Image
                src={session.user.image}
                alt={session.user.name || "User"}
                width={32}
                height={32}
                className="rounded-full flex-shrink-0"
              />
              <span className="text-sm text-slate-300 opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-300 whitespace-nowrap truncate">
                {session.user.name}
              </span>
            </div>
          </div>
        )}
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden fixed top-0 left-0 right-0 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/10 z-30 h-14 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center">
            <span className="text-white font-bold text-sm">F</span>
          </div>
          <span className="text-white font-semibold">Fat Trimmer</span>
        </div>
        {session?.user?.image && (
          <Image src={session.user.image} alt="" width={32} height={32} className="rounded-full" />
        )}
      </header>

      {/* Mobile Bottom Nav */}
      <nav aria-label="Main navigation" className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0a0a0f]/80 backdrop-blur-xl border-t border-white/10 z-30">
        <div className="flex justify-around items-center h-16">
          {navItems.slice(0, 5).map((item) => {
            const href = item.isDashboard ? dashboardPath : item.href;
            const isActive = item.isDashboard
              ? ["/dashboard", "/v1", "/v2", "/v3"].includes(pathname)
              : pathname === item.href;
            return (
              <Link
                key={item.href}
                href={href}
                aria-current={isActive ? "page" : undefined}
                className={`flex flex-col items-center justify-center w-full h-full transition-colors ${
                  isActive ? "text-teal-400" : "text-slate-500"
                }`}
              >
                {item.icon}
                <span className="text-[10px] mt-1 truncate">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Main Content */}
      <main className="md:ml-20 pt-14 md:pt-0 pb-20 md:pb-0 min-h-screen">
        <div className="p-4 md:p-8 max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
