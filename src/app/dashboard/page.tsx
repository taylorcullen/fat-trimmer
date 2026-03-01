import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { DashboardClient } from "./dashboard-client";
import { calculateBMI, calculateProgress } from "@/lib/utils";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      heightCm: true,
      goalWeightKg: true,
    },
  });

  const weights = await prisma.weight.findMany({
    where: { userId: session.user.id },
    orderBy: { date: "desc" },
    take: 30,
  });

  const currentWeight = weights[0]?.weightKg || null;
  const previousWeight = weights[1]?.weightKg || null;
  const startWeight = weights.length > 0 ? weights[weights.length - 1].weightKg : null;

  const bmi =
    currentWeight && user?.heightCm
      ? calculateBMI(currentWeight, user.heightCm)
      : null;

  const progress =
    startWeight && currentWeight && user?.goalWeightKg
      ? calculateProgress(currentWeight, startWeight, user.goalWeightKg)
      : 0;

  const totalLost = startWeight && currentWeight ? startWeight - currentWeight : 0;

  const stats = {
    currentWeight,
    previousWeight,
    startWeight,
    goalWeight: user?.goalWeightKg || null,
    bmi,
    progress,
    totalLost,
    heightCm: user?.heightCm || null,
    recentWeights: weights.map((w) => ({
      id: w.id,
      weightKg: w.weightKg,
      date: w.date,
      notes: w.notes,
    })),
  };

  return <DashboardClient stats={stats} userName={session.user.name || "User"} />;
}
