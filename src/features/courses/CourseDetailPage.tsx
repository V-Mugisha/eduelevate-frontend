import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  Clock,
  User,
  Shield,
  Play,
  Users,
  Send,
  EyeOff,
  Loader2,
  Award,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import LoadingBubbles from "@/components/shared/LoadingBubbles";
import useAuth from "@/features/auth/hooks/useAuth";
import { getCourse, publishCourse } from "./services/coursesService";
import type { Course } from "./types/coursesTypes";
import useEnrollment from "./hooks/useEnrollment";
import { generateCertificate, getCertificateByCourse } from "./services/certificateService";
import { generateCertificatePdf } from "@/lib/generateCertificatePdf";
import type { Certificate } from "./types/coursesTypes";
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
  const [showUnpublishConfirm, setShowUnpublishConfirm] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "certificate">("overview");
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [isGeneratingCert, setIsGeneratingCert] = useState(false);

  useEffect(() => {
    if (!id) return;
    getCourse(id)
      .then(setCourse)
      .catch(() => setError("Failed to load course details."))
      .finally(() => setIsLoading(false));
  }, [id]);

  useEffect(() => {
    if (!id || !isEnrolled) return;
    getCertificateByCourse(id)
      .then((cert) => setCertificate(cert ?? null))
      .catch(() => setCertificate(null));
  }, [id, isEnrolled]);

  const isOwner = user?.id === course?.creator?.id || user?.role === "admin";

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

  async function handlePublish() {
    if (!id || !course) return;
    if (course.isPublished) {
      setShowUnpublishConfirm(true);
      return;
    }
    setIsPublishing(true);
    try {
      const updated = await publishCourse(id, true);
      setCourse(updated);
    } catch {
      // error silently handled
    } finally {
      setIsPublishing(false);
    }
  }

  async function confirmUnpublish() {
    if (!id || !course) return;
    setIsPublishing(true);
    setShowUnpublishConfirm(false);
    try {
      const updated = await publishCourse(id, false);
      setCourse(updated);
    } catch {
      // error silently handled
    } finally {
      setIsPublishing(false);
    }
  }

  async function handleGenerateCertificate() {
    if (!id) return;
    setIsGeneratingCert(true);
    try {
      const cert = await generateCertificate(id);
      setCertificate(cert);
    } catch {
      // error handled silently
    } finally {
      setIsGeneratingCert(false);
    }
  }

  function handleDownloadCert() {
    if (!certificate) return;
    generateCertificatePdf(
      {
        studentName: `${certificate.user.firstName} ${certificate.user.lastName}`,
        courseTitle: certificate.course.title,
        educatorName: `${certificate.course.creator.firstName} ${certificate.course.creator.lastName}`,
        issuedAt: new Date(certificate.issuedAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        certificateId: certificate.id,
      },
      `certificate-${certificate.user.firstName}-${certificate.user.lastName}.pdf`,
    );
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

      <div className="mt-8 border-b">
        <nav className="flex gap-6">
          <button
            onClick={() => setActiveTab("overview")}
            className={`border-b-2 pb-2 text-sm font-medium transition-colors ${
              activeTab === "overview"
                ? "border-primary text-primary"
                : "text-muted-foreground hover:text-foreground border-transparent"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("certificate")}
            className={`border-b-2 pb-2 text-sm font-medium transition-colors ${
              activeTab === "certificate"
                ? "border-primary text-primary"
                : "text-muted-foreground hover:text-foreground border-transparent"
            }`}
          >
            Certificate
          </button>
        </nav>
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {activeTab === "overview" ? (
            <>
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
            </>
          ) : (
            <div>
              {!isEnrolled || isOwner ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <Award className="text-muted-foreground size-12" />
                  <p className="text-muted-foreground mt-4">
                    Enroll and complete this course to earn a certificate.
                  </p>
                </div>
              ) : certificate ? (
                <div className="space-y-4">
                  <div className="bg-card rounded-xl border p-6">
                    <div className="flex items-center gap-2">
                      <Award className="text-primary size-5" />
                      <span className="text-foreground text-sm font-medium">
                        Certificate Earned
                      </span>
                    </div>
                    <p className="text-muted-foreground mt-2 text-sm">
                      You earned this certificate on{" "}
                      {new Date(certificate.issuedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                      .
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Link to={`/certificates/${certificate.id}`}>
                        <Button variant="outline" size="sm">
                          View Certificate
                        </Button>
                      </Link>
                      <Button variant="default" size="sm" onClick={handleDownloadCert}>
                        <Download className="mr-1.5 size-4" />
                        Download PDF
                      </Button>
                    </div>
                  </div>
                </div>
              ) : progress === 100 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <Award className="text-primary size-12" />
                  <p className="text-foreground mt-4 text-lg font-medium">
                    Congratulations! You have completed this course.
                  </p>
                  <p className="text-muted-foreground mt-1 text-sm">
                    Generate your certificate now.
                  </p>
                  <Button
                    className="mt-6"
                    onClick={handleGenerateCertificate}
                    disabled={isGeneratingCert}
                  >
                    <Award className="mr-2 size-4" />
                    {isGeneratingCert ? "Generating..." : "Generate Certificate"}
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <Award className="text-muted-foreground size-12" />
                  <p className="text-foreground mt-4 text-lg font-medium">
                    Complete all lessons to earn your certificate
                  </p>
                  <div className="mt-4 w-full max-w-xs">
                    <div className="text-muted-foreground flex items-center justify-between text-xs">
                      <span>Progress</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="bg-muted mt-1 h-1.5 w-full overflow-hidden rounded-full">
                      <div
                        className="bg-primary h-full rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                  {isEnrolled && (
                    <Link to={`/courses/${course.id}/learn`} className="mt-6">
                      <Button size="sm">
                        <Play className="mr-1.5 size-4" />
                        Continue Learning
                      </Button>
                    </Link>
                  )}
                </div>
              )}
            </div>
          )}
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
              {course.maxStudents && (
                <div className="flex items-center gap-2 text-sm">
                  <Users className="text-muted-foreground size-4" />
                  <span className="text-muted-foreground">{course.maxStudents} max students</span>
                </div>
              )}
            </div>
            <div className="mt-4 border-t pt-4">
              {isOwner ? (
                <div className="space-y-2">
                  {!course.isPublished && (
                    <span className="inline-block rounded-full bg-yellow-500/10 px-2 py-0.5 text-xs text-yellow-600 dark:text-yellow-400">
                      Draft — not visible to students
                    </span>
                  )}
                  <Link to={`/courses/${course.id}/content`}>
                    <Button className="w-full">Manage Content</Button>
                  </Link>
                  <Link to={`/courses/${course.id}/students`}>
                    <Button variant="outline" className="w-full">
                      <Users className="mr-1.5 size-4" />
                      Manage Students
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    className="w-full"
                    onClick={handlePublish}
                    disabled={isPublishing}
                  >
                    {isPublishing ? (
                      <Loader2 className="mr-1.5 size-4 animate-spin" />
                    ) : course.isPublished ? (
                      <EyeOff className="mr-1.5 size-4" />
                    ) : (
                      <Send className="mr-1.5 size-4" />
                    )}
                    {course.isPublished ? "Unpublish" : "Publish Course"}
                  </Button>
                </div>
              ) : !course.isPublished ? (
                <p className="text-muted-foreground text-sm">
                  This course is not yet available for enrollment.
                </p>
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

      {showUnpublishConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-card mx-4 w-full max-w-sm rounded-xl border p-6 shadow-lg">
            <h3 className="text-foreground text-lg font-semibold">Unpublish Course</h3>
            <p className="text-muted-foreground mt-2 text-sm">
              Unpublishing will hide this course from the catalog. Students who are already enrolled
              will retain access, but no new students will be able to enroll.
            </p>
            <p className="text-muted-foreground mt-2 text-sm">Are you sure you want to continue?</p>
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowUnpublishConfirm(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmUnpublish} disabled={isPublishing}>
                {isPublishing ? "Unpublishing..." : "Unpublish"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
