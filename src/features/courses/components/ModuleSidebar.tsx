import { Plus, ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Module, Lesson } from "../services/contentService";

interface ModuleSidebarProps {
  modules: Module[];
  expandedModules: Set<string>;
  activeModuleId: string | null;
  activeLessonId: string | null;
  onSelectModule: (mod: Module) => void;
  onSelectLesson: (lesson: Lesson) => void;
  onAddModule: () => void;
  onAddLesson: (moduleId: string) => void;
}

export default function ModuleSidebar({
  modules,
  expandedModules,
  activeModuleId,
  activeLessonId,
  onSelectModule,
  onSelectLesson,
  onAddModule,
  onAddLesson,
}: ModuleSidebarProps) {
  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-foreground font-semibold">Modules</h2>
        <Button variant="ghost" size="icon" onClick={onAddModule} title="Add Module">
          <Plus className="size-4" />
        </Button>
      </div>
      <div className="space-y-1">
        {modules.map((mod) => {
          const isOpen = expandedModules.has(mod.id);
          return (
            <div key={mod.id}>
              <button
                onClick={() => onSelectModule(mod)}
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
                      onClick={() => onSelectLesson(l)}
                      className={`block w-full rounded px-2 py-1 text-left text-sm ${activeLessonId === l.id ? "bg-primary/5 text-primary" : "text-muted-foreground hover:bg-muted"}`}
                    >
                      {l.title}
                    </button>
                  ))}
                  <button
                    onClick={() => onAddLesson(mod.id)}
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
