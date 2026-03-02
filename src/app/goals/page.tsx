"use client";

import { useEffect, useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { calculateProgress } from "@/lib/utils";
import { useUnits } from "@/lib/unit-context";
import { kgToStoneLbs, stoneLbsToKg } from "@/lib/units";
import { GoalEntry } from "@/types";

interface WeightRecord {
  weightKg: number;
  date: string;
}

type GoalStatus = "active" | "achieved" | "superseded";

function getGoalStatus(
  goal: GoalEntry,
  index: number,
  weights: WeightRecord[]
): GoalStatus {
  if (index === 0) return "active";

  const goalDate = new Date(goal.createdAt).getTime();
  const achieved = weights.some(
    (w) =>
      new Date(w.date).getTime() >= goalDate && w.weightKg <= goal.targetWeightKg
  );

  return achieved ? "achieved" : "superseded";
}

const statusConfig = {
  active: { label: "Active", className: "bg-green-500/20 text-green-400 border-green-500/30" },
  achieved: { label: "Achieved", className: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  superseded: { label: "Superseded", className: "bg-slate-500/20 text-slate-400 border-slate-500/30" },
};

export default function GoalsPage() {
  const [goals, setGoals] = useState<GoalEntry[]>([]);
  const [weights, setWeights] = useState<WeightRecord[]>([]);
  const [currentWeight, setCurrentWeight] = useState<number | null>(null);
  const [startWeight, setStartWeight] = useState<number | null>(null);
  const { formatWeight: fmtWeight, formatWeightChange: fmtWeightChange, unitSystem } = useUnits();
  const [isLoading, setIsLoading] = useState(true);
  const [goalInput, setGoalInput] = useState("");
  const [goalStone, setGoalStone] = useState("");
  const [goalLbs, setGoalLbs] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const [goalsRes, weightsRes] = await Promise.all([
        fetch("/api/goals"),
        fetch("/api/weights?limit=100"),
      ]);

      const { goals: goalsData } = await goalsRes.json();
      const { weights: weightsData } = await weightsRes.json();

      setGoals(goalsData);
      setWeights(weightsData);

      const sortedWeights = [...weightsData].sort(
        (a: WeightRecord, b: WeightRecord) =>
          new Date(a.date).getTime() - new Date(b.date).getTime()
      );

      setCurrentWeight(weightsData[0]?.weightKg || null);
      setStartWeight(sortedWeights[0]?.weightKg || null);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    let targetWeightKg: number;
    if (unitSystem === "imperial") {
      if (!goalStone && !goalLbs) {
        setIsSaving(false);
        return;
      }
      targetWeightKg = stoneLbsToKg(parseFloat(goalStone) || 0, parseFloat(goalLbs) || 0);
    } else {
      if (!goalInput) {
        setIsSaving(false);
        return;
      }
      targetWeightKg = parseFloat(goalInput);
    }

    try {
      const response = await fetch("/api/goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetWeightKg }),
      });

      if (response.ok) {
        setGoalInput("");
        setGoalStone("");
        setGoalLbs("");
        fetchData();
      }
    } catch (error) {
      console.error("Failed to create goal:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteGoal = async (id: string) => {
    setDeletingId(id);
    try {
      const response = await fetch(`/api/goals/${id}`, { method: "DELETE" });
      if (response.ok) {
        fetchData();
      }
    } catch (error) {
      console.error("Failed to delete goal:", error);
    } finally {
      setDeletingId(null);
    }
  };

  const activeGoal = goals[0] || null;

  const progress =
    startWeight && currentWeight && activeGoal
      ? calculateProgress(currentWeight, startWeight, activeGoal.targetWeightKg)
      : 0;

  const weightToLose =
    currentWeight && activeGoal
      ? Math.max(0, currentWeight - activeGoal.targetWeightKg)
      : null;

  const totalToLose =
    startWeight && activeGoal ? startWeight - activeGoal.targetWeightKg : null;

  const weightLost =
    startWeight && currentWeight ? startWeight - currentWeight : null;

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-lg mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Goals</h1>
          <p className="text-slate-400">Set and track your weight loss goals</p>
        </div>

        {/* Set New Goal */}
        <Card>
          <CardHeader>
            <CardTitle>Set New Goal</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateGoal} className="space-y-4">
              {unitSystem === "imperial" ? (
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    Target Weight
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      label="Stone"
                      type="number"
                      min="0"
                      value={goalStone}
                      onChange={(e) => setGoalStone(e.target.value)}
                      placeholder="11"
                    />
                    <Input
                      label="Pounds"
                      type="number"
                      min="0"
                      max="13"
                      value={goalLbs}
                      onChange={(e) => setGoalLbs(e.target.value)}
                      placeholder="0"
                    />
                  </div>
                </div>
              ) : (
                <Input
                  label="Target Weight (kg)"
                  type="number"
                  step="0.1"
                  min="0"
                  value={goalInput}
                  onChange={(e) => setGoalInput(e.target.value)}
                  placeholder="70"
                />
              )}
              <Button type="submit" className="w-full" isLoading={isSaving}>
                Set New Goal
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Active Goal Progress */}
        {activeGoal && currentWeight && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Progress to Goal</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Progress Ring */}
                <div className="flex justify-center">
                  <div className="relative w-40 h-40">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="80"
                        cy="80"
                        r="70"
                        stroke="#334155"
                        strokeWidth="12"
                        fill="none"
                      />
                      <circle
                        cx="80"
                        cy="80"
                        r="70"
                        stroke="url(#progressGradient)"
                        strokeWidth="12"
                        fill="none"
                        strokeLinecap="round"
                        strokeDasharray={`${(Math.min(progress, 100) / 100) * 440} 440`}
                      />
                      <defs>
                        <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#8B5CF6" />
                          <stop offset="100%" stopColor="#3B82F6" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-bold text-white">
                        {Math.round(progress)}%
                      </span>
                      <span className="text-sm text-slate-400">complete</span>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-sm text-slate-400">Start</p>
                    <p className="text-lg font-semibold text-white">
                      {startWeight ? fmtWeight(startWeight) : "--"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Current</p>
                    <p className="text-lg font-semibold text-white">
                      {fmtWeight(currentWeight)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Goal</p>
                    <p className="text-lg font-semibold text-green-400">
                      {fmtWeight(activeGoal.targetWeightKg)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Detailed Progress */}
            <Card>
              <CardHeader>
                <CardTitle>Progress Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-slate-700/50 rounded-lg">
                  <span className="text-slate-300">Weight lost so far</span>
                  <span className={`font-semibold ${weightLost && weightLost > 0 ? "text-green-400" : "text-white"}`}>
                    {weightLost ? fmtWeightChange(weightLost) : "--"}
                  </span>
                </div>

                <div className="flex justify-between items-center p-3 bg-slate-700/50 rounded-lg">
                  <span className="text-slate-300">Remaining to goal</span>
                  <span className="font-semibold text-yellow-400">
                    {weightToLose ? fmtWeightChange(weightToLose) : "--"}
                  </span>
                </div>

                <div className="flex justify-between items-center p-3 bg-slate-700/50 rounded-lg">
                  <span className="text-slate-300">Total journey</span>
                  <span className="font-semibold text-white">
                    {totalToLose ? fmtWeightChange(totalToLose) : "--"}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Motivational Message */}
            <Card className="bg-gradient-to-br from-primary-900/50 to-secondary-900/50 border-primary-700/50">
              <CardContent className="pt-4 text-center">
                {progress >= 100 ? (
                  <>
                    <div className="text-4xl mb-2">🎉</div>
                    <p className="text-lg font-semibold text-white">
                      Congratulations! You&apos;ve reached your goal!
                    </p>
                    <p className="text-slate-300 mt-1">
                      Amazing work! Consider setting a new goal to keep progressing.
                    </p>
                  </>
                ) : progress >= 75 ? (
                  <>
                    <div className="text-4xl mb-2">🔥</div>
                    <p className="text-lg font-semibold text-white">Almost there!</p>
                    <p className="text-slate-300 mt-1">
                      You&apos;re so close to your goal. Keep pushing!
                    </p>
                  </>
                ) : progress >= 50 ? (
                  <>
                    <div className="text-4xl mb-2">💪</div>
                    <p className="text-lg font-semibold text-white">Halfway there!</p>
                    <p className="text-slate-300 mt-1">
                      You&apos;ve made incredible progress. Keep it up!
                    </p>
                  </>
                ) : progress >= 25 ? (
                  <>
                    <div className="text-4xl mb-2">🌟</div>
                    <p className="text-lg font-semibold text-white">Great start!</p>
                    <p className="text-slate-300 mt-1">
                      You&apos;re making steady progress. Stay consistent!
                    </p>
                  </>
                ) : (
                  <>
                    <div className="text-4xl mb-2">🚀</div>
                    <p className="text-lg font-semibold text-white">Let&apos;s do this!</p>
                    <p className="text-slate-300 mt-1">
                      Every journey starts with a single step. You&apos;ve got this!
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
          </>
        )}

        {/* No Goals Set */}
        {goals.length === 0 && (
          <Card className="border-dashed">
            <CardContent className="py-8 text-center">
              <div className="w-16 h-16 rounded-full bg-slate-700 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-slate-400">Set a goal above to track your progress</p>
            </CardContent>
          </Card>
        )}

        {/* Goal Timeline */}
        {goals.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Goal Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {goals.map((goal, index) => {
                const status = getGoalStatus(goal, index, weights);
                const config = statusConfig[status];
                const date = new Date(goal.createdAt);

                return (
                  <div
                    key={goal.id}
                    className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-white">
                          {fmtWeight(goal.targetWeightKg)}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${config.className}`}>
                          {config.label}
                        </span>
                      </div>
                      <p className="text-sm text-slate-400">
                        Set {date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteGoal(goal.id)}
                      disabled={deletingId === goal.id}
                      className="p-2 text-slate-400 hover:text-red-400 transition-colors disabled:opacity-50"
                      title="Delete goal"
                    >
                      {deletingId === goal.id ? (
                        <div className="w-4 h-4 animate-spin rounded-full border-2 border-slate-400 border-t-transparent" />
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      )}
                    </button>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
