"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useTheme } from "@/lib/theme-context";
import Image from "next/image";

const navItems = [
  { href: "/v1", label: "Dashboard", isDashboard: true },
  { href: "/log", label: "Log Weight" },
  { href: "/history", label: "History" },
  { href: "/goals", label: "Goals" },
  { href: "/measurements", label: "Body" },
  { href: "/photos", label: "Photos" },
  { href: "/settings", label: "Settings" },
];

export function V1Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { dashboardPath } = useTheme();

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      {/* Top Horizontal Navbar */}
      <header className="bg-[#16213e] border-b border-[#2a2a4a] sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-8">
              <h1 className="text-lg font-bold text-[#f0a500]">Fat Trimmer</h1>
              <nav className="hidden md:flex items-center gap-1">
                {navItems.map((item) => {
                  const href = item.isDashboard ? dashboardPath : item.href;
                  const isActive = item.isDashboard ? ["/dashboard", "/v1", "/v2", "/v3"].includes(pathname) : pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={href}
                      className={`px-3 py-2 text-sm font-medium rounded transition-colors ${
                        isActive
                          ? "bg-[#f0a500] text-[#16213e]"
                          : "text-slate-300 hover:bg-[#2a2a4a] hover:text-white"
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </div>
            {session?.user?.image && (
              <Image
                src={session.user.image}
                alt={session.user.name || "User"}
                width={32}
                height={32}
                className="rounded-full"
              />
            )}
          </div>
        </div>
        {/* Mobile nav */}
        <nav className="md:hidden flex overflow-x-auto px-4 pb-2 gap-1">
          {navItems.slice(0, 5).map((item) => {
            const href = item.isDashboard ? dashboardPath : item.href;
            const isActive = item.isDashboard ? ["/dashboard", "/v1", "/v2", "/v3"].includes(pathname) : pathname === item.href;
            return (
              <Link
                key={item.href}
                href={href}
                className={`px-3 py-1.5 text-xs font-medium rounded whitespace-nowrap transition-colors ${
                  isActive
                    ? "bg-[#f0a500] text-[#16213e]"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto p-4 md:p-6">
        {children}
      </main>
    </div>
  );
}
