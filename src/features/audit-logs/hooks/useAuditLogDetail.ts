import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import * as auditLogService from "../services/auditLogService";
import type { AuditLogDetail } from "../types/auditLogTypes";

export default function useAuditLogDetail(logId: string | undefined) {
  const [log, setLog] = useState<AuditLogDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLog = useCallback(async () => {
    if (!logId) return;
    setIsLoading(true);
    try {
      const result = await auditLogService.getAuditLog(logId);
      setLog(result.data);
    } catch {
      toast.error("Failed to load audit log");
    } finally {
      setIsLoading(false);
    }
  }, [logId]);

  useEffect(() => {
    fetchLog();
  }, [fetchLog]);

  return { log, isLoading, refresh: fetchLog };
}
