"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useTheme } from "@/lib/theme-context";
import { navItems as baseNavItems, getNavItemsWithIcons, DASHBOARD_ROUTES } from "@/lib/nav-items";

const sidebarNavItems = getNavItemsWithIcons(baseNavItems.filter((item) => item.href !== "/settings"));
const settingsNavItem = getNavItemsWithIcons(baseNavItems.filter((item) => item.href === "/settings"))[0];

const mobileNavItems = sidebarNavItems.slice(0, 5);

export function MobileNav() {
  const pathname = usePathname();
  const { dashboardPath } = useTheme();

  return (
    <nav aria-label="Main navigation" className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-700 z-30 pb-safe">
      <div className="flex justify-around items-center h-16">
        {mobileNavItems.map((item) => {
          const href = item.isDashboard ? dashboardPath : item.href;
          const isActive = item.isDashboard
            ? DASHBOARD_ROUTES.includes(pathname)
            : pathname === href;
          return (
            <Link
              key={item.href}
              href={href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full transition-colors",
                isActive
                  ? "text-primary-400"
                  : "text-slate-400 hover:text-slate-200"
              )}
            >
              {item.icon}
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const { dashboardPath } = useTheme();

  return (
    <aside className="hidden md:flex flex-col w-64 bg-slate-900 border-r border-slate-700 h-screen fixed left-0 top-0">
      <div className="p-6">
        <h1 className="text-2xl font-bold gradient-text">Fat Trimmer</h1>
        <p className="text-sm text-slate-400 mt-1">Track your progress</p>
      </div>

      <nav aria-label="Main navigation" className="flex-1 px-4 space-y-1">
        {sidebarNavItems.map((item) => {
          const href = item.isDashboard ? dashboardPath : item.href;
          const isActive = item.isDashboard
            ? DASHBOARD_ROUTES.includes(pathname)
            : pathname === href;
          return (
            <Link
              key={item.href}
              href={href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all",
                isActive
                  ? "bg-gradient-primary text-white"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              )}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-700">
        <Link
          href={settingsNavItem.href}
          aria-current={pathname === settingsNavItem.href ? "page" : undefined}
          className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-lg transition-all",
            pathname === settingsNavItem.href
              ? "bg-gradient-primary text-white"
              : "text-slate-300 hover:bg-slate-800 hover:text-white"
          )}
        >
          {settingsNavItem.icon}
          <span className="font-medium">{settingsNavItem.label}</span>
        </Link>
      </div>
    </aside>
  );
}
