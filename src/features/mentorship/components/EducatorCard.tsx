import { Link } from "react-router-dom";
import { ChevronRight, Star } from "lucide-react";
import type { EducatorListing } from "../services/mentorshipService";

interface EducatorCardProps {
  educator: EducatorListing;
}

export default function EducatorCard({ educator }: EducatorCardProps) {
  return (
    <Link
      to={`/mentorship/educators/${educator.id}`}
      className="group bg-card rounded-xl border p-5 transition-shadow hover:shadow-md"
    >
      <div className="flex items-center gap-3">
        <div className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-full text-sm font-bold">
          {educator.firstName[0]}
          {educator.lastName[0]}
        </div>
        <div className="flex-1">
          <p className="text-foreground group-hover:text-primary text-sm font-medium">
            {educator.firstName} {educator.lastName}
          </p>
          <p className="text-muted-foreground text-xs">{educator.email}</p>
          {educator.rating && educator.rating.average !== null && (
            <p className="mt-0.5 flex items-center gap-1 text-xs">
              <Star className="size-3 text-yellow-500" />
              <span className="text-foreground">{educator.rating.average}</span>
              <span className="text-muted-foreground">({educator.rating.count})</span>
            </p>
          )}
        </div>
        <ChevronRight className="text-muted-foreground size-4" />
      </div>
      <div className="mt-3 flex flex-wrap gap-1">
        {educator.mentorshipProfile.topics.slice(0, 3).map((t) => (
          <span key={t} className="bg-primary/10 text-primary rounded-full px-2 py-0.5 text-xs">
            {t}
          </span>
        ))}
        {educator.mentorshipProfile.topics.length > 3 && (
          <span className="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-xs">
            +{educator.mentorshipProfile.topics.length - 3}
          </span>
        )}
      </div>
    </Link>
  );
}
