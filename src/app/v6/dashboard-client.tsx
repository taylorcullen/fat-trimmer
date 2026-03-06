"use client";

import { V6Shell } from "@/components/layout/shells/v6-shell";
import { WeightChart } from "@/components/charts/weight-chart";
import { formatWeight, getBMICategory, getWeightChange } from "@/lib/utils";
import { useUnits } from "@/lib/unit-context";
import { VersionSelector } from "@/components/ui/version-selector";
import { DashboardStats } from "@/types";
import Link from "next/link";

interface V6DashboardClientProps {
  stats: DashboardStats;
  userName: string;
}

export function V6DashboardClient({ stats, userName }: V6DashboardClientProps) {
  const { formatWeight: fmtWeight, formatWeightChange: fmtWeightChange, unitSystem } = useUnits();

  const weightChange = stats.currentWeight && stats.previousWeight
    ? getWeightChange(stats.currentWeight, stats.previousWeight)
    : null;

  const bmiCategory = stats.bmi ? getBMICategory(stats.bmi) : null;

  return (
    <V6Shell>
      <div className="space-y-8">

        {/* ---- HEADER ---- */}
        <div className="flex items-end justify-between border-b-4 border-black pb-5">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-black/50 mb-1">
              Overview
            </p>
            <h2 className="text-4xl font-black uppercase tracking-tight text-black leading-none">
              DASHBOARD
            </h2>
            <p className="text-sm font-bold text-black/60 mt-2 uppercase tracking-wider">
              Welcome back, <span className="text-[#ff3864]">{userName.split(" ")[0]}</span>
            </p>
          </div>
          <VersionSelector className="bg-white border-2 border-black text-black font-black text-xs uppercase tracking-wider shadow-[3px_3px_0_0_black] rounded-none" />
        </div>

        {/* ---- STAT CARDS ---- */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Current Weight */}
          <div className="bg-white border-2 border-black p-4 shadow-[4px_4px_0_0_black]">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-black/50 mb-2">
              CURRENT
            </p>
            <p className="text-3xl font-black text-black tracking-tight">
              {stats.currentWeight ? fmtWeight(stats.currentWeight) : "--"}
            </p>
            {weightChange && (
              <p className={`text-xs font-black mt-2 uppercase ${weightChange.isLoss ? "text-[#00a86b]" : "text-[#ff3864]"}`}>
                {weightChange.isLoss ? "DOWN" : "UP"} {fmtWeightChange(weightChange.value)}
              </p>
            )}
          </div>

          {/* BMI */}
          <div className="bg-white border-2 border-black p-4 shadow-[4px_4px_0_0_black]">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-black/50 mb-2">
              BMI
            </p>
            <p className="text-3xl font-black text-black tracking-tight">
              {stats.bmi ? formatWeight(stats.bmi) : "--"}
            </p>
            {bmiCategory && (
              <p className={`text-xs font-black mt-2 uppercase ${bmiCategory.lightColor}`}>{bmiCategory.label}</p>
            )}
          </div>

          {/* Goal Weight */}
          <div className="bg-white border-2 border-black p-4 shadow-[4px_4px_0_0_black]">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-black/50 mb-2">
              TARGET
            </p>
            <p className="text-3xl font-black text-black tracking-tight">
              {stats.goalWeight ? fmtWeight(stats.goalWeight) : "--"}
            </p>
            <p className="text-xs font-black mt-2 uppercase text-black/50">
              {stats.goalWeight ? `${Math.round(stats.progress)}% done` : "Not set"}
            </p>
          </div>

          {/* Total Lost */}
          <div className="bg-[#ffdb58] border-2 border-black p-4 shadow-[4px_4px_0_0_black]">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-black/60 mb-2">
              TOTAL LOST
            </p>
            <p className="text-3xl font-black text-black tracking-tight">
              {stats.totalLost > 0 ? fmtWeightChange(stats.totalLost) : "--"}
            </p>
            <p className="text-xs font-black mt-2 uppercase text-black/60">
              {stats.startWeight ? `From ${fmtWeight(stats.startWeight)}` : ""}
            </p>
          </div>
        </div>

        {/* ---- PROGRESS BAR ---- */}
        {stats.goalWeight && stats.currentWeight && (
          <div className="bg-white border-2 border-black p-5 shadow-[4px_4px_0_0_black]">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-black/50">
                PROGRESS
              </p>
              <p className="text-sm font-black text-black uppercase tracking-wider">
                {fmtWeight(stats.currentWeight)}
                <span className="text-black/30 mx-2">/</span>
                {fmtWeight(stats.goalWeight)}
              </p>
            </div>
            {/* Thick brutalist progress bar */}
            <div className="relative h-8 bg-[#f5f5f0] border-2 border-black overflow-hidden">
              {/* Fill -- solid black block */}
              <div
                className="absolute inset-y-0 left-0 bg-black transition-all duration-500"
                style={{ width: `${Math.min(stats.progress, 100)}%` }}
              />
              {/* Percentage label */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={`text-xs font-black uppercase tracking-widest ${
                  stats.progress > 50 ? "text-[#ffdb58]" : "text-black"
                }`}>
                  {Math.round(stats.progress)}%
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ---- WEIGHT CHART ---- */}
        <div className="bg-white border-2 border-black p-5 shadow-[4px_4px_0_0_black]">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-black">
              WEIGHT TREND
            </h3>
            <Link
              href="/history"
              className="text-[10px] font-black uppercase tracking-[0.15em] text-black bg-[#ffdb58] border-2 border-black px-3 py-1 shadow-[2px_2px_0_0_black] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-100"
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

        {/* ---- QUICK ACTIONS ---- */}
        <div className="grid grid-cols-2 gap-4">
          <Link
            href="/log"
            className="bg-black text-[#ffdb58] font-black text-sm text-center uppercase tracking-[0.2em] py-5 px-6 border-2 border-black shadow-[4px_4px_0_0_#ffdb58] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all duration-100"
          >
            LOG WEIGHT
          </Link>
          <Link
            href="/photos"
            className="bg-[#ff3864] text-white font-black text-sm text-center uppercase tracking-[0.2em] py-5 px-6 border-2 border-black shadow-[4px_4px_0_0_black] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all duration-100"
          >
            PROGRESS PHOTO
          </Link>
        </div>

        {/* ---- SETUP PROMPTS ---- */}
        {(!stats.heightCm || !stats.goalWeight) && (
          <div className="bg-[#ffdb58] border-2 border-black p-5 shadow-[4px_4px_0_0_black]">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-black mb-2">
              ACTION REQUIRED
            </p>
            <p className="text-sm font-bold text-black/70 leading-relaxed">
              {!stats.heightCm && "Add your height to enable BMI tracking. "}
              {!stats.goalWeight && "Set a target weight to track your progress."}
            </p>
            <div className="flex gap-4 mt-4">
              {!stats.heightCm && (
                <Link
                  href="/settings"
                  className="text-xs font-black uppercase tracking-[0.15em] bg-black text-[#ffdb58] px-4 py-2 border-2 border-black shadow-[2px_2px_0_0_black] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-100"
                >
                  SETTINGS
                </Link>
              )}
              {!stats.goalWeight && (
                <Link
                  href="/goals"
                  className="text-xs font-black uppercase tracking-[0.15em] bg-black text-[#ffdb58] px-4 py-2 border-2 border-black shadow-[2px_2px_0_0_black] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-100"
                >
                  SET TARGET
                </Link>
              )}
            </div>
          </div>
        )}

      </div>
    </V6Shell>
  );
}
