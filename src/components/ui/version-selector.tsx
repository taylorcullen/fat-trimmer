"use client";

import { useTheme, ThemeVersion } from "@/lib/theme-context";

const options: { value: ThemeVersion; label: string }[] = [
  { value: "default", label: "Default" },
  { value: "v1", label: "V1 Classic" },
  { value: "v2", label: "V2 Modern" },
  { value: "v3", label: "V3 Minimal" },
];

export function VersionSelector({ className = "" }: { className?: string }) {
  const { theme, setTheme } = useTheme();

  return (
    <select
      value={theme}
      onChange={(e) => setTheme(e.target.value as ThemeVersion)}
      aria-label="Select theme version"
      className={`bg-slate-700 border border-slate-600 text-slate-300 text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary-500 cursor-pointer ${className}`}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
