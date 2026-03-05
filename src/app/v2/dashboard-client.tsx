"use client";

import { useState } from "react";
import { V2Shell } from "@/components/layout/shells/v2-shell";
import { WeightChart } from "@/components/charts/weight-chart";
import { formatWeight, getBMICategory, getWeightChange } from "@/lib/utils";
import { useUnits } from "@/lib/unit-context";
import { VersionSelector } from "@/components/ui/version-selector";
import { DashboardStats } from "@/types";
import Link from "next/link";

interface V2DashboardClientProps {
  stats: DashboardStats;
  userName: string;
}

let progressRingCounter = 0;

function ProgressRing({ progress, size = 80, strokeWidth = 6 }: { progress: number; size?: number; strokeWidth?: number }) {
  const [gradientId] = useState(() => `progress-ring-gradient-${++progressRingCounter}`);
  const [glowId] = useState(() => `progress-ring-glow-${progressRingCounter}`);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (Math.min(progress, 100) / 100) * circumference;

  return (
    <svg width={size} height={size} className="transform -rotate-90 drop-shadow-[0_0_8px_rgba(20,184,166,0.3)]">
      {/* Background track */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="rgba(255,255,255,0.04)"
        strokeWidth={strokeWidth}
        fill="none"
      />
      {/* Glow layer */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={`url(#${glowId})`}
        strokeWidth={strokeWidth + 4}
        fill="none"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        opacity={0.3}
        className="transition-all duration-1000 ease-out"
      />
      {/* Main progress stroke */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={`url(#${gradientId})`}
        strokeWidth={strokeWidth}
        fill="none"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        className="transition-all duration-1000 ease-out"
      />
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#14b8a6" />
          <stop offset="50%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#10b981" />
        </linearGradient>
        <linearGradient id={glowId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#14b8a6" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/** Reusable glassmorphic card wrapper */
function GlassCard({ children, className = "", glow = false }: { children: React.ReactNode; className?: string; glow?: boolean }) {
  return (
    <div className={`
      relative bg-white/[0.04] backdrop-blur-xl rounded-2xl border border-white/[0.08]
      shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]
      hover:bg-white/[0.06] hover:border-white/[0.12] hover:scale-[1.015]
      transition-all duration-500 ease-out
      ${glow ? "hover:shadow-[0_0_30px_-5px_rgba(20,184,166,0.15)]" : "hover:shadow-lg hover:shadow-black/20"}
      ${className}
    `}>
      {children}
    </div>
  );
}

export function V2DashboardClient({ stats, userName }: V2DashboardClientProps) {
  const { formatWeight: fmtWeight, formatWeightChange: fmtWeightChange, unitSystem } = useUnits();

  const weightChange = stats.currentWeight && stats.previousWeight
    ? getWeightChange(stats.currentWeight, stats.previousWeight)
    : null;

  const bmiCategory = stats.bmi ? getBMICategory(stats.bmi) : null;

  return (
    <V2Shell>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white/90 tracking-tight">
              Welcome back,{" "}
              <span className="bg-gradient-to-r from-teal-300 via-cyan-300 to-emerald-300 bg-clip-text text-transparent">
                {userName.split(" ")[0]}
              </span>
            </h1>
            <p className="text-white/25 mt-1.5 text-sm tracking-wide">Here&apos;s your progress overview</p>
          </div>
          <VersionSelector className="bg-white/[0.04] border-white/[0.08] text-white/40 rounded-xl backdrop-blur-xl" />
        </div>

        {/* Glassmorphic Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <GlassCard glow className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-teal-400 shadow-[0_0_6px_rgba(20,184,166,0.6)]" />
              <p className="text-[11px] text-white/30 uppercase tracking-[0.15em] font-medium">Current Weight</p>
            </div>
            <p className="text-2xl font-bold text-white/90 tracking-tight">
              {stats.currentWeight ? fmtWeight(stats.currentWeight) : "--"}
            </p>
            {weightChange && (
              <p className={`text-sm mt-1.5 font-medium ${weightChange.isLoss ? "text-emerald-400" : "text-rose-400"}`}>
                {weightChange.isLoss ? "-" : "+"}{fmtWeightChange(weightChange.value)}
              </p>
            )}
          </GlassCard>

          <GlassCard glow className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(6,182,212,0.6)]" />
              <p className="text-[11px] text-white/30 uppercase tracking-[0.15em] font-medium">BMI</p>
            </div>
            <p className="text-2xl font-bold text-white/90 tracking-tight">
              {stats.bmi ? formatWeight(stats.bmi) : "--"}
            </p>
            {bmiCategory && (
              <p className={`text-sm mt-1.5 font-medium ${bmiCategory.color}`}>{bmiCategory.label}</p>
            )}
          </GlassCard>

          <GlassCard glow className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.6)]" />
              <p className="text-[11px] text-white/30 uppercase tracking-[0.15em] font-medium">Goal Progress</p>
            </div>
            <div className="flex items-center gap-3 mt-1">
              {stats.goalWeight ? (
                <>
                  <ProgressRing progress={stats.progress} size={52} strokeWidth={4} />
                  <div>
                    <p className="text-xl font-bold text-white/90">{Math.round(stats.progress)}%</p>
                    <p className="text-xs text-white/25 mt-0.5">{fmtWeight(stats.goalWeight)}</p>
                  </div>
                </>
              ) : (
                <p className="text-2xl font-bold text-white/30">--</p>
              )}
            </div>
          </GlassCard>

          <GlassCard glow className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-teal-300 shadow-[0_0_6px_rgba(94,234,212,0.6)]" />
              <p className="text-[11px] text-white/30 uppercase tracking-[0.15em] font-medium">Total Lost</p>
            </div>
            <p className={`text-2xl font-bold tracking-tight mt-1 ${stats.totalLost > 0 ? "text-emerald-400" : "text-white/30"}`}>
              {stats.totalLost > 0 ? `-${fmtWeightChange(stats.totalLost)}` : "--"}
            </p>
            {stats.startWeight && (
              <p className="text-xs text-white/20 mt-1.5">Started: {fmtWeight(stats.startWeight)}</p>
            )}
          </GlassCard>
        </div>

        {/* Progress Bar */}
        {stats.goalWeight && stats.currentWeight && (
          <GlassCard className="p-5">
            <div className="flex justify-between mb-3">
              <span className="text-sm text-white/30 font-medium">Progress to goal</span>
              <span className="text-sm text-white/70 font-medium tabular-nums">
                {fmtWeight(stats.currentWeight)} / {fmtWeight(stats.goalWeight)}
              </span>
            </div>
            <div className="h-2 bg-white/[0.04] rounded-full overflow-hidden relative">
              <div
                className="h-full bg-gradient-to-r from-teal-500 via-cyan-400 to-emerald-400 rounded-full transition-all duration-1000 relative"
                style={{ width: `${Math.min(stats.progress, 100)}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-teal-500 via-cyan-400 to-emerald-400 rounded-full blur-sm opacity-60" />
              </div>
            </div>
          </GlassCard>
        )}

        {/* Weight Chart */}
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-base font-semibold text-white/80 tracking-tight">Weight Trend</h3>
            <Link href="/history" className="text-sm text-teal-400/70 hover:text-teal-300 transition-colors duration-300">
              View all
            </Link>
          </div>
          <WeightChart
            data={stats.recentWeights}
            goalWeight={stats.goalWeight}
            height={250}
            unitSystem={unitSystem}
          />
        </GlassCard>

        {/* Quick Action Cards */}
        <div className="grid grid-cols-2 gap-4">
          <Link href="/log">
            <div className="group relative bg-gradient-to-br from-teal-500/[0.08] to-emerald-500/[0.08] backdrop-blur-xl border border-teal-400/[0.12] rounded-2xl p-5 hover:scale-[1.02] transition-all duration-500 cursor-pointer hover:shadow-[0_0_40px_-10px_rgba(20,184,166,0.2)] hover:border-teal-400/20">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 via-cyan-400 to-emerald-500 flex items-center justify-center mb-3 shadow-lg shadow-teal-500/20 group-hover:shadow-teal-500/30 transition-shadow duration-500">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <p className="font-semibold text-white/80 tracking-tight">Log Weight</p>
              <p className="text-sm text-white/25 mt-0.5">Record today&apos;s weight</p>
            </div>
          </Link>

          <Link href="/photos">
            <div className="group relative bg-gradient-to-br from-cyan-500/[0.08] to-blue-500/[0.08] backdrop-blur-xl border border-cyan-400/[0.12] rounded-2xl p-5 hover:scale-[1.02] transition-all duration-500 cursor-pointer hover:shadow-[0_0_40px_-10px_rgba(6,182,212,0.2)] hover:border-cyan-400/20">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center mb-3 shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/30 transition-shadow duration-500">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <p className="font-semibold text-white/80 tracking-tight">Progress Photo</p>
              <p className="text-sm text-white/25 mt-0.5">Capture your progress</p>
            </div>
          </Link>
        </div>

        {/* Setup Prompts */}
        {(!stats.heightCm || !stats.goalWeight) && (
          <div className="relative bg-amber-500/[0.06] backdrop-blur-xl border border-amber-400/[0.12] rounded-2xl p-5">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/15 flex items-center justify-center flex-shrink-0 ring-1 ring-amber-400/20">
                <svg className="w-4 h-4 text-amber-400/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-white/80 tracking-tight">Complete your profile</p>
                <p className="text-sm text-white/30 mt-0.5">
                  {!stats.heightCm && "Add your height to track BMI. "}
                  {!stats.goalWeight && "Set a goal weight to track progress."}
                </p>
                <div className="flex gap-3 mt-2.5">
                  {!stats.heightCm && (
                    <Link href="/settings" className="text-sm text-teal-400/80 hover:text-teal-300 transition-colors duration-300 font-medium">Go to settings</Link>
                  )}
                  {!stats.goalWeight && (
                    <Link href="/goals" className="text-sm text-teal-400/80 hover:text-teal-300 transition-colors duration-300 font-medium">Set a goal</Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </V2Shell>
  );
}
