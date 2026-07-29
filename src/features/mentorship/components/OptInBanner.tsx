import { CheckCircle, Plus, X as XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface OptInBannerProps {
  isEducator: boolean;
  isOptedIn: boolean;
  isOpen: boolean;
  topics: string[];
  bio: string;
  isSaving: boolean;
  onToggle: () => void;
  onSave: () => void;
  onOptOut: () => void;
  onAddTopic: () => void;
  onRemoveTopic: (index: number) => void;
  onTopicChange: (index: number, value: string) => void;
  onBioChange: (value: string) => void;
}

export default function OptInBanner({
  isEducator,
  isOptedIn,
  isOpen,
  topics,
  bio,
  isSaving,
  onToggle,
  onSave,
  onOptOut,
  onAddTopic,
  onRemoveTopic,
  onTopicChange,
  onBioChange,
}: OptInBannerProps) {
  if (!isEducator) return null;

  return (
    <div className="space-y-3">
      {isOptedIn ? (
        <div className="flex items-center justify-between rounded-lg border border-green-500/30 bg-green-500/5 p-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="size-5 text-green-500" />
            <div>
              <p className="text-foreground text-sm font-medium">Mentorship profile active</p>
              <p className="text-muted-foreground text-xs">
                Students can find and apply to be mentored by you.
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onToggle}>
              Edit
            </Button>
            <Button variant="ghost" size="sm" className="text-destructive" onClick={onOptOut}>
              Opt Out
            </Button>
          </div>
        </div>
      ) : (
        <div className="bg-muted/30 flex items-center justify-between rounded-lg border p-4">
          <div>
            <p className="text-foreground text-sm font-medium">Become a mentor</p>
            <p className="text-muted-foreground text-xs">
              Opt in to be discoverable by students seeking mentorship.
            </p>
          </div>
          <Button size="sm" onClick={onToggle}>
            <Plus className="mr-1.5 size-4" /> Opt In
          </Button>
        </div>
      )}

      {isOpen && (
        <div className="mt-4 space-y-3 border-t pt-4">
          <div className="space-y-2">
            <Label>Topics you can mentor on</Label>
            {topics.map((t, i) => (
              <div key={i} className="flex items-center gap-2">
                <Input
                  value={t}
                  onChange={(e) => onTopicChange(i, e.target.value)}
                  placeholder={`Topic ${i + 1}`}
                />
                {topics.length > 1 && (
                  <Button variant="ghost" size="icon" onClick={() => onRemoveTopic(i)}>
                    <XIcon className="size-3" />
                  </Button>
                )}
              </div>
            ))}
            <Button variant="ghost" size="sm" onClick={onAddTopic}>
              <Plus className="mr-1 size-3" /> Add Topic
            </Button>
          </div>
          <div className="space-y-2">
            <Label>Bio (optional)</Label>
            <Textarea
              value={bio}
              onChange={(e) => onBioChange(e.target.value)}
              placeholder="Tell students about yourself..."
            />
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={onSave} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save"}
            </Button>
            <Button size="sm" variant="outline" onClick={onToggle}>
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
