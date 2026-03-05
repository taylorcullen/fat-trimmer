"use client";

import { AppLayout } from "@/components/layout/app-layout";
import { WeightChart } from "@/components/charts/weight-chart";
import { formatWeight, getBMICategory, getWeightChange } from "@/lib/utils";
import { useUnits } from "@/lib/unit-context";
import { VersionSelector } from "@/components/ui/version-selector";
import { DashboardStats } from "@/types";
import Link from "next/link";

interface DashboardClientProps {
  stats: DashboardStats;
  userName: string;
}

export function DashboardClient({ stats, userName }: DashboardClientProps) {
  const { formatWeight: fmtWeight, formatWeightChange: fmtWeightChange, unitSystem } = useUnits();

  const weightChange = stats.currentWeight && stats.previousWeight
    ? getWeightChange(stats.currentWeight, stats.previousWeight)
    : null;

  const bmiCategory = stats.bmi ? getBMICategory(stats.bmi) : null;

  const progressClamped = Math.min(Math.max(stats.progress, 0), 100);

  return (
    <AppLayout>
      <div className="min-h-screen">
        {/* Ambient gradient mesh background */}
        <div className="fixed inset-0 pointer-events-none -z-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#1e3a8a]/8 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#3b82f6]/5 rounded-full blur-[100px]" />
          <div className="absolute top-1/2 left-0 w-64 h-64 bg-[#6366f1]/4 rounded-full blur-[80px]" />
        </div>

        <div className="space-y-8 pb-8">
          {/* Header */}
          <div className="flex items-start justify-between pt-1">
            <div>
              <p className="text-[#5a7299] text-sm font-medium tracking-widest uppercase mb-1">Dashboard</p>
              <h1 className="text-3xl font-bold text-[#e2e8f4] tracking-tight">
                Welcome back, {userName.split(" ")[0]}
              </h1>
              <p className="text-[#3d5278] mt-1 text-sm">Your progress at a glance</p>
            </div>
            <VersionSelector />
          </div>

          {/* Stat Cards Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Current Weight */}
            <div className="group relative bg-[#0c1425]/70 backdrop-blur-sm rounded-2xl border border-[#1e3054]/50 p-5 shadow-xl shadow-[#0a1628]/40 hover:border-[#2563eb]/30 transition-all duration-300">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#2563eb]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full bg-[#3b82f6] shadow-sm shadow-[#3b82f6]/50" />
                  <p className="text-xs text-[#5a7299] font-medium tracking-wider uppercase">Weight</p>
                </div>
                <p className="text-3xl font-bold text-[#e2e8f4] tracking-tight">
                  {stats.currentWeight ? fmtWeight(stats.currentWeight) : "--"}
                </p>
                {weightChange && (
                  <p className={`text-sm font-medium mt-1 ${weightChange.isLoss ? "text-[#34d399]" : "text-[#f87171]"}`}>
                    {weightChange.isLoss ? "-" : "+"}{fmtWeightChange(weightChange.value)}
                  </p>
                )}
              </div>
            </div>

            {/* BMI */}
            <div className="group relative bg-[#0c1425]/70 backdrop-blur-sm rounded-2xl border border-[#1e3054]/50 p-5 shadow-xl shadow-[#0a1628]/40 hover:border-[#6366f1]/30 transition-all duration-300">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#6366f1]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full bg-[#818cf8] shadow-sm shadow-[#818cf8]/50" />
                  <p className="text-xs text-[#5a7299] font-medium tracking-wider uppercase">BMI</p>
                </div>
                <p className="text-3xl font-bold text-[#e2e8f4] tracking-tight">
                  {stats.bmi ? formatWeight(stats.bmi) : "--"}
                </p>
                {bmiCategory && (
                  <p className={`text-sm font-medium mt-1 ${bmiCategory.color}`}>{bmiCategory.label}</p>
                )}
              </div>
            </div>

            {/* Goal Progress */}
            <div className="group relative bg-[#0c1425]/70 backdrop-blur-sm rounded-2xl border border-[#1e3054]/50 p-5 shadow-xl shadow-[#0a1628]/40 hover:border-[#2563eb]/30 transition-all duration-300">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#2563eb]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full bg-[#60a5fa] shadow-sm shadow-[#60a5fa]/50" />
                  <p className="text-xs text-[#5a7299] font-medium tracking-wider uppercase">Goal</p>
                </div>
                <p className="text-3xl font-bold text-[#e2e8f4] tracking-tight">
                  {stats.goalWeight ? `${Math.round(stats.progress)}%` : "--"}
                </p>
                {stats.goalWeight && (
                  <p className="text-sm text-[#5a7299] mt-1">
                    Target: {fmtWeight(stats.goalWeight)}
                  </p>
                )}
              </div>
            </div>

            {/* Total Lost */}
            <div className="group relative bg-[#0c1425]/70 backdrop-blur-sm rounded-2xl border border-[#1e3054]/50 p-5 shadow-xl shadow-[#0a1628]/40 hover:border-[#34d399]/30 transition-all duration-300">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#059669]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full bg-[#34d399] shadow-sm shadow-[#34d399]/50" />
                  <p className="text-xs text-[#5a7299] font-medium tracking-wider uppercase">Lost</p>
                </div>
                <p className={`text-3xl font-bold tracking-tight ${stats.totalLost > 0 ? "text-[#34d399]" : "text-[#e2e8f4]"}`}>
                  {stats.totalLost > 0 ? `-${fmtWeightChange(stats.totalLost)}` : "--"}
                </p>
                {stats.startWeight && (
                  <p className="text-sm text-[#5a7299] mt-1">
                    Started: {fmtWeight(stats.startWeight)}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          {stats.goalWeight && stats.currentWeight && (
            <div className="bg-[#0c1425]/70 backdrop-blur-sm rounded-2xl border border-[#1e3054]/50 p-6 shadow-xl shadow-[#0a1628]/40">
              <div className="flex justify-between items-end mb-4">
                <div>
                  <p className="text-xs text-[#5a7299] font-medium tracking-wider uppercase mb-1">Progress to goal</p>
                  <p className="text-lg font-semibold text-[#e2e8f4]">
                    {fmtWeight(stats.currentWeight)}
                    <span className="text-[#3d5278] mx-2 font-normal">/</span>
                    <span className="text-[#60a5fa]">{fmtWeight(stats.goalWeight)}</span>
                  </p>
                </div>
                <span className="text-2xl font-bold text-[#60a5fa]">{Math.round(progressClamped)}%</span>
              </div>
              <div className="relative h-3 bg-[#0a1220] rounded-full overflow-hidden border border-[#1e3054]/30">
                <div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#2563eb] via-[#3b82f6] to-[#60a5fa] rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${progressClamped}%` }}
                />
                <div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#2563eb]/20 via-[#3b82f6]/30 to-[#60a5fa]/20 rounded-full blur-sm transition-all duration-700 ease-out"
                  style={{ width: `${progressClamped}%` }}
                />
              </div>
            </div>
          )}

          {/* Weight Chart */}
          <div className="bg-[#0c1425]/70 backdrop-blur-sm rounded-2xl border border-[#1e3054]/50 shadow-xl shadow-[#0a1628]/40 overflow-hidden">
            <div className="p-5 border-b border-[#1e3054]/40 flex items-center justify-between">
              <div>
                <p className="text-xs text-[#5a7299] font-medium tracking-wider uppercase mb-1">Analytics</p>
                <h2 className="text-lg font-semibold text-[#e2e8f4]">Weight Trend</h2>
              </div>
              <Link
                href="/history"
                className="text-sm text-[#60a5fa] hover:text-[#93bbfc] font-medium tracking-wide transition-colors"
              >
                View all
              </Link>
            </div>
            <div className="p-5">
              <WeightChart
                data={stats.recentWeights}
                goalWeight={stats.goalWeight}
                height={280}
                unitSystem={unitSystem}
              />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-4">
            <Link href="/log" className="group">
              <div className="relative bg-[#0c1425]/70 backdrop-blur-sm rounded-2xl border border-[#1e3054]/50 p-6 shadow-xl shadow-[#0a1628]/40 hover:border-[#2563eb]/40 transition-all duration-300 h-full flex flex-col items-center justify-center text-center">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#2563eb]/8 to-[#1d4ed8]/3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#2563eb] to-[#1d4ed8] flex items-center justify-center mb-4 shadow-lg shadow-[#2563eb]/20 group-hover:shadow-[#2563eb]/40 transition-shadow duration-300">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <p className="font-semibold text-[#e2e8f4] tracking-wide">Log Weight</p>
                  <p className="text-sm text-[#5a7299] mt-1">Record today&apos;s weight</p>
                </div>
              </div>
            </Link>

            <Link href="/photos" className="group">
              <div className="relative bg-[#0c1425]/70 backdrop-blur-sm rounded-2xl border border-[#1e3054]/50 p-6 shadow-xl shadow-[#0a1628]/40 hover:border-[#6366f1]/40 transition-all duration-300 h-full flex flex-col items-center justify-center text-center">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#6366f1]/8 to-[#4f46e5]/3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#6366f1] to-[#4f46e5] flex items-center justify-center mb-4 shadow-lg shadow-[#6366f1]/20 group-hover:shadow-[#6366f1]/40 transition-shadow duration-300">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <p className="font-semibold text-[#e2e8f4] tracking-wide">Progress Photo</p>
                  <p className="text-sm text-[#5a7299] mt-1">Capture your progress</p>
                </div>
              </div>
            </Link>
          </div>

          {/* Setup Prompts */}
          {(!stats.heightCm || !stats.goalWeight) && (
            <div className="relative bg-[#0c1425]/70 backdrop-blur-sm rounded-2xl border border-[#f59e0b]/20 p-5 shadow-xl shadow-[#0a1628]/40 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-[#f59e0b]/5 to-transparent" />
              <div className="relative flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#f59e0b]/10 border border-[#f59e0b]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-5 h-5 text-[#fbbf24]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-[#e2e8f4] mb-1 tracking-wide">Complete your profile</p>
                  <p className="text-sm text-[#7b8fb5] leading-relaxed">
                    {!stats.heightCm && "Add your height to track BMI. "}
                    {!stats.goalWeight && "Set a goal weight to track progress."}
                  </p>
                  <div className="flex gap-4 mt-3">
                    {!stats.heightCm && (
                      <Link
                        href="/settings"
                        className="text-sm text-[#60a5fa] hover:text-[#93bbfc] font-medium tracking-wide transition-colors"
                      >
                        Go to settings
                      </Link>
                    )}
                    {!stats.goalWeight && (
                      <Link
                        href="/goals"
                        className="text-sm text-[#60a5fa] hover:text-[#93bbfc] font-medium tracking-wide transition-colors"
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
      </div>
    </AppLayout>
  );
}
