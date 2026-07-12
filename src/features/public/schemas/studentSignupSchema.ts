import { z } from "zod";

const gradeLevels = ["S4", "S5", "S6"] as const;

export const studentSignupSchema = z
  .object({
    firstName: z
      .string()
      .min(1, "First name is required")
      .max(100, "First name must be at most 100 characters"),
    lastName: z
      .string()
      .min(1, "Last name is required")
      .max(100, "Last name must be at most 100 characters"),
    email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[a-zA-Z]/, "Password must contain at least one letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    schoolName: z
      .string()
      .min(1, "School name is required")
      .max(200, "School name must be at most 200 characters"),
    grade: z.enum(gradeLevels, {
      message: "Please select your grade level",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type StudentSignupPayload = z.infer<typeof studentSignupSchema>;
