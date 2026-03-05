"use client";

import { V3Shell } from "@/components/layout/shells/v3-shell";
import { WeightChart } from "@/components/charts/weight-chart";
import { formatWeight, getBMICategory, getWeightChange } from "@/lib/utils";
import { useUnits } from "@/lib/unit-context";
import { VersionSelector } from "@/components/ui/version-selector";
import { DashboardStats } from "@/types";
import Link from "next/link";

interface V3DashboardClientProps {
  stats: DashboardStats;
  userName: string;
}

export function V3DashboardClient({ stats, userName }: V3DashboardClientProps) {
  const { formatWeight: fmtWeight, formatWeightChange: fmtWeightChange, unitSystem } = useUnits();

  const weightChange = stats.currentWeight && stats.previousWeight
    ? getWeightChange(stats.currentWeight, stats.previousWeight)
    : null;

  const bmiCategory = stats.bmi ? getBMICategory(stats.bmi) : null;

  return (
    <V3Shell>
      <div className="space-y-16">
        {/* Version switcher */}
        <div className="flex justify-end">
          <VersionSelector className="bg-transparent border-white/5 text-white/20 rounded-none" />
        </div>

        {/* Hero stat */}
        <div>
          <p className="text-white/20 text-sm tracking-widest uppercase">current weight</p>
          <p className="text-6xl font-bold text-white mt-2 tracking-tight">
            {stats.currentWeight ? fmtWeight(stats.currentWeight) : "--"}
          </p>
          {weightChange && (
            <p className={`text-lg mt-2 ${weightChange.isLoss ? "text-emerald-500" : "text-[#f43f5e]"}`}>
              {weightChange.isLoss ? "-" : "+"}{fmtWeightChange(weightChange.value)} from last entry
            </p>
          )}
        </div>

        {/* Stats - minimal divider style */}
        <div className="space-y-0">
          <div className="flex justify-between items-baseline py-5 border-t border-white/5">
            <span className="text-white/20 text-sm">BMI</span>
            <div className="text-right">
              <span className="text-xl font-medium text-white">
                {stats.bmi ? formatWeight(stats.bmi) : "--"}
              </span>
              {bmiCategory && (
                <span className={`text-sm ml-3 ${bmiCategory.color}`}>{bmiCategory.label}</span>
              )}
            </div>
          </div>

          <div className="flex justify-between items-baseline py-5 border-t border-white/5">
            <span className="text-white/20 text-sm">goal</span>
            <div className="text-right">
              <span className="text-xl font-medium text-white">
                {stats.goalWeight ? fmtWeight(stats.goalWeight) : "--"}
              </span>
              {stats.goalWeight && (
                <span className="text-sm text-white/20 ml-3">{Math.round(stats.progress)}%</span>
              )}
            </div>
          </div>

          <div className="flex justify-between items-baseline py-5 border-t border-white/5">
            <span className="text-white/20 text-sm">total lost</span>
            <span className={`text-xl font-medium ${stats.totalLost > 0 ? "text-emerald-500" : "text-white"}`}>
              {stats.totalLost > 0 ? fmtWeightChange(stats.totalLost) : "--"}
            </span>
          </div>

          <div className="flex justify-between items-baseline py-5 border-t border-white/5 border-b border-b-white/5">
            <span className="text-white/20 text-sm">started at</span>
            <span className="text-xl font-medium text-white">
              {stats.startWeight ? fmtWeight(stats.startWeight) : "--"}
            </span>
          </div>
        </div>

        {/* Progress - thin line */}
        {stats.goalWeight && stats.currentWeight && (
          <div>
            <div className="flex justify-between mb-3">
              <span className="text-white/20 text-sm">progress</span>
              <span className="text-sm text-white/40">
                {fmtWeight(stats.currentWeight)} / {fmtWeight(stats.goalWeight)}
              </span>
            </div>
            <div className="h-px bg-white/5 relative">
              <div
                className="h-px bg-[#f43f5e] absolute top-0 left-0 transition-all duration-1000"
                style={{ width: `${Math.min(stats.progress, 100)}%` }}
              />
            </div>
          </div>
        )}

        {/* Weight Chart */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <span className="text-white/20 text-sm tracking-widest uppercase">trend</span>
            <Link href="/history" className="text-sm text-[#f43f5e] hover:underline underline-offset-4">
              view all
            </Link>
          </div>
          <WeightChart
            data={stats.recentWeights}
            goalWeight={stats.goalWeight}
            height={200}
            unitSystem={unitSystem}
          />
        </div>

        {/* Actions - simple text links */}
        <div className="flex gap-8">
          <Link href="/log" className="text-[#f43f5e] hover:underline underline-offset-4 text-sm">
            log weight
          </Link>
          <Link href="/photos" className="text-white/30 hover:text-white/60 hover:underline underline-offset-4 text-sm">
            progress photo
          </Link>
        </div>

        {/* Setup prompt */}
        {(!stats.heightCm || !stats.goalWeight) && (
          <div className="border-t border-white/5 pt-8">
            <p className="text-white/20 text-sm">
              {!stats.heightCm && (
                <>add your height in <Link href="/settings" className="text-[#f43f5e] hover:underline underline-offset-4">settings</Link> to track BMI. </>
              )}
              {!stats.goalWeight && (
                <>set a <Link href="/goals" className="text-[#f43f5e] hover:underline underline-offset-4">goal</Link> to track progress.</>
              )}
            </p>
          </div>
        )}
      </div>
    </V3Shell>
  );
}
