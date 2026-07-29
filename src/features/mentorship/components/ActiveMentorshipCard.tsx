import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Mentorship } from "../services/mentorshipService";
import type { User } from "@/features/auth/types/authTypes";

interface ActiveMentorshipCardProps {
  mentorship: Mentorship;
  currentUser: User;
  onChat: (id: string) => void;
  onEnd: (id: string) => void;
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function ActiveMentorshipCard({
  mentorship,
  currentUser,
  onChat,
  onEnd,
}: ActiveMentorshipCardProps) {
  const isStudent = mentorship.studentId === currentUser.id;
  const otherPerson = isStudent ? mentorship.educator : mentorship.student;
  const roleLabel = isStudent ? "Educator" : "Student";
  const initials = otherPerson.firstName[0] + otherPerson.lastName[0];
  const isActive = !mentorship.endedAt;

  return (
    <div className="bg-card rounded-xl border p-5">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className="bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-bold">
            {initials}
          </div>
          <div>
            <p className="text-foreground text-sm font-semibold">
              {otherPerson.firstName} {otherPerson.lastName}
            </p>
            <p className="text-muted-foreground text-xs">
              {roleLabel} &bull; Since {formatDate(mentorship.startedAt)}
              {!isActive && mentorship.endedAt && <> &bull; Ended {formatDate(mentorship.endedAt)}</>}
            </p>
          </div>
        </div>
        <div className="text-right">
          <span
            className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
              isActive
                ? "bg-green-500/10 text-green-600"
                : "bg-red-500/10 text-red-600"
            }`}
          >
            {isActive ? "Active" : "Ended"}
          </span>
          {mentorship.rating && (
            <p className="text-muted-foreground mt-1 text-xs">Rated: {mentorship.rating.rating}/10</p>
          )}
        </div>
      </div>

      {isActive && (
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={() => onChat(mentorship.id)}>
            <MessageSquare className="mr-1.5 size-3" />
            Chat
          </Button>
          <Button variant="outline" size="sm" onClick={() => onEnd(mentorship.id)}>
            End
          </Button>
        </div>
      )}
    </div>
  );
}
