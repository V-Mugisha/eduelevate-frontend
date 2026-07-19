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
