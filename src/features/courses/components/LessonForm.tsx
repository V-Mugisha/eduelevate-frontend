import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import TiptapEditor from "@/components/shared/TiptapEditor";

interface LessonFormProps {
  title: string;
  subtitle: string;
  content: string;
  isEditing: boolean;
  onTitleChange: (value: string) => void;
  onSubtitleChange: (value: string) => void;
  onContentChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

export default function LessonForm({
  title,
  subtitle,
  content,
  isEditing,
  onTitleChange,
  onSubtitleChange,
  onContentChange,
  onSave,
  onCancel,
}: LessonFormProps) {
  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <h3 className="text-foreground font-semibold">
        {isEditing ? "Edit Lesson" : "New Lesson"}
      </h3>
      <div className="space-y-2">
        <Label>Title</Label>
        <Input value={title} onChange={(e) => onTitleChange(e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label>Subtitle (optional)</Label>
        <Input value={subtitle} onChange={(e) => onSubtitleChange(e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label>Content</Label>
        <TiptapEditor value={content} onChange={onContentChange} />
      </div>
      <div className="flex gap-3">
        <Button onClick={onSave}>{isEditing ? "Save Lesson" : "Create Lesson"}</Button>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
