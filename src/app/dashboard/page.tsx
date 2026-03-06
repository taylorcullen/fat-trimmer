import { getDashboardData } from "@/lib/dashboard-data";
import { DashboardClient } from "./dashboard-client";

export default async function DashboardPage() {
  const { stats, userName } = await getDashboardData();
  return <DashboardClient stats={stats} userName={userName} />;
}
