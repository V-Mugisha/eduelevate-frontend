import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import SearchableSelectDropdown from "@/components/shared/SearchableSelectDropdown";
import useAuth from "@/features/auth/hooks/useAuth";
import type { Category } from "../types/coursesTypes";

interface CourseFilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  categoryId: string;
  onCategoryChange: (value: string) => void;
  level: string;
  onLevelChange: (value: string) => void;
  showMyCourses: boolean;
  onShowMyCoursesChange: (value: boolean) => void;
  categories: Category[];
}

const levelOptions = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
];

export default function CourseFilterBar({
  search,
  onSearchChange,
  categoryId,
  onCategoryChange,
  level,
  onLevelChange,
  showMyCourses,
  onShowMyCoursesChange,
  categories,
}: CourseFilterBarProps) {
  const { user } = useAuth();
  const isEducatorOrAdmin = user?.role === "educator" || user?.role === "admin";

  const categoryOptions = categories.map((cat) => ({
    value: cat.id,
    label: cat.name,
  }));

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
        <Input
          placeholder="Search courses..."
          className="pl-10"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <SearchableSelectDropdown
          options={categoryOptions}
          value={categoryId}
          onChange={onCategoryChange}
          placeholder="All Categories"
          searchPlaceholder="Filter categories..."
          emptyMessage="No categories found."
          triggerClassName="h-9 w-auto min-w-[180px]"
        />

        <SearchableSelectDropdown
          options={levelOptions}
          value={level}
          onChange={onLevelChange}
          placeholder="All Levels"
          searchPlaceholder="Filter levels..."
          emptyMessage="No levels found."
          triggerClassName="h-9 w-auto min-w-[150px]"
        />

        {isEducatorOrAdmin && (
          <div className="flex items-center gap-2">
            <Checkbox
              id="my-courses"
              checked={showMyCourses}
              onCheckedChange={(checked) => onShowMyCoursesChange(Boolean(checked))}
            />
            <Label htmlFor="my-courses" className="cursor-pointer text-sm font-normal">
              My Courses
            </Label>
          </div>
        )}
      </div>
    </div>
  );
}
