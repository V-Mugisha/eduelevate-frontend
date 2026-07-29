import { useState, useEffect } from "react";
import { Clock } from "lucide-react";
import type { User } from "@/features/auth/types/authTypes";

interface WelcomeCardProps {
  user: User;
}

const roleLabel: Record<string, string> = {
  student: "Student",
  educator: "Educator",
  admin: "Admin",
};

const roleBadgeStyles: Record<string, string> = {
  student: "bg-green-500/10 text-green-600",
  educator: "bg-blue-500/10 text-blue-600",
  admin: "bg-purple-500/10 text-purple-600",
};

function useClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

export default function WelcomeCard({ user }: WelcomeCardProps) {
  const clock = useClock();
  const initials = user.firstName[0] + user.lastName[0];
  const date = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="bg-card relative overflow-hidden rounded-xl border p-6 sm:p-8">
      <div className="bg-primary/5 absolute top-0 right-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full" />
      <div className="bg-primary/5 absolute right-12 bottom-0 h-24 w-24 translate-y-8 rounded-full" />

      <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-primary/10 text-primary flex size-14 shrink-0 items-center justify-center rounded-full text-xl font-bold sm:size-16 sm:text-2xl">
            {initials}
          </div>
          <div>
            <h1 className="text-foreground text-xl font-bold sm:text-2xl">
              Welcome back, {user.firstName}!
            </h1>
            <div className="mt-1.5 flex flex-wrap items-center gap-2">
              <span
                className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${roleBadgeStyles[user.role] ?? "bg-muted text-muted-foreground"}`}
              >
                {roleLabel[user.role] ?? user.role}
              </span>
              <span className="text-muted-foreground text-sm">{user.email}</span>
            </div>
            <p className="text-muted-foreground mt-1 text-xs">{date}</p>
          </div>
        </div>

        <div className="bg-muted/50 flex items-center gap-3 self-start rounded-xl border px-5 py-3 sm:self-center">
          <Clock className="text-primary size-5" />
          <span className="text-foreground font-mono text-2xl font-semibold tracking-wider tabular-nums">
            {clock}
          </span>
        </div>
      </div>
    </div>
  );
}
