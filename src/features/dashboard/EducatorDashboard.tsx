import { Link } from "react-router-dom";
import { BookOpen, Users, FileEdit, MessageSquare, Handshake, Plus, ArrowRight } from "lucide-react";
import LoadingBubbles from "@/components/shared/LoadingBubbles";
import WelcomeCard from "./components/WelcomeCard";
import StatCard from "./components/StatCard";
import QuickLinkCard from "./components/QuickLinkCard";
import useDashboardStats from "./hooks/useDashboardStats";
import useAuth from "@/features/auth/hooks/useAuth";
import type { EducatorStats } from "./types/dashboardTypes";

export default function EducatorDashboard() {
  const { user } = useAuth();
  const { stats, isLoading } = useDashboardStats();
  const educatorStats = stats as EducatorStats | null;

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
          icon={BookOpen}
          label="Published Courses"
          value={educatorStats?.publishedCourses ?? 0}
          accent="bg-green-500/10 text-green-600"
        />
        <StatCard
          icon={FileEdit}
          label="Draft Courses"
          value={educatorStats?.draftCourses ?? 0}
          accent="bg-yellow-500/10 text-yellow-600"
        />
        <StatCard
          icon={Users}
          label="Total Students"
          value={educatorStats?.totalStudents ?? 0}
          accent="bg-blue-500/10 text-blue-600"
        />
        <StatCard
          icon={MessageSquare}
          label="Pending Applications"
          value={educatorStats?.pendingMentorshipApplications ?? 0}
          accent="bg-purple-500/10 text-purple-600"
        />
      </div>

      <div>
        <h2 className="text-foreground mb-4 text-lg font-semibold">Quick Actions</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <QuickLinkCard
            icon={Plus}
            label="Create Course"
            description="Build a new course for students"
            href="/courses/create"
            accent="bg-primary/10 text-primary"
          />
          <QuickLinkCard
            icon={BookOpen}
            label="My Courses"
            description="Manage your published and draft courses"
            href="/courses/my-courses"
            accent="bg-blue-500/10 text-blue-600"
          />
          <QuickLinkCard
            icon={Handshake}
            label="Mentorship Hub"
            description="View mentorship applications and manage sessions"
            href="/mentorship"
            accent="bg-purple-500/10 text-purple-600"
          />
        </div>
      </div>

      <div className="bg-card rounded-xl border p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-foreground text-lg font-semibold">Recent Courses</h2>
          <Link
            to="/courses/my-courses"
            className="text-primary hover:underline inline-flex items-center gap-1 text-sm"
          >
            View all
            <ArrowRight className="size-3" />
          </Link>
        </div>

        {!educatorStats || educatorStats.recentCourses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <BookOpen className="text-muted-foreground mb-3 size-10" />
            <p className="text-muted-foreground text-sm">No courses yet.</p>
            <Link
              to="/courses/create"
              className="text-primary hover:underline mt-2 text-sm"
            >
              Create your first course
            </Link>
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            {educatorStats.recentCourses.map((course) => (
              <Link
                key={course.id}
                to={`/courses/${course.id}`}
                className="hover:bg-muted/30 flex items-center justify-between rounded-lg border p-4 transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-foreground truncate text-sm font-medium">{course.title}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-muted-foreground text-xs">{course.category}</span>
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-medium ${
                        course.isPublished
                          ? "bg-green-500/10 text-green-600"
                          : "bg-yellow-500/10 text-yellow-600"
                      }`}
                    >
                      {course.isPublished ? "Published" : "Draft"}
                    </span>
                    <span className="text-muted-foreground text-xs">
                      {course.enrolledCount} {course.enrolledCount === 1 ? "student" : "students"}
                    </span>
                  </div>
                </div>
                <ArrowRight className="text-muted-foreground ml-4 size-4 shrink-0" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
