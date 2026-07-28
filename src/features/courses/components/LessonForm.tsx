import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SectionsEditor from "@/components/shared/SectionsEditor";

interface LessonFormProps {
  title: string;
  subtitle: string;
  sections: { title: string; content: string }[];
  onTitleChange: (value: string) => void;
  onSubtitleChange: (value: string) => void;
  onSectionsChange: (sections: { title: string; content: string }[]) => void;
  onSave: () => void;
  onCancel: () => void;
}

export default function LessonForm({
  title,
  subtitle,
  sections,
  onTitleChange,
  onSubtitleChange,
  onSectionsChange,
  onSave,
  onCancel,
}: LessonFormProps) {
  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <h3 className="text-foreground font-semibold">New Lesson</h3>
      <div className="space-y-2">
        <Label>Title</Label>
        <Input value={title} onChange={(e) => onTitleChange(e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label>Subtitle (optional)</Label>
        <Input value={subtitle} onChange={(e) => onSubtitleChange(e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label>Sections</Label>
        <SectionsEditor sections={sections} onChange={onSectionsChange} />
      </div>
      <div className="flex gap-3">
        <Button onClick={onSave}>Create Lesson</Button>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
