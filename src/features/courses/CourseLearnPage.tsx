import { useState, useEffect } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { ArrowLeft, ChevronRight, BookOpen, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import LoadingBubbles from "@/components/shared/LoadingBubbles";
import type { Module, Lesson } from "./services/contentService";
import { listModules } from "./services/contentService";
import { getCourse } from "./services/coursesService";
import useEnrollment from "./hooks/useEnrollment";

export default function CourseLearnPage() {
  const { id: courseId } = useParams<{ id: string }>();
  const [modules, setModules] = useState<Module[]>([]);
  const [activeModule, setActiveModule] = useState<Module | null>(null);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [courseTitle, setCourseTitle] = useState("");
  const [courseSubtitle, setCourseSubtitle] = useState<string | null>(null);
  const { isEnrolled, completedLessonIds, progress, handleCompleteLesson } = useEnrollment(
    courseId ?? "",
  );

  useEffect(() => {
    if (!courseId) return;
    Promise.all([listModules(courseId), getCourse(courseId)])
      .then(([moduleData, courseData]) => {
        setModules(moduleData);
        setCourseTitle(courseData.title);
        setCourseSubtitle(courseData.subtitle);
        if (moduleData.length > 0) {
          setActiveModule(moduleData[0]);
          if (moduleData[0].lessons.length > 0) setActiveLesson(moduleData[0].lessons[0]);
        }
      })
      .finally(() => setIsLoading(false));
  }, [courseId]);

  if (isLoading) return <LoadingBubbles size="lg" />;
  if (!isEnrolled) return <Navigate to={`/courses/${courseId}`} replace />;

  return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-col">
      <header className="bg-background flex items-start gap-4 border-b px-6 py-3">
        <Link
          to={`/courses/${courseId}`}
          className="text-muted-foreground hover:text-foreground mt-0.5 flex shrink-0 items-center gap-1 text-sm"
        >
          <ArrowLeft className="size-4" /> Back
        </Link>
        <div className="min-w-0 flex-1">
          <h2 className="text-foreground truncate text-lg font-semibold">
            {courseTitle || "Course Content"}
          </h2>
          {courseSubtitle && (
            <p className="text-muted-foreground truncate text-sm">{courseSubtitle}</p>
          )}
          <div className="mt-1 flex items-center gap-2">
            <div className="bg-muted h-1.5 w-40 rounded-full">
              <div
                className="bg-primary h-full rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-muted-foreground text-xs">{progress}% complete</span>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <div className="bg-background w-72 shrink-0 overflow-y-auto border-r p-4">
          {modules.map((mod) => (
            <div key={mod.id} className="mb-1">
              <button
                onClick={() => {
                  setActiveModule(mod);
                  if (mod.lessons.length > 0) setActiveLesson(mod.lessons[0]);
                }}
                className={`flex w-full items-center gap-1 rounded-lg px-2 py-1.5 text-left text-sm font-medium ${
                  activeModule?.id === mod.id
                    ? "bg-primary/10 text-primary"
                    : "text-foreground hover:bg-muted"
                }`}
              >
                <ChevronRight
                  className={`size-4 shrink-0 transition-transform ${activeModule?.id === mod.id ? "rotate-90" : ""}`}
                />
                {mod.title}
              </button>
              {activeModule?.id === mod.id && (
                <div className="ml-5 border-l pl-2">
                  {mod.lessons.map((l) => {
                    const isComplete = completedLessonIds.has(l.id);
                    return (
                      <button
                        key={l.id}
                        onClick={() => setActiveLesson(l)}
                        className={`flex w-full items-center gap-1 rounded px-2 py-1 text-left text-sm ${
                          activeLesson?.id === l.id
                            ? "bg-primary/5 text-primary"
                            : isComplete
                              ? "text-foreground"
                              : "text-muted-foreground hover:bg-muted"
                        }`}
                      >
                        {isComplete && <CheckCircle className="size-3 text-green-500" />}
                        {l.title}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto">
          {activeLesson ? (
            <div className="mx-auto max-w-3xl px-6 py-10 lg:px-8">
              <h1 className="text-foreground text-2xl font-bold">{activeLesson.title}</h1>
              {activeLesson.subtitle && (
                <p className="text-muted-foreground mt-1">{activeLesson.subtitle}</p>
              )}
              <div className="mt-8 space-y-6">
                {(activeLesson.sections ?? []).map((s) => (
                  <div key={s.id}>
                    {s.title && (
                      <h3 className="text-foreground text-lg font-semibold">{s.title}</h3>
                    )}
                    <p className="text-muted-foreground whitespace-pre-line">{s.content}</p>
                  </div>
                ))}
              </div>
              <div className="mt-12 border-t pt-6">
                {completedLessonIds.has(activeLesson.id) ? (
                  <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                    <CheckCircle className="size-4" /> Lesson completed
                  </div>
                ) : (
                  <Button onClick={() => handleCompleteLesson(activeLesson.id)}>
                    <CheckCircle className="mr-1.5 size-4" />
                    Mark as Complete
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="text-muted-foreground flex h-full items-center justify-center">
              <div className="text-center">
                <BookOpen className="mx-auto size-12" />
                <p className="mt-4">Select a lesson to start learning.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
