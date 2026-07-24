import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Plus,
  ChevronDown,
  ChevronRight,
  Trash2,
  Pencil,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import LoadingBubbles from "@/components/shared/LoadingBubbles";
import RichTextEditor from "@/components/shared/RichTextEditor";
import useModules from "./hooks/useModules";
import type { Module, Lesson } from "./services/contentService";
import { getCourse } from "./services/coursesService";

export default function CourseContentPage() {
  const { id: courseId } = useParams<{ id: string }>();
  const {
    modules,
    isLoading,
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

  const [moduleTitle, setModuleTitle] = useState("");
  const [moduleSubtitle, setModuleSubtitle] = useState("");
  const [moduleDescription, setModuleDescription] = useState("");
  const [modulePrereq, setModulePrereq] = useState("");

  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonSubtitle, setLessonSubtitle] = useState("");
  const [lessonContent, setLessonContent] = useState("");

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
    setLessonContent(lesson.content);
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
    await addLesson(activeModuleId, {
      title: lessonTitle,
      subtitle: lessonSubtitle || undefined,
      content: lessonContent,
    });
    setIsAddingLesson(false);
  }

  async function handleSaveLesson() {
    if (!activeLessonId || !activeModuleId) return;
    await editLesson(activeLessonId, activeModuleId, {
      title: lessonTitle,
      subtitle: lessonSubtitle || undefined,
      content: lessonContent,
    });
    setIsEditingLesson(false);
  }

  const activeModule = modules.find((m) => m.id === activeModuleId) ?? null;

  const [courseTitle, setCourseTitle] = useState("");
  const [courseSubtitle, setCourseSubtitle] = useState<string | null>(null);

  useEffect(() => {
    if (!courseId) return;
    getCourse(courseId)
      .then((c) => {
        setCourseTitle(c.title);
        setCourseSubtitle(c.subtitle);
      })
      .catch(() => {});
  }, [courseId]);

  if (!courseId || isLoading) return <LoadingBubbles size="lg" />;

  return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-col">
      <header className="bg-background flex items-start lg:items-center gap-4 border-b px-6 py-3">
        <Link
          to="/courses"
          className="text-muted-foreground hover:text-foreground mt-0.5 flex shrink-0 items-center gap-1 text-sm"
        >
          <ArrowLeft className="size-4" /> Courses
        </Link>
        <div className="min-w-0 flex-1">
          <h2 className="text-foreground truncate text-lg font-semibold">
            {courseTitle || "Course Content"}
          </h2>
          {courseSubtitle && (
            <p className="text-muted-foreground truncate text-sm">{courseSubtitle}</p>
          )}
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <div className="bg-background w-72 shrink-0 overflow-y-auto border-r p-4">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-foreground font-semibold">Modules</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setShowAddModule(true);
                setActiveModuleId(null);
                setActiveLessonId(null);
              }}
              title="Add Module"
            >
              <Plus className="size-4" />
            </Button>
          </div>
          <div className="space-y-1">
            {modules.map((mod) => {
              const isOpen = expandedModules.has(mod.id);
              return (
                <div key={mod.id}>
                  <button
                    onClick={() => {
                      toggleModule(mod.id);
                      openModulePreview(mod);
                    }}
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
                          onClick={() => openLessonPreview(l)}
                          className={`block w-full rounded px-2 py-1 text-left text-sm ${activeLessonId === l.id ? "bg-primary/5 text-primary" : "text-muted-foreground hover:bg-muted"}`}
                        >
                          {l.title}
                        </button>
                      ))}
                      <button
                        onClick={() => {
                          setActiveModuleId(mod.id);
                          setIsAddingLesson(true);
                          setActiveLessonId(null);
                        }}
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
        </div>

        <div className="flex-1 overflow-y-auto p-6">
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
                    <Button variant="outline" onClick={() => setIsAddingLesson(true)}>
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
                <Label>Content</Label>
                <RichTextEditor
                  value={lessonContent}
                  onChange={setLessonContent}
                  minHeight="300px"
                />
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
                  <div className="space-y-2">
                    <Label>Content</Label>
                    <RichTextEditor
                      value={lessonContent}
                      onChange={setLessonContent}
                      minHeight="300px"
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
                  <div
                    className="prose dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: lessonContent }}
                  />
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
    </div>
  );
}
