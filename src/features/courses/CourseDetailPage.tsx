import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, BookOpen, Clock, User, Shield, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import LoadingBubbles from "@/components/shared/LoadingBubbles";
import useAuth from "@/features/auth/hooks/useAuth";
import { getCourse } from "./services/coursesService";
import type { Course } from "./types/coursesTypes";
import useEnrollment from "./hooks/useEnrollment";
import EnrollmentModal from "./components/EnrollmentModal";

const levelColors: Record<string, string> = {
  beginner: "bg-green-500/10 text-green-600 dark:text-green-400",
  intermediate: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
  advanced: "bg-red-500/10 text-red-600 dark:text-red-400",
};

function gradientFromId(id: string): string {
  const hash = id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const hue = hash % 360;
  return `linear-gradient(135deg, hsl(${hue}, 60%, 65%), hsl(${(hue + 40) % 360}, 60%, 50%))`;
}

export default function CourseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isEnrolled, progress, handleEnroll, fetchEnrollment } = useEnrollment(id ?? "");
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [isEnrolling, setIsEnrolling] = useState(false);

  useEffect(() => {
    if (!id) return;
    getCourse(id)
      .then(setCourse)
      .catch(() => setError("Failed to load course details."))
      .finally(() => setIsLoading(false));
  }, [id]);

  const isOwner = user?.id === course?.creator?.id;
  const isEducatorOrAdmin = user?.role === "educator" || user?.role === "admin";

  async function confirmEnroll() {
    setIsEnrolling(true);
    try {
      await handleEnroll();
      await fetchEnrollment();
      setShowEnrollModal(false);
    } catch {
      // error handled by hook
    } finally {
      setIsEnrolling(false);
    }
  }

  if (isLoading) return <LoadingBubbles size="lg" />;
  if (error || !course) {
    return (
      <div className="flex items-center justify-center px-4 py-20">
        <p className="text-muted-foreground">{error ?? "Course not found."}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-10 lg:px-8">
      <Button variant="ghost" onClick={() => navigate("/courses")} className="mb-6 -ml-3">
        <ArrowLeft className="mr-1.5 size-4" />
        Back to Courses
      </Button>

      <div
        className="flex h-48 items-center justify-center rounded-xl sm:h-56"
        style={{ background: gradientFromId(course.id) }}
      >
        <BookOpen className="size-12 text-white/50" />
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <span className="bg-primary/10 text-primary inline-block rounded-full px-3 py-1 text-sm font-medium">
            {course.category.name}
          </span>
          <h1 className="text-foreground mt-3 text-3xl font-bold">{course.title}</h1>
          {course.subtitle && (
            <p className="text-muted-foreground mt-2 text-lg">{course.subtitle}</p>
          )}
          <div className="mt-6 flex flex-wrap gap-2">
            <span
              className={`rounded-full px-3 py-1 text-sm font-medium ${levelColors[course.level]}`}
            >
              {course.level}
            </span>
            {course.duration && (
              <span className="bg-muted text-muted-foreground flex items-center gap-1 rounded-full px-3 py-1 text-sm">
                <Clock className="size-3.5" /> {course.duration}
              </span>
            )}
          </div>
          <div className="mt-8">
            <h2 className="text-foreground text-lg font-semibold">About this course</h2>
            <p className="text-muted-foreground mt-3 leading-relaxed whitespace-pre-line">
              {course.description}
            </p>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-card sticky top-20 rounded-xl border p-6 shadow-sm">
            <h3 className="text-foreground font-semibold">Course Info</h3>
            <div className="mt-4 space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <User className="text-muted-foreground size-4" />
                <span className="text-muted-foreground">
                  {course.creator.firstName} {course.creator.lastName}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Shield className="text-muted-foreground size-4" />
                <span className={`font-medium capitalize ${levelColors[course.level]}`}>
                  {course.level}
                </span>
              </div>
              {course.duration && (
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="text-muted-foreground size-4" />
                  <span className="text-muted-foreground">{course.duration}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm">
                <BookOpen className="text-muted-foreground size-4" />
                <span className="text-muted-foreground">{course.category.name}</span>
              </div>
            </div>
            <div className="mt-4 border-t pt-4">
              {isOwner || isEducatorOrAdmin ? (
                <Link to={`/courses/${course.id}/content`}>
                  <Button className="w-full">Manage Content</Button>
                </Link>
              ) : isEnrolled ? (
                <div>
                  {progress > 0 && (
                    <div className="mb-3">
                      <div className="text-muted-foreground flex items-center justify-between text-xs">
                        <span>Progress</span>
                        <span>{progress}%</span>
                      </div>
                      <div className="bg-muted mt-1 h-1.5 w-full overflow-hidden rounded-full">
                        <div
                          className="bg-primary h-full rounded-full transition-all"
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        />
                      </div>
                    </div>
                  )}
                  <Link to={`/courses/${course.id}/learn`}>
                    <Button className="w-full">
                      <Play className="mr-1.5 size-4" />
                      {progress > 0 ? `Continue (${progress}%)` : "Start Learning"}
                    </Button>
                  </Link>
                </div>
              ) : (
                <Button className="w-full" onClick={() => setShowEnrollModal(true)}>
                  Enroll
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <EnrollmentModal
        courseTitle={course.title}
        isOpen={showEnrollModal}
        onConfirm={confirmEnroll}
        onCancel={() => setShowEnrollModal(false)}
        isLoading={isEnrolling}
      />
    </div>
  );
}
