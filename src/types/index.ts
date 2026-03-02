import { User, Weight, Measurement, Photo } from "@prisma/client";

export type UserWithRelations = User & {
  weights: Weight[];
  measurements: Measurement[];
  photos: Photo[];
};

export interface WeightEntry {
  id: string;
  weightKg: number;
  date: Date;
  notes?: string | null;
}

export interface MeasurementEntry {
  id: string;
  date: Date;
  chestCm?: number | null;
  waistCm?: number | null;
  hipsCm?: number | null;
  armCm?: number | null;
  thighCm?: number | null;
}

export interface PhotoEntry {
  id: string;
  date: Date;
  filename: string;
  category: "front" | "side" | "back";
}

export interface GoalEntry {
  id: string;
  targetWeightKg: number;
  createdAt: string;
}

export interface DashboardStats {
  currentWeight: number | null;
  previousWeight: number | null;
  startWeight: number | null;
  goalWeight: number | null;
  bmi: number | null;
  progress: number;
  totalLost: number;
  recentWeights: WeightEntry[];
}
