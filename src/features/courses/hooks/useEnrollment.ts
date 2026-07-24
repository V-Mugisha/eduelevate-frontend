import { useState, useEffect, useCallback } from "react";
import * as enrollmentService from "../services/enrollmentService";

interface EnrollmentData {
  id: string;
  completedLessons: { lessonId: string }[];
  totalLessons?: number;
  progress?: number;
}

export default function useEnrollment(courseId: string) {
  const [enrollment, setEnrollment] = useState<EnrollmentData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchEnrollment = useCallback(async () => {
    if (!courseId) return;
    setIsLoading(true);
    try {
      const data = await enrollmentService.getEnrollment(courseId);
      setEnrollment(data);
    } catch {
      setEnrollment(null);
    } finally {
      setIsLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    fetchEnrollment();
  }, [fetchEnrollment]);

  async function handleEnroll() {
    const result = await enrollmentService.enrollInCourse(courseId);
    setEnrollment(result);
    return result;
  }

  async function handleCompleteLesson(lessonId: string) {
    await enrollmentService.completeLesson(lessonId);
    await fetchEnrollment();
  }

  const isEnrolled = enrollment !== null;
  const completedLessonIds = new Set(enrollment?.completedLessons.map((l) => l.lessonId) ?? []);
  const progress = enrollment?.progress ?? 0;

  return {
    enrollment,
    isLoading,
    isEnrolled,
    completedLessonIds,
    progress,
    handleEnroll,
    handleCompleteLesson,
    fetchEnrollment,
  };
}
