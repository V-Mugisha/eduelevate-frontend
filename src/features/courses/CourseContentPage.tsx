import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Plus,
  ChevronDown,
  ChevronRight,
  Trash2,
  Pencil,
  CheckCircle,
  ArrowLeft,
  PanelLeftClose,
  PanelLeftOpen,
  Send,
  EyeOff,
  ClipboardList,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import LoadingBubbles from "@/components/shared/LoadingBubbles";
import SectionsEditor from "@/components/shared/SectionsEditor";
import useModules from "./hooks/useModules";
import type { Module, Lesson } from "./services/contentService";
import { getCourse, publishCourse } from "./services/coursesService";
import { createSection } from "./services/contentService";

export default function CourseContentPage() {
  const { id: courseId } = useParams<{ id: string }>();
  const {
    modules,
    isLoading,
    fetchModules,
    addModule,
    editModule,
    removeModule,
    addLesson,
    editLesson,
    removeLesson,
  } = useModules(courseId ?? "");

  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);
  const [isEditingModule, setIsEditingModule] = useState(false);
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [isEditingLesson, setIsEditingLesson] = useState(false);
  const [showAddModule, setShowAddModule] = useState(false);
  const [isAddingLesson, setIsAddingLesson] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);

  const [moduleTitle, setModuleTitle] = useState("");
  const [moduleSubtitle, setModuleSubtitle] = useState("");
  const [moduleDescription, setModuleDescription] = useState("");
  const [modulePrereq, setModulePrereq] = useState("");

  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonSubtitle, setLessonSubtitle] = useState("");
  const [lessonSections, setLessonSections] = useState<{ title: string; content: string }[]>([
    { title: "", content: "" },
  ]);

  const [courseTitle, setCourseTitle] = useState("");
  const [courseSubtitle, setCourseSubtitle] = useState<string | null>(null);
  const [courseIsPublished, setCourseIsPublished] = useState(false);
  const [showUnpublishConfirm, setShowUnpublishConfirm] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  useEffect(() => {
    if (!courseId) return;
    getCourse(courseId)
      .then((c) => {
        setCourseTitle(c.title);
        setCourseSubtitle(c.subtitle);
        setCourseIsPublished(c.isPublished);
      })
      .catch(() => {});
  }, [courseId]);

  function toggleModule(moduleId: string) {
    setExpandedModules((prev) => {
      const next = new Set(prev);
      if (next.has(moduleId)) next.delete(moduleId);
      else next.add(moduleId);
      return next;
    });
  }

  function openModulePreview(mod: Module) {
    setActiveModuleId(mod.id);
    setActiveLessonId(null);
    setIsEditingModule(false);
    setIsEditingLesson(false);
    setIsAddingLesson(false);
    setShowAddModule(false);
    setModuleTitle(mod.title);
    setModuleSubtitle(mod.subtitle ?? "");
    setModuleDescription(mod.description ?? "");
    setModulePrereq(mod.prerequisites.join(", "));
  }

  function openLessonPreview(lesson: Lesson) {
    setActiveLessonId(lesson.id);
    setIsEditingLesson(false);
    setLessonTitle(lesson.title);
    setLessonSubtitle(lesson.subtitle ?? "");
  }

  function handleModuleClick(mod: Module) {
    toggleModule(mod.id);
    openModulePreview(mod);
    setMobileSheetOpen(false);
  }

  function handleLessonClick(lesson: Lesson) {
    openLessonPreview(lesson);
    setMobileSheetOpen(false);
  }

  function startAddLesson() {
    setIsAddingLesson(true);
    setActiveLessonId(null);
    setLessonTitle("");
    setLessonSubtitle("");
    setLessonSections([{ title: "", content: "" }]);
  }

  function handleStartAddModule() {
    setShowAddModule(true);
    setActiveModuleId(null);
    setActiveLessonId(null);
    setMobileSheetOpen(false);
  }

  function handleStartAddLesson(moduleId: string) {
    setActiveModuleId(moduleId);
    startAddLesson();
    setMobileSheetOpen(false);
  }

  async function handleSaveModule() {
    if (!activeModuleId) return;
    await editModule(activeModuleId, {
      title: moduleTitle,
      subtitle: moduleSubtitle || undefined,
      description: moduleDescription || undefined,
      prerequisites: modulePrereq ? modulePrereq.split(",").map((s) => s.trim()) : undefined,
    });
    setIsEditingModule(false);
  }

  async function handleAddModule() {
    if (!moduleTitle || !courseId) return;
    await addModule({
      title: moduleTitle,
      subtitle: moduleSubtitle || undefined,
      description: moduleDescription || undefined,
    });
    setShowAddModule(false);
  }

  async function handleAddLesson() {
    if (!activeModuleId || !lessonTitle || !courseId) return;
    const lesson = await addLesson(activeModuleId, {
      title: lessonTitle,
      subtitle: lessonSubtitle || undefined,
    });
    for (const s of lessonSections) {
      if (s.content.trim())
        await createSection(lesson.id, { title: s.title || undefined, content: s.content });
    }
    setIsAddingLesson(false);
    await fetchModules();
    setActiveLessonId(lesson.id);
  }

  async function handleSaveLesson() {
    if (!activeLessonId || !activeModuleId) return;
    await editLesson(activeModuleId, activeLessonId, {
      title: lessonTitle,
      subtitle: lessonSubtitle || undefined,
    });
    setIsEditingLesson(false);
  }

  async function handlePublish() {
    if (!courseId) return;
    if (courseIsPublished) {
      setShowUnpublishConfirm(true);
      return;
    }
    setIsPublishing(true);
    try {
      const updated = await publishCourse(courseId, true);
      setCourseIsPublished(updated.isPublished);
    } catch {
      // error silently handled
    } finally {
      setIsPublishing(false);
    }
  }

  async function confirmUnpublish() {
    if (!courseId) return;
    setIsPublishing(true);
    setShowUnpublishConfirm(false);
    try {
      const updated = await publishCourse(courseId, false);
      setCourseIsPublished(updated.isPublished);
    } catch {
      // error silently handled
    } finally {
      setIsPublishing(false);
    }
  }

  const activeModule = modules.find((m) => m.id === activeModuleId) ?? null;

  function renderSidebarContent() {
    return (
      <>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-foreground font-semibold">Modules</h2>
          <Button variant="ghost" size="icon" onClick={handleStartAddModule} title="Add Module">
            <Plus className="size-4" />
          </Button>
        </div>
        <div className="space-y-1">
          {modules.map((mod) => {
            const isOpen = expandedModules.has(mod.id);
            return (
              <div key={mod.id}>
                <button
                  onClick={() => handleModuleClick(mod)}
                  className={`flex w-full items-center gap-1 rounded-lg px-2 py-1.5 text-left text-sm ${activeModuleId === mod.id && !activeLessonId ? "bg-primary/10 text-primary" : "hover:bg-muted"}`}
                >
                  {isOpen ? (
                    <ChevronDown className="size-4 shrink-0" />
                  ) : (
                    <ChevronRight className="size-4 shrink-0" />
                  )}
                  <span className="truncate">{mod.title}</span>
                </button>
                {isOpen && (
                  <div className="ml-5 space-y-0.5 border-l pl-2">
                    {mod.lessons.map((l) => (
                      <button
                        key={l.id}
                        onClick={() => handleLessonClick(l)}
                        className={`block w-full rounded px-2 py-1 text-left text-sm ${activeLessonId === l.id ? "bg-primary/5 text-primary" : "text-muted-foreground hover:bg-muted"}`}
                      >
                        {l.title}
                      </button>
                    ))}
                    <button
                      onClick={() => handleStartAddLesson(mod.id)}
                      className="text-muted-foreground hover:bg-muted flex w-full items-center gap-1 rounded px-2 py-1 text-sm"
                    >
                      <Plus className="size-3" /> Add Lesson
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </>
    );
  }

  if (!courseId || isLoading) return <LoadingBubbles size="lg" />;

  return (
    <div className="flex h-[calc(100dvh-3.5rem)] min-w-0 flex-col overflow-x-hidden">
      <header className="bg-background flex items-center gap-3 border-b px-4 py-3 sm:px-6">
        <Link
          to="/courses"
          className="text-muted-foreground hover:text-foreground mt-0.5 flex shrink-0 items-center gap-1 text-sm"
        >
          <ArrowLeft className="size-4" /> Courses
        </Link>
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
        <div className="min-w-0 flex-1">
          <h2 className="text-foreground truncate text-lg font-semibold">
            {courseTitle || "Course Content"}
          </h2>
          {courseSubtitle && (
            <p className="text-muted-foreground truncate text-sm">{courseSubtitle}</p>
          )}
          {!courseIsPublished && (
            <span className="mt-1 inline-block rounded-full bg-yellow-500/10 px-2 py-0.5 text-xs text-yellow-600 dark:text-yellow-400">
              Draft
            </span>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Button
            variant={courseIsPublished ? "outline" : "default"}
            size="sm"
            onClick={handlePublish}
            disabled={isPublishing}
          >
            {isPublishing ? (
              <LoadingBubbles size="sm" />
            ) : courseIsPublished ? (
              <>
                <EyeOff className="mr-1.5 size-4" />
                Unpublish
              </>
            ) : (
              <>
                <Send className="mr-1.5 size-4" />
                Publish
              </>
            )}
          </Button>
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
              <SheetTitle>Modules</SheetTitle>
            </SheetHeader>
            {renderSidebarContent()}
          </SheetContent>
        </Sheet>

        <div className="min-w-0 flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6">
          <div className="mb-4 md:hidden">
            <Button variant="outline" size="sm" onClick={() => setMobileSheetOpen(true)}>
              <PanelLeftOpen className="mr-1.5 size-4" />
              Modules
            </Button>
          </div>

          {showAddModule && (
            <div className="mx-auto max-w-2xl space-y-4">
              <h3 className="text-foreground font-semibold">New Module</h3>
              <div className="space-y-2">
                <Label>Title</Label>
                <Input value={moduleTitle} onChange={(e) => setModuleTitle(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Subtitle (optional)</Label>
                <Input value={moduleSubtitle} onChange={(e) => setModuleSubtitle(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Description (optional)</Label>
                <Textarea
                  value={moduleDescription}
                  onChange={(e) => setModuleDescription(e.target.value)}
                />
              </div>
              <div className="flex gap-3">
                <Button onClick={handleAddModule}>Create Module</Button>
                <Button variant="outline" onClick={() => setShowAddModule(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {activeModule && !showAddModule && !activeLessonId && !isAddingLesson && (
            <div className="mx-auto max-w-2xl">
              {isEditingModule ? (
                <div className="space-y-4">
                  <h3 className="text-foreground font-semibold">Edit Module</h3>
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input value={moduleTitle} onChange={(e) => setModuleTitle(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Subtitle (optional)</Label>
                    <Input
                      value={moduleSubtitle}
                      onChange={(e) => setModuleSubtitle(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Description (optional)</Label>
                    <Textarea
                      value={moduleDescription}
                      onChange={(e) => setModuleDescription(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Prerequisites (comma-separated)</Label>
                    <Input
                      value={modulePrereq}
                      onChange={(e) => setModulePrereq(e.target.value)}
                      placeholder="e.g. Basic HTML, CSS Fundamentals"
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button onClick={handleSaveModule}>Save Module</Button>
                    <Button variant="outline" onClick={() => setIsEditingModule(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="mb-6 flex items-start justify-between">
                    <div>
                      <h1 className="text-foreground text-2xl font-bold">{activeModule.title}</h1>
                      {activeModule.subtitle && (
                        <p className="text-muted-foreground mt-1">{activeModule.subtitle}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => setIsEditingModule(true)}>
                        <Pencil className="mr-1.5 size-4" />
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          removeModule(activeModule.id);
                          setActiveModuleId(null);
                        }}
                      >
                        <Trash2 className="text-destructive size-4" />
                      </Button>
                    </div>
                  </div>
                  {activeModule.description && (
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      {activeModule.description}
                    </p>
                  )}
                  {activeModule.prerequisites.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-foreground mb-2 font-medium">Prerequisites</h3>
                      <ul className="text-muted-foreground list-disc space-y-1 pl-5 text-sm">
                        {activeModule.prerequisites.map((p) => (
                          <li key={p}>{p}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div className="border-t pt-4">
                    <Button variant="outline" onClick={() => handleStartAddLesson(activeModule.id)}>
                      <Plus className="mr-1.5 size-4" />
                      Add Lesson
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {isAddingLesson && activeModuleId && (
            <div className="mx-auto max-w-2xl space-y-4">
              <h3 className="text-foreground font-semibold">New Lesson</h3>
              <div className="space-y-2">
                <Label>Title</Label>
                <Input value={lessonTitle} onChange={(e) => setLessonTitle(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Subtitle (optional)</Label>
                <Input value={lessonSubtitle} onChange={(e) => setLessonSubtitle(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Sections</Label>
                <SectionsEditor sections={lessonSections} onChange={setLessonSections} />
              </div>
              <div className="flex gap-3">
                <Button onClick={handleAddLesson}>Create Lesson</Button>
                <Button variant="outline" onClick={() => setIsAddingLesson(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {activeLessonId && activeModule && !isAddingLesson && (
            <div className="mx-auto max-w-2xl">
              {isEditingLesson ? (
                <div className="space-y-4">
                  <h3 className="text-foreground font-semibold">Edit Lesson</h3>
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input value={lessonTitle} onChange={(e) => setLessonTitle(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Subtitle (optional)</Label>
                    <Input
                      value={lessonSubtitle}
                      onChange={(e) => setLessonSubtitle(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button onClick={handleSaveLesson}>Save Lesson</Button>
                    <Button variant="outline" onClick={() => setIsEditingLesson(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="mb-8 flex items-start justify-between">
                    <div>
                      <h1 className="text-foreground text-2xl font-bold">{lessonTitle}</h1>
                      {lessonSubtitle && (
                        <p className="text-muted-foreground mt-1">{lessonSubtitle}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => setIsEditingLesson(true)}>
                        <Pencil className="mr-1.5 size-4" />
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          removeLesson(activeLessonId, activeModule.id);
                          setActiveLessonId(null);
                        }}
                      >
                        <Trash2 className="text-destructive size-4" />
                      </Button>
                    </div>
                  </div>
                  {(activeModule.lessons.find((l) => l.id === activeLessonId)?.sections ?? []).map(
                    (s) => (
                      <div key={s.id} className="mb-6">
                        {s.title && (
                          <h3 className="text-foreground text-lg font-semibold">{s.title}</h3>
                        )}
                        <p className="text-muted-foreground whitespace-pre-line">{s.content}</p>
                      </div>
                    ),
                  )}
                  <div className="mt-8 border-t pt-6">
                    <Link to={`/courses/${courseId}/content/assessment/${activeLessonId}`}>
                      <Button variant="outline" size="sm">
                        <ClipboardList className="mr-1.5 size-4" />
                        Manage Assessment
                      </Button>
                    </Link>
                  </div>
                  <div className="mt-12 border-t pt-6">
                    <Button disabled title="Progress tracking coming soon">
                      <CheckCircle className="mr-1.5 size-4" />
                      Mark as Complete
                    </Button>
                    <p className="text-muted-foreground mt-1 text-xs">
                      Progress tracking coming soon
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {!showAddModule && !activeModuleId && !activeLessonId && !isAddingLesson && (
            <div className="text-muted-foreground flex h-full items-center justify-center">
              Select a module from the sidebar or create a new one.
            </div>
          )}
        </div>
      </div>

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
                {isPublishing ? <LoadingBubbles size="sm" /> : "Unpublish"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
