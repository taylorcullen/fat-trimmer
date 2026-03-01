"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUnits } from "@/lib/unit-context";
import { stoneLbsToKg, kgToStoneLbs } from "@/lib/units";

interface WeightFormProps {
  onSubmit: (data: { weightKg: number; date: string; notes: string }) => Promise<void>;
  initialValues?: {
    weightKg?: number;
    date?: string;
    notes?: string;
  };
  submitLabel?: string;
}

export function WeightForm({
  onSubmit,
  initialValues,
  submitLabel = "Log Weight",
}: WeightFormProps) {
  const { unitSystem } = useUnits();

  // Metric state
  const [weightKg, setWeightKg] = useState(initialValues?.weightKg?.toString() || "");

  // Imperial state
  const [stone, setStone] = useState(() => {
    if (initialValues?.weightKg) {
      const { stone } = kgToStoneLbs(initialValues.weightKg);
      return stone.toString();
    }
    return "";
  });
  const [lbs, setLbs] = useState(() => {
    if (initialValues?.weightKg) {
      const { lbs } = kgToStoneLbs(initialValues.weightKg);
      return Math.round(lbs).toString();
    }
    return "";
  });

  const [date, setDate] = useState(
    initialValues?.date || new Date().toISOString().split("T")[0]
  );
  const [notes, setNotes] = useState(initialValues?.notes || "");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    let weight: number;
    if (unitSystem === "imperial") {
      const s = parseFloat(stone) || 0;
      const l = parseFloat(lbs) || 0;
      if (s <= 0 && l <= 0) {
        setError("Please enter a valid weight");
        return;
      }
      weight = stoneLbsToKg(s, l);
    } else {
      weight = parseFloat(weightKg);
      if (isNaN(weight) || weight <= 0) {
        setError("Please enter a valid weight");
        return;
      }
    }

    setIsLoading(true);
    try {
      await onSubmit({ weightKg: weight, date, notes });
      if (!initialValues) {
        setWeightKg("");
        setStone("");
        setLbs("");
        setNotes("");
        setDate(new Date().toISOString().split("T")[0]);
      }
    } catch (err) {
      setError("Failed to save weight. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {unitSystem === "imperial" ? (
          <>
            <Input
              label="Stone"
              type="number"
              min="0"
              value={stone}
              onChange={(e) => setStone(e.target.value)}
              placeholder="14"
              required
            />
            <Input
              label="Pounds"
              type="number"
              step="1"
              min="0"
              max="13"
              value={lbs}
              onChange={(e) => setLbs(e.target.value)}
              placeholder="0"
            />
          </>
        ) : (
          <Input
            label="Weight (kg)"
            type="number"
            step="0.1"
            min="0"
            value={weightKg}
            onChange={(e) => setWeightKg(e.target.value)}
            placeholder="75.5"
            required
          />
        )}
        <Input
          label="Date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">
          Notes (optional)
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2.5 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 resize-none"
          rows={2}
          placeholder="Any notes about today..."
        />
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <Button type="submit" className="w-full" isLoading={isLoading}>
        {submitLabel}
      </Button>
    </form>
  );
}
