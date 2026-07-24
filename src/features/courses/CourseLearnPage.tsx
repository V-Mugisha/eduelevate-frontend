import { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, useSearchParams, Link, Navigate } from "react-router-dom";
import { ArrowLeft, ChevronRight, BookOpen, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import LoadingBubbles from "@/components/shared/LoadingBubbles";
import type { Module, Lesson } from "./services/contentService";
import { listModules } from "./services/contentService";
import { getCourse } from "./services/coursesService";
import useEnrollment from "./hooks/useEnrollment";

interface FlatLesson {
  lesson: Lesson;
  module: Module;
}

function buildFlatLessonList(modules: Module[]): FlatLesson[] {
  const flat: FlatLesson[] = [];
  for (const mod of modules) {
    for (const lesson of mod.lessons) {
      flat.push({ lesson, module: mod });
    }
  }
  return flat;
}

function findFlatLessonById(flat: FlatLesson[], lessonId: string): FlatLesson | undefined {
  return flat.find((f) => f.lesson.id === lessonId);
}

function computeExpandedModuleIds(
  activeFlatLesson: FlatLesson | null,
): Set<string> {
  if (!activeFlatLesson) return new Set();
  return new Set([activeFlatLesson.module.id]);
}

export default function CourseLearnPage() {
  const { id: courseId } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [modules, setModules] = useState<Module[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [courseTitle, setCourseTitle] = useState("");
  const [courseSubtitle, setCourseSubtitle] = useState<string | null>(null);
  const [completingLessonId, setCompletingLessonId] = useState<string | null>(null);
  const { isEnrolled, completedLessonIds, progress, handleCompleteLesson } = useEnrollment(
    courseId ?? "",
  );

  const flatLessonList = useMemo(() => buildFlatLessonList(modules), [modules]);

  const lessonParam = searchParams.get("lesson");
  const activeFlatLesson = lessonParam
    ? (findFlatLessonById(flatLessonList, lessonParam) ?? null)
    : null;

  const expandedModuleIds = useMemo(
    () => computeExpandedModuleIds(activeFlatLesson),
    [activeFlatLesson],
  );

  const activeLesson = activeFlatLesson?.lesson ?? null;

  useEffect(() => {
    if (!courseId) return;
    Promise.all([listModules(courseId), getCourse(courseId)])
      .then(([moduleData, courseData]) => {
        setModules(moduleData);
        setCourseTitle(courseData.title);
        setCourseSubtitle(courseData.subtitle);
      })
      .finally(() => setIsLoading(false));
  }, [courseId]);

  useEffect(() => {
    if (isLoading || flatLessonList.length === 0) return;
    const param = searchParams.get("lesson");
    if (!param || !findFlatLessonById(flatLessonList, param)) {
      const firstId = flatLessonList[0].lesson.id;
      setSearchParams({ lesson: firstId }, { replace: true });
    }
  }, [isLoading, flatLessonList, searchParams, setSearchParams]);

  const selectLesson = useCallback(
    (lessonId: string) => {
      setSearchParams({ lesson: lessonId }, { replace: true });
    },
    [setSearchParams],
  );

  const handleModuleToggle = useCallback(
    (moduleId: string) => {
      if (expandedModuleIds.has(moduleId)) {
        setSearchParams(
          (prev) => {
            const next = new URLSearchParams(prev);
            next.delete("lesson");
            return next;
          },
          { replace: true },
        );
      } else {
        const mod = modules.find((m) => m.id === moduleId);
        if (mod && mod.lessons.length > 0) {
          selectLesson(mod.lessons[0].id);
        }
      }
    },
    [expandedModuleIds, modules, selectLesson, setSearchParams],
  );

  const handleMarkComplete = useCallback(async () => {
    if (!activeLesson) return;
    setCompletingLessonId(activeLesson.id);
    try {
      await handleCompleteLesson(activeLesson.id);
      const currentIndex = flatLessonList.findIndex((f) => f.lesson.id === activeLesson.id);
      if (currentIndex >= 0 && currentIndex < flatLessonList.length - 1) {
        const nextLesson = flatLessonList[currentIndex + 1].lesson;
        selectLesson(nextLesson.id);
      }
    } finally {
      setCompletingLessonId(null);
    }
  }, [activeLesson, handleCompleteLesson, flatLessonList, selectLesson]);

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
            <div className="bg-muted h-1.5 w-40 overflow-hidden rounded-full">
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
          {modules.map((mod) => {
            const isExpanded = expandedModuleIds.has(mod.id);
            return (
              <div key={mod.id} className="mb-1">
                <button
                  onClick={() => handleModuleToggle(mod.id)}
                  className={`flex w-full items-center gap-1 rounded-lg px-2 py-1.5 text-left text-sm font-medium ${
                    isExpanded ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted"
                  }`}
                >
                  <ChevronRight
                    className={`size-4 shrink-0 transition-transform ${isExpanded ? "rotate-90" : ""}`}
                  />
                  {mod.title}
                </button>
                {isExpanded && (
                  <div className="ml-5 border-l pl-2">
                    {mod.lessons.map((l) => {
                      const isComplete = completedLessonIds.has(l.id);
                      return (
                        <button
                          key={l.id}
                          onClick={() => selectLesson(l.id)}
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
            );
          })}
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
                  <Button
                    onClick={handleMarkComplete}
                    disabled={completingLessonId === activeLesson.id}
                  >
                    <CheckCircle className="mr-1.5 size-4" />
                    {completingLessonId === activeLesson.id ? "Completing..." : "Mark as Complete"}
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
