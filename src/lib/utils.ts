import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculateBMI(weightKg: number, heightCm: number): number {
  const heightM = heightCm / 100;
  return weightKg / (heightM * heightM);
}

export function getBMICategory(bmi: number): { label: string; color: string; lightColor: string } {
  if (bmi < 18.5) return { label: "Underweight", color: "text-blue-400", lightColor: "text-blue-600" };
  if (bmi < 25) return { label: "Normal", color: "text-green-400", lightColor: "text-green-600" };
  if (bmi < 30) return { label: "Overweight", color: "text-yellow-400", lightColor: "text-yellow-600" };
  return { label: "Obese", color: "text-red-400", lightColor: "text-red-600" };
}

export function formatWeight(kg: number, decimals: number = 1): string {
  return kg.toFixed(decimals);
}

export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatDateShort(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function getWeightChange(current: number, previous: number): { value: number; isLoss: boolean } {
  const change = current - previous;
  return {
    value: Math.abs(change),
    isLoss: change < 0,
  };
}

export function calculateProgress(current: number, start: number, goal: number): number {
  if (start === goal) return 100;
  const totalToLose = start - goal;
  const lost = start - current;
  const progress = (lost / totalToLose) * 100;
  return Math.min(Math.max(progress, 0), 100);
}
