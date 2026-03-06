"use client";

import { V5Shell } from "@/components/layout/shells/v5-shell";
import { WeightChart } from "@/components/charts/weight-chart";
import { formatWeight, getBMICategory, getWeightChange } from "@/lib/utils";
import { useUnits } from "@/lib/unit-context";
import { VersionSelector } from "@/components/ui/version-selector";
import { DashboardStats } from "@/types";
import Link from "next/link";

interface V5DashboardClientProps {
  stats: DashboardStats;
  userName: string;
}

function OrganicProgressBar({ progress }: { progress: number }) {
  const clamped = Math.min(progress, 100);
  return (
    <div className="relative h-4 bg-[#3a3630] rounded-3xl overflow-hidden shadow-inner">
      <div
        className="absolute inset-y-0 left-0 rounded-3xl bg-gradient-to-r from-[#8aad64] via-[#a8c686] to-[#c4dca4] transition-all duration-1000 ease-out"
        style={{ width: `${clamped}%` }}
      />
      {/* Subtle texture grain overlay */}
      <div className="absolute inset-0 opacity-[0.04] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiNmZmYiLz48L3N2Zz4=')]" />
    </div>
  );
}

export function V5DashboardClient({ stats, userName }: V5DashboardClientProps) {
  const { formatWeight: fmtWeight, formatWeightChange: fmtWeightChange, unitSystem } = useUnits();

  const weightChange = stats.currentWeight && stats.previousWeight
    ? getWeightChange(stats.currentWeight, stats.previousWeight)
    : null;

  const bmiCategory = stats.bmi ? getBMICategory(stats.bmi) : null;

  return (
    <V5Shell>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <p className="text-[#7a7264] text-sm tracking-widest uppercase mb-1">Welcome back</p>
            <h1 className="text-3xl font-light text-[#e8dcc8] tracking-wide">
              {userName.split(" ")[0]}
            </h1>
          </div>
          <VersionSelector className="bg-[#3a3630] border-[#5c5647] text-[#9b9285] rounded-2xl" />
        </div>

        {/* Stat Cards - organic rounded shapes with generous padding */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {/* Current Weight */}
          <div className="bg-[#2d2a24] rounded-3xl border border-[#3a3630] p-6 shadow-md shadow-[#1a1815]/40 hover:shadow-lg hover:shadow-[#1a1815]/50 transition-shadow duration-300">
            <p className="text-xs text-[#7a7264] uppercase tracking-widest mb-3">Current</p>
            <p className="text-2xl font-semibold text-[#e8dcc8] tracking-tight">
              {stats.currentWeight ? fmtWeight(stats.currentWeight) : "--"}
            </p>
            {weightChange && (
              <p className={`text-sm mt-2 ${weightChange.isLoss ? "text-[#a8c686]" : "text-[#d4726a]"}`}>
                {weightChange.isLoss ? "-" : "+"}{fmtWeightChange(weightChange.value)}
              </p>
            )}
          </div>

          {/* BMI */}
          <div className="bg-[#2d2a24] rounded-3xl border border-[#3a3630] p-6 shadow-md shadow-[#1a1815]/40 hover:shadow-lg hover:shadow-[#1a1815]/50 transition-shadow duration-300">
            <p className="text-xs text-[#7a7264] uppercase tracking-widest mb-3">BMI</p>
            <p className="text-2xl font-semibold text-[#e8dcc8] tracking-tight">
              {stats.bmi ? formatWeight(stats.bmi) : "--"}
            </p>
            {bmiCategory && (
              <p className={`text-sm mt-2 ${bmiCategory.color}`}>{bmiCategory.label}</p>
            )}
          </div>

          {/* Goal Progress */}
          <div className="bg-[#2d2a24] rounded-3xl border border-[#3a3630] p-6 shadow-md shadow-[#1a1815]/40 hover:shadow-lg hover:shadow-[#1a1815]/50 transition-shadow duration-300">
            <p className="text-xs text-[#7a7264] uppercase tracking-widest mb-3">Progress</p>
            {stats.goalWeight ? (
              <div>
                <p className="text-2xl font-semibold text-[#a8c686] tracking-tight">
                  {Math.round(stats.progress)}%
                </p>
                <p className="text-xs text-[#7a7264] mt-2">
                  Goal: {fmtWeight(stats.goalWeight)}
                </p>
              </div>
            ) : (
              <p className="text-2xl font-semibold text-[#e8dcc8]">--</p>
            )}
          </div>

          {/* Total Lost */}
          <div className="bg-[#2d2a24] rounded-3xl border border-[#3a3630] p-6 shadow-md shadow-[#1a1815]/40 hover:shadow-lg hover:shadow-[#1a1815]/50 transition-shadow duration-300">
            <p className="text-xs text-[#7a7264] uppercase tracking-widest mb-3">Total Lost</p>
            <p className={`text-2xl font-semibold tracking-tight ${stats.totalLost > 0 ? "text-[#a8c686]" : "text-[#e8dcc8]"}`}>
              {stats.totalLost > 0 ? `-${fmtWeightChange(stats.totalLost)}` : "--"}
            </p>
            {stats.startWeight && (
              <p className="text-xs text-[#7a7264] mt-2">Started: {fmtWeight(stats.startWeight)}</p>
            )}
          </div>
        </div>

        {/* Organic Progress Bar */}
        {stats.goalWeight && stats.currentWeight && (
          <div className="bg-[#2d2a24] rounded-3xl border border-[#3a3630] p-7 shadow-md shadow-[#1a1815]/40">
            <div className="flex justify-between mb-4">
              <span className="text-sm text-[#9b9285] tracking-wide">Journey to goal</span>
              <span className="text-sm text-[#e8dcc8] font-medium tracking-wide">
                {fmtWeight(stats.currentWeight)} / {fmtWeight(stats.goalWeight)}
              </span>
            </div>
            <OrganicProgressBar progress={stats.progress} />
          </div>
        )}

        {/* Weight Chart */}
        <div className="bg-[#2d2a24] rounded-3xl border border-[#3a3630] p-7 shadow-md shadow-[#1a1815]/40">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-medium text-[#e8dcc8] tracking-wide">Weight Trend</h3>
            <Link
              href="/history"
              className="text-sm text-[#a8c686] hover:text-[#c4dca4] transition-colors tracking-wide"
            >
              View all
            </Link>
          </div>
          <WeightChart
            data={stats.recentWeights}
            goalWeight={stats.goalWeight}
            height={250}
            unitSystem={unitSystem}
          />
        </div>

        {/* Quick Actions - grounded, organic buttons */}
        <div className="grid grid-cols-2 gap-4 md:gap-5">
          <Link href="/log">
            <div className="bg-[#2d2a24] rounded-3xl border border-[#3a3630] p-6 hover:border-[#a8c686]/30 hover:shadow-lg hover:shadow-[#a8c686]/5 transition-all duration-300 cursor-pointer group">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#a8c686] to-[#8aad64] flex items-center justify-center mb-4 shadow-sm group-hover:shadow-md group-hover:shadow-[#a8c686]/20 transition-shadow">
                <svg className="w-5 h-5 text-[#2d2a24]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <p className="font-medium text-[#e8dcc8] tracking-wide">Log Weight</p>
              <p className="text-sm text-[#7a7264] mt-1 tracking-wide">Record today&apos;s weight</p>
            </div>
          </Link>

          <Link href="/photos">
            <div className="bg-[#2d2a24] rounded-3xl border border-[#3a3630] p-6 hover:border-[#a8c686]/30 hover:shadow-lg hover:shadow-[#a8c686]/5 transition-all duration-300 cursor-pointer group">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#c4a882] to-[#a8926a] flex items-center justify-center mb-4 shadow-sm group-hover:shadow-md group-hover:shadow-[#c4a882]/20 transition-shadow">
                <svg className="w-5 h-5 text-[#2d2a24]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <p className="font-medium text-[#e8dcc8] tracking-wide">Progress Photo</p>
              <p className="text-sm text-[#7a7264] mt-1 tracking-wide">Capture your journey</p>
            </div>
          </Link>
        </div>

        {/* Setup Prompts - warm amber tones */}
        {(!stats.heightCm || !stats.goalWeight) && (
          <div className="bg-[#33302a] rounded-3xl border border-[#5c5240] p-6 shadow-md">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-2xl bg-[#c4a882]/15 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-[#c4a882]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-[#e8dcc8] tracking-wide">Complete your profile</p>
                <p className="text-sm text-[#9b9285] mt-1 tracking-wide leading-relaxed">
                  {!stats.heightCm && "Add your height to track BMI. "}
                  {!stats.goalWeight && "Set a goal weight to track progress."}
                </p>
                <div className="flex gap-4 mt-3">
                  {!stats.heightCm && (
                    <Link
                      href="/settings"
                      className="text-sm text-[#a8c686] hover:text-[#c4dca4] transition-colors tracking-wide"
                    >
                      Go to settings
                    </Link>
                  )}
                  {!stats.goalWeight && (
                    <Link
                      href="/goals"
                      className="text-sm text-[#a8c686] hover:text-[#c4dca4] transition-colors tracking-wide"
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
    </V5Shell>
  );
}
