export interface Category {
  id: string;
  name: string;
  description: string | null;
}

export interface Course {
  id: string;
  title: string;
  subtitle: string | null;
  description: string;
  level: string;
  duration: string | null;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  category: Category;
  creator: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

export interface CoursesListResponse {
  courses: Course[];
  total: number;
  page: number;
  limit: number;
}

export type CourseLevel = "beginner" | "intermediate" | "advanced";

export interface EnrolledStudent {
  id: string;
  enrolledAt: string;
  completedCount: number;
  totalLessons: number;
  progress: number;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    schoolName: string | null;
    grade: string | null;
  };
}

export interface StudentDetailModule {
  id: string;
  title: string;
  lessons: { id: string; title: string }[];
}

export interface StudentDetail {
  enrollmentId: string;
  enrolledAt: string;
  progress: number;
  completedCount: number;
  totalLessons: number;
  completedLessonIds: string[];
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    schoolName: string | null;
    grade: string | null;
  };
  course: {
    id: string;
    title: string;
  };
  modules: StudentDetailModule[];
}
