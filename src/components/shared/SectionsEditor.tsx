import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2 } from "lucide-react";

interface SectionData {
  title: string;
  content: string;
}

interface SectionsEditorProps {
  sections: SectionData[];
  onChange: (sections: SectionData[]) => void;
}

export default function SectionsEditor({ sections, onChange }: SectionsEditorProps) {
  function handleAdd() {
    onChange([...sections, { title: "", content: "" }]);
  }

  function handleRemove(index: number) {
    if (sections.length <= 1) return;
    onChange(sections.filter((_, i) => i !== index));
  }

  function handleChange(index: number, field: keyof SectionData, value: string) {
    const updated = sections.map((s, i) => (i === index ? { ...s, [field]: value } : s));
    onChange(updated);
  }

  return (
    <div className="space-y-4">
      {sections.map((section, index) => (
        <div key={index} className="rounded-lg border p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-muted-foreground text-sm font-medium">Section {index + 1}</span>
            {sections.length > 1 && (
              <Button type="button" variant="ghost" size="icon" onClick={() => handleRemove(index)}>
                <Trash2 className="text-muted-foreground size-4" />
              </Button>
            )}
          </div>
          <div className="space-y-3">
            <Input
              placeholder="Section title (optional)"
              value={section.title}
              onChange={(e) => handleChange(index, "title", e.target.value)}
            />
            <Textarea
              placeholder="Section content..."
              className="min-h-[120px]"
              value={section.content}
              onChange={(e) => handleChange(index, "content", e.target.value)}
            />
          </div>
        </div>
      ))}
      <Button type="button" variant="outline" className="w-full" onClick={handleAdd}>
        <Plus className="mr-1.5 size-4" /> Add Section
      </Button>
    </div>
  );
}
