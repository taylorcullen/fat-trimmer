import { getDashboardData } from "@/lib/dashboard-data";
import { V1DashboardClient } from "./dashboard-client";

export default async function V1DashboardPage() {
  const { stats, userName } = await getDashboardData();
  return <V1DashboardClient stats={stats} userName={userName} />;
}
