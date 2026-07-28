import { z } from "zod";

export const educatorSignupSchema = z
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
    isIndependent: z.boolean(),
    organizationName: z
      .string()
      .max(200, "Organization name must be at most 200 characters")
      .optional(),
    expertiseAreas: z
      .array(z.string().min(1, "Expertise cannot be empty").max(200))
      .min(1, "At least one area of expertise is required"),
    yearsOfExperience: z.string().optional(),
    bio: z.string().max(2000, "Bio must be at most 2000 characters").optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine(
    (data) => data.isIndependent || (data.organizationName && data.organizationName.length > 0),
    {
      message: "Organization name is required",
      path: ["organizationName"],
    },
  );

export type EducatorSignupPayload = z.infer<typeof educatorSignupSchema>;
