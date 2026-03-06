"use client";

import { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useUnits } from "@/lib/unit-context";
import { useTheme } from "@/lib/theme-context";
import { getThemeStyles } from "@/lib/theme-styles";
import {
  type UnitSystem,
  cmToFeetInches,
  feetInchesToCm,
  formatHeightDisplay,
} from "@/lib/units";

interface UserData {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  heightCm: number | null;
  unitSystem: UnitSystem;
}

export default function SettingsPage() {
  const { data: session } = useSession();
  const { setUnitSystem: setContextUnit } = useUnits();
  const { theme } = useTheme();
  const styles = getThemeStyles(theme);
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [unitSystem, setUnitSystem] = useState<UnitSystem>("metric");

  // Metric inputs
  const [heightCm, setHeightCm] = useState("");

  // Imperial inputs
  const [heightFeet, setHeightFeet] = useState("");
  const [heightInches, setHeightInches] = useState("");

  const [success, setSuccess] = useState(false);

  const fetchUser = async () => {
    try {
      const response = await fetch("/api/user");
      const data = await response.json();
      setUser(data);
      const system = (data.unitSystem as UnitSystem) || "metric";
      setUnitSystem(system);
      setHeightCm(data.heightCm?.toString() || "");

      if (data.heightCm) {
        const { feet, inches } = cmToFeetInches(data.heightCm);
        setHeightFeet(feet.toString());
        setHeightInches(inches.toString());
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
    } else {
      finalHeightCm = heightCm || null;
    }

    try {
      const response = await fetch("/api/user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          heightCm: finalHeightCm,
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
        if (data.heightCm) {
          const { feet, inches } = cmToFeetInches(data.heightCm);
          setHeightFeet(feet.toString());
          setHeightInches(inches.toString());
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
          <h1 className={`text-2xl font-bold ${styles.heading}`}>Settings</h1>
          <p className={styles.subtext}>Manage your profile and preferences</p>
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
                <p className={`text-lg font-medium ${styles.text}`}>{session?.user?.name}</p>
                <p className={`text-sm ${styles.mutedText}`}>{session?.user?.email}</p>
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
                    ? styles.btnPrimary
                    : styles.btnSecondary
                }`}
              >
                Metric (kg, cm)
              </button>
              <button
                type="button"
                onClick={() => handleUnitToggle("imperial")}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                  unitSystem === "imperial"
                    ? styles.btnPrimary
                    : styles.btnSecondary
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
                <Input
                  label="Height (cm)"
                  type="number"
                  step="0.1"
                  min="0"
                  value={heightCm}
                  onChange={(e) => setHeightCm(e.target.value)}
                  placeholder="175"
                />
              ) : (
                <div>
                  <label className={`block text-sm font-medium ${styles.mutedText} mb-1`}>
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
              )}

              {success && (
                <div className={`flex items-center gap-2 ${styles.successText} text-sm`}>
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
          <Card>
            <CardContent className="pt-4">
              <h3 className={`font-medium ${styles.text} mb-2`}>BMI Reference</h3>
              <div className={`text-sm ${styles.mutedText} space-y-1`}>
                <p>Your height: {formatHeightDisplay(user.heightCm, unitSystem)}</p>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div className={`p-2 ${styles.listItem} rounded`}>
                    <p className="text-blue-400">Underweight</p>
                    <p>&lt; 18.5</p>
                  </div>
                  <div className={`p-2 ${styles.listItem} rounded`}>
                    <p className="text-green-400">Normal</p>
                    <p>18.5 - 24.9</p>
                  </div>
                  <div className={`p-2 ${styles.listItem} rounded`}>
                    <p className="text-yellow-400">Overweight</p>
                    <p>25 - 29.9</p>
                  </div>
                  <div className={`p-2 ${styles.listItem} rounded`}>
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
            <p className={`text-sm ${styles.mutedText} mb-4`}>
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
