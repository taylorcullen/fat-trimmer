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
      <div className="space-y-20">
        {/* Version switcher — flush right, near-invisible */}
        <div className="flex justify-end">
          <VersionSelector className="bg-transparent border-0 text-white/25 rounded-none text-xs tracking-widest" />
        </div>

        {/* Hero weight — massive editorial typography */}
        <section>
          <p className="text-white/35 text-[11px] tracking-[0.3em] uppercase font-light">
            current weight
          </p>
          <p className="text-[clamp(4rem,12vw,8rem)] font-extralight text-white leading-none mt-3 tracking-tighter">
            {stats.currentWeight ? fmtWeight(stats.currentWeight) : "\u2014"}
          </p>
          {weightChange && (
            <p className={`text-base font-light mt-4 tracking-wide ${
              weightChange.isLoss ? "text-white/40" : "text-[#f43f5e]"
            }`}>
              {weightChange.isLoss ? "\u2212" : "+"}
              {fmtWeightChange(weightChange.value)}
              <span className="text-white/35 ml-2">from last entry</span>
            </p>
          )}
        </section>

        {/* Stats — elegant typographic rows, no cards, just hairlines */}
        <section>
          <div className="h-px bg-white/[0.04]" />

          <div className="flex justify-between items-baseline py-6">
            <span className="text-white/35 text-[11px] tracking-[0.3em] uppercase font-light">bmi</span>
            <div className="text-right flex items-baseline gap-4">
              <span className="text-2xl font-extralight text-white tracking-tight">
                {stats.bmi ? formatWeight(stats.bmi) : "\u2014"}
              </span>
              {bmiCategory && (
                <span className="text-[11px] tracking-[0.2em] uppercase text-white/35">{bmiCategory.label}</span>
              )}
            </div>
          </div>

          <div className="h-px bg-white/[0.04]" />

          <div className="flex justify-between items-baseline py-6">
            <span className="text-white/35 text-[11px] tracking-[0.3em] uppercase font-light">goal</span>
            <div className="text-right flex items-baseline gap-4">
              <span className="text-2xl font-extralight text-white tracking-tight">
                {stats.goalWeight ? fmtWeight(stats.goalWeight) : "\u2014"}
              </span>
              {stats.goalWeight && (
                <span className="text-[11px] tracking-[0.2em] text-[#f43f5e]">
                  {Math.round(stats.progress)}%
                </span>
              )}
            </div>
          </div>

          <div className="h-px bg-white/[0.04]" />

          <div className="flex justify-between items-baseline py-6">
            <span className="text-white/35 text-[11px] tracking-[0.3em] uppercase font-light">total lost</span>
            <span className={`text-2xl font-extralight tracking-tight ${
              stats.totalLost > 0 ? "text-white" : "text-white/35"
            }`}>
              {stats.totalLost > 0 ? fmtWeightChange(stats.totalLost) : "\u2014"}
            </span>
          </div>

          <div className="h-px bg-white/[0.04]" />

          <div className="flex justify-between items-baseline py-6">
            <span className="text-white/35 text-[11px] tracking-[0.3em] uppercase font-light">started at</span>
            <span className="text-2xl font-extralight text-white tracking-tight">
              {stats.startWeight ? fmtWeight(stats.startWeight) : "\u2014"}
            </span>
          </div>

          <div className="h-px bg-white/[0.04]" />
        </section>

        {/* Progress — a single thin rose line on void */}
        {stats.goalWeight && stats.currentWeight && (
          <section>
            <div className="flex justify-between items-baseline mb-6">
              <span className="text-white/35 text-[11px] tracking-[0.3em] uppercase font-light">progress</span>
              <span className="text-[11px] tracking-[0.15em] text-white/35 font-light">
                {fmtWeight(stats.currentWeight)}
                <span className="text-white/25 mx-2">/</span>
                {fmtWeight(stats.goalWeight)}
              </span>
            </div>
            <div className="h-px bg-white/[0.04] relative">
              <div
                className="h-px bg-[#f43f5e] absolute top-0 left-0 transition-all duration-[1.5s] ease-out"
                style={{ width: `${Math.min(stats.progress, 100)}%` }}
              />
            </div>
          </section>
        )}

        {/* Trend chart — minimal label above */}
        <section>
          <div className="flex items-baseline justify-between mb-8">
            <span className="text-white/35 text-[11px] tracking-[0.3em] uppercase font-light">trend</span>
            <Link
              href="/history"
              className="text-[11px] tracking-[0.2em] uppercase text-[#f43f5e] hover:text-[#f43f5e]/70 transition-colors"
            >
              view all
            </Link>
          </div>
          <WeightChart
            data={stats.recentWeights}
            goalWeight={stats.goalWeight}
            height={180}
            unitSystem={unitSystem}
          />
        </section>

        {/* Actions — text-only, editorial spacing */}
        <section className="flex gap-10">
          <Link
            href="/log"
            className="text-[11px] tracking-[0.3em] uppercase text-[#f43f5e] hover:text-[#f43f5e]/70 transition-colors"
          >
            log weight
          </Link>
          <Link
            href="/photos"
            className="text-[11px] tracking-[0.3em] uppercase text-white/35 hover:text-white/50 transition-colors"
          >
            progress photo
          </Link>
        </section>

        {/* Setup prompts — whisper-quiet, separated by hairline */}
        {(!stats.heightCm || !stats.goalWeight) && (
          <section className="pt-10">
            <div className="h-px bg-white/[0.04] mb-10" />
            <p className="text-white/35 text-[13px] font-light leading-relaxed">
              {!stats.heightCm && (
                <>
                  Add your height in{" "}
                  <Link
                    href="/settings"
                    className="text-[#f43f5e] hover:text-[#f43f5e]/70 transition-colors"
                  >
                    settings
                  </Link>{" "}
                  to track BMI.{" "}
                </>
              )}
              {!stats.goalWeight && (
                <>
                  Set a{" "}
                  <Link
                    href="/goals"
                    className="text-[#f43f5e] hover:text-[#f43f5e]/70 transition-colors"
                  >
                    goal
                  </Link>{" "}
                  to track progress.
                </>
              )}
            </p>
          </section>
        )}
      </div>
    </V3Shell>
  );
}
