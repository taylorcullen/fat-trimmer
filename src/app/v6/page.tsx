import { getDashboardData } from "@/lib/dashboard-data";
import { V6DashboardClient } from "./dashboard-client";

export default async function V6DashboardPage() {
  const { stats, userName } = await getDashboardData();
  return <V6DashboardClient stats={stats} userName={userName} />;
}
