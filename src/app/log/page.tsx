"use client";

import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WeightForm } from "@/components/forms/weight-form";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LogPage() {
  const router = useRouter();
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (data: { weightKg: number; date: string; notes: string }) => {
    const response = await fetch("/api/weights", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to log weight");
    }

    setSuccess(true);
    setTimeout(() => {
      router.push("/dashboard");
      router.refresh();
    }, 1500);
  };

  return (
    <AppLayout>
      <div className="max-w-lg mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Log Weight</h1>
          <p className="text-slate-400">Record your daily weight</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>New Entry</CardTitle>
          </CardHeader>
          <CardContent>
            {success ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-lg font-medium text-white">Weight logged!</p>
                <p className="text-slate-400">Redirecting to dashboard...</p>
              </div>
            ) : (
              <WeightForm onSubmit={handleSubmit} />
            )}
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50">
          <CardContent className="pt-4">
            <h3 className="font-medium text-white mb-2">Tips for accurate tracking</h3>
            <ul className="text-sm text-slate-400 space-y-1">
              <li>- Weigh yourself at the same time each day</li>
              <li>- Morning, after using the bathroom, is ideal</li>
              <li>- Wear similar clothing or none</li>
              <li>- Use the same scale consistently</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
