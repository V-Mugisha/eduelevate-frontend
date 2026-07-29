import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import TiptapEditor from "@/components/shared/TiptapEditor";

interface ModuleFormProps {
  title: string;
  subtitle: string;
  description: string;
  prerequisites: string;
  isEditing: boolean;
  onTitleChange: (value: string) => void;
  onSubtitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onPrerequisitesChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

export default function ModuleForm({
  title,
  subtitle,
  description,
  prerequisites,
  isEditing,
  onTitleChange,
  onSubtitleChange,
  onDescriptionChange,
  onPrerequisitesChange,
  onSave,
  onCancel,
}: ModuleFormProps) {
  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <h3 className="text-foreground font-semibold">{isEditing ? "Edit Module" : "New Module"}</h3>
      <div className="space-y-2">
        <Label>Title</Label>
        <Input value={title} onChange={(e) => onTitleChange(e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label>Subtitle (optional)</Label>
        <Input value={subtitle} onChange={(e) => onSubtitleChange(e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label>Description (optional)</Label>
        <TiptapEditor value={description} onChange={onDescriptionChange} />
      </div>
      <div className="space-y-2">
        <Label>Prerequisites (comma-separated)</Label>
        <Input
          value={prerequisites}
          onChange={(e) => onPrerequisitesChange(e.target.value)}
          placeholder="e.g. Basic HTML, CSS Fundamentals"
        />
      </div>
      <div className="flex gap-3">
        <Button onClick={onSave}>{isEditing ? "Save Module" : "Create Module"}</Button>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
