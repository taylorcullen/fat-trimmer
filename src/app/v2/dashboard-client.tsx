"use client";

import { V2Layout } from "./v2-layout";
import { WeightChart } from "@/components/charts/weight-chart";
import { formatWeight, getBMICategory, getWeightChange } from "@/lib/utils";
import { useUnits } from "@/lib/unit-context";
import { VersionSelector } from "@/components/ui/version-selector";
import Link from "next/link";

interface V2DashboardClientProps {
  stats: {
    currentWeight: number | null;
    previousWeight: number | null;
    startWeight: number | null;
    goalWeight: number | null;
    bmi: number | null;
    progress: number;
    totalLost: number;
    heightCm: number | null;
    recentWeights: Array<{
      id: string;
      weightKg: number;
      date: Date;
      notes: string | null;
    }>;
  };
  userName: string;
}

function ProgressRing({ progress, size = 80, strokeWidth = 6 }: { progress: number; size?: number; strokeWidth?: number }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (Math.min(progress, 100) / 100) * circumference;

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="rgba(255,255,255,0.05)"
        strokeWidth={strokeWidth}
        fill="none"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="url(#tealGradient)"
        strokeWidth={strokeWidth}
        fill="none"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        className="transition-all duration-1000 ease-out"
      />
      <defs>
        <linearGradient id="tealGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#14b8a6" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function V2DashboardClient({ stats, userName }: V2DashboardClientProps) {
  const { formatWeight: fmtWeight, formatWeightChange: fmtWeightChange, unitSystem } = useUnits();

  const weightChange = stats.currentWeight && stats.previousWeight
    ? getWeightChange(stats.currentWeight, stats.previousWeight)
    : null;

  const bmiCategory = stats.bmi ? getBMICategory(stats.bmi) : null;

  return (
    <V2Layout>
      <div className="space-y-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">
              Welcome back, <span className="bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">{userName.split(" ")[0]}</span>
            </h1>
            <p className="text-slate-500 mt-1">Here&apos;s your progress overview</p>
          </div>
          <VersionSelector className="bg-white/5 border-white/10 text-slate-400 rounded-xl" />
        </div>

        {/* Glassmorphic Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-5 hover:scale-[1.02] hover:bg-white/[0.07] transition-all duration-300 hover:shadow-lg hover:shadow-teal-500/5">
            <p className="text-xs text-slate-500 uppercase tracking-wider">Current Weight</p>
            <p className="text-2xl font-bold text-white mt-2">
              {stats.currentWeight ? fmtWeight(stats.currentWeight) : "--"}
            </p>
            {weightChange && (
              <p className={`text-sm mt-1 ${weightChange.isLoss ? "text-emerald-400" : "text-red-400"}`}>
                {weightChange.isLoss ? "-" : "+"}{fmtWeightChange(weightChange.value)}
              </p>
            )}
          </div>

          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-5 hover:scale-[1.02] hover:bg-white/[0.07] transition-all duration-300 hover:shadow-lg hover:shadow-teal-500/5">
            <p className="text-xs text-slate-500 uppercase tracking-wider">BMI</p>
            <p className="text-2xl font-bold text-white mt-2">
              {stats.bmi ? formatWeight(stats.bmi) : "--"}
            </p>
            {bmiCategory && (
              <p className={`text-sm mt-1 ${bmiCategory.color}`}>{bmiCategory.label}</p>
            )}
          </div>

          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-5 hover:scale-[1.02] hover:bg-white/[0.07] transition-all duration-300 hover:shadow-lg hover:shadow-teal-500/5">
            <p className="text-xs text-slate-500 uppercase tracking-wider">Goal Progress</p>
            <div className="flex items-center gap-3 mt-2">
              {stats.goalWeight ? (
                <>
                  <ProgressRing progress={stats.progress} size={48} strokeWidth={4} />
                  <div>
                    <p className="text-xl font-bold text-white">{Math.round(stats.progress)}%</p>
                    <p className="text-xs text-slate-500">{fmtWeight(stats.goalWeight)}</p>
                  </div>
                </>
              ) : (
                <p className="text-2xl font-bold text-white">--</p>
              )}
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-5 hover:scale-[1.02] hover:bg-white/[0.07] transition-all duration-300 hover:shadow-lg hover:shadow-teal-500/5">
            <p className="text-xs text-slate-500 uppercase tracking-wider">Total Lost</p>
            <p className={`text-2xl font-bold mt-2 ${stats.totalLost > 0 ? "text-emerald-400" : "text-white"}`}>
              {stats.totalLost > 0 ? `-${fmtWeightChange(stats.totalLost)}` : "--"}
            </p>
            {stats.startWeight && (
              <p className="text-xs text-slate-500 mt-1">Started: {fmtWeight(stats.startWeight)}</p>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        {stats.goalWeight && stats.currentWeight && (
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-5">
            <div className="flex justify-between mb-3">
              <span className="text-sm text-slate-400">Progress to goal</span>
              <span className="text-sm text-white font-medium">
                {fmtWeight(stats.currentWeight)} / {fmtWeight(stats.goalWeight)}
              </span>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-teal-500 to-cyan-400 rounded-full transition-all duration-1000"
                style={{ width: `${Math.min(stats.progress, 100)}%` }}
              />
            </div>
          </div>
        )}

        {/* Weight Chart */}
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Weight Trend</h3>
            <Link href="/history" className="text-sm text-teal-400 hover:text-teal-300 transition-colors">
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

        {/* Floating Action Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <Link href="/log">
            <div className="bg-gradient-to-r from-teal-500/20 to-emerald-500/20 border border-teal-500/30 rounded-2xl p-5 hover:scale-[1.02] transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-teal-500/10">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center mb-3">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <p className="font-medium text-white">Log Weight</p>
              <p className="text-sm text-slate-500 mt-0.5">Record today&apos;s weight</p>
            </div>
          </Link>

          <Link href="/photos">
            <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-2xl p-5 hover:scale-[1.02] transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-cyan-500/10">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center mb-3">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <p className="font-medium text-white">Progress Photo</p>
              <p className="text-sm text-slate-500 mt-0.5">Capture your progress</p>
            </div>
          </Link>
        </div>

        {/* Setup Prompts */}
        {(!stats.heightCm || !stats.goalWeight) && (
          <div className="bg-amber-500/10 backdrop-blur-lg border border-amber-500/20 rounded-2xl p-5">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-white">Complete your profile</p>
                <p className="text-sm text-slate-400 mt-0.5">
                  {!stats.heightCm && "Add your height to track BMI. "}
                  {!stats.goalWeight && "Set a goal weight to track progress."}
                </p>
                <div className="flex gap-3 mt-2">
                  {!stats.heightCm && (
                    <Link href="/settings" className="text-sm text-teal-400 hover:text-teal-300 transition-colors">Go to settings</Link>
                  )}
                  {!stats.goalWeight && (
                    <Link href="/goals" className="text-sm text-teal-400 hover:text-teal-300 transition-colors">Set a goal</Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </V2Layout>
  );
}
