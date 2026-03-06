import { getDashboardData } from "@/lib/dashboard-data";
import { V5DashboardClient } from "./dashboard-client";

export default async function V5DashboardPage() {
  const { stats, userName } = await getDashboardData();
  return <V5DashboardClient stats={stats} userName={userName} />;
}
