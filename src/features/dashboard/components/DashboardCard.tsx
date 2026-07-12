import { useNavigate } from "react-router-dom";
import useAuth from "@/features/auth/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { LogOut, User, Mail, Shield, BookOpen, Code, Activity } from "lucide-react";
import type { User as UserType } from "@/features/auth/types/authTypes";

interface DashboardCardProps {
  user: UserType;
}

const roleLabel: Record<string, string> = {
  student: "Student",
  educator: "Educator",
  admin: "Administrator",
};

const stats = [
  { label: "Courses", value: "-", icon: BookOpen, description: "Coming soon" },
  { label: "Projects", value: "-", icon: Code, description: "Coming soon" },
  { label: "Exercises", value: "-", icon: Activity, description: "Coming soon" },
];

export default function DashboardCard({ user }: DashboardCardProps) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-primary/10 flex size-14 items-center justify-center rounded-full sm:size-16">
            <User className="text-primary size-7 sm:size-8" />
          </div>
          <div>
            <h1 className="text-foreground text-2xl font-bold sm:text-3xl">
              Welcome back, {user.firstName}!
            </h1>
            <div className="mt-1 flex items-center gap-2">
              <span className="bg-primary/10 text-primary inline-flex items-center rounded-full px-3 py-0.5 text-xs font-medium">
                {roleLabel[user.role] ?? user.role}
              </span>
            </div>
          </div>
        </div>
        <Button variant="outline" onClick={handleLogout} className="shrink-0">
          <LogOut className="mr-2 size-4" />
          Log Out
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-card flex flex-col gap-3 rounded-xl border p-5 shadow-sm"
          >
            <div className="bg-muted flex size-10 items-center justify-center rounded-lg">
              <stat.icon className="text-muted-foreground size-5" />
            </div>
            <div>
              <p className="text-muted-foreground text-sm">{stat.label}</p>
              <p className="text-foreground text-xl font-semibold">{stat.value}</p>
              <p className="text-muted-foreground mt-0.5 text-xs">{stat.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-card rounded-xl border p-6 shadow-sm">
        <h2 className="text-foreground text-lg font-semibold">Account Details</h2>
        <div className="mt-4 divide-y">
          <div className="flex items-center gap-3 py-3">
            <Mail className="text-muted-foreground size-4 shrink-0" />
            <span className="text-muted-foreground text-sm">Email</span>
            <span className="text-foreground ml-auto text-sm font-medium">{user.email}</span>
          </div>
          <div className="flex items-center gap-3 py-3">
            <User className="text-muted-foreground size-4 shrink-0" />
            <span className="text-muted-foreground text-sm">Full Name</span>
            <span className="text-foreground ml-auto text-sm font-medium">
              {user.firstName} {user.lastName}
            </span>
          </div>
          <div className="flex items-center gap-3 py-3">
            <Shield className="text-muted-foreground size-4 shrink-0" />
            <span className="text-muted-foreground text-sm">Role</span>
            <span className="text-foreground ml-auto text-sm font-medium">
              {roleLabel[user.role] ?? user.role}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
