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
      <div className="space-y-6">
        <div className="flex items-start justify-between border-b border-[#2a2a4a] pb-4">
          <div>
            <h2 className="text-xl font-bold text-[#f0a500]">Dashboard</h2>
            <p className="text-sm text-slate-400">Welcome back, {userName.split(" ")[0]}</p>
          </div>
          <VersionSelector className="bg-[#16213e] border-[#2a2a4a] text-slate-300" />
        </div>

        {/* Stats Table */}
        <div className="bg-[#16213e] border border-[#2a2a4a] rounded-md overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2a2a4a] bg-[#0f1a2e]">
                <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 py-3">Metric</th>
                <th className="text-right text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 py-3">Value</th>
                <th className="text-right text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 py-3">Detail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a2a4a]">
              <tr>
                <td className="px-4 py-3 text-sm text-slate-300">Current Weight</td>
                <td className="px-4 py-3 text-sm text-right font-mono text-white">
                  {stats.currentWeight ? fmtWeight(stats.currentWeight) : "--"}
                </td>
                <td className="px-4 py-3 text-sm text-right">
                  {weightChange && (
                    <span className={weightChange.isLoss ? "text-green-400" : "text-red-400"}>
                      {weightChange.isLoss ? "-" : "+"}{fmtWeightChange(weightChange.value)}
                    </span>
                  )}
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm text-slate-300">BMI</td>
                <td className="px-4 py-3 text-sm text-right font-mono text-white">
                  {stats.bmi ? formatWeight(stats.bmi) : "--"}
                </td>
                <td className="px-4 py-3 text-sm text-right">
                  {bmiCategory && (
                    <span className={bmiCategory.color}>{bmiCategory.label}</span>
                  )}
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm text-slate-300">Goal Weight</td>
                <td className="px-4 py-3 text-sm text-right font-mono text-white">
                  {stats.goalWeight ? fmtWeight(stats.goalWeight) : "--"}
                </td>
                <td className="px-4 py-3 text-sm text-right text-slate-400">
                  {stats.goalWeight ? `${Math.round(stats.progress)}% complete` : "Not set"}
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm text-slate-300">Total Lost</td>
                <td className="px-4 py-3 text-sm text-right font-mono text-white">
                  {stats.totalLost > 0 ? fmtWeightChange(stats.totalLost) : "--"}
                </td>
                <td className="px-4 py-3 text-sm text-right text-slate-400">
                  {stats.startWeight ? `Started: ${fmtWeight(stats.startWeight)}` : ""}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Progress Bar */}
        {stats.goalWeight && stats.currentWeight && (
          <div className="bg-[#16213e] border border-[#2a2a4a] rounded-md p-4">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-slate-400">Progress to Goal</span>
              <span className="text-sm font-mono text-white">
                {fmtWeight(stats.currentWeight)} / {fmtWeight(stats.goalWeight)}
              </span>
            </div>
            <div className="h-4 bg-[#0f1a2e] rounded-sm border border-[#2a2a4a] overflow-hidden">
              <div
                className="h-full bg-[#f0a500] transition-all duration-500"
                style={{ width: `${Math.min(stats.progress, 100)}%` }}
              />
            </div>
          </div>
        )}

        {/* Weight Chart */}
        <div className="bg-[#16213e] border border-[#2a2a4a] rounded-md p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-[#f0a500] uppercase tracking-wider">Weight Trend</h3>
            <Link href="/history" className="text-sm text-[#f0a500] hover:underline">
              View all →
            </Link>
          </div>
          <WeightChart
            data={stats.recentWeights}
            goalWeight={stats.goalWeight}
            height={250}
            unitSystem={unitSystem}
          />
        </div>

        {/* Quick Actions */}
        <div className="flex gap-3">
          <Link
            href="/log"
            className="flex-1 bg-[#f0a500] text-[#16213e] font-medium text-sm text-center py-2.5 px-4 rounded-md hover:bg-[#cf9f00] transition-colors"
          >
            Log Weight
          </Link>
          <Link
            href="/photos"
            className="flex-1 bg-[#16213e] border border-[#2a2a4a] text-slate-300 font-medium text-sm text-center py-2.5 px-4 rounded-md hover:bg-[#2a2a4a] transition-colors"
          >
            Progress Photo
          </Link>
        </div>

        {/* Setup Prompts */}
        {(!stats.heightCm || !stats.goalWeight) && (
          <div className="bg-[#2a2a1a] border border-[#f0a500]/30 rounded-md p-4">
            <p className="text-sm font-medium text-[#f0a500]">Complete your profile</p>
            <p className="text-sm text-slate-300 mt-1">
              {!stats.heightCm && "Add your height to track BMI. "}
              {!stats.goalWeight && "Set a goal weight to track progress."}
            </p>
            <div className="flex gap-3 mt-2">
              {!stats.heightCm && (
                <Link href="/settings" className="text-sm text-[#f0a500] hover:underline">Settings →</Link>
              )}
              {!stats.goalWeight && (
                <Link href="/goals" className="text-sm text-[#f0a500] hover:underline">Set goal →</Link>
              )}
            </div>
          </div>
        )}
      </div>
    </V1Shell>
  );
}
