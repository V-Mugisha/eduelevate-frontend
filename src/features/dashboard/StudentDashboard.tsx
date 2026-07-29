import { Link } from "react-router-dom";
import { BookOpen, Award, Handshake, ArrowRight } from "lucide-react";
import LoadingBubbles from "@/components/shared/LoadingBubbles";
import WelcomeCard from "./components/WelcomeCard";
import StatCard from "./components/StatCard";
import useDashboardStats from "./hooks/useDashboardStats";
import useAuth from "@/features/auth/hooks/useAuth";
import type { StudentStats } from "./types/dashboardTypes";

export default function StudentDashboard() {
  const { user } = useAuth();
  const { stats, isLoading } = useDashboardStats();
  const studentStats = stats as StudentStats | null;

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

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          icon={BookOpen}
          label="Courses Enrolled"
          value={studentStats?.enrolledCourses ?? 0}
          accent="bg-blue-500/10 text-blue-600"
        />
        <StatCard
          icon={Award}
          label="Certificates Earned"
          value={studentStats?.certificatesEarned ?? 0}
          accent="bg-yellow-500/10 text-yellow-600"
        />
        <StatCard
          icon={Handshake}
          label="Active Mentorships"
          value={studentStats?.activeMentorships ?? 0}
          accent="bg-green-500/10 text-green-600"
        />
      </div>

      <div className="bg-card rounded-xl border p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-foreground text-lg font-semibold">Continue Learning</h2>
          <Link
            to="/my-learning"
            className="text-primary hover:underline inline-flex items-center gap-1 text-sm"
          >
            View all
            <ArrowRight className="size-3" />
          </Link>
        </div>

        {!studentStats || studentStats.recentEnrollments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <BookOpen className="text-muted-foreground mb-3 size-10" />
            <p className="text-muted-foreground text-sm">No courses yet.</p>
            <Link
              to="/courses"
              className="text-primary hover:underline mt-2 text-sm"
            >
              Browse courses
            </Link>
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            {studentStats.recentEnrollments.map((enrollment) => (
              <Link
                key={enrollment.courseId}
                to={`/courses/${enrollment.courseId}/learn`}
                className="hover:bg-muted/30 flex items-center justify-between rounded-lg border p-4 transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-foreground truncate text-sm font-medium">
                    {enrollment.courseTitle}
                  </p>
                  <div className="mt-1.5 flex items-center gap-3">
                    <div className="bg-muted h-1.5 w-28 overflow-hidden rounded-full">
                      <div
                        className="bg-primary h-full rounded-full transition-all"
                        style={{ width: `${enrollment.progress}%` }}
                      />
                    </div>
                    <span className="text-muted-foreground text-xs">{enrollment.progress}%</span>
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
