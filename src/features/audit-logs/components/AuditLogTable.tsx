import { Link } from "react-router-dom";
import { ChevronRight, ScrollText } from "lucide-react";
import LoadingBubbles from "@/components/shared/LoadingBubbles";
import type { AuditLogEntry } from "../types/auditLogTypes";

interface AuditLogTableProps {
  logs: AuditLogEntry[];
  isLoading: boolean;
  totalPages: number;
  page: number;
  limit: number;
  total: number;
  onPageChange: (page: number) => void;
}

export default function AuditLogTable({
  logs,
  isLoading,
  totalPages,
  page,
  limit,
  total,
  onPageChange,
}: AuditLogTableProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <LoadingBubbles size="md" />
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <ScrollText className="text-muted-foreground mb-4 size-12" />
        <h3 className="text-foreground text-lg font-semibold">No audit logs found</h3>
        <p className="text-muted-foreground mt-1 text-sm">
          Try adjusting your search or filters.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-card overflow-x-auto rounded-xl border">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/30 border-b text-left">
              <th className="px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
              <th className="px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Performed By
              </th>
              <th className="px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-5 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-muted/20 transition-colors">
                <td className="px-5 py-4">
                  <span className="text-foreground text-xs font-medium">{log.action}</span>
                </td>
                <td className="text-muted-foreground px-5 py-4 text-xs">
                  {log.performer
                    ? `${log.performer.firstName} ${log.performer.lastName}`
                    : <span className="italic opacity-50">System</span>}
                </td>
                <td className="px-5 py-4">
                  <span
                    className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                      log.status === "success"
                        ? "bg-green-500/10 text-green-600"
                        : "bg-red-500/10 text-red-600"
                    }`}
                  >
                    {log.status}
                  </span>
                </td>
                <td className="text-muted-foreground px-5 py-4 text-xs whitespace-nowrap">
                  {new Date(log.createdAt).toLocaleDateString()}{" "}
                  {new Date(log.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </td>
                <td className="px-5 py-4 text-right">
                  <Link
                    to={`/admin/audit-logs/${log.id}`}
                    className="text-muted-foreground hover:text-primary inline-flex items-center gap-1 text-xs"
                  >
                    View
                    <ChevronRight className="size-3" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground text-xs">
            Showing {(page - 1) * limit + 1}–{Math.min(page * limit, total)} of {total} logs
          </p>
          <div className="flex gap-1">
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
              className="hover:bg-muted disabled:text-muted-foreground/40 rounded-lg px-3 py-1.5 text-sm transition-colors disabled:cursor-not-allowed"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => onPageChange(i + 1)}
                className={`rounded-lg px-3 py-1.5 text-sm transition-colors ${
                  page === i + 1
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted text-muted-foreground"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
              className="hover:bg-muted disabled:text-muted-foreground/40 rounded-lg px-3 py-1.5 text-sm transition-colors disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
