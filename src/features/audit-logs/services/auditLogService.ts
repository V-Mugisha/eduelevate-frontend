import apiClient from "@/lib/apiClient";
import type { AuditLogListResponse, AuditLogDetail } from "../types/auditLogTypes";

export async function listAuditLogs(params: {
  action?: string;
  entityType?: string;
  status?: string;
  performedBy?: string;
  from?: string;
  to?: string;
  q?: string;
  page?: number;
  limit?: number;
}): Promise<AuditLogListResponse> {
  const res = await apiClient.get<AuditLogListResponse>("/audit-logs", { params });
  return res.data;
}

export async function getAuditLog(id: string): Promise<{ data: AuditLogDetail }> {
  const res = await apiClient.get<{ data: AuditLogDetail }>(`/audit-logs/${id}`);
  return res.data;
}

export async function listActions(): Promise<{ data: string[] }> {
  const res = await apiClient.get<{ data: string[] }>("/audit-logs/filters/actions");
  return res.data;
}

export async function listEntityTypes(): Promise<{ data: string[] }> {
  const res = await apiClient.get<{ data: string[] }>("/audit-logs/filters/entity-types");
  return res.data;
}
