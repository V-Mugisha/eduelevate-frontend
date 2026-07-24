import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";

interface EnrollmentModalProps {
  courseTitle: string;
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function EnrollmentModal({
  courseTitle,
  isOpen,
  onConfirm,
  onCancel,
  isLoading = false,
}: EnrollmentModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-card w-full max-w-md rounded-xl border p-6 shadow-lg sm:p-8">
        <div className="bg-primary/10 mx-auto flex size-12 items-center justify-center rounded-full">
          <BookOpen className="text-primary size-6" />
        </div>
        <h2 className="text-foreground mt-4 text-center text-lg font-semibold">Enroll in Course</h2>
        <p className="text-muted-foreground mt-2 text-center text-sm">
          You are about to enroll in{" "}
          <span className="text-foreground font-medium">{courseTitle}</span>. You will gain access
          to all course modules and lessons.
        </p>
        <div className="mt-6 flex gap-3">
          <Button variant="outline" className="flex-1" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button className="flex-1" onClick={onConfirm} disabled={isLoading}>
            {isLoading ? "Enrolling..." : "Confirm Enrollment"}
          </Button>
        </div>
      </div>
    </div>
  );
}
