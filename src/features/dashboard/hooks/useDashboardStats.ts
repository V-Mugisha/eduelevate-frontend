import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import * as dashboardService from "../services/dashboardService";
import type { DashboardStats } from "../types/dashboardTypes";

export default function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await dashboardService.getDashboardStats();
      setStats(result.data);
    } catch {
      toast.error("Failed to load dashboard");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, isLoading, refresh: fetchStats };
}
