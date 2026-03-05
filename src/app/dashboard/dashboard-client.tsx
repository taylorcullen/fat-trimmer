"use client";

import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WeightChart } from "@/components/charts/weight-chart";
import { formatWeight, getBMICategory, getWeightChange } from "@/lib/utils";
import { useUnits } from "@/lib/unit-context";
import { VersionSelector } from "@/components/ui/version-selector";
import Link from "next/link";

interface DashboardClientProps {
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

export function DashboardClient({ stats, userName }: DashboardClientProps) {
  const { formatWeight: fmtWeight, formatWeightChange: fmtWeightChange, unitSystem } = useUnits();

  const weightChange = stats.currentWeight && stats.previousWeight
    ? getWeightChange(stats.currentWeight, stats.previousWeight)
    : null;

  const bmiCategory = stats.bmi ? getBMICategory(stats.bmi) : null;

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">
              Welcome back, {userName.split(" ")[0]}
            </h1>
            <p className="text-slate-400">Here&apos;s your progress overview</p>
          </div>
          <VersionSelector />
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-4">
              <p className="text-sm text-slate-400">Current Weight</p>
              <p className="text-2xl font-bold text-white">
                {stats.currentWeight ? fmtWeight(stats.currentWeight) : "--"}
              </p>
              {weightChange && (
                <p className={`text-sm ${weightChange.isLoss ? "text-green-400" : "text-red-400"}`}>
                  {weightChange.isLoss ? "-" : "+"}{fmtWeightChange(weightChange.value)}
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4">
              <p className="text-sm text-slate-400">BMI</p>
              <p className="text-2xl font-bold text-white">
                {stats.bmi ? formatWeight(stats.bmi) : "--"}
              </p>
              {bmiCategory && (
                <p className={`text-sm ${bmiCategory.color}`}>{bmiCategory.label}</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4">
              <p className="text-sm text-slate-400">Goal Progress</p>
              <p className="text-2xl font-bold text-white">
                {stats.goalWeight ? `${Math.round(stats.progress)}%` : "--"}
              </p>
              {stats.goalWeight && (
                <p className="text-sm text-slate-400">
                  Target: {fmtWeight(stats.goalWeight)}
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4">
              <p className="text-sm text-slate-400">Total Lost</p>
              <p className={`text-2xl font-bold ${stats.totalLost > 0 ? "text-green-400" : "text-white"}`}>
                {stats.totalLost > 0 ? `-${fmtWeightChange(stats.totalLost)}` : "--"}
              </p>
              {stats.startWeight && (
                <p className="text-sm text-slate-400">
                  Started: {fmtWeight(stats.startWeight)}
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Progress Bar */}
        {stats.goalWeight && stats.currentWeight && (
          <Card>
            <CardContent className="pt-4">
              <div className="flex justify-between mb-2">
                <span className="text-sm text-slate-400">Progress to goal</span>
                <span className="text-sm text-white font-medium">
                  {fmtWeight(stats.currentWeight)} / {fmtWeight(stats.goalWeight)}
                </span>
              </div>
              <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-primary transition-all duration-500"
                  style={{ width: `${Math.min(stats.progress, 100)}%` }}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Weight Chart */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Weight Trend</CardTitle>
              <Link href="/history" className="text-sm text-primary-400 hover:underline">
                View all
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <WeightChart
              data={stats.recentWeights}
              goalWeight={stats.goalWeight}
              height={250}
              unitSystem={unitSystem}
            />
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Link href="/log">
            <Card className="hover:border-primary-500 transition-colors cursor-pointer h-full">
              <CardContent className="pt-4 flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center mb-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <p className="font-medium text-white">Log Weight</p>
                <p className="text-sm text-slate-400">Record today&apos;s weight</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/photos">
            <Card className="hover:border-primary-500 transition-colors cursor-pointer h-full">
              <CardContent className="pt-4 flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <p className="font-medium text-white">Progress Photo</p>
                <p className="text-sm text-slate-400">Capture your progress</p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Setup Prompts */}
        {(!stats.heightCm || !stats.goalWeight) && (
          <Card className="border-yellow-500/50 bg-yellow-500/10">
            <CardContent className="pt-4">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-yellow-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                  <p className="font-medium text-white">Complete your profile</p>
                  <p className="text-sm text-slate-300">
                    {!stats.heightCm && "Add your height to track BMI. "}
                    {!stats.goalWeight && "Set a goal weight to track progress."}
                  </p>
                  {!stats.heightCm && (
                    <Link href="/settings" className="text-sm text-primary-400 hover:underline mt-1 inline-block">
                      Go to settings
                    </Link>
                  )}
                  {!stats.goalWeight && (
                    <Link href="/goals" className="text-sm text-primary-400 hover:underline mt-1 inline-block ml-2">
                      Set a goal
                    </Link>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
