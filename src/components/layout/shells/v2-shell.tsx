"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useTheme } from "@/lib/theme-context";
import Image from "next/image";
import { getNavItemsWithIcons, DASHBOARD_ROUTES } from "@/lib/nav-items";

const navItems = getNavItemsWithIcons();

export function V2Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { dashboardPath } = useTheme();

  return (
    <div className="min-h-screen bg-[#0a0a0f] relative overflow-hidden">
      {/* Aurora background washes */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[50%] bg-teal-500/[0.07] rounded-full blur-[120px] animate-pulse" style={{ animationDuration: "8s" }} />
        <div className="absolute top-[30%] right-[-15%] w-[50%] h-[40%] bg-cyan-400/[0.05] rounded-full blur-[100px] animate-pulse" style={{ animationDuration: "12s", animationDelay: "2s" }} />
        <div className="absolute bottom-[-10%] left-[20%] w-[40%] h-[35%] bg-emerald-500/[0.06] rounded-full blur-[100px] animate-pulse" style={{ animationDuration: "10s", animationDelay: "4s" }} />
      </div>

      {/* Glassmorphic Sidebar */}
      <aside className="hidden md:flex flex-col w-20 hover:w-64 group/sidebar transition-all duration-500 ease-out bg-white/[0.03] backdrop-blur-2xl border-r border-white/[0.06] h-screen fixed left-0 top-0 z-40 overflow-hidden">
        {/* Inner glow edge */}
        <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-teal-400/20 via-cyan-400/10 to-emerald-400/20" />

        <div className="p-4 flex items-center gap-3 h-16 relative">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 via-cyan-400 to-emerald-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-teal-500/25">
            <span className="text-white font-bold text-lg drop-shadow-sm">F</span>
          </div>
          <span className="text-white/90 font-semibold opacity-0 group-hover/sidebar:opacity-100 transition-all duration-500 whitespace-nowrap tracking-tight">Fat Trimmer</span>
        </div>

        <nav aria-label="Main navigation" className="flex-1 px-3 py-4 space-y-1">
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
                className={`group/link flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 relative ${
                  isActive
                    ? "bg-gradient-to-r from-teal-500/15 to-cyan-500/15 text-teal-300 shadow-[inset_0_0_20px_rgba(20,184,166,0.08)]"
                    : "text-white/30 hover:text-white/80 hover:bg-white/[0.04]"
                }`}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-gradient-to-b from-teal-400 to-cyan-400 rounded-full" />
                )}
                <span className="flex-shrink-0 transition-transform duration-300 group-hover/link:scale-110">{item.icon}</span>
                <span className="text-sm font-medium opacity-0 group-hover/sidebar:opacity-100 transition-all duration-500 whitespace-nowrap">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {session?.user?.image && (
          <div className="p-3 border-t border-white/[0.06]">
            <div className="flex items-center gap-3 px-3 py-2">
              <Image
                src={session.user.image}
                alt={session.user.name || "User"}
                width={32}
                height={32}
                className="rounded-full flex-shrink-0 ring-2 ring-white/10"
              />
              <span className="text-sm text-white/40 opacity-0 group-hover/sidebar:opacity-100 transition-all duration-500 whitespace-nowrap truncate">
                {session.user.name}
              </span>
            </div>
          </div>
        )}
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden fixed top-0 left-0 right-0 bg-[#0a0a0f]/70 backdrop-blur-2xl border-b border-white/[0.06] z-30 h-14 flex items-center justify-between px-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-400 via-cyan-400 to-emerald-500 flex items-center justify-center shadow-md shadow-teal-500/20">
            <span className="text-white font-bold text-sm">F</span>
          </div>
          <span className="text-white/90 font-semibold tracking-tight">Fat Trimmer</span>
        </div>
        {session?.user?.image && (
          <Image src={session.user.image} alt="" width={32} height={32} className="rounded-full ring-2 ring-white/10" />
        )}
      </header>

      {/* Mobile Bottom Nav */}
      <nav aria-label="Main navigation" className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0a0a0f]/70 backdrop-blur-2xl border-t border-white/[0.06] z-30">
        <div className="flex justify-around items-center h-16">
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
                className={`flex flex-col items-center justify-center w-full h-full transition-all duration-300 relative ${
                  isActive ? "text-teal-300" : "text-white/25"
                }`}
              >
                {isActive && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full" />
                )}
                {item.icon}
                <span className="text-[10px] mt-1 truncate font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Main Content */}
      <main className="md:ml-20 pt-14 md:pt-0 pb-20 md:pb-0 min-h-screen relative z-10">
        <div className="p-4 md:p-8 max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
