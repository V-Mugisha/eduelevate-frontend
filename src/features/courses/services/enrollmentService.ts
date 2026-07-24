import apiClient from "@/lib/apiClient";
import type { EnrolledStudent, StudentDetail } from "../types/coursesTypes";

interface EnrollmentData {
  id: string;
  createdAt: string;
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

export async function enrollInCourse(courseId: string): Promise<EnrollmentData> {
  const res = await apiClient.post<{ data: EnrollmentData }>(`/courses/${courseId}/enroll`);
  return res.data.data;
}

export async function getEnrollment(courseId: string): Promise<EnrollmentData | null> {
  try {
    const res = await apiClient.get<{ data: EnrollmentData }>(`/courses/${courseId}/enrollment`);
    return res.data.data;
  } catch {
    return null;
  }
}

export async function listMyEnrollments(): Promise<EnrollmentData[]> {
  const res = await apiClient.get<{ data: EnrollmentData[] }>("/enrollments/mine");
  return res.data.data;
}

export async function completeLesson(lessonId: string): Promise<void> {
  await apiClient.post(`/lessons/${lessonId}/complete`);
}

export async function getCourseStudents(courseId: string): Promise<EnrolledStudent[]> {
  const res = await apiClient.get<{ data: EnrolledStudent[] }>(`/courses/${courseId}/students`);
  return res.data.data;
}

export async function getStudentDetail(
  courseId: string,
  studentUserId: string,
): Promise<StudentDetail> {
  const res = await apiClient.get<{ data: StudentDetail }>(
    `/courses/${courseId}/students/${studentUserId}`,
  );
  return res.data.data;
}
