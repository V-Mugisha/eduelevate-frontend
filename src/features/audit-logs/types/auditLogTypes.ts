export interface AuditLogEntry {
  id: string;
  action: string;
  entityType: string;
  entityId: string | null;
  status: "success" | "failure";
  details: Record<string, unknown> | null;
  createdAt: string;
  performer: {
    id: string;
    firstName: string;
    lastName: string;
  } | null;
}

export interface AuditLogDetail {
  id: string;
  action: string;
  entityType: string;
  entityId: string | null;
  status: "success" | "failure";
  details: Record<string, unknown> | null;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
  performer: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  } | null;
}

export interface AuditLogListResponse {
  data: AuditLogEntry[];
  total: number;
  page: number;
  limit: number;
}
