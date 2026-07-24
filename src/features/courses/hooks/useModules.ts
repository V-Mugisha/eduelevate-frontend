import { useState, useEffect, useCallback } from "react";
import type { Module } from "../services/contentService";
import * as contentService from "../services/contentService";

export default function useModules(courseId: string) {
  const [modules, setModules] = useState<Module[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchModules = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await contentService.listModules(courseId);
      setModules(data);
    } catch {
      setModules([]);
    } finally {
      setIsLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    fetchModules();
  }, [fetchModules]);

  async function addModule(data: {
    title: string;
    subtitle?: string;
    description?: string;
    prerequisites?: string[];
  }) {
    const mod = await contentService.createModule(courseId, data);
    setModules((prev) => [...prev, { ...mod, lessons: [] }]);
    return mod;
  }

  async function editModule(
    moduleId: string,
    data: { title?: string; subtitle?: string; description?: string; prerequisites?: string[] },
  ) {
    const updated = await contentService.updateModule(courseId, moduleId, data);
    setModules((prev) => prev.map((m) => (m.id === moduleId ? { ...m, ...updated } : m)));
  }

  async function removeModule(moduleId: string) {
    await contentService.deleteModule(courseId, moduleId);
    setModules((prev) => prev.filter((m) => m.id !== moduleId));
  }

  async function addLesson(
    moduleId: string,
    data: { title: string; subtitle?: string; content: string },
  ) {
    const lesson = await contentService.createLesson(moduleId, data);
    setModules((prev) =>
      prev.map((m) => (m.id === moduleId ? { ...m, lessons: [...m.lessons, lesson] } : m)),
    );
    return lesson;
  }

  async function editLesson(
    lessonId: string,
    moduleId: string,
    data: { title?: string; subtitle?: string; content?: string },
  ) {
    const updated = await contentService.updateLesson(moduleId, lessonId, data);
    setModules((prev) =>
      prev.map((m) =>
        m.id === moduleId
          ? { ...m, lessons: m.lessons.map((l) => (l.id === lessonId ? { ...l, ...updated } : l)) }
          : m,
      ),
    );
  }

  async function removeLesson(lessonId: string, moduleId: string) {
    await contentService.deleteLesson(moduleId, lessonId);
    setModules((prev) =>
      prev.map((m) =>
        m.id === moduleId ? { ...m, lessons: m.lessons.filter((l) => l.id !== lessonId) } : m,
      ),
    );
  }

  return {
    modules,
    isLoading,
    fetchModules,
    addModule,
    editModule,
    removeModule,
    addLesson,
    editLesson,
    removeLesson,
  };
}
