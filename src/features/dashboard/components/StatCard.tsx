import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: number | string;
  accent?: string;
}

export default function StatCard({ icon: Icon, label, value, accent }: StatCardProps) {
  return (
    <div className="bg-card rounded-xl border p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div
          className={`flex size-10 items-center justify-center rounded-lg ${accent ?? "bg-primary/10 text-primary"}`}
        >
          <Icon className="size-5" />
        </div>
        <div>
          <p className="text-muted-foreground text-xs">{label}</p>
          <p className="text-foreground text-xl font-bold">{value}</p>
        </div>
      </div>
    </div>
  );
}
