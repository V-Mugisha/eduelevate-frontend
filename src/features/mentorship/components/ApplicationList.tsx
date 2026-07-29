import { Handshake } from "lucide-react";
import ApplicationCard from "./ApplicationCard";
import type { MentorshipApplication } from "../services/mentorshipService";

interface ApplicationListProps {
  applications: MentorshipApplication[];
  isEducator: boolean;
  rejectingId: string | null;
  rejectionReason: string;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
  onShowReject: (id: string) => void;
  onCancelReject: () => void;
  onRejectionReasonChange: (value: string) => void;
}

export default function ApplicationList({
  applications,
  isEducator,
  rejectingId,
  rejectionReason,
  onAccept,
  onReject,
  onShowReject,
  onCancelReject,
  onRejectionReasonChange,
}: ApplicationListProps) {
  if (applications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Handshake className="text-muted-foreground size-12" />
        <p className="text-muted-foreground mt-4">No applications.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {applications.map((app) => (
        <ApplicationCard
          key={app.id}
          application={app}
          isEducator={isEducator}
          rejectingId={rejectingId}
          rejectionReason={rejectionReason}
          onAccept={onAccept}
          onReject={onReject}
          onShowReject={onShowReject}
          onCancelReject={onCancelReject}
          onRejectionReasonChange={onRejectionReasonChange}
        />
      ))}
    </div>
  );
}
