"use client";

import { useState } from "react";
import { V4Shell } from "@/components/layout/shells/v4-shell";
import { WeightChart } from "@/components/charts/weight-chart";
import { formatWeight, getBMICategory, getWeightChange } from "@/lib/utils";
import { useUnits } from "@/lib/unit-context";
import { VersionSelector } from "@/components/ui/version-selector";
import { DashboardStats } from "@/types";
import Link from "next/link";

interface V4DashboardClientProps {
  stats: DashboardStats;
  userName: string;
}

/* Neon-bordered progress bar with animated glow */
let progressRingCounter = 0;

function NeonProgressRing({
  progress,
  size = 80,
  strokeWidth = 6,
}: {
  progress: number;
  size?: number;
  strokeWidth?: number;
}) {
  const [gradientId] = useState(() => `v4-neon-ring-${++progressRingCounter}`);
  const [glowId] = useState(() => `v4-neon-glow-${progressRingCounter}`);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (Math.min(progress, 100) / 100) * circumference;

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#e94560" />
          <stop offset="50%" stopColor="#533483" />
          <stop offset="100%" stopColor="#e94560" />
        </linearGradient>
        <filter id={glowId}>
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="rgba(83,52,131,0.3)"
        strokeWidth={strokeWidth}
        fill="none"
      />
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
        filter={`url(#${glowId})`}
        className="transition-all duration-1000 ease-out"
      />
    </svg>
  );
}

/* Stat card with neon border and arcade scoreboard feel */
function NeonStatCard({
  label,
  value,
  sub,
  subColor,
}: {
  label: string;
  value: string;
  sub?: string;
  subColor?: string;
}) {
  return (
    <div className="relative bg-[#16213e]/80 border border-[#533483]/70 rounded-md p-5 shadow-[0_0_16px_rgba(83,52,131,0.15)] hover:shadow-[0_0_24px_rgba(233,69,96,0.2)] hover:border-[#e94560]/50 transition-all duration-300 group">
      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#e94560]/40 rounded-tl-md" />
      <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#e94560]/40 rounded-tr-md" />
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#e94560]/40 rounded-bl-md" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#e94560]/40 rounded-br-md" />

      <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#533483] group-hover:text-[#e94560]/60 transition-colors">
        {label}
      </p>
      <p className="text-2xl font-black text-[#e8e8e8] mt-2 tracking-tight drop-shadow-[0_0_8px_rgba(232,232,232,0.1)]">
        {value}
      </p>
      {sub && (
        <p className={`text-sm mt-1 font-semibold ${subColor || "text-[#e8e8e8]/40"}`}>
          {sub}
        </p>
      )}
    </div>
  );
}

export function V4DashboardClient({ stats, userName }: V4DashboardClientProps) {
  const {
    formatWeight: fmtWeight,
    formatWeightChange: fmtWeightChange,
    unitSystem,
  } = useUnits();

  const weightChange =
    stats.currentWeight && stats.previousWeight
      ? getWeightChange(stats.currentWeight, stats.previousWeight)
      : null;

  const bmiCategory = stats.bmi ? getBMICategory(stats.bmi) : null;

  return (
    <V4Shell>
      <div className="space-y-8">
        {/* Header with retro-futuristic styling */}
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#533483] mb-1">
              Welcome back
            </p>
            <h1 className="text-3xl font-black text-[#e8e8e8]">
              <span className="text-[#e94560] drop-shadow-[0_0_12px_rgba(233,69,96,0.5)]">
                {userName.split(" ")[0]}
              </span>
            </h1>
            <div className="mt-2 h-[2px] w-24 bg-gradient-to-r from-[#e94560] via-[#533483] to-transparent" />
          </div>
          <VersionSelector className="bg-[#16213e] border-[#533483] text-[#e8e8e8]/60 rounded-md font-bold text-xs uppercase tracking-wider" />
        </div>

        {/* Arcade Scoreboard Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <NeonStatCard
            label="Current Weight"
            value={stats.currentWeight ? fmtWeight(stats.currentWeight) : "--"}
            sub={
              weightChange
                ? `${weightChange.isLoss ? "-" : "+"}${fmtWeightChange(weightChange.value)}`
                : undefined
            }
            subColor={
              weightChange
                ? weightChange.isLoss
                  ? "text-[#0cca4a] drop-shadow-[0_0_6px_rgba(12,202,74,0.4)]"
                  : "text-[#e94560] drop-shadow-[0_0_6px_rgba(233,69,96,0.4)]"
                : undefined
            }
          />

          <NeonStatCard
            label="BMI"
            value={stats.bmi ? formatWeight(stats.bmi) : "--"}
            sub={bmiCategory?.label}
            subColor={bmiCategory?.color}
          />

          <div className="relative bg-[#16213e]/80 border border-[#533483]/70 rounded-md p-5 shadow-[0_0_16px_rgba(83,52,131,0.15)]">
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#e94560]/40 rounded-tl-md" />
            <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#e94560]/40 rounded-tr-md" />
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#e94560]/40 rounded-bl-md" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#e94560]/40 rounded-br-md" />
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#533483]">
              Goal Progress
            </p>
            <div className="flex items-center gap-3 mt-2">
              {stats.goalWeight ? (
                <>
                  <NeonProgressRing progress={stats.progress} size={48} strokeWidth={4} />
                  <div>
                    <p className="text-xl font-black text-[#e8e8e8]">
                      {Math.round(stats.progress)}%
                    </p>
                    <p className="text-xs text-[#533483] font-bold">
                      {fmtWeight(stats.goalWeight)}
                    </p>
                  </div>
                </>
              ) : (
                <p className="text-2xl font-black text-[#e8e8e8]">--</p>
              )}
            </div>
          </div>

          <NeonStatCard
            label="Total Lost"
            value={stats.totalLost > 0 ? `-${fmtWeightChange(stats.totalLost)}` : "--"}
            sub={stats.startWeight ? `Started: ${fmtWeight(stats.startWeight)}` : undefined}
            subColor={
              stats.totalLost > 0
                ? "text-[#0cca4a] drop-shadow-[0_0_6px_rgba(12,202,74,0.4)]"
                : undefined
            }
          />
        </div>

        {/* Neon Progress Bar */}
        {stats.goalWeight && stats.currentWeight && (
          <div className="bg-[#16213e]/80 border border-[#533483]/70 rounded-md p-5 shadow-[0_0_16px_rgba(83,52,131,0.15)]">
            <div className="flex justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#533483]">
                Progress to goal
              </span>
              <span className="text-sm text-[#e8e8e8] font-bold">
                {fmtWeight(stats.currentWeight)} / {fmtWeight(stats.goalWeight)}
              </span>
            </div>
            <div className="h-3 bg-[#0f3460]/60 rounded-full overflow-hidden border border-[#533483]/40 relative">
              <div
                className="h-full rounded-full transition-all duration-1000 relative"
                style={{
                  width: `${Math.min(stats.progress, 100)}%`,
                  background: "linear-gradient(90deg, #e94560, #533483, #e94560)",
                  boxShadow: "0 0 12px rgba(233,69,96,0.5), 0 0 24px rgba(233,69,96,0.2)",
                }}
              />
            </div>
          </div>
        )}

        {/* Weight Chart with synthwave frame */}
        <div className="bg-[#16213e]/80 border border-[#533483]/70 rounded-md p-6 shadow-[0_0_16px_rgba(83,52,131,0.15)]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-[#e94560] drop-shadow-[0_0_6px_rgba(233,69,96,0.4)]">
              Weight Trend
            </h3>
            <Link
              href="/history"
              className="text-xs font-bold uppercase tracking-wider text-[#533483] hover:text-[#e94560] transition-colors"
            >
              View all
            </Link>
          </div>
          {/* Retro grid accent line */}
          <div className="h-[1px] w-full bg-gradient-to-r from-[#e94560]/40 via-[#533483]/60 to-transparent mb-4" />
          <WeightChart
            data={stats.recentWeights}
            goalWeight={stats.goalWeight}
            height={250}
            unitSystem={unitSystem}
          />
        </div>

        {/* Quick Action Cards -- neon-bordered arcade buttons */}
        <div className="grid grid-cols-2 gap-4">
          <Link href="/log">
            <div className="relative bg-[#16213e]/80 border-2 border-[#e94560]/40 rounded-md p-5 hover:border-[#e94560] hover:shadow-[0_0_20px_rgba(233,69,96,0.3)] transition-all duration-300 cursor-pointer group">
              <div className="w-10 h-10 rounded-md bg-gradient-to-br from-[#e94560] to-[#533483] flex items-center justify-center mb-3 shadow-[0_0_12px_rgba(233,69,96,0.4)] group-hover:shadow-[0_0_20px_rgba(233,69,96,0.6)] transition-shadow">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </div>
              <p className="font-black text-[#e8e8e8] uppercase tracking-wider text-sm">
                Log Weight
              </p>
              <p className="text-xs text-[#e8e8e8]/30 mt-0.5 font-medium">
                Record today&apos;s weight
              </p>
            </div>
          </Link>

          <Link href="/photos">
            <div className="relative bg-[#16213e]/80 border-2 border-[#533483]/60 rounded-md p-5 hover:border-[#533483] hover:shadow-[0_0_20px_rgba(83,52,131,0.3)] transition-all duration-300 cursor-pointer group">
              <div className="w-10 h-10 rounded-md bg-gradient-to-br from-[#533483] to-[#0f3460] flex items-center justify-center mb-3 shadow-[0_0_12px_rgba(83,52,131,0.4)] group-hover:shadow-[0_0_20px_rgba(83,52,131,0.6)] transition-shadow">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <p className="font-black text-[#e8e8e8] uppercase tracking-wider text-sm">
                Progress Photo
              </p>
              <p className="text-xs text-[#e8e8e8]/30 mt-0.5 font-medium">
                Capture your progress
              </p>
            </div>
          </Link>
        </div>

        {/* Setup Prompts -- warning with neon amber */}
        {(!stats.heightCm || !stats.goalWeight) && (
          <div className="bg-[#16213e]/80 border-2 border-[#f0a500]/40 rounded-md p-5 shadow-[0_0_16px_rgba(240,165,0,0.1)]">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-md bg-[#f0a500]/20 border border-[#f0a500]/40 flex items-center justify-center flex-shrink-0 shadow-[0_0_8px_rgba(240,165,0,0.2)]">
                <svg
                  className="w-4 h-4 text-[#f0a500]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <div>
                <p className="font-black text-[#e8e8e8] uppercase tracking-wider text-sm">
                  Complete Your Profile
                </p>
                <p className="text-sm text-[#e8e8e8]/40 mt-1 font-medium">
                  {!stats.heightCm && "Add your height to track BMI. "}
                  {!stats.goalWeight && "Set a goal weight to track progress."}
                </p>
                <div className="flex gap-4 mt-3">
                  {!stats.heightCm && (
                    <Link
                      href="/settings"
                      className="text-xs font-bold uppercase tracking-wider text-[#e94560] hover:text-[#e94560]/80 transition-colors drop-shadow-[0_0_4px_rgba(233,69,96,0.4)]"
                    >
                      Go to settings
                    </Link>
                  )}
                  {!stats.goalWeight && (
                    <Link
                      href="/goals"
                      className="text-xs font-bold uppercase tracking-wider text-[#e94560] hover:text-[#e94560]/80 transition-colors drop-shadow-[0_0_4px_rgba(233,69,96,0.4)]"
                    >
                      Set a goal
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </V4Shell>
  );
}
