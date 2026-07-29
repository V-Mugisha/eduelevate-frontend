import { Link } from "react-router-dom";
import {
  Users,
  BookOpen,
  GraduationCap,
  Award,
  ShieldCheck,
  ScrollText,
  ArrowRight,
  CheckCircle,
  XCircle,
} from "lucide-react";
import LoadingBubbles from "@/components/shared/LoadingBubbles";
import WelcomeCard from "./components/WelcomeCard";
import StatCard from "./components/StatCard";
import QuickLinkCard from "./components/QuickLinkCard";
import useDashboardStats from "./hooks/useDashboardStats";
import useAuth from "@/features/auth/hooks/useAuth";
import type { AdminStats } from "./types/dashboardTypes";

export default function AdminDashboard() {
  const { user } = useAuth();
  const { stats, isLoading } = useDashboardStats();
  const adminStats = stats as AdminStats | null;

  if (isLoading) {
    return (
      <div className="flex justify-center py-24">
        <LoadingBubbles size="lg" />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      {user && <WelcomeCard user={user} />}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Users}
          label="Total Users"
          value={adminStats?.totalUsers ?? 0}
          accent="bg-blue-500/10 text-blue-600"
        />
        <StatCard
          icon={BookOpen}
          label="Total Courses"
          value={adminStats?.totalCourses ?? 0}
          accent="bg-green-500/10 text-green-600"
        />
        <StatCard
          icon={GraduationCap}
          label="Total Enrollments"
          value={adminStats?.totalEnrollments ?? 0}
          accent="bg-purple-500/10 text-purple-600"
        />
        <StatCard
          icon={Award}
          label="Certificates Issued"
          value={adminStats?.totalCertificates ?? 0}
          accent="bg-yellow-500/10 text-yellow-600"
        />
      </div>

      <div>
        <h2 className="text-foreground mb-4 text-lg font-semibold">Quick Actions</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <QuickLinkCard
            icon={Users}
            label="Manage Users"
            description="View, create, and manage all user accounts"
            href="/admin/users"
            accent="bg-blue-500/10 text-blue-600"
          />
          <QuickLinkCard
            icon={ScrollText}
            label="Audit Logs"
            description="Track all system activity and changes"
            href="/admin/audit-logs"
            accent="bg-purple-500/10 text-purple-600"
          />
          <QuickLinkCard
            icon={BookOpen}
            label="All Courses"
            description="Browse and manage all platform courses"
            href="/courses"
            accent="bg-green-500/10 text-green-600"
          />
          <QuickLinkCard
            icon={ShieldCheck}
            label="Mentorship Hub"
            description="View mentorship activity across the platform"
            href="/mentorship"
            accent="bg-yellow-500/10 text-yellow-600"
          />
        </div>
      </div>

      <div className="bg-card rounded-xl border p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-foreground text-lg font-semibold">Recent Activity</h2>
          <Link
            to="/admin/audit-logs"
            className="text-primary hover:underline inline-flex items-center gap-1 text-sm"
          >
            View all
            <ArrowRight className="size-3" />
          </Link>
        </div>

        {!adminStats || adminStats.recentAuditLogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <ScrollText className="text-muted-foreground mb-3 size-10" />
            <p className="text-muted-foreground text-sm">No recent activity to show.</p>
          </div>
        ) : (
          <div className="mt-4 space-y-2">
            {adminStats.recentAuditLogs.map((log) => (
              <div
                key={log.id}
                className="hover:bg-muted/30 flex items-center justify-between rounded-lg border p-3 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {log.status === "success" ? (
                    <CheckCircle className="size-4 shrink-0 text-green-600" />
                  ) : (
                    <XCircle className="size-4 shrink-0 text-red-600" />
                  )}
                  <div>
                    <p className="text-foreground text-xs font-medium">{log.action}</p>
                    <p className="text-muted-foreground text-[10px]">
                      {log.performer
                        ? `by ${log.performer.firstName} ${log.performer.lastName}`
                        : "System"}
                      {" · "}
                      {new Date(log.createdAt).toLocaleDateString()}{" "}
                      {new Date(log.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
