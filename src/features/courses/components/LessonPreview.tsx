import { useState } from "react";
import { Link } from "react-router-dom";
import { Pencil, Trash2, ClipboardList, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import ActionsDropdown from "@/components/shared/ActionsDropdown";
import SectionEditModal from "./SectionEditModal";
import type { Lesson, Section } from "../services/contentService";

interface LessonPreviewProps {
  lesson: Lesson;
  courseId: string;
  isEditing: boolean;
  title: string;
  subtitle: string;
  onTitleChange: (value: string) => void;
  onSubtitleChange: (value: string) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onStartEdit: () => void;
  onDelete: () => void;
  onUpdateSection: (sectionId: string, data: { title?: string; content?: string }) => Promise<void>;
}

export default function LessonPreview({
  lesson,
  courseId,
  isEditing,
  title,
  subtitle,
  onTitleChange,
  onSubtitleChange,
  onSaveEdit,
  onCancelEdit,
  onStartEdit,
  onDelete,
  onUpdateSection,
}: LessonPreviewProps) {
  const [editingSection, setEditingSection] = useState<Section | null>(null);

  const sections = lesson.sections ?? [];

  return (
    <div className="mx-auto max-w-2xl">
      {isEditing ? (
        <div className="space-y-4">
          <h3 className="text-foreground font-semibold">Edit Lesson</h3>
          <div className="space-y-2">
            <label className="text-sm font-medium">Title</label>
            <input
              className="w-full rounded-lg border px-3 py-2 text-sm"
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Subtitle (optional)</label>
            <input
              className="w-full rounded-lg border px-3 py-2 text-sm"
              value={subtitle}
              onChange={(e) => onSubtitleChange(e.target.value)}
            />
          </div>
          <div className="flex gap-3">
            <Button size="sm" onClick={onSaveEdit}>
              Save Lesson
            </Button>
            <Button size="sm" variant="outline" onClick={onCancelEdit}>
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div>
          <div className="mb-8 flex items-start justify-between">
            <div>
              <h1 className="text-foreground text-2xl font-bold">{lesson.title}</h1>
              {lesson.subtitle && <p className="text-muted-foreground mt-1">{lesson.subtitle}</p>}
            </div>
            <ActionsDropdown
              actions={[
                {
                  label: "Edit",
                  icon: <Pencil className="size-4" />,
                  onClick: onStartEdit,
                },
                {
                  label: "Delete",
                  icon: <Trash2 className="size-4" />,
                  onClick: onDelete,
                  destructive: true,
                },
              ]}
            />
          </div>
          {sections.map((s) => (
            <div key={s.id} className="mb-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {s.title && <h3 className="text-foreground text-lg font-semibold">{s.title}</h3>}
                  <p className="text-muted-foreground whitespace-pre-line">{s.content}</p>
                </div>
                <ActionsDropdown
                  actions={[
                    {
                      label: "Edit",
                      icon: <Pencil className="size-4" />,
                      onClick: () => setEditingSection(s),
                    },
                  ]}
                />
              </div>
            </div>
          ))}
          <div className="mt-8 border-t pt-6">
            <Link to={`/courses/${courseId}/content/assessment/${lesson.id}`}>
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
            <p className="text-muted-foreground mt-1 text-xs">Progress tracking coming soon</p>
          </div>
        </div>
      )}

      {editingSection && (
        <SectionEditModal
          section={editingSection}
          isOpen={!!editingSection}
          onClose={() => setEditingSection(null)}
          onSave={onUpdateSection}
        />
      )}
    </div>
  );
}
