"use client";

import { useEffect, useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatWeight, calculateProgress } from "@/lib/utils";
import { useUnits } from "@/lib/unit-context";
import { kgToStoneLbs, stoneLbsToKg } from "@/lib/units";

interface GoalData {
  currentWeight: number | null;
  startWeight: number | null;
  goalWeight: number | null;
  heightCm: number | null;
}

export default function GoalsPage() {
  const [data, setData] = useState<GoalData>({
    currentWeight: null,
    startWeight: null,
    goalWeight: null,
    heightCm: null,
  });
  const { formatWeight: fmtWeight, formatWeightChange: fmtWeightChange, unitSystem } = useUnits();
  const [isLoading, setIsLoading] = useState(true);
  const [goalInput, setGoalInput] = useState("");
  const [goalStone, setGoalStone] = useState("");
  const [goalLbs, setGoalLbs] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const fetchData = async () => {
    try {
      const [userRes, weightsRes] = await Promise.all([
        fetch("/api/user"),
        fetch("/api/weights?limit=100"),
      ]);

      const user = await userRes.json();
      const { weights } = await weightsRes.json();

      const sortedWeights = weights.sort(
        (a: { date: string }, b: { date: string }) =>
          new Date(a.date).getTime() - new Date(b.date).getTime()
      );

      setData({
        currentWeight: weights[0]?.weightKg || null,
        startWeight: sortedWeights[0]?.weightKg || null,
        goalWeight: user.goalWeightKg,
        heightCm: user.heightCm,
      });
      setGoalInput(user.goalWeightKg?.toString() || "");
      if (user.goalWeightKg) {
        const { stone, lbs } = kgToStoneLbs(user.goalWeightKg);
        setGoalStone(stone.toString());
        setGoalLbs(Math.round(lbs).toString());
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    let finalGoalKg: string | null;
    if (unitSystem === "imperial") {
      if (goalStone || goalLbs) {
        const kg = stoneLbsToKg(parseFloat(goalStone) || 0, parseFloat(goalLbs) || 0);
        finalGoalKg = kg.toString();
      } else {
        finalGoalKg = null;
      }
    } else {
      finalGoalKg = goalInput || null;
    }

    try {
      const response = await fetch("/api/user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goalWeightKg: finalGoalKg }),
      });

      if (response.ok) {
        fetchData();
      }
    } catch (error) {
      console.error("Failed to save goal:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const progress =
    data.startWeight && data.currentWeight && data.goalWeight
      ? calculateProgress(data.currentWeight, data.startWeight, data.goalWeight)
      : 0;

  const weightToLose =
    data.currentWeight && data.goalWeight
      ? Math.max(0, data.currentWeight - data.goalWeight)
      : null;

  const totalToLose =
    data.startWeight && data.goalWeight ? data.startWeight - data.goalWeight : null;

  const weightLost =
    data.startWeight && data.currentWeight ? data.startWeight - data.currentWeight : null;

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

        {/* Goal Setting */}
        <Card>
          <CardHeader>
            <CardTitle>Your Goal</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSaveGoal} className="space-y-4">
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
                {data.goalWeight ? "Update Goal" : "Set Goal"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Progress Overview */}
        {data.goalWeight && data.currentWeight && (
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
                        strokeDasharray={`${(progress / 100) * 440} 440`}
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
                      {data.startWeight ? fmtWeight(data.startWeight) : "--"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Current</p>
                    <p className="text-lg font-semibold text-white">
                      {fmtWeight(data.currentWeight)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Goal</p>
                    <p className="text-lg font-semibold text-green-400">
                      {fmtWeight(data.goalWeight)}
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
                      Amazing work! Consider setting a new goal to maintain your progress.
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

        {/* No Goal Set */}
        {!data.goalWeight && (
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
      </div>
    </AppLayout>
  );
}
