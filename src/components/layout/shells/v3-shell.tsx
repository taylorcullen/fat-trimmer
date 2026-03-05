"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/lib/theme-context";
import { navItems, DASHBOARD_ROUTES } from "@/lib/nav-items";

export function V3Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { dashboardPath } = useTheme();

  return (
    <div className="min-h-screen bg-[#09090b] selection:bg-[#f43f5e]/20 selection:text-white">
      {/* Header — text-only, no decorations */}
      <header className="sticky top-0 z-30 bg-[#09090b]/95 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto px-6">
          <div className="flex items-center justify-between h-14">
            <Link
              href={dashboardPath}
              className="text-[11px] font-light tracking-[0.4em] uppercase text-white/50 hover:text-white/80 transition-colors"
            >
              fat trimmer
            </Link>

            {/* Desktop nav — text-only, generous spacing */}
            <nav aria-label="Main navigation" className="hidden md:flex items-center gap-8">
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
                    className={`text-[11px] tracking-[0.2em] uppercase transition-colors ${
                      isActive
                        ? "text-[#f43f5e]"
                        : "text-white/20 hover:text-white/40"
                    }`}
                  >
                    {item.label.toLowerCase()}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Hairline below header */}
          <div className="h-px bg-white/[0.04]" />

          {/* Mobile nav — horizontal scroll, text-only */}
          <nav
            aria-label="Main navigation"
            className="md:hidden flex overflow-x-auto gap-6 py-3 scrollbar-none"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
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
                  className={`text-[10px] tracking-[0.2em] uppercase whitespace-nowrap transition-colors ${
                    isActive ? "text-[#f43f5e]" : "text-white/20"
                  }`}
                >
                  {item.label.toLowerCase()}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main content — max-w-3xl, generous vertical padding */}
      <main className="max-w-3xl mx-auto px-6 py-16">
        {children}
      </main>
    </div>
  );
}
