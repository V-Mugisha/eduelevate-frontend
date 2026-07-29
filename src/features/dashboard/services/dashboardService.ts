import apiClient from "@/lib/apiClient";
import type { DashboardStats } from "../types/dashboardTypes";

export async function getDashboardStats(): Promise<{ data: DashboardStats }> {
  const res = await apiClient.get<{ data: DashboardStats }>("/dashboard/stats");
  return res.data;
}
