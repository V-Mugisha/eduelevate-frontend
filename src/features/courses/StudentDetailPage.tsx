import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ChevronRight,
  CheckCircle,
  Mail,
  GraduationCap,
  Calendar,
  Shield,
  Award,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import LoadingBubbles from "@/components/shared/LoadingBubbles";
import { getStudentDetail } from "./services/enrollmentService";
import { generateCertificatePdf } from "@/lib/generateCertificatePdf";
import type { StudentDetail } from "./types/coursesTypes";

const gradeLabels: Record<string, string> = {
  S4: "Senior 4",
  S5: "Senior 5",
  S6: "Senior 6",
};

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function StudentDetailPage() {
  const { id: courseId, userId } = useParams<{ id: string; userId: string }>();
  const navigate = useNavigate();
  const [detail, setDetail] = useState<StudentDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!courseId || !userId) return;
    getStudentDetail(courseId, userId)
      .then(setDetail)
      .catch(() => setError("Failed to load student details."))
      .finally(() => setIsLoading(false));
  }, [courseId, userId]);

  function toggleModule(moduleId: string) {
    setExpandedModules((prev) => {
      const next = new Set(prev);
      if (next.has(moduleId)) next.delete(moduleId);
      else next.add(moduleId);
      return next;
    });
  }

  if (isLoading) return <LoadingBubbles size="lg" />;

  if (error || !detail) {
    return (
      <div className="flex items-center justify-center px-4 py-20">
        <p className="text-muted-foreground">{error ?? "Student not found."}</p>
      </div>
    );
  }

  const completedSet = new Set(detail.completedLessonIds);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <Button
        variant="ghost"
        onClick={() => navigate(`/courses/${courseId}/students`)}
        className="mb-4 -ml-3"
      >
        <ArrowLeft className="mr-1.5 size-4" />
        Back to Students
      </Button>

      <div className="mb-8">
        <h1 className="text-foreground text-2xl font-bold sm:text-3xl">
          {detail.user.firstName} {detail.user.lastName}
        </h1>
        <p className="text-muted-foreground mt-1">{detail.course.title}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <div className="bg-card rounded-xl border p-6 shadow-sm">
            <h3 className="text-foreground font-semibold">Student Info</h3>
            <div className="mt-4 space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="text-muted-foreground size-4" />
                <span className="text-muted-foreground">{detail.user.email}</span>
              </div>
              {detail.user.schoolName && (
                <div className="flex items-center gap-2 text-sm">
                  <GraduationCap className="text-muted-foreground size-4" />
                  <span className="text-muted-foreground">{detail.user.schoolName}</span>
                </div>
              )}
              {detail.user.grade && (
                <div className="flex items-center gap-2 text-sm">
                  <Shield className="text-muted-foreground size-4" />
                  <span className="text-muted-foreground">
                    {gradeLabels[detail.user.grade] ?? detail.user.grade}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="text-muted-foreground size-4" />
                <span className="text-muted-foreground">
                  Enrolled {formatDate(detail.enrolledAt)}
                </span>
              </div>
            </div>

            <div className="mt-6 border-t pt-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="text-foreground font-medium">{detail.progress}%</span>
              </div>
              <div className="bg-muted mt-2 h-2 w-full overflow-hidden rounded-full">
                <div
                  className="bg-primary h-full rounded-full transition-all"
                  style={{ width: `${detail.progress}%` }}
                />
              </div>
              <p className="text-muted-foreground mt-2 text-xs">
                {detail.completedCount} of {detail.totalLessons} lessons completed
              </p>
            </div>

            {detail.certificate && (
              <div className="mt-6 border-t pt-4">
                <div className="flex items-center gap-2">
                  <Award className="text-primary size-4" />
                  <span className="text-foreground text-sm font-medium">Certificate</span>
                </div>
                <p className="text-muted-foreground mt-1 text-xs">
                  Earned on{" "}
                  {new Date(detail.certificate.issuedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3 w-full"
                  onClick={() =>
                    generateCertificatePdf(
                      {
                        studentName: `${detail.user.firstName} ${detail.user.lastName}`,
                        courseTitle: detail.course.title,
                        educatorName: "Educator",
                        issuedAt: new Date(detail.certificate!.issuedAt).toLocaleDateString(
                          "en-US",
                          { year: "numeric", month: "long", day: "numeric" },
                        ),
                        certificateId: detail.certificate!.id,
                      },
                      `certificate-${detail.user.firstName}-${detail.user.lastName}.pdf`,
                    )
                  }
                >
                  <Download className="mr-1.5 size-3.5" />
                  Download PDF
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2">
          <h2 className="text-foreground mb-4 text-lg font-semibold">Course Content</h2>
          {detail.modules.length === 0 ? (
            <p className="text-muted-foreground text-sm">No content added yet.</p>
          ) : (
            <div className="bg-card divide-y rounded-xl border">
              {detail.modules.map((mod) => {
                const isExpanded = expandedModules.has(mod.id);
                const completedInModule = mod.lessons.filter((l) => completedSet.has(l.id)).length;
                return (
                  <div key={mod.id}>
                    <button
                      onClick={() => toggleModule(mod.id)}
                      className="text-foreground hover:bg-muted/50 flex w-full items-center gap-2 px-4 py-3 text-left text-sm font-medium"
                    >
                      <ChevronRight
                        className={`text-muted-foreground size-4 shrink-0 transition-transform ${isExpanded ? "rotate-90" : ""}`}
                      />
                      <span className="flex-1">{mod.title}</span>
                      <span className="text-muted-foreground text-xs">
                        {completedInModule}/{mod.lessons.length}
                      </span>
                    </button>
                    {isExpanded && (
                      <div className="bg-muted/20 border-t px-4 py-2">
                        {mod.lessons.map((lesson) => {
                          const isComplete = completedSet.has(lesson.id);
                          return (
                            <div key={lesson.id} className="flex items-center gap-2 py-1.5 text-sm">
                              {isComplete ? (
                                <CheckCircle className="size-4 shrink-0 text-green-500" />
                              ) : (
                                <div className="border-muted-foreground/30 size-4 shrink-0 rounded-full border-2" />
                              )}
                              <span
                                className={isComplete ? "text-foreground" : "text-muted-foreground"}
                              >
                                {lesson.title}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
