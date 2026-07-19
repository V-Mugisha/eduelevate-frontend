import { Link } from "react-router-dom";
import { Clock, BookOpen } from "lucide-react";
import type { Course } from "../types/coursesTypes";

interface CourseCardProps {
  course: Course;
}

const levelColors: Record<string, string> = {
  beginner: "bg-green-500/10 text-green-600 dark:text-green-400",
  intermediate: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
  advanced: "bg-red-500/10 text-red-600 dark:text-red-400",
};

function gradientFromId(id: string): string {
  const hash = id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const hue = hash % 360;
  return `linear-gradient(135deg, hsl(${hue}, 60%, 65%), hsl(${(hue + 40) % 360}, 60%, 50%))`;
}

export default function CourseCard({ course }: CourseCardProps) {
  return (
    <Link
      to={`/courses/${course.id}`}
      className="group bg-card overflow-hidden rounded-xl border shadow-sm transition-shadow hover:shadow-md"
    >
      <div
        className="flex h-40 items-center justify-center"
        style={{ background: gradientFromId(course.id) }}
      >
        <BookOpen className="size-10 text-white/70" />
      </div>
      <div className="p-5">
        <span className="bg-primary/10 text-primary inline-block rounded-full px-2 py-0.5 text-xs font-medium">
          {course.category.name}
        </span>
        <h3 className="text-foreground group-hover:text-primary mt-2 line-clamp-2 text-base font-semibold">
          {course.title}
        </h3>
        {course.subtitle && (
          <p className="text-muted-foreground mt-1 line-clamp-2 text-sm">{course.subtitle}</p>
        )}
        <div className="text-muted-foreground mt-3 flex items-center gap-3 text-xs">
          <span className={`rounded-full px-2 py-0.5 font-medium ${levelColors[course.level]}`}>
            {course.level}
          </span>
          {course.duration && (
            <span className="flex items-center gap-1">
              <Clock className="size-3" />
              {course.duration}
            </span>
          )}
        </div>
        <p className="text-muted-foreground mt-2 text-xs">
          by {course.creator.firstName} {course.creator.lastName}
        </p>
      </div>
    </Link>
  );
}
