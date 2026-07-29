import { Handshake, Search, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import LoadingBubbles from "@/components/shared/LoadingBubbles";
import EducatorCard from "./EducatorCard";
import type { EducatorListing } from "../services/mentorshipService";

interface EducatorListProps {
  educators: EducatorListing[];
  isLoading: boolean;
  currentUserId: string | undefined;
  hasSearch: boolean;
}

export default function EducatorList({
  educators,
  isLoading,
  currentUserId,
  hasSearch,
}: EducatorListProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <LoadingBubbles size="md" />
      </div>
    );
  }

  const visible = educators.filter((e) => e.id !== currentUserId);

  if (visible.length === 0 && hasSearch) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Search className="text-muted-foreground mb-4 size-12" />
        <h3 className="text-foreground text-lg font-semibold">No educators match your search</h3>
        <p className="text-muted-foreground mt-1 max-w-sm text-sm">
          Try searching with a different name or topic, or clear the search to browse all available
          mentors.
        </p>
      </div>
    );
  }

  if (visible.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Handshake className="text-muted-foreground mb-4 size-12" />
        <h3 className="text-foreground text-lg font-semibold">No mentors available yet</h3>
        <p className="text-muted-foreground mt-1 max-w-sm text-sm">
          There are no educators who have opted in to the mentorship program yet. Check back later!
        </p>
        <Link
          to="/courses"
          className="text-primary hover:underline mt-4 inline-flex items-center gap-1 text-sm"
        >
          <BookOpen className="size-4" />
          Browse courses instead
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {visible.map((e) => (
        <EducatorCard key={e.id} educator={e} />
      ))}
    </div>
  );
}
