"use client";

import { useEffect, useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { WeightChart } from "@/components/charts/weight-chart";
import { formatDate, formatWeight } from "@/lib/utils";
import { useUnits } from "@/lib/unit-context";
import { useTheme } from "@/lib/theme-context";
import { getThemeStyles } from "@/lib/theme-styles";

interface WeightEntry {
  id: string;
  weightKg: number;
  date: string;
  notes: string | null;
}

export default function HistoryPage() {
  const { formatWeight: fmtWeight, formatWeightChange: fmtWeightChange, unitSystem } = useUnits();
  const { theme } = useTheme();
  const styles = getThemeStyles(theme);
  const [weights, setWeights] = useState<WeightEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const limit = 20;

  const fetchWeights = async (offset: number = 0) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/weights?limit=${limit}&offset=${offset}`);
      const data = await response.json();
      setWeights(data.weights);
      setTotal(data.total);
    } catch (error) {
      console.error("Failed to fetch weights:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWeights(page * limit);
  }, [page]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this entry?")) return;

    try {
      const response = await fetch(`/api/weights/${id}`, { method: "DELETE" });
      if (response.ok) {
        fetchWeights(page * limit);
      }
    } catch (error) {
      console.error("Failed to delete weight:", error);
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className={`text-2xl font-bold ${styles.heading}`}>Weight History</h1>
          <p className={styles.subtext}>View and manage your weight entries</p>
        </div>

        {/* Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Weight Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <WeightChart data={weights} height={300} unitSystem={unitSystem} />
          </CardContent>
        </Card>

        {/* History List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>All Entries</CardTitle>
              <span className={`text-sm ${styles.mutedText}`}>{total} total</span>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500" />
              </div>
            ) : weights.length === 0 ? (
              <div className="text-center py-8">
                <p className={styles.mutedText}>No weight entries yet</p>
              </div>
            ) : (
              <div className="space-y-2">
                {weights.map((entry, index) => {
                  const prevEntry = weights[index + 1];
                  const change = prevEntry ? entry.weightKg - prevEntry.weightKg : null;

                  return (
                    <div
                      key={entry.id}
                      className={`flex items-center justify-between p-3 rounded-lg ${styles.listItem}`}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <span className={`text-lg font-semibold ${styles.text}`}>
                            {fmtWeight(entry.weightKg)}
                          </span>
                          {change !== null && (
                            <span
                              className={`text-sm ${
                                change < 0
                                  ? styles.successText
                                  : change > 0
                                  ? styles.dangerText
                                  : styles.mutedText
                              }`}
                            >
                              {change > 0 ? "+" : ""}{change < 0 ? "-" : ""}{fmtWeightChange(change)}
                            </span>
                          )}
                        </div>
                        <div className={`flex items-center gap-2 text-sm ${styles.mutedText}`}>
                          <span>{formatDate(entry.date)}</span>
                          {entry.notes && (
                            <>
                              <span>-</span>
                              <span className="truncate max-w-[200px]">{entry.notes}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => handleDelete(entry.id)}
                        className={`p-2 ${styles.mutedText} hover:text-red-400 transition-colors`}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-4">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                >
                  Previous
                </Button>
                <span className={`text-sm ${styles.mutedText}`}>
                  Page {page + 1} of {totalPages}
                </span>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                  disabled={page >= totalPages - 1}
                >
                  Next
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
