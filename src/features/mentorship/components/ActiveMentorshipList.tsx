import { Handshake } from "lucide-react";
import ActiveMentorshipCard from "./ActiveMentorshipCard";
import type { Mentorship } from "../services/mentorshipService";
import type { User } from "@/features/auth/types/authTypes";

interface ActiveMentorshipListProps {
  mentorships: Mentorship[];
  currentUser: User;
  onChat: (id: string) => void;
  onEnd: (id: string) => void;
}

export default function ActiveMentorshipList({
  mentorships,
  currentUser,
  onChat,
  onEnd,
}: ActiveMentorshipListProps) {
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
          onChat={onChat}
          onEnd={onEnd}
        />
      ))}
    </div>
  );
}
