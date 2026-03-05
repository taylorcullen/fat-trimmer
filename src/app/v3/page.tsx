import { getDashboardData } from "@/lib/dashboard-data";
import { V3DashboardClient } from "./dashboard-client";

export default async function V3DashboardPage() {
  const { stats, userName } = await getDashboardData();
  return <V3DashboardClient stats={stats} userName={userName} />;
}
