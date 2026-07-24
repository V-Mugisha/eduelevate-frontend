import apiClient from "@/lib/apiClient";

export interface Section {
  id: string;
  title: string | null;
  content: string;
  order: number;
}

export interface Module {
  id: string;
  courseId: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  prerequisites: string[];
  createdAt: string;
  updatedAt: string;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  subtitle: string | null;
  createdAt: string;
  updatedAt: string;
  sections: Section[];
}

export async function listModules(courseId: string): Promise<Module[]> {
  const res = await apiClient.get<{ data: Module[] }>(`/courses/${courseId}/modules`);
  return res.data.data;
}

export async function createModule(
  courseId: string,
  data: { title: string; subtitle?: string; description?: string; prerequisites?: string[] },
): Promise<Module> {
  const res = await apiClient.post<{ data: Module }>(`/courses/${courseId}/modules`, data);
  return res.data.data;
}

export async function updateModule(
  courseId: string,
  moduleId: string,
  data: { title?: string; subtitle?: string; description?: string; prerequisites?: string[] },
): Promise<Module> {
  const res = await apiClient.put<{ data: Module }>(
    `/courses/${courseId}/modules/${moduleId}`,
    data,
  );
  return res.data.data;
}

export async function deleteModule(courseId: string, moduleId: string): Promise<void> {
  await apiClient.delete(`/courses/${courseId}/modules/${moduleId}`);
}

export async function createLesson(
  moduleId: string,
  data: { title: string; subtitle?: string },
): Promise<Lesson> {
  const res = await apiClient.post<{ data: Lesson }>(`/modules/${moduleId}/lessons`, data);
  return res.data.data;
}

export async function updateLesson(
  moduleId: string,
  lessonId: string,
  data: { title?: string; subtitle?: string },
): Promise<Lesson> {
  const res = await apiClient.put<{ data: Lesson }>(
    `/modules/${moduleId}/lessons/${lessonId}`,
    data,
  );
  return res.data.data;
}

export async function deleteLesson(moduleId: string, lessonId: string): Promise<void> {
  await apiClient.delete(`/modules/${moduleId}/lessons/${lessonId}`);
}

export async function createSection(
  lessonId: string,
  data: { title?: string; content: string },
): Promise<Section> {
  const res = await apiClient.post<{ data: Section }>(`/lessons/${lessonId}/sections`, data);
  return res.data.data;
}

export async function updateSection(
  lessonId: string,
  sectionId: string,
  data: { title?: string; content?: string },
): Promise<Section> {
  const res = await apiClient.put<{ data: Section }>(
    `/lessons/${lessonId}/sections/${sectionId}`,
    data,
  );
  return res.data.data;
}

export async function deleteSection(lessonId: string, sectionId: string): Promise<void> {
  await apiClient.delete(`/lessons/${lessonId}/sections/${sectionId}`);
}
