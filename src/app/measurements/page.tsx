"use client";

import { useEffect, useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { formatDate } from "@/lib/utils";
import { useUnits } from "@/lib/unit-context";
import { cmToInches, inchesToCm, measurementUnit, formatMeasurementChangeDisplay } from "@/lib/units";
import { MeasurementGuide } from "@/components/ui/measurement-guides";
import { useTheme } from "@/lib/theme-context";
import { getThemeStyles } from "@/lib/theme-styles";

interface Measurement {
  id: string;
  date: string;
  chestCm: number | null;
  waistCm: number | null;
  hipsCm: number | null;
  armCm: number | null;
  thighCm: number | null;
}

const measurementFields = [
  { key: "chestCm", label: "Chest", icon: "📏" },
  { key: "waistCm", label: "Waist", icon: "📏" },
  { key: "hipsCm", label: "Hips", icon: "📏" },
  { key: "armCm", label: "Arm", icon: "💪" },
  { key: "thighCm", label: "Thigh", icon: "🦵" },
] as const;

export default function MeasurementsPage() {
  const { formatMeasurement, unitSystem } = useUnits();
  const unit = measurementUnit(unitSystem);
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    chestCm: "",
    waistCm: "",
    hipsCm: "",
    armCm: "",
    thighCm: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { theme } = useTheme();
  const styles = getThemeStyles(theme);

  const fetchMeasurements = async () => {
    try {
      const response = await fetch("/api/measurements");
      const data = await response.json();
      setMeasurements(data.measurements);
    } catch (error) {
      console.error("Failed to fetch measurements:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMeasurements();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Convert from display units to cm for storage
    const toCm = (val: string) => {
      if (!val) return null;
      const num = parseFloat(val);
      return unitSystem === "imperial" ? inchesToCm(num) : num;
    };

    try {
      const response = await fetch("/api/measurements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: formData.date,
          chestCm: toCm(formData.chestCm),
          waistCm: toCm(formData.waistCm),
          hipsCm: toCm(formData.hipsCm),
          armCm: toCm(formData.armCm),
          thighCm: toCm(formData.thighCm),
        }),
      });

      if (response.ok) {
        setIsModalOpen(false);
        setFormData({
          date: new Date().toISOString().split("T")[0],
          chestCm: "",
          waistCm: "",
          hipsCm: "",
          armCm: "",
          thighCm: "",
        });
        fetchMeasurements();
      }
    } catch (error) {
      console.error("Failed to save measurement:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this measurement?")) return;

    try {
      const response = await fetch(`/api/measurements/${id}`, { method: "DELETE" });
      if (response.ok) {
        fetchMeasurements();
      }
    } catch (error) {
      console.error("Failed to delete measurement:", error);
    }
  };

  const getChange = (current: number | null, previous: number | null) => {
    if (current === null || previous === null) return null;
    return current - previous;
  };

  const latestMeasurement = measurements[0];
  const previousMeasurement = measurements[1];

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-2xl font-bold ${styles.heading}`}>Body Measurements</h1>
            <p className={styles.subtext}>Track your body measurements over time</p>
          </div>
          <Button onClick={() => setIsModalOpen(true)}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add
          </Button>
        </div>

        {/* Current Stats */}
        {latestMeasurement && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {measurementFields.map((field) => {
              const value = latestMeasurement[field.key];
              const prevValue = previousMeasurement?.[field.key];
              const change = getChange(value, prevValue);

              return (
                <Card key={field.key}>
                  <CardContent className="pt-4 text-center">
                    <p className={`text-sm ${styles.subtext}`}>{field.label}</p>
                    <p className={`text-2xl font-bold ${styles.text}`}>
                      {value ? formatMeasurement(value) : "--"}
                    </p>
                    {change !== null && (
                      <p
                        className={`text-sm ${
                          change < 0 ? styles.successText : change > 0 ? styles.dangerText : styles.subtext
                        }`}
                      >
                        {change > 0 ? "+" : ""}
                        {formatMeasurementChangeDisplay(change, unitSystem)}
                      </p>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* History */}
        <Card>
          <CardHeader>
            <CardTitle>Measurement History</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500" />
              </div>
            ) : measurements.length === 0 ? (
              <div className="text-center py-8">
                <p className={`${styles.subtext} mb-4`}>No measurements yet</p>
                <Button onClick={() => setIsModalOpen(true)}>Add your first measurement</Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className={`border-b ${styles.divider}`}>
                      <th className={`text-left py-2 px-2 text-sm ${styles.subtext}`}>Date</th>
                      {measurementFields.map((field) => (
                        <th key={field.key} className={`text-right py-2 px-2 text-sm ${styles.subtext}`}>
                          {field.label}
                        </th>
                      ))}
                      <th className="w-10"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {measurements.map((m) => (
                      <tr key={m.id} className={`border-b ${styles.divider}`}>
                        <td className={`py-3 px-2 text-sm ${styles.text}`}>{formatDate(m.date)}</td>
                        {measurementFields.map((field) => (
                          <td key={field.key} className={`py-3 px-2 text-sm text-right ${styles.mutedText}`}>
                            {m[field.key] ? formatMeasurement(m[field.key]!) : "-"}
                          </td>
                        ))}
                        <td className="py-3 px-2">
                          <button
                            onClick={() => handleDelete(m.id)}
                            className={`p-1 ${styles.subtext} hover:text-red-400 transition-colors`}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Add Modal */}
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Measurement" className="max-w-lg">
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />

            <div className="space-y-4">
              {measurementFields.map((field) => (
                <div
                  key={field.key}
                  className={`flex items-center gap-4 p-3 ${styles.listItem} rounded-lg`}
                >
                  <div className="w-20 shrink-0">
                    <MeasurementGuide field={field.key} />
                  </div>
                  <div className="flex-1">
                    <Input
                      label={`${field.label} (${unit})`}
                      type="number"
                      step="0.1"
                      value={formData[field.key]}
                      onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                      placeholder="0.0"
                    />
                  </div>
                </div>
              ))}
            </div>

            <Button type="submit" className="w-full" isLoading={isSubmitting}>
              Save Measurement
            </Button>
          </form>
        </Modal>
      </div>
    </AppLayout>
  );
}
