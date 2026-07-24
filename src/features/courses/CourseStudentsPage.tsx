import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Users, GraduationCap, Calendar, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import LoadingBubbles from "@/components/shared/LoadingBubbles";
import { getCourseStudents } from "./services/enrollmentService";
import { getCourse } from "./services/coursesService";
import type { EnrolledStudent } from "./types/coursesTypes";

const gradeLabels: Record<string, string> = {
  S4: "Senior 4",
  S5: "Senior 5",
  S6: "Senior 6",
};

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function CourseStudentsPage() {
  const { id: courseId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [students, setStudents] = useState<EnrolledStudent[]>([]);
  const [courseTitle, setCourseTitle] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!courseId) return;
    Promise.all([getCourseStudents(courseId), getCourse(courseId)])
      .then(([studentData, courseData]) => {
        setStudents(studentData);
        setCourseTitle(courseData.title);
      })
      .catch(() => setError("Failed to load student data."))
      .finally(() => setIsLoading(false));
  }, [courseId]);

  if (isLoading) return <LoadingBubbles size="lg" />;

  if (error) {
    return (
      <div className="flex items-center justify-center px-4 py-20">
        <p className="text-muted-foreground">{error}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <Button
        variant="ghost"
        onClick={() => navigate(`/courses/${courseId}`)}
        className="mb-4 -ml-3"
      >
        <ArrowLeft className="mr-1.5 size-4" />
        Back to Course
      </Button>

      <div className="mb-8">
        <h1 className="text-foreground text-2xl font-bold sm:text-3xl">
          {courseTitle || "Course Students"}
        </h1>
        <p className="text-muted-foreground mt-1">
          {students.length} {students.length === 1 ? "student" : "students"} enrolled
        </p>
      </div>

      {students.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Users className="text-muted-foreground size-12" />
          <p className="text-muted-foreground mt-4 text-lg">No students have enrolled yet.</p>
        </div>
      ) : (
        <div className="bg-card overflow-hidden rounded-xl border">
          <div className="hidden md:block">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted/50 border-b">
                    <th className="text-muted-foreground px-4 py-3 text-left text-xs font-medium tracking-wider uppercase">
                      Student
                    </th>
                    <th className="text-muted-foreground px-4 py-3 text-left text-xs font-medium tracking-wider uppercase">
                      School
                    </th>
                    <th className="text-muted-foreground px-4 py-3 text-left text-xs font-medium tracking-wider uppercase">
                      Grade
                    </th>
                    <th className="text-muted-foreground px-4 py-3 text-left text-xs font-medium tracking-wider uppercase">
                      Enrolled
                    </th>
                    <th className="text-muted-foreground px-4 py-3 text-left text-xs font-medium tracking-wider uppercase">
                      Progress
                    </th>
                    <th className="text-muted-foreground px-4 py-3 text-right text-xs font-medium tracking-wider uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {students.map((student) => (
                    <tr key={student.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3">
                        <div>
                          <p className="text-foreground text-sm font-medium">
                            {student.user.firstName} {student.user.lastName}
                          </p>
                          <p className="text-muted-foreground text-xs">{student.user.email}</p>
                        </div>
                      </td>
                      <td className="text-foreground px-4 py-3 text-sm">
                        {student.user.schoolName ?? "\u2014"}
                      </td>
                      <td className="text-foreground px-4 py-3 text-sm">
                        {student.user.grade
                          ? (gradeLabels[student.user.grade] ?? student.user.grade)
                          : "\u2014"}
                      </td>
                      <td className="text-muted-foreground px-4 py-3 text-sm">
                        {formatDate(student.enrolledAt)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="bg-muted h-1.5 w-20 overflow-hidden rounded-full">
                            <div
                              className="bg-primary h-full rounded-full transition-all"
                              style={{ width: `${student.progress}%` }}
                            />
                          </div>
                          <span className="text-muted-foreground text-xs">{student.progress}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link
                          to={`/courses/${courseId}/students/${student.user.id}`}
                          className="text-primary inline-flex items-center gap-1 text-xs hover:underline"
                        >
                          View <ChevronRight className="size-3" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="divide-y md:hidden">
            {students.map((student) => (
              <div key={student.id} className="flex flex-col gap-1 px-4 py-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-foreground text-sm font-medium">
                      {student.user.firstName} {student.user.lastName}
                    </p>
                    <p className="text-muted-foreground text-xs">{student.user.email}</p>
                  </div>
                  <Link
                    to={`/courses/${courseId}/students/${student.user.id}`}
                    className="text-primary shrink-0"
                  >
                    <ChevronRight className="size-5" />
                  </Link>
                </div>
                <div className="text-muted-foreground mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
                  <span className="flex items-center gap-1">
                    <GraduationCap className="size-3" />
                    {student.user.schoolName ?? "No school"}{" "}
                    {student.user.grade ? `(${student.user.grade})` : ""}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="size-3" />
                    {formatDate(student.enrolledAt)}
                  </span>
                </div>
                <div className="mt-1 flex items-center gap-2">
                  <div className="bg-muted h-1.5 w-24 overflow-hidden rounded-full">
                    <div
                      className="bg-primary h-full rounded-full transition-all"
                      style={{ width: `${student.progress}%` }}
                    />
                  </div>
                  <span className="text-muted-foreground text-xs">{student.progress}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
