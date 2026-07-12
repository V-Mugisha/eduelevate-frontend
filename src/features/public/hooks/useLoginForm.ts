import { useState } from "react";
import type { LoginFormValues } from "../types/types";
import { loginSchema } from "../schemas/loginSchema";
import { login } from "@/features/auth/services/authService";
import useAuth from "@/features/auth/hooks/useAuth";
import type { User } from "@/features/auth/types/authTypes";

const initialFormValues: LoginFormValues = {
  email: "",
  password: "",
};

export default function useLoginForm() {
  const [formValues, setFormValues] = useState<LoginFormValues>(initialFormValues);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof LoginFormValues, string>>>(
    {},
  );
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const { login: authenticate } = useAuth();

  function handleChange(field: keyof LoginFormValues, value: string) {
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

    const result = loginSchema.safeParse(formValues);
    if (!result.success) {
      const errors: Partial<Record<keyof LoginFormValues, string>> = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof LoginFormValues;
        if (!errors[field]) {
          errors[field] = issue.message;
        }
      }
      setFieldErrors(errors);
      return false;
    }

    setIsLoading(true);
    try {
      const response = await login(result.data);
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
      const message = error instanceof Error ? error.message : "Login failed. Please try again.";
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
