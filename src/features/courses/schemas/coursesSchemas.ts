import { z } from "zod";

export const createCourseSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  subtitle: z.string().max(300).optional(),
  description: z.string().min(1, "Description is required").max(5000),
  categoryId: z.string().min(1, "Category is required"),
  level: z.enum(["beginner", "intermediate", "advanced"], {
    message: "Level must be beginner, intermediate, or advanced",
  }),
  duration: z.string().max(100).optional(),
  maxStudents: z.number().int().min(1).optional(),
});

export type CreateCourseFormValues = z.infer<typeof createCourseSchema>;
