import { useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { Section } from "../services/contentService";

interface SectionEditModalProps {
  section: Section;
  isOpen: boolean;
  onClose: () => void;
  onSave: (sectionId: string, data: { title?: string; content?: string }) => Promise<void>;
}

export default function SectionEditModal({
  section,
  isOpen,
  onClose,
  onSave,
}: SectionEditModalProps) {
  const [title, setTitle] = useState(section.title ?? "");
  const [content, setContent] = useState(section.content);
  const [isSaving, setIsSaving] = useState(false);

  function handleOpenChange(open: boolean) {
    if (!open) {
      setTitle(section.title ?? "");
      setContent(section.content);
      onClose();
    }
  }

  async function handleSave() {
    setIsSaving(true);
    try {
      await onSave(section.id, {
        title: title || undefined,
        content,
      });
      onClose();
    } catch {
      toast.error("Failed to save section. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Section</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Title (optional)</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Content</Label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[200px]"
            />
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => handleOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
