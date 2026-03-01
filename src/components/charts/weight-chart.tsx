"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { formatDateShort } from "@/lib/utils";
import { type UnitSystem, formatWeightDisplay, kgToLbs, kgToStoneLbs } from "@/lib/units";

interface WeightChartProps {
  data: Array<{
    date: Date | string;
    weightKg: number;
  }>;
  goalWeight?: number | null;
  height?: number;
  unitSystem?: UnitSystem;
}

function chartValue(kg: number, unitSystem: UnitSystem): number {
  if (unitSystem === "imperial") {
    return Math.round(kgToLbs(kg) * 10) / 10;
  }
  return kg;
}

function chartUnit(unitSystem: UnitSystem): string {
  return unitSystem === "imperial" ? "lb" : "kg";
}

export function WeightChart({ data, goalWeight, height = 300, unitSystem = "metric" }: WeightChartProps) {
  const chartData = [...data]
    .reverse()
    .map((entry) => ({
      date: formatDateShort(entry.date),
      weight: chartValue(entry.weightKg, unitSystem),
    }));

  if (chartData.length === 0) {
    return (
      <div
        className="flex items-center justify-center bg-slate-700/50 rounded-lg"
        style={{ height }}
      >
        <p className="text-slate-400">No data to display</p>
      </div>
    );
  }

  const weights = chartData.map((d) => d.weight);
  const goalDisplay = goalWeight ? chartValue(goalWeight, unitSystem) : null;
  const minWeight = Math.min(...weights, goalDisplay || Infinity);
  const maxWeight = Math.max(...weights);
  const padding = (maxWeight - minWeight) * 0.1 || 5;
  const unit = chartUnit(unitSystem);

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
        <XAxis
          dataKey="date"
          stroke="#94a3b8"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#94a3b8"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          domain={[minWeight - padding, maxWeight + padding]}
          tickFormatter={(value) => `${value}`}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "#1e293b",
            border: "1px solid #334155",
            borderRadius: "8px",
            color: "#fff",
          }}
          formatter={(value: number) => {
            if (unitSystem === "imperial") {
              // Show both lbs and stone/lbs in tooltip
              const stLb = kgToStoneLbs(value / 2.20462);
              return [`${value.toFixed(1)} ${unit} (${stLb.stone}st ${Math.round(stLb.lbs)}lb)`, "Weight"];
            }
            return [`${value.toFixed(1)} ${unit}`, "Weight"];
          }}
        />
        {goalDisplay && (
          <ReferenceLine
            y={goalDisplay}
            stroke="#22c55e"
            strokeDasharray="5 5"
            label={{
              value: goalWeight ? `Goal: ${formatWeightDisplay(goalWeight, unitSystem)}` : "",
              fill: "#22c55e",
              fontSize: 12,
              position: "right",
            }}
          />
        )}
        <Line
          type="monotone"
          dataKey="weight"
          stroke="url(#gradient)"
          strokeWidth={2}
          dot={{ fill: "#8B5CF6", strokeWidth: 0, r: 4 }}
          activeDot={{ fill: "#8B5CF6", strokeWidth: 2, stroke: "#fff", r: 6 }}
        />
        <defs>
          <linearGradient id="gradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#3B82F6" />
          </linearGradient>
        </defs>
      </LineChart>
    </ResponsiveContainer>
  );
}
