import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import LoadingBubbles from "@/components/shared/LoadingBubbles";
import { listMyEnrollments } from "./services/enrollmentService";
import EnrolledCourseCard from "./components/EnrolledCourseCard";

interface EnrollmentItem {
  id: string;
  completedLessons: { lessonId: string }[];
  totalLessons?: number;
  progress?: number;
  course: {
    id: string;
    title: string;
    subtitle: string | null;
    level: string;
    duration: string | null;
    category: { id: string; name: string; description: string | null };
    creator: { id: string; firstName: string; lastName: string };
  };
}

export default function MyLearningPage() {
  const [enrollments, setEnrollments] = useState<EnrollmentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    listMyEnrollments()
      .then(setEnrollments)
      .catch(() => setEnrollments([]))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return <LoadingBubbles size="lg" />;

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-10 lg:px-8">
      <div className="mb-8">
        <h1 className="text-foreground text-2xl font-bold sm:text-3xl">My Learning</h1>
        <p className="text-muted-foreground mt-1">Courses you are enrolled in</p>
      </div>

      {enrollments.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <BookOpen className="text-muted-foreground size-12" />
          <p className="text-muted-foreground mt-4 text-lg">
            You are not enrolled in any courses yet.
          </p>
          <Link to="/courses" className="mt-4">
            <Button>Browse Courses</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {enrollments.map((e) => (
            <EnrolledCourseCard
              key={e.id}
              course={{
                id: e.course.id,
                title: e.course.title,
                subtitle: e.course.subtitle,
                description: "",
                level: e.course.level,
                duration: e.course.duration,
                isPublished: true,
                createdAt: "",
                updatedAt: "",
                category: {
                  id: e.course.category.id,
                  name: e.course.category.name,
                  description: e.course.category.description,
                },
                creator: e.course.creator,
              }}
              progress={e.progress ?? 0}
            />
          ))}
        </div>
      )}
    </div>
  );
}
