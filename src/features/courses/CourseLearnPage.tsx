import { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, useSearchParams, Link, Navigate } from "react-router-dom";
import {
  ArrowLeft,
  ChevronRight,
  BookOpen,
  CheckCircle,
  PanelLeftClose,
  PanelLeftOpen,
  ClipboardList,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import LoadingBubbles from "@/components/shared/LoadingBubbles";
import DOMPurify from "isomorphic-dompurify";
import type { Module, Lesson } from "./services/contentService";
import { listModules } from "./services/contentService";
import { getCourse } from "./services/coursesService";
import useEnrollment from "./hooks/useEnrollment";
import { getAssessment } from "./services/assessmentService";

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

export default function CourseLearnPage() {
  const { id: courseId } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [modules, setModules] = useState<Module[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [courseTitle, setCourseTitle] = useState("");
  const [courseSubtitle, setCourseSubtitle] = useState<string | null>(null);
  const [completingLessonId, setCompletingLessonId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);
  const [hasAssessment, setHasAssessment] = useState(false);
  const [expandedModuleIds, setExpandedModuleIds] = useState<Set<string>>(new Set());
  const { isEnrolled, completedLessonIds, progress, handleCompleteLesson } = useEnrollment(
    courseId ?? "",
  );

  const flatLessonList = useMemo(() => buildFlatLessonList(modules), [modules]);

  const lessonParam = searchParams.get("lesson");
  const activeFlatLesson = lessonParam
    ? (findFlatLessonById(flatLessonList, lessonParam) ?? null)
    : null;

  const activeLesson = activeFlatLesson?.lesson ?? null;

  useEffect(() => {
    if (activeFlatLesson) {
      setExpandedModuleIds((prev) => {
        const next = new Set(prev);
        next.add(activeFlatLesson.module.id);
        return next;
      });
    }
  }, [activeFlatLesson?.module.id]);

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

  useEffect(() => {
    if (!activeLesson) {
      setHasAssessment(false);
      return;
    }
    getAssessment(activeLesson.id)
      .then((a) => setHasAssessment(!!a))
      .catch(() => setHasAssessment(false));
  }, [activeLesson?.id]);

  const selectLesson = useCallback(
    (lessonId: string) => {
      setSearchParams({ lesson: lessonId }, { replace: true });
      setMobileSheetOpen(false);
    },
    [setSearchParams],
  );

  const handleModuleToggle = useCallback((moduleId: string) => {
    setExpandedModuleIds((prev) => {
      const next = new Set(prev);
      if (next.has(moduleId)) {
        next.delete(moduleId);
      } else {
        next.add(moduleId);
      }
      return next;
    });
  }, []);

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

  function renderSidebarContent() {
    return (
      <div className="space-y-1">
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
    );
  }

  return (
    <div className="flex h-[calc(100dvh-3.5rem)] min-w-0 flex-col overflow-x-hidden">
      <header className="bg-background flex min-w-0 items-center gap-3 border-b px-4 py-3 sm:px-6">
        <div>
          <Link
            to={`/courses/${courseId}`}
            className="text-muted-foreground hover:text-foreground mt-0.5 flex shrink-0 items-center gap-1 text-sm"
          >
            <ArrowLeft className="size-4" /> Back
          </Link>
          {activeLesson && (
            <Button
              variant="ghost"
              size="icon"
              className="hidden md:flex"
              onClick={() => setSidebarOpen((prev) => !prev)}
              aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
            >
              {sidebarOpen ? (
                <PanelLeftClose className="size-5" />
              ) : (
                <PanelLeftOpen className="size-5" />
              )}
            </Button>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-foreground truncate text-lg font-semibold">
            {courseTitle || "Course Content"}
          </h2>
          {courseSubtitle && (
            <p className="text-muted-foreground truncate text-sm">{courseSubtitle}</p>
          )}
          <div className="mt-1 flex items-center gap-2">
            <div className="bg-muted h-1.5 w-32 overflow-hidden rounded-full sm:w-40">
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
        <aside
          className={`bg-background hidden shrink-0 overflow-hidden border-r transition-all duration-200 md:block ${
            sidebarOpen ? "w-72" : "w-0 border-r-0"
          }`}
        >
          <div className="w-72 overflow-y-auto p-4">{renderSidebarContent()}</div>
        </aside>

        <Sheet open={mobileSheetOpen} onOpenChange={setMobileSheetOpen}>
          <SheetContent side="left" className="w-72 sm:w-80">
            <SheetHeader>
              <SheetTitle>Course Content</SheetTitle>
            </SheetHeader>
            {renderSidebarContent()}
          </SheetContent>
        </Sheet>

        <div className="min-w-0 flex-1 overflow-x-hidden overflow-y-auto">
          {activeLesson ? (
            <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
              <div className="mb-4 flex items-center gap-2 md:hidden">
                <Button variant="outline" size="sm" onClick={() => setMobileSheetOpen(true)}>
                  <PanelLeftOpen className="mr-1.5 size-4" />
                  Lessons
                </Button>
              </div>
              <h1 className="text-foreground text-2xl font-bold">{activeLesson.title}</h1>
              {activeLesson.subtitle && (
                <p className="text-muted-foreground mt-1">{activeLesson.subtitle}</p>
              )}
              <div className="mt-8">
                {activeLesson.content ? (
                  <div
                    className="prose prose-sm dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(activeLesson.content),
                    }}
                  />
                ) : (
                  <p className="text-muted-foreground py-8 text-center text-sm">
                    This lesson has no content yet.
                  </p>
                )}
              </div>
              <div className="mt-8 border-t pt-6">
                {completedLessonIds.has(activeLesson.id) ? (
                  <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                    <CheckCircle className="size-4" /> Lesson completed
                  </div>
                ) : hasAssessment ? (
                  <Link
                    to={`/courses/${courseId}/learn/assessment/${activeLesson.id}`}
                    className="inline-flex w-full"
                  >
                    <Button size="lg" className="w-full">
                      <ClipboardList className="mr-2 size-4" />
                      Practice
                    </Button>
                  </Link>
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
