"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/lib/theme-context";
import { navItems } from "@/lib/nav-items";

export function V3Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { dashboardPath } = useTheme();

  return (
    <div className="min-h-screen bg-[#09090b]">
      <header className="border-b border-white/5 sticky top-0 z-30 bg-[#09090b]">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href={dashboardPath} className="text-sm font-medium text-white/90">fat trimmer</Link>
          <nav aria-label="Main navigation" className="hidden md:flex items-center gap-6">
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
                  className={`text-sm transition-colors ${
                    isActive
                      ? "text-[#f43f5e]"
                      : "text-white/30 hover:text-white/60"
                  }`}
                >
                  {item.label.toLowerCase()}
                </Link>
              );
            })}
          </nav>
        </div>
        <nav aria-label="Main navigation" className="md:hidden flex overflow-x-auto px-6 pb-3 gap-5">
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
                className={`text-xs whitespace-nowrap transition-colors ${
                  isActive ? "text-[#f43f5e]" : "text-white/30"
                }`}
              >
                {item.label.toLowerCase()}
              </Link>
            );
          })}
        </nav>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12">
        {children}
      </main>
    </div>
  );
}
