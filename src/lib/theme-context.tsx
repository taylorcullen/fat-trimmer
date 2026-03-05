"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export type ThemeVersion = "default" | "v1" | "v2" | "v3";

const VALID_THEMES: ThemeVersion[] = ["default", "v1", "v2", "v3"];

function isValidTheme(value: unknown): value is ThemeVersion {
  return typeof value === "string" && VALID_THEMES.includes(value as ThemeVersion);
}

const DASHBOARD_PATHS: Record<ThemeVersion, string> = {
  default: "/dashboard",
  v1: "/v1",
  v2: "/v2",
  v3: "/v3",
};

interface ThemeContextValue {
  theme: ThemeVersion;
  setTheme: (theme: ThemeVersion) => void;
  dashboardPath: string;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "default",
  setTheme: () => {},
  dashboardPath: "/dashboard",
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeVersion>(() => {
    if (typeof window !== "undefined") {
      const attr = document.documentElement.getAttribute("data-theme");
      if (isValidTheme(attr)) return attr;
    }
    return "default";
  });
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const stored = localStorage.getItem("fat-trimmer-theme");
    if (isValidTheme(stored)) {
      setThemeState(stored);
    }
  }, []);

  const setTheme = (newTheme: ThemeVersion) => {
    setThemeState(newTheme);
    localStorage.setItem("fat-trimmer-theme", newTheme);
    const isDashboard = pathname === "/dashboard" || pathname === "/v1" || pathname === "/v2" || pathname === "/v3";
    if (isDashboard) {
      router.push(DASHBOARD_PATHS[newTheme]);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, dashboardPath: DASHBOARD_PATHS[theme] }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

export { getThemeStyles } from "./theme-styles";
export type { ThemeStyles } from "./theme-styles";
