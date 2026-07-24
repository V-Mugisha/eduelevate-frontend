import apiClient from "@/lib/apiClient";
import type { Course, CoursesListResponse, Category } from "../types/coursesTypes";

interface ListCoursesParams {
  search?: string;
  categoryId?: string;
  level?: string;
  page?: number;
  limit?: number;
}

export async function listCourses(params?: ListCoursesParams): Promise<CoursesListResponse> {
  const response = await apiClient.get<{ data: CoursesListResponse }>("/courses", { params });
  return response.data.data;
}

export async function getCourse(id: string): Promise<Course> {
  const response = await apiClient.get<{ data: Course }>(`/courses/${id}`);
  return response.data.data;
}

export async function listMyCourses(): Promise<Course[]> {
  const response = await apiClient.get<{ data: Course[] }>("/courses/my-courses");
  return response.data.data;
}

export async function listCategories(): Promise<Category[]> {
  const response = await apiClient.get<{ data: Category[] }>("/categories");
  return response.data.data;
}

export async function createCourse(data: {
  title: string;
  subtitle?: string;
  description: string;
  categoryId: string;
  level: string;
  duration?: string;
  maxStudents?: number;
}): Promise<Course> {
  const response = await apiClient.post<{ data: Course }>("/courses", data);
  return response.data.data;
}

export async function publishCourse(id: string, publish: boolean): Promise<Course> {
  const response = await apiClient.patch<{ data: Course }>(`/courses/${id}/publish`, { publish });
  return response.data.data;
}
