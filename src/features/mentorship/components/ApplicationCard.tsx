import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { MentorshipApplication } from "../services/mentorshipService";

interface ApplicationCardProps {
  application: MentorshipApplication;
  isEducator: boolean;
  rejectingId: string | null;
  rejectionReason: string;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
  onShowReject: (id: string) => void;
  onCancelReject: () => void;
  onRejectionReasonChange: (value: string) => void;
}

function statusStyles(status: string) {
  if (status === "pending") return "bg-yellow-500/10 text-yellow-600";
  if (status === "accepted") return "bg-green-500/10 text-green-600";
  return "bg-red-500/10 text-red-600";
}

export default function ApplicationCard({
  application,
  isEducator,
  rejectingId,
  rejectionReason,
  onAccept,
  onReject,
  onShowReject,
  onCancelReject,
  onRejectionReasonChange,
}: ApplicationCardProps) {
  const isRejecting = rejectingId === application.id;
  const firstName = isEducator
    ? (application.student?.firstName ?? "")
    : (application.educator?.firstName ?? "");
  const lastName = isEducator
    ? (application.student?.lastName ?? "")
    : (application.educator?.lastName ?? "");
  const email = isEducator ? application.student?.email : undefined;
  const initials = (firstName[0] ?? "") + (lastName[0] ?? "");
  const appliedDate = new Date(application.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="bg-card rounded-xl border p-5">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className="bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-bold">
            {initials || "?"}
          </div>
          <div>
            <p className="text-foreground text-sm font-semibold">
              {firstName} {lastName}
            </p>
            {email && <p className="text-muted-foreground text-xs">{email}</p>}
            <p className="text-muted-foreground mt-0.5 text-xs">Applied {appliedDate}</p>
          </div>
        </div>
        <div className="text-right">
          <span
            className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${statusStyles(application.status)}`}
          >
            {application.status}
          </span>
          {application.rejectionReason && (
            <p className="text-muted-foreground mt-1 text-xs italic">
              Reason: {application.rejectionReason}
            </p>
          )}
        </div>
      </div>

      {application.message && (
        <div className="bg-muted/30 mt-4 rounded-lg border-l-2 border-primary/30 py-3 pl-4 pr-3">
          <p className="text-foreground/85 text-sm leading-relaxed italic">
            &ldquo;{application.message}&rdquo;
          </p>
        </div>
      )}

      <div className="mt-4 flex items-center justify-between">
        <div>
          {application.topic && (
            <span className="bg-primary/10 text-primary rounded-full px-2 py-0.5 text-xs font-medium">
              {application.topic}
            </span>
          )}
        </div>

        {isEducator && application.status === "pending" && (
          <div className="flex gap-2">
            {isRejecting ? (
              <div className="flex items-center gap-2">
                <Input
                  className="h-8 w-40 text-xs"
                  placeholder="Reason (optional)"
                  value={rejectionReason}
                  onChange={(e) => onRejectionReasonChange(e.target.value)}
                />
                <Button size="sm" variant="destructive" onClick={() => onReject(application.id)}>
                  Confirm
                </Button>
                <Button size="sm" variant="outline" onClick={onCancelReject}>
                  Cancel
                </Button>
              </div>
            ) : (
              <>
                <Button size="sm" onClick={() => onAccept(application.id)}>
                  Accept
                </Button>
                <Button size="sm" variant="outline" onClick={() => onShowReject(application.id)}>
                  Reject
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
