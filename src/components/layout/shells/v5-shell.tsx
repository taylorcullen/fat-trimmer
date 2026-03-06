"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useTheme } from "@/lib/theme-context";
import Image from "next/image";
import { getNavItemsWithIcons, DASHBOARD_ROUTES } from "@/lib/nav-items";

const navItems = getNavItemsWithIcons();

export function V5Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { dashboardPath } = useTheme();

  return (
    <div className="min-h-screen bg-[#23211b]">
      {/* Warm Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-[#2d2a24] border-r border-[#3a3630] h-screen fixed left-0 top-0 z-40">
        {/* Logo area with organic feel */}
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#a8c686] to-[#8aad64] flex items-center justify-center shadow-md shadow-[#a8c686]/20">
            <svg className="w-5 h-5 text-[#2d2a24]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <span className="text-[#e8dcc8] font-semibold tracking-wide text-lg">Fat Trimmer</span>
            <p className="text-[#7a7264] text-xs tracking-widest uppercase">Wellness</p>
          </div>
        </div>

        <div className="mx-5 border-t border-[#3a3630]/60" />

        <nav aria-label="Main navigation" className="flex-1 px-4 py-5 space-y-1">
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
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 ${
                  isActive
                    ? "bg-[#a8c686]/15 text-[#a8c686] shadow-sm shadow-[#a8c686]/5"
                    : "text-[#9b9285] hover:text-[#e8dcc8] hover:bg-[#3a3630]/50"
                }`}
              >
                <span className="flex-shrink-0 opacity-80">{item.icon}</span>
                <span className="text-sm font-medium tracking-wide">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {session?.user?.image && (
          <div className="p-4 border-t border-[#3a3630]/60">
            <div className="flex items-center gap-3 px-3 py-2">
              <Image
                src={session.user.image}
                alt={session.user.name || "User"}
                width={36}
                height={36}
                className="rounded-2xl flex-shrink-0"
              />
              <div className="min-w-0">
                <p className="text-sm text-[#e8dcc8] truncate">{session.user.name}</p>
                <p className="text-xs text-[#7a7264] tracking-wide">Profile</p>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden fixed top-0 left-0 right-0 bg-[#2d2a24]/95 backdrop-blur-sm border-b border-[#3a3630] z-30 h-14 flex items-center justify-between px-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#a8c686] to-[#8aad64] flex items-center justify-center">
            <svg className="w-4 h-4 text-[#2d2a24]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span className="text-[#e8dcc8] font-semibold tracking-wide">Fat Trimmer</span>
        </div>
        {session?.user?.image && (
          <Image src={session.user.image} alt="" width={32} height={32} className="rounded-xl" />
        )}
      </header>

      {/* Mobile Bottom Tab Bar */}
      <nav aria-label="Main navigation" className="md:hidden fixed bottom-0 left-0 right-0 bg-[#2d2a24]/95 backdrop-blur-sm border-t border-[#3a3630] z-30">
        <div className="flex justify-around items-center h-16 px-1">
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
                className={`flex flex-col items-center justify-center w-full h-full rounded-2xl transition-colors ${
                  isActive ? "text-[#a8c686]" : "text-[#7a7264]"
                }`}
              >
                {item.icon}
                <span className="text-[10px] mt-1 tracking-wide">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Main Content */}
      <main className="md:ml-64 pt-14 md:pt-0 pb-20 md:pb-0 min-h-screen">
        <div className="p-5 md:p-10 max-w-5xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
