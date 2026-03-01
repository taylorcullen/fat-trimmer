"use client";

import { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useUnits } from "@/lib/unit-context";
import {
  type UnitSystem,
  cmToFeetInches,
  feetInchesToCm,
  kgToStoneLbs,
  stoneLbsToKg,
  formatHeightDisplay,
} from "@/lib/units";

interface UserData {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  heightCm: number | null;
  goalWeightKg: number | null;
  unitSystem: UnitSystem;
}

export default function SettingsPage() {
  const { data: session } = useSession();
  const { setUnitSystem: setContextUnit } = useUnits();
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [unitSystem, setUnitSystem] = useState<UnitSystem>("metric");

  // Metric inputs
  const [heightCm, setHeightCm] = useState("");
  const [goalWeightKg, setGoalWeightKg] = useState("");

  // Imperial inputs
  const [heightFeet, setHeightFeet] = useState("");
  const [heightInches, setHeightInches] = useState("");
  const [goalStone, setGoalStone] = useState("");
  const [goalLbs, setGoalLbs] = useState("");

  const [success, setSuccess] = useState(false);

  const fetchUser = async () => {
    try {
      const response = await fetch("/api/user");
      const data = await response.json();
      setUser(data);
      const system = (data.unitSystem as UnitSystem) || "metric";
      setUnitSystem(system);
      setHeightCm(data.heightCm?.toString() || "");
      setGoalWeightKg(data.goalWeightKg?.toString() || "");

      if (data.heightCm) {
        const { feet, inches } = cmToFeetInches(data.heightCm);
        setHeightFeet(feet.toString());
        setHeightInches(inches.toString());
      }
      if (data.goalWeightKg) {
        const { stone, lbs } = kgToStoneLbs(data.goalWeightKg);
        setGoalStone(stone.toString());
        setGoalLbs(Math.round(lbs).toString());
      }
    } catch (error) {
      console.error("Failed to fetch user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleUnitToggle = (system: UnitSystem) => {
    setUnitSystem(system);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccess(false);

    let finalHeightCm: string | null;
    let finalGoalWeightKg: string | null;

    if (unitSystem === "imperial") {
      if (heightFeet || heightInches) {
        const cm = feetInchesToCm(
          parseFloat(heightFeet) || 0,
          parseFloat(heightInches) || 0
        );
        finalHeightCm = cm.toString();
      } else {
        finalHeightCm = null;
      }

      if (goalStone || goalLbs) {
        const kg = stoneLbsToKg(
          parseFloat(goalStone) || 0,
          parseFloat(goalLbs) || 0
        );
        finalGoalWeightKg = kg.toString();
      } else {
        finalGoalWeightKg = null;
      }
    } else {
      finalHeightCm = heightCm || null;
      finalGoalWeightKg = goalWeightKg || null;
    }

    try {
      const response = await fetch("/api/user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          heightCm: finalHeightCm,
          goalWeightKg: finalGoalWeightKg,
          unitSystem,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data);
        setContextUnit(unitSystem);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);

        // Sync the metric fields from response
        setHeightCm(data.heightCm?.toString() || "");
        setGoalWeightKg(data.goalWeightKg?.toString() || "");
        if (data.heightCm) {
          const { feet, inches } = cmToFeetInches(data.heightCm);
          setHeightFeet(feet.toString());
          setHeightInches(inches.toString());
        }
        if (data.goalWeightKg) {
          const { stone, lbs } = kgToStoneLbs(data.goalWeightKg);
          setGoalStone(stone.toString());
          setGoalLbs(Math.round(lbs).toString());
        }
      }
    } catch (error) {
      console.error("Failed to save settings:", error);
    } finally {
      setIsSaving(false);
    }
  };

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
          <h1 className="text-2xl font-bold text-white">Settings</h1>
          <p className="text-slate-400">Manage your profile and preferences</p>
        </div>

        {/* Profile Card */}
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              {session?.user?.image && (
                <Image
                  src={session.user.image}
                  alt={session.user.name || "User"}
                  width={64}
                  height={64}
                  className="rounded-full"
                />
              )}
              <div>
                <p className="text-lg font-medium text-white">{session?.user?.name}</p>
                <p className="text-sm text-slate-400">{session?.user?.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Unit Preference */}
        <Card>
          <CardHeader>
            <CardTitle>Units</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleUnitToggle("metric")}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                  unitSystem === "metric"
                    ? "bg-primary-500 text-white"
                    : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                }`}
              >
                Metric (kg, cm)
              </button>
              <button
                type="button"
                onClick={() => handleUnitToggle("imperial")}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                  unitSystem === "imperial"
                    ? "bg-primary-500 text-white"
                    : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                }`}
              >
                Imperial (st/lb, ft/in)
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Body Info */}
        <Card>
          <CardHeader>
            <CardTitle>Body Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-4">
              {unitSystem === "metric" ? (
                <>
                  <Input
                    label="Height (cm)"
                    type="number"
                    step="0.1"
                    min="0"
                    value={heightCm}
                    onChange={(e) => setHeightCm(e.target.value)}
                    placeholder="175"
                  />
                  <Input
                    label="Goal Weight (kg)"
                    type="number"
                    step="0.1"
                    min="0"
                    value={goalWeightKg}
                    onChange={(e) => setGoalWeightKg(e.target.value)}
                    placeholder="70"
                  />
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                      Height
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        label="Feet"
                        type="number"
                        min="0"
                        max="8"
                        value={heightFeet}
                        onChange={(e) => setHeightFeet(e.target.value)}
                        placeholder="5"
                      />
                      <Input
                        label="Inches"
                        type="number"
                        min="0"
                        max="11"
                        value={heightInches}
                        onChange={(e) => setHeightInches(e.target.value)}
                        placeholder="9"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                      Goal Weight
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
                </>
              )}

              {success && (
                <div className="flex items-center gap-2 text-green-400 text-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Settings saved successfully
                </div>
              )}

              <Button type="submit" className="w-full" isLoading={isSaving}>
                Save Changes
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* BMI Info */}
        {user?.heightCm && (
          <Card className="bg-slate-800/50">
            <CardContent className="pt-4">
              <h3 className="font-medium text-white mb-2">BMI Reference</h3>
              <div className="text-sm text-slate-400 space-y-1">
                <p>Your height: {formatHeightDisplay(user.heightCm, unitSystem)}</p>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div className="p-2 bg-slate-700/50 rounded">
                    <p className="text-blue-400">Underweight</p>
                    <p>&lt; 18.5</p>
                  </div>
                  <div className="p-2 bg-slate-700/50 rounded">
                    <p className="text-green-400">Normal</p>
                    <p>18.5 - 24.9</p>
                  </div>
                  <div className="p-2 bg-slate-700/50 rounded">
                    <p className="text-yellow-400">Overweight</p>
                    <p>25 - 29.9</p>
                  </div>
                  <div className="p-2 bg-slate-700/50 rounded">
                    <p className="text-red-400">Obese</p>
                    <p>&gt;= 30</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Danger Zone */}
        <Card className="border-red-500/30">
          <CardHeader>
            <CardTitle className="text-red-400">Account</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-400 mb-4">
              Sign out of your account on this device.
            </p>
            <Button variant="danger" onClick={() => signOut({ callbackUrl: "/login" })}>
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
