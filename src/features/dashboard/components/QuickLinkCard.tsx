import { Link } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import { ChevronRight } from "lucide-react";

interface QuickLinkCardProps {
  icon: LucideIcon;
  label: string;
  description: string;
  href: string;
  accent?: string;
}

export default function QuickLinkCard({
  icon: Icon,
  label,
  description,
  href,
  accent,
}: QuickLinkCardProps) {
  return (
    <Link
      to={href}
      className="bg-card group rounded-xl border p-5 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="flex items-start justify-between">
        <div className={`flex size-10 items-center justify-center rounded-lg ${accent ?? "bg-primary/10 text-primary"}`}>
          <Icon className="size-5" />
        </div>
        <ChevronRight className="text-muted-foreground group-hover:text-primary size-4 transition-colors" />
      </div>
      <div className="mt-3">
        <p className="text-foreground text-sm font-semibold">{label}</p>
        <p className="text-muted-foreground mt-0.5 text-xs">{description}</p>
      </div>
    </Link>
  );
}
