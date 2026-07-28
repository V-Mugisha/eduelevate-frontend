import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { toast } from "sonner";
import {
  ArrowLeft,
  PanelLeftClose,
  PanelLeftOpen,
  Send,
  EyeOff,
  Pencil,
  Trash2,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import LoadingBubbles from "@/components/shared/LoadingBubbles";
import ModuleSidebar from "./components/ModuleSidebar";
import ModuleForm from "./components/ModuleForm";
import LessonForm from "./components/LessonForm";
import LessonPreview from "./components/LessonPreview";
import ActionsDropdown from "./components/ActionsDropdown";
import useModules from "./hooks/useModules";
import type { Module, Lesson } from "./services/contentService";
import { getCourse, publishCourse } from "./services/coursesService";
import { createSection, updateSection } from "./services/contentService";

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

  function openModuleForm(mod: Module) {
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
    openModuleForm(mod);
    setMobileSheetOpen(false);
  }

  function handleLessonClick(lesson: Lesson) {
    openLessonPreview(lesson);
    setMobileSheetOpen(false);
  }

  function handleStartAddModule() {
    setShowAddModule(true);
    setActiveModuleId(null);
    setActiveLessonId(null);
    setMobileSheetOpen(false);
    setModuleTitle("");
    setModuleSubtitle("");
    setModuleDescription("");
    setModulePrereq("");
  }

  function handleStartAddLesson(moduleId: string) {
    setActiveModuleId(moduleId);
    setIsAddingLesson(true);
    setActiveLessonId(null);
    setLessonTitle("");
    setLessonSubtitle("");
    setLessonSections([{ title: "", content: "" }]);
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
    setModuleTitle("");
    setModuleSubtitle("");
    setModuleDescription("");
    setModulePrereq("");
  }

  async function handleAddLesson() {
    if (!activeModuleId || !lessonTitle || !courseId) return;
    const lesson = await addLesson(activeModuleId, {
      title: lessonTitle,
      subtitle: lessonSubtitle || undefined,
    });
    const validSections = lessonSections.filter((s) => s.title.trim() || s.content.trim());
    for (const s of validSections) {
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
      toast.success("Course published successfully.");
    } catch {
      toast.error("Failed to publish course.");
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
      toast.success("Course unpublished.");
    } catch {
      toast.error("Failed to unpublish course.");
    } finally {
      setIsPublishing(false);
    }
  }

  async function handleUpdateSection(
    lessonId: string,
    sectionId: string,
    data: { title?: string; content?: string },
  ) {
    try {
      await updateSection(lessonId, sectionId, data);
      await fetchModules();
      toast.success("Section updated.");
    } catch {
      toast.error("Failed to update section.");
    }
  }

  const activeModule = modules.find((m) => m.id === activeModuleId) ?? null;

  if (!courseId || isLoading) return <LoadingBubbles size="lg" />;

  return (
    <div className="flex h-[calc(100dvh-3.5rem)] min-w-0 flex-col overflow-x-hidden">
      <header className="bg-background flex items-center gap-3 border-b px-4 py-3 sm:px-6">
        <Link
          to="/courses/my-courses"
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
          <div className="w-72 overflow-y-auto p-4">
            <ModuleSidebar
              modules={modules}
              expandedModules={expandedModules}
              activeModuleId={activeModuleId}
              activeLessonId={activeLessonId}
              onSelectModule={handleModuleClick}
              onSelectLesson={handleLessonClick}
              onAddModule={handleStartAddModule}
              onAddLesson={handleStartAddLesson}
            />
          </div>
        </aside>

        <Sheet open={mobileSheetOpen} onOpenChange={setMobileSheetOpen}>
          <SheetContent side="left" className="w-72 sm:w-80">
            <SheetHeader>
              <SheetTitle>Modules</SheetTitle>
            </SheetHeader>
            <ModuleSidebar
              modules={modules}
              expandedModules={expandedModules}
              activeModuleId={activeModuleId}
              activeLessonId={activeLessonId}
              onSelectModule={handleModuleClick}
              onSelectLesson={handleLessonClick}
              onAddModule={handleStartAddModule}
              onAddLesson={handleStartAddLesson}
            />
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
            <ModuleForm
              title={moduleTitle}
              subtitle={moduleSubtitle}
              description={moduleDescription}
              prerequisites={modulePrereq}
              isEditing={false}
              onTitleChange={setModuleTitle}
              onSubtitleChange={setModuleSubtitle}
              onDescriptionChange={setModuleDescription}
              onPrerequisitesChange={setModulePrereq}
              onSave={handleAddModule}
              onCancel={() => setShowAddModule(false)}
            />
          )}

          {activeModule && !showAddModule && !activeLessonId && !isAddingLesson && (
            <>
              {isEditingModule ? (
                <ModuleForm
                  title={moduleTitle}
                  subtitle={moduleSubtitle}
                  description={moduleDescription}
                  prerequisites={modulePrereq}
                  isEditing
                  onTitleChange={setModuleTitle}
                  onSubtitleChange={setModuleSubtitle}
                  onDescriptionChange={setModuleDescription}
                  onPrerequisitesChange={setModulePrereq}
                  onSave={handleSaveModule}
                  onCancel={() => setIsEditingModule(false)}
                />
              ) : (
                <div className="mx-auto max-w-2xl">
                  <div className="mb-6 flex items-start justify-between">
                    <div>
                      <h1 className="text-foreground text-2xl font-bold">{activeModule.title}</h1>
                      {activeModule.subtitle && (
                        <p className="text-muted-foreground mt-1">{activeModule.subtitle}</p>
                      )}
                    </div>
                    <ActionsDropdown
                      actions={[
                        {
                          label: "Edit",
                          icon: <Pencil className="size-4" />,
                          onClick: () => setIsEditingModule(true),
                        },
                        {
                          label: "Delete",
                          icon: <Trash2 className="size-4" />,
                          onClick: () => {
                            removeModule(activeModule.id);
                            setActiveModuleId(null);
                          },
                          destructive: true,
                        },
                      ]}
                    />
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
            </>
          )}

          {isAddingLesson && activeModuleId && (
            <LessonForm
              title={lessonTitle}
              subtitle={lessonSubtitle}
              sections={lessonSections}
              onTitleChange={setLessonTitle}
              onSubtitleChange={setLessonSubtitle}
              onSectionsChange={setLessonSections}
              onSave={handleAddLesson}
              onCancel={() => setIsAddingLesson(false)}
            />
          )}

          {activeLessonId && activeModule && !isAddingLesson && (
            <LessonPreview
              lesson={
                activeModule.lessons.find((l) => l.id === activeLessonId) ?? {
                  id: activeLessonId,
                  moduleId: activeModule.id,
                  title: lessonTitle,
                  subtitle: lessonSubtitle || null,
                  createdAt: "",
                  updatedAt: "",
                  sections: [],
                }
              }
              courseId={courseId!}
              isEditing={isEditingLesson}
              title={lessonTitle}
              subtitle={lessonSubtitle}
              onTitleChange={setLessonTitle}
              onSubtitleChange={setLessonSubtitle}
              onSaveEdit={handleSaveLesson}
              onCancelEdit={() => setIsEditingLesson(false)}
              onStartEdit={() => setIsEditingLesson(true)}
              onDelete={() => {
                removeLesson(activeLessonId, activeModule.id);
                setActiveLessonId(null);
              }}
              onUpdateSection={(sectionId, data) =>
                handleUpdateSection(
                  activeModule.lessons.find((l) => l.id === activeLessonId)?.id ?? activeLessonId,
                  sectionId,
                  data,
                )
              }
            />
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
