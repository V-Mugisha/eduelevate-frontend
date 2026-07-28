import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import SearchableSelectDropdown from "@/components/shared/SearchableSelectDropdown";
import LoadingBubbles from "@/components/shared/LoadingBubbles";
import { createCourseSchema } from "../schemas/coursesSchemas";
import * as coursesService from "../services/coursesService";
import type { Category } from "../types/coursesTypes";

const levelOptions = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
];

export default function CreateCourseForm() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [level, setLevel] = useState("beginner");
  const [duration, setDuration] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    coursesService
      .listCategories()
      .then(setCategories)
      .catch(() => {});
  }, []);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const result = createCourseSchema.safeParse({
      title,
      subtitle: subtitle || undefined,
      description,
      categoryId,
      level,
      duration: duration || undefined,
    });

    if (!result.success) {
      toast.error(result.error.issues.map((i) => i.message).join(", "));
      return;
    }

    setIsSubmitting(true);
    try {
      await coursesService.createCourse(result.data);
      toast.success("Course created successfully. You can add content and publish it when ready.");
      navigate("/courses/my-courses");
    } catch {
      toast.error("Failed to create course. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const categoryOptions = categories.map((cat) => ({
    value: cat.id,
    label: cat.name,
  }));

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="course-title">Title</Label>
        <Input
          id="course-title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="e.g. Introduction to Web Development"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="course-subtitle">Subtitle (optional)</Label>
        <Input
          id="course-subtitle"
          value={subtitle}
          onChange={(event) => setSubtitle(event.target.value)}
          placeholder="A short description that appears below the title"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="course-description">Description</Label>
        <Textarea
          id="course-description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Describe what students will learn in this course..."
          className="min-h-40"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="course-category">Category</Label>
          <SearchableSelectDropdown
            options={categoryOptions}
            value={categoryId}
            onChange={setCategoryId}
            placeholder="Select category"
            searchPlaceholder="Search categories..."
            emptyMessage="No categories found."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="course-level">Level</Label>
          <SearchableSelectDropdown
            options={levelOptions}
            value={level}
            onChange={setLevel}
            placeholder="Select level"
            emptyMessage="No levels found."
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="course-duration">Duration (optional)</Label>
        <Input
          id="course-duration"
          value={duration}
          onChange={(event) => setDuration(event.target.value)}
          placeholder="e.g. 6 weeks, 10 hours"
        />
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? <LoadingBubbles size="sm" /> : "Create Course"}
        </Button>
        <Button type="button" variant="outline" onClick={() => navigate("/courses")}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
