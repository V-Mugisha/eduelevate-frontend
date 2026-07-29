import { useParams, Link } from "react-router-dom";
import { ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import LoadingBubbles from "@/components/shared/LoadingBubbles";
import useAuditLogDetail from "./hooks/useAuditLogDetail";

export default function AuditLogDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { log, isLoading } = useAuditLogDetail(id);

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <LoadingBubbles size="md" />
      </div>
    );
  }

  if (!log) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-muted-foreground">Audit log entry not found.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        to="/admin/audit-logs"
        className="text-muted-foreground hover:text-foreground mb-6 inline-flex items-center gap-1 text-sm"
      >
        <ArrowLeft className="size-4" />
        Back to Audit Logs
      </Link>

      <div className="mb-8">
        <h1 className="text-foreground text-2xl font-bold">Audit Log Detail</h1>
        <p className="text-muted-foreground mt-1 text-sm">Detailed view of a single audit event</p>
      </div>

      <div className="bg-card rounded-xl border p-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <span className="text-xs font-medium tracking-wider text-gray-500 uppercase">
              Action
            </span>
            <p className="text-foreground mt-1 text-sm font-semibold">{log.action}</p>
          </div>
          <div>
            <span className="text-xs font-medium tracking-wider text-gray-500 uppercase">
              Status
            </span>
            <p className="mt-1 flex items-center gap-1.5">
              {log.status === "success" ? (
                <>
                  <CheckCircle className="size-4 text-green-600" />
                  <span className="text-sm font-medium text-green-600">Success</span>
                </>
              ) : (
                <>
                  <XCircle className="size-4 text-red-600" />
                  <span className="text-sm font-medium text-red-600">Failure</span>
                </>
              )}
            </p>
          </div>
          <div>
            <span className="text-xs font-medium tracking-wider text-gray-500 uppercase">
              Entity Type
            </span>
            <p className="text-foreground mt-1 text-sm">{log.entityType}</p>
          </div>
          <div>
            <span className="text-xs font-medium tracking-wider text-gray-500 uppercase">
              Entity ID
            </span>
            <p className="text-foreground mt-1 font-mono text-sm">
              {log.entityId ?? <span className="text-muted-foreground italic">N/A</span>}
            </p>
          </div>
          <div>
            <span className="text-xs font-medium tracking-wider text-gray-500 uppercase">
              Performed By
            </span>
            <p className="text-foreground mt-1 text-sm">
              {log.performer ? (
                `${log.performer.firstName} ${log.performer.lastName} (${log.performer.email})`
              ) : (
                <span className="text-muted-foreground italic">System</span>
              )}
            </p>
          </div>
          <div>
            <span className="text-xs font-medium tracking-wider text-gray-500 uppercase">
              Timestamp
            </span>
            <p className="text-foreground mt-1 text-sm">
              {new Date(log.createdAt).toLocaleString()}
            </p>
          </div>
          {log.ipAddress && (
            <div>
              <span className="text-xs font-medium tracking-wider text-gray-500 uppercase">
                IP Address
              </span>
              <p className="text-foreground mt-1 font-mono text-sm">{log.ipAddress}</p>
            </div>
          )}
          {log.userAgent && (
            <div>
              <span className="text-xs font-medium tracking-wider text-gray-500 uppercase">
                User Agent
              </span>
              <p className="text-muted-foreground mt-1 text-xs break-all">{log.userAgent}</p>
            </div>
          )}
        </div>

        {log.details && Object.keys(log.details).length > 0 && (
          <div className="mt-6 border-t pt-6">
            <h3 className="text-foreground text-sm font-semibold">Details</h3>
            <pre className="bg-muted/30 mt-3 overflow-auto rounded-lg p-4 text-xs">
              {JSON.stringify(log.details, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
