import { useState, useEffect, useCallback } from "react";
import useDebounce from "@/hooks/useDebounce";
import type { Course, Category } from "../types/coursesTypes";
import * as coursesService from "../services/coursesService";

export default function useCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const [categoryId, setCategoryId] = useState("");
  const [level, setLevel] = useState("");
  const [showMyCourses, setShowMyCourses] = useState(false);

  const fetchCourses = useCallback(async () => {
    setIsLoading(true);
    try {
      if (showMyCourses) {
        const data = await coursesService.listMyCourses();
        setCourses(data);
      } else {
        const params: Record<string, string | number> = {};
        if (debouncedSearch) params.search = debouncedSearch;
        if (categoryId) params.categoryId = categoryId;
        if (level) params.level = level;
        const result = await coursesService.listCourses(params);
        setCourses(result.courses);
      }
    } catch {
      setCourses([]);
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch, categoryId, level, showMyCourses]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  useEffect(() => {
    coursesService
      .listCategories()
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  return {
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
    refetch: fetchCourses,
  };
}
