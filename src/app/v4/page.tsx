import { getDashboardData } from "@/lib/dashboard-data";
import { V4DashboardClient } from "./dashboard-client";

export default async function V4DashboardPage() {
  const { stats, userName } = await getDashboardData();
  return <V4DashboardClient stats={stats} userName={userName} />;
}
