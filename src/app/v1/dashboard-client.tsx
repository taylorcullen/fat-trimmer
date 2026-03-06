"use client";

import { V1Shell } from "@/components/layout/shells/v1-shell";
import { WeightChart } from "@/components/charts/weight-chart";
import { formatWeight, getBMICategory, getWeightChange } from "@/lib/utils";
import { useUnits } from "@/lib/unit-context";
import { VersionSelector } from "@/components/ui/version-selector";
import { DashboardStats } from "@/types";
import Link from "next/link";

interface V1DashboardClientProps {
  stats: DashboardStats;
  userName: string;
}

export function V1DashboardClient({ stats, userName }: V1DashboardClientProps) {
  const { formatWeight: fmtWeight, formatWeightChange: fmtWeightChange, unitSystem } = useUnits();

  const weightChange = stats.currentWeight && stats.previousWeight
    ? getWeightChange(stats.currentWeight, stats.previousWeight)
    : null;

  const bmiCategory = stats.bmi ? getBMICategory(stats.bmi) : null;

  return (
    <V1Shell>
      <div className="space-y-8">

        {/* ---- HEADER BAR ---- */}
        <div className="flex items-end justify-between border-b-2 border-[#f0a500]/20 pb-5">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#6b7394] mb-1">
              Command Overview
            </p>
            <h2 className="text-2xl font-bold uppercase tracking-[0.15em] text-[#f0a500] font-mono">
              Dashboard
            </h2>
            <p className="text-xs font-mono text-[#6b7394] mt-1 tracking-wider">
              Operative: <span className="text-[#c4985a]">{userName.split(" ")[0]}</span>
            </p>
          </div>
          <VersionSelector className="bg-[#0f1420] border-2 border-[#f0a500]/20 text-[#c4985a] font-mono text-xs uppercase tracking-wider" />
        </div>

        {/* ---- INSTRUMENT PANEL: STAT CARDS ---- */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Current Weight */}
          <div className="bg-[#0f1420] border-2 border-[#f0a500]/20 p-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-[#f0a500]" />
            <p className="text-[9px] font-mono uppercase tracking-[0.25em] text-[#6b7394] mb-2">
              Current
            </p>
            <p className="text-2xl font-mono font-bold text-white tracking-tight">
              {stats.currentWeight ? fmtWeight(stats.currentWeight) : "--"}
            </p>
            {weightChange && (
              <p className={`text-xs font-mono mt-1 ${weightChange.isLoss ? "text-emerald-400" : "text-red-400"}`}>
                {weightChange.isLoss ? "▼" : "▲"} {fmtWeightChange(weightChange.value)}
              </p>
            )}
          </div>

          {/* BMI */}
          <div className="bg-[#0f1420] border-2 border-[#f0a500]/20 p-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-[#f0a500]" />
            <p className="text-[9px] font-mono uppercase tracking-[0.25em] text-[#6b7394] mb-2">
              BMI Index
            </p>
            <p className="text-2xl font-mono font-bold text-white tracking-tight">
              {stats.bmi ? formatWeight(stats.bmi) : "--"}
            </p>
            {bmiCategory && (
              <p className={`text-xs font-mono mt-1 ${bmiCategory.color}`}>{bmiCategory.label}</p>
            )}
          </div>

          {/* Goal Weight */}
          <div className="bg-[#0f1420] border-2 border-[#f0a500]/20 p-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-[#f0a500]" />
            <p className="text-[9px] font-mono uppercase tracking-[0.25em] text-[#6b7394] mb-2">
              Target
            </p>
            <p className="text-2xl font-mono font-bold text-white tracking-tight">
              {stats.goalWeight ? fmtWeight(stats.goalWeight) : "--"}
            </p>
            <p className="text-xs font-mono mt-1 text-[#6b7394]">
              {stats.goalWeight ? `${Math.round(stats.progress)}% complete` : "Not set"}
            </p>
          </div>

          {/* Total Lost */}
          <div className="bg-[#0f1420] border-2 border-[#f0a500]/20 p-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-emerald-400" />
            <p className="text-[9px] font-mono uppercase tracking-[0.25em] text-[#6b7394] mb-2">
              Total Lost
            </p>
            <p className="text-2xl font-mono font-bold text-emerald-400 tracking-tight">
              {stats.totalLost > 0 ? fmtWeightChange(stats.totalLost) : "--"}
            </p>
            <p className="text-xs font-mono mt-1 text-[#6b7394]">
              {stats.startWeight ? `From ${fmtWeight(stats.startWeight)}` : ""}
            </p>
          </div>
        </div>

        {/* ---- PROGRESS BAR — brass gauge ---- */}
        {stats.goalWeight && stats.currentWeight && (
          <div className="bg-[#0f1420] border-2 border-[#f0a500]/20 p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[9px] font-mono uppercase tracking-[0.25em] text-[#6b7394]">
                Mission Progress
              </p>
              <p className="text-xs font-mono text-[#c4985a] tracking-wider">
                {fmtWeight(stats.currentWeight)}
                <span className="text-[#6b7394] mx-2">/</span>
                {fmtWeight(stats.goalWeight)}
              </p>
            </div>
            {/* Gauge track */}
            <div className="relative h-5 bg-[#0b0e1a] border border-[#f0a500]/20 overflow-hidden">
              {/* Tick marks */}
              <div className="absolute inset-0 flex">
                {Array.from({ length: 20 }).map((_, i) => (
                  <div key={i} className="flex-1 border-r border-[#f0a500]/10 last:border-r-0" />
                ))}
              </div>
              {/* Fill */}
              <div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#f0a500] to-[#c4985a] transition-all duration-700"
                style={{ width: `${Math.min(stats.progress, 100)}%` }}
              />
              {/* Percentage label on fill */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[10px] font-mono font-bold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] tracking-wider">
                  {Math.round(stats.progress)}%
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ---- WEIGHT CHART — command center display ---- */}
        <div className="bg-[#0f1420] border-2 border-[#f0a500]/20 p-5">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-[#f0a500] rotate-45" />
              <h3 className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-[#f0a500]">
                Weight Trend
              </h3>
            </div>
            <Link
              href="/history"
              className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#6b7394] hover:text-[#f0a500] transition-colors border-b border-[#6b7394]/30 hover:border-[#f0a500]/40 pb-0.5"
            >
              Full History
            </Link>
          </div>
          <WeightChart
            data={stats.recentWeights}
            goalWeight={stats.goalWeight}
            height={260}
            unitSystem={unitSystem}
          />
        </div>

        {/* ---- QUICK ACTIONS — angular command buttons ---- */}
        <div className="grid grid-cols-2 gap-4">
          <Link
            href="/log"
            className="group relative bg-[#f0a500] text-[#0b0e1a] font-mono font-bold text-xs text-center uppercase tracking-[0.2em] py-4 px-6 hover:bg-[#c4985a] transition-all duration-200 overflow-hidden"
          >
            {/* Corner notch decorations */}
            <span className="absolute top-0 right-0 w-3 h-3 bg-[#0b0e1a] -translate-x-0 translate-y-0" style={{ clipPath: "polygon(100% 0, 0 0, 100% 100%)" }} />
            Log Weight
          </Link>
          <Link
            href="/photos"
            className="group relative bg-[#0f1420] border-2 border-[#f0a500]/30 text-[#c4985a] font-mono font-bold text-xs text-center uppercase tracking-[0.2em] py-4 px-6 hover:border-[#f0a500] hover:text-[#f0a500] transition-all duration-200"
          >
            Progress Photo
          </Link>
        </div>

        {/* ---- SETUP PROMPTS — alert panel ---- */}
        {(!stats.heightCm || !stats.goalWeight) && (
          <div className="relative bg-[#0f1420] border-2 border-[#f0a500]/40 p-5">
            {/* Alert indicator */}
            <div className="absolute top-0 left-0 w-1 h-full bg-[#f0a500]" />
            <div className="pl-4">
              <p className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-[#f0a500] mb-2">
                Action Required
              </p>
              <p className="text-xs font-mono text-[#6b7394] leading-relaxed">
                {!stats.heightCm && "Add your height to enable BMI tracking. "}
                {!stats.goalWeight && "Set a target weight to activate mission progress."}
              </p>
              <div className="flex gap-6 mt-3">
                {!stats.heightCm && (
                  <Link
                    href="/settings"
                    className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#f0a500] hover:text-[#c4985a] transition-colors border-b border-[#f0a500]/40 pb-0.5"
                  >
                    Settings
                  </Link>
                )}
                {!stats.goalWeight && (
                  <Link
                    href="/goals"
                    className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#f0a500] hover:text-[#c4985a] transition-colors border-b border-[#f0a500]/40 pb-0.5"
                  >
                    Set Target
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </V1Shell>
  );
}
