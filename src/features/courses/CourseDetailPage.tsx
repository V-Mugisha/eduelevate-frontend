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
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import LoadingBubbles from "@/components/shared/LoadingBubbles";
import useAuth from "@/features/auth/hooks/useAuth";
import { getCourse, publishCourse, deleteCourse } from "./services/coursesService";
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
  const [showPublishConfirm, setShowPublishConfirm] = useState(false);
  const [showUnpublishConfirm, setShowUnpublishConfirm] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "certificate">("overview");
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [isGeneratingCert, setIsGeneratingCert] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

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
      toast.success("Successfully enrolled in this course.");
    } catch {
      toast.error("Failed to enroll. Please try again.");
    } finally {
      setIsEnrolling(false);
    }
  }

  async function handlePublishClick() {
    if (course?.isPublished) {
      setShowUnpublishConfirm(true);
    } else {
      setShowPublishConfirm(true);
    }
  }

  async function confirmPublish() {
    if (!id) return;
    setIsPublishing(true);
    setShowPublishConfirm(false);
    try {
      const updated = await publishCourse(id, true);
      setCourse(updated);
      toast.success("Course published successfully.");
    } catch {
      toast.error("Failed to publish course.");
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
      toast.success("Course unpublished.");
    } catch {
      toast.error("Failed to unpublish course.");
    } finally {
      setIsPublishing(false);
    }
  }

  async function handleDeleteCourse() {
    if (!id || !course) return;
    setIsDeleting(true);
    try {
      await deleteCourse(id);
      toast.success("Course deleted successfully.");
      navigate("/courses/my-courses");
    } catch {
      toast.error("Failed to delete course.");
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  }

  async function handleGenerateCertificate() {
    if (!id) return;
    setIsGeneratingCert(true);
    try {
      const cert = await generateCertificate(id);
      setCertificate(cert);
      toast.success("Certificate generated successfully.");
    } catch {
      toast.error("Failed to generate certificate.");
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

  function renderOverviewContent(course: Course) {
    return (
      <>
        <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
          {course.category.name}
        </span>
        <h1 className="mt-3 text-3xl font-bold text-foreground">{course.title}</h1>
        {course.subtitle && (
          <p className="mt-2 text-lg text-muted-foreground">{course.subtitle}</p>
        )}
        <div className="mt-6 flex flex-wrap gap-2">
          <span
            className={`rounded-full px-3 py-1 text-sm font-medium ${levelColors[course.level]}`}
          >
            {course.level}
          </span>
          {course.duration && (
            <span className="flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-sm text-muted-foreground">
              <Clock className="size-3.5" /> {course.duration}
            </span>
          )}
        </div>
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-foreground">About this course</h2>
          <p className="mt-3 leading-relaxed whitespace-pre-line text-muted-foreground">
            {course.description}
          </p>
        </div>
      </>
    );
  }

  function renderCertificateTabContent(course: Course) {
    return (
      <div>
        {!isEnrolled || isOwner ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Award className="size-12 text-muted-foreground" />
            <p className="mt-4 text-muted-foreground">
              Enroll and complete this course to earn a certificate.
            </p>
          </div>
        ) : certificate ? (
          <div className="space-y-4">
            <div className="rounded-xl border bg-card p-6">
              <div className="flex items-center gap-2">
                <Award className="size-5 text-primary" />
                <span className="text-sm font-medium text-foreground">Certificate Earned</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
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
            <Award className="size-12 text-primary" />
            <p className="mt-4 text-lg font-medium text-foreground">
              Congratulations! You have completed this course.
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
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
            <Award className="size-12 text-muted-foreground" />
            <p className="mt-4 text-lg font-medium text-foreground">
              Complete all lessons to earn your certificate
            </p>
            <div className="mt-4 w-full max-w-xs">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Progress</span>
                <span>{progress}%</span>
              </div>
              <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all"
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

      {!isOwner && (
        <div className="mt-8 border-b">
          <nav className="flex gap-6">
            <button
              onClick={() => setActiveTab("overview")}
              className={`border-b-2 pb-2 text-sm font-medium transition-colors ${
                activeTab === "overview"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("certificate")}
              className={`border-b-2 pb-2 text-sm font-medium transition-colors ${
                activeTab === "certificate"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Certificate
            </button>
          </nav>
        </div>
      )}

      <div className="mt-8 grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {isOwner || activeTab === "overview"
            ? renderOverviewContent(course)
            : renderCertificateTabContent(course)}
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-20 rounded-xl border bg-card p-6 shadow-sm">
            <h3 className="font-semibold text-foreground">Course Info</h3>
            <div className="mt-4 space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <User className="size-4 text-muted-foreground" />
                <span className="text-muted-foreground">
                  {course.creator.firstName} {course.creator.lastName}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Shield className="size-4 text-muted-foreground" />
                <span className={`font-medium capitalize ${levelColors[course.level]}`}>
                  {course.level}
                </span>
              </div>
              {course.duration && (
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="size-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{course.duration}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm">
                <BookOpen className="size-4 text-muted-foreground" />
                <span className="text-muted-foreground">{course.category.name}</span>
              </div>
              {course.maxStudents && (
                <div className="flex items-center gap-2 text-sm">
                  <Users className="size-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{course.maxStudents} max students</span>
                </div>
              )}
            </div>
            <div className="mt-4 border-t pt-4">
              {isOwner ? (
                <div className="space-y-3">
                  {!course.isPublished && (
                    <span className="inline-block rounded-full bg-yellow-500/10 px-2 py-0.5 text-xs text-yellow-600 dark:text-yellow-400">
                      Draft. Not visible to students
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
                    onClick={handlePublishClick}
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
                  <Button
                    variant="ghost"
                    className="w-full text-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => setShowDeleteConfirm(true)}
                  >
                    <Trash2 className="mr-1.5 size-4" />
                    Delete Course
                  </Button>
                </div>
              ) : !course.isPublished ? (
                <p className="text-sm text-muted-foreground">
                  This course is not yet available for enrollment.
                </p>
              ) : isEnrolled ? (
                <div>
                  {progress > 0 && (
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Progress</span>
                        <span>{progress}%</span>
                      </div>
                      <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-primary transition-all"
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

      {showPublishConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="mx-4 w-full max-w-sm rounded-xl border bg-card p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-foreground">Publish Course</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              This course will become visible to students in the course catalog. Students will be
              able to find and enroll in it.
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Are you sure you want to publish this course?
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowPublishConfirm(false)}>
                Cancel
              </Button>
              <Button onClick={confirmPublish} disabled={isPublishing}>
                {isPublishing ? "Publishing..." : "Publish"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {showUnpublishConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="mx-4 w-full max-w-sm rounded-xl border bg-card p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-foreground">Unpublish Course</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Unpublishing will hide this course from the catalog. Students who are already enrolled
              will retain access, but no new students will be able to enroll.
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Are you sure you want to continue?
            </p>
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

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="mx-4 w-full max-w-md rounded-xl border bg-card p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-destructive">Delete Course</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              This action cannot be undone. All enrolled students, their progress, certificates, and
              all course content will be permanently deleted.
            </p>
            <p className="mt-4 text-sm text-muted-foreground">
              To confirm, type <span className="font-medium text-foreground">{course.title}</span>{" "}
              below:
            </p>
            <Input
              className="mt-2"
              value={deleteConfirmation}
              onChange={(e) => setDeleteConfirmation(e.target.value)}
              placeholder={course.title}
            />
            <div className="mt-6 flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setDeleteConfirmation("");
                }}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteCourse}
                disabled={isDeleting || deleteConfirmation !== course.title}
              >
                {isDeleting ? "Deleting..." : "Delete Course"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
