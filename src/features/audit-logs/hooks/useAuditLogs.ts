import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import useDebounce from "@/hooks/useDebounce";
import * as auditLogService from "../services/auditLogService";
import type { AuditLogEntry } from "../types/auditLogTypes";

export default function useAuditLogs() {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const [actionFilter, setActionFilter] = useState("");
  const [entityTypeFilter, setEntityTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [actions, setActions] = useState<string[]>([]);
  const [entityTypes, setEntityTypes] = useState<string[]>([]);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  useEffect(() => {
    auditLogService
      .listActions()
      .then((r) => setActions(r.data))
      .catch(() => {});
    auditLogService
      .listEntityTypes()
      .then((r) => setEntityTypes(r.data))
      .catch(() => {});
  }, []);

  const fetchLogs = useCallback(async () => {
    setIsLoading(true);
    try {
      const params: Record<string, string | number | undefined> = {
        page,
        limit,
      };
      if (debouncedSearch) params.q = debouncedSearch;
      if (actionFilter) params.action = actionFilter;
      if (entityTypeFilter) params.entityType = entityTypeFilter;
      if (statusFilter) params.status = statusFilter;
      if (dateFrom) params.from = dateFrom;
      if (dateTo) params.to = dateTo;

      const result = await auditLogService.listAuditLogs(params);
      setLogs(result.data);
      setTotal(result.total);
    } catch {
      toast.error("Failed to load audit logs");
    } finally {
      setIsLoading(false);
    }
  }, [
    debouncedSearch,
    actionFilter,
    entityTypeFilter,
    statusFilter,
    dateFrom,
    dateTo,
    page,
    limit,
  ]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  function handleActionFilter(value: string) {
    setActionFilter(value);
    setPage(1);
  }

  function handleEntityTypeFilter(value: string) {
    setEntityTypeFilter(value);
    setPage(1);
  }

  function handleStatusFilter(value: string) {
    setStatusFilter(value);
    setPage(1);
  }

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return {
    logs,
    total,
    isLoading,
    search,
    setSearch,
    actionFilter,
    entityTypeFilter,
    statusFilter,
    actions,
    entityTypes,
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,
    page,
    totalPages,
    limit,
    handleActionFilter,
    handleEntityTypeFilter,
    handleStatusFilter,
    setPage,
    refresh: fetchLogs,
  };
}
