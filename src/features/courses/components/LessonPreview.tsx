import { Link } from "react-router-dom";
import { Pencil, Trash2, ClipboardList, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ActionsDropdown from "@/components/shared/ActionsDropdown";
import TiptapEditor from "@/components/shared/TiptapEditor";
import LoadingBubbles from "@/components/shared/LoadingBubbles";
import DOMPurify from "isomorphic-dompurify";
import type { Lesson } from "../services/contentService";

interface LessonPreviewProps {
  lesson: Lesson;
  courseId: string;
  isEditing: boolean;
  isSaving: boolean;
  title: string;
  subtitle: string;
  content: string;
  onTitleChange: (value: string) => void;
  onSubtitleChange: (value: string) => void;
  onContentChange: (value: string) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onStartEdit: () => void;
  onDelete: () => void;
}

export default function LessonPreview({
  lesson,
  courseId,
  isEditing,
  isSaving,
  title,
  subtitle,
  content,
  onTitleChange,
  onSubtitleChange,
  onContentChange,
  onSaveEdit,
  onCancelEdit,
  onStartEdit,
  onDelete,
}: LessonPreviewProps) {
  return (
    <div className="mx-auto max-w-2xl">
      {isEditing ? (
        <div className="space-y-4">
          <h3 className="text-foreground font-semibold">Edit Lesson</h3>
          <div className="space-y-2">
            <label className="text-sm font-medium">Title</label>
            <Input value={title} onChange={(e) => onTitleChange(e.target.value)} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Subtitle (optional)</label>
            <Input value={subtitle} onChange={(e) => onSubtitleChange(e.target.value)} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Content</label>
            <TiptapEditor value={content} onChange={onContentChange} />
          </div>
          <div className="flex gap-3">
            <Button size="sm" onClick={onSaveEdit} disabled={isSaving}>
              {isSaving ? <LoadingBubbles size="sm" /> : "Save Lesson"}
            </Button>
            <Button size="sm" variant="outline" onClick={onCancelEdit} disabled={isSaving}>
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
          {lesson.content && (
            <div
              className="prose prose-sm dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(lesson.content),
              }}
            />
          )}
          {!lesson.content && (
            <p className="text-muted-foreground py-8 text-center text-sm">
              This lesson has no content yet. Click Edit to add content.
            </p>
          )}
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
    </div>
  );
}
