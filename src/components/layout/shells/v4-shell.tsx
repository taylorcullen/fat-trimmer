"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useTheme } from "@/lib/theme-context";
import Image from "next/image";
import { getNavItemsWithIcons, DASHBOARD_ROUTES } from "@/lib/nav-items";

const navItems = getNavItemsWithIcons();

export function V4Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { dashboardPath } = useTheme();

  return (
    <div className="min-h-screen bg-[#1a1a2e] relative">
      {/* CRT Scanline overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-30"
        style={{
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px)",
        }}
      />

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-[#16213e]/90 border-r-2 border-[#533483] h-screen fixed left-0 top-0 z-40 shadow-[4px_0_24px_rgba(83,52,131,0.3)]">
        {/* Logo area with neon glow */}
        <div className="p-5 border-b-2 border-[#533483]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#e94560] to-[#533483] flex items-center justify-center shadow-[0_0_20px_rgba(233,69,96,0.5)]">
              <span className="text-white font-black text-lg tracking-tighter">FT</span>
            </div>
            <div>
              <h1 className="text-[#e94560] font-black text-sm uppercase tracking-[0.2em] drop-shadow-[0_0_8px_rgba(233,69,96,0.6)]">
                Fat Trimmer
              </h1>
              <p className="text-[#533483] text-[10px] uppercase tracking-[0.3em] font-bold">
                Synthwave
              </p>
            </div>
          </div>
        </div>

        {/* Nav items with neon borders */}
        <nav aria-label="Main navigation" className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
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
                  flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-200 font-bold text-sm uppercase tracking-wider
                  ${
                    isActive
                      ? "bg-[#e94560]/15 text-[#e94560] border border-[#e94560]/60 shadow-[0_0_12px_rgba(233,69,96,0.2),inset_0_0_12px_rgba(233,69,96,0.05)]"
                      : "text-[#e8e8e8]/50 border border-transparent hover:text-[#e94560] hover:border-[#533483]/60 hover:bg-[#533483]/10"
                  }
                `}
              >
                <span className={`flex-shrink-0 ${isActive ? "drop-shadow-[0_0_6px_rgba(233,69,96,0.8)]" : ""}`}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User section */}
        {session?.user?.image && (
          <div className="p-4 border-t-2 border-[#533483]">
            <div className="flex items-center gap-3 px-2">
              <div className="relative">
                <div className="absolute -inset-[2px] rounded-full border border-[#e94560]/50 shadow-[0_0_8px_rgba(233,69,96,0.3)]" />
                <Image
                  src={session.user.image}
                  alt={session.user.name || "User"}
                  width={34}
                  height={34}
                  className="rounded-full"
                />
              </div>
              <span className="text-sm text-[#e8e8e8]/60 font-medium truncate">
                {session.user.name}
              </span>
            </div>
          </div>
        )}
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden fixed top-0 left-0 right-0 bg-[#16213e]/95 backdrop-blur-sm border-b-2 border-[#533483] z-30 h-14 flex items-center justify-between px-4 shadow-[0_4px_20px_rgba(83,52,131,0.3)]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-md bg-gradient-to-br from-[#e94560] to-[#533483] flex items-center justify-center shadow-[0_0_12px_rgba(233,69,96,0.4)]">
            <span className="text-white font-black text-xs">FT</span>
          </div>
          <span className="text-[#e94560] font-black text-xs uppercase tracking-[0.15em] drop-shadow-[0_0_6px_rgba(233,69,96,0.5)]">
            Fat Trimmer
          </span>
        </div>
        {session?.user?.image && (
          <Image src={session.user.image} alt="" width={30} height={30} className="rounded-full border border-[#533483]" />
        )}
      </header>

      {/* Mobile Bottom Nav */}
      <nav aria-label="Main navigation" className="md:hidden fixed bottom-0 left-0 right-0 bg-[#16213e]/95 backdrop-blur-sm border-t-2 border-[#533483] z-30 shadow-[0_-4px_20px_rgba(83,52,131,0.3)]">
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
                className={`flex flex-col items-center justify-center w-full h-full transition-colors ${
                  isActive
                    ? "text-[#e94560] drop-shadow-[0_0_8px_rgba(233,69,96,0.6)]"
                    : "text-[#e8e8e8]/30"
                }`}
              >
                {item.icon}
                <span className="text-[9px] mt-1 font-bold uppercase tracking-wider truncate">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Main Content */}
      <main className="md:ml-64 pt-14 md:pt-0 pb-20 md:pb-0 min-h-screen">
        <div className="p-4 md:p-8 max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
