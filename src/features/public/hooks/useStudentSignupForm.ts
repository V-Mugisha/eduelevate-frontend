import { useState } from "react";
import type { StudentSignupFormValues, GradeLevel } from "../types/types";
import { studentSignupSchema } from "../schemas/studentSignupSchema";
import { registerStudent } from "@/features/auth/services/authService";
import useAuth from "@/features/auth/hooks/useAuth";
import type { User } from "@/features/auth/types/authTypes";

const initialFormValues: StudentSignupFormValues = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
  schoolName: "",
  grade: "" as GradeLevel | "",
};

export default function useStudentSignupForm() {
  const [formValues, setFormValues] = useState<StudentSignupFormValues>(initialFormValues);
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof StudentSignupFormValues, string>>
  >({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const { login: authenticate } = useAuth();

  function handleChange(field: keyof StudentSignupFormValues, value: string) {
    setFormValues((previousValues) => ({
      ...previousValues,
      [field]: value,
    }));
    if (fieldErrors[field]) {
      setFieldErrors((previousErrors) => {
        const updatedErrors = { ...previousErrors };
        delete updatedErrors[field];
        return updatedErrors;
      });
    }
    if (apiError) {
      setApiError(null);
    }
  }

  async function handleSubmit(): Promise<boolean> {
    setApiError(null);

    const result = studentSignupSchema.safeParse(formValues);
    if (!result.success) {
      const errors: Partial<Record<keyof StudentSignupFormValues, string>> = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof StudentSignupFormValues;
        if (!errors[field]) {
          errors[field] = issue.message;
        }
      }
      setFieldErrors(errors);
      return false;
    }

    setIsLoading(true);
    try {
      const response = await registerStudent({
        firstName: result.data.firstName,
        lastName: result.data.lastName,
        email: result.data.email,
        password: result.data.password,
        schoolName: result.data.schoolName,
        grade: result.data.grade,
      });
      const user: User = {
        id: response.data.user.id,
        email: response.data.user.email,
        firstName: response.data.user.firstName,
        lastName: response.data.user.lastName,
        role: response.data.user.role,
      };
      authenticate(user, response.data.token);
      return true;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Registration failed. Please try again.";
      setApiError(message);
      return false;
    } finally {
      setIsLoading(false);
    }
  }

  return {
    formValues,
    fieldErrors,
    apiError,
    isLoading,
    handleChange,
    handleSubmit,
  };
}
