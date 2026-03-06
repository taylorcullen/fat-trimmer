import { getDashboardData } from "@/lib/dashboard-data";
import { V2DashboardClient } from "./dashboard-client";

export default async function V2DashboardPage() {
  const { stats, userName } = await getDashboardData();
  return <V2DashboardClient stats={stats} userName={userName} />;
}
