import { Handshake } from "lucide-react";
import LoadingBubbles from "@/components/shared/LoadingBubbles";
import ActiveMentorshipCard from "./ActiveMentorshipCard";
import type { Mentorship } from "../services/mentorshipService";
import type { User } from "@/features/auth/types/authTypes";

interface ActiveMentorshipListProps {
  mentorships: Mentorship[];
  currentUser: User;
  isLoading: boolean;
  isSaving: boolean;
  onChat: (id: string) => void;
  onEnd: (id: string) => void;
}

export default function ActiveMentorshipList({
  mentorships,
  currentUser,
  isLoading,
  isSaving,
  onChat,
  onEnd,
}: ActiveMentorshipListProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <LoadingBubbles size="md" />
      </div>
    );
  }

  if (mentorships.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Handshake className="text-muted-foreground size-12" />
        <p className="text-muted-foreground mt-4">No active mentorships.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {mentorships.map((m) => (
        <ActiveMentorshipCard
          key={m.id}
          mentorship={m}
          currentUser={currentUser}
          isSaving={isSaving}
          onChat={onChat}
          onEnd={onEnd}
        />
      ))}
    </div>
  );
}
