import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(1, "Name is required").max(200, "Name must be at most 200 characters"),
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(5000, "Message must be at most 5000 characters"),
});

export type ContactPayload = z.infer<typeof contactSchema>;
