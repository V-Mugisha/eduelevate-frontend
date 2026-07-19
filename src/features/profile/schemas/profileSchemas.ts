import { z } from "zod";

export const updateProfileSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(100, "First name must be at most 100 characters"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(100, "Last name must be at most 100 characters"),
});

export const updateStudentProfileSchema = z.object({
  schoolName: z
    .string()
    .min(1, "School name is required")
    .max(200, "School name must be at most 200 characters"),
  grade: z.enum(["S4", "S5", "S6"], { message: "Please select a grade" }),
});

export const updateEducatorProfileSchema = z.object({
  bio: z.string().min(1, "Bio is required").max(2000, "Bio must be at most 2000 characters"),
  expertiseAreas: z.array(z.string().min(1)).min(1, "At least one area of expertise is required"),
  yearsOfExperience: z.string().optional(),
  isIndependent: z.boolean(),
  organizationName: z.string().optional(),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[a-zA-Z]/, "Password must contain at least one letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmNewPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords do not match",
    path: ["confirmNewPassword"],
  });
