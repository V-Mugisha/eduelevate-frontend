import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import LoadingBubbles from "@/components/shared/LoadingBubbles";
import useAuth from "@/features/auth/hooks/useAuth";
import useCourses from "./hooks/useCourses";
import CourseCard from "./components/CourseCard";
import CourseFilterBar from "./components/CourseFilterBar";

export default function CoursesCatalogPage() {
  const { user } = useAuth();
  const {
    courses,
    categories,
    isLoading,
    search,
    setSearch,
    categoryId,
    setCategoryId,
    level,
    setLevel,
    showMyCourses,
    setShowMyCourses,
  } = useCourses();

  const isEducatorOrAdmin = user?.role === "educator" || user?.role === "admin";

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-10 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-foreground text-2xl font-bold sm:text-3xl">
            {showMyCourses ? "My Courses" : "Course Catalog"}
          </h1>
          <p className="text-muted-foreground mt-1">
            {showMyCourses
              ? "Courses you have created"
              : "Discover courses and start learning today"}
          </p>
        </div>
        {isEducatorOrAdmin && (
          <Link to="/courses/create">
            <Button>
              <Plus className="mr-1.5 size-4" />
              Create Course
            </Button>
          </Link>
        )}
      </div>

      <CourseFilterBar
        search={search}
        onSearchChange={setSearch}
        categoryId={categoryId}
        onCategoryChange={setCategoryId}
        level={level}
        onLevelChange={setLevel}
        showMyCourses={showMyCourses}
        onShowMyCoursesChange={setShowMyCourses}
        categories={categories}
      />

      {isLoading ? (
        <LoadingBubbles size="lg" />
      ) : courses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-muted-foreground text-lg">No courses found.</p>
          {isEducatorOrAdmin && !showMyCourses && (
            <Link to="/courses/create" className="mt-4">
              <Button variant="outline">Create your first course</Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
}
