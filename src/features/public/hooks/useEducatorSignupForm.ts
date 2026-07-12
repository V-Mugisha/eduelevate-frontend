import { useState } from "react";
import type { EducatorSignupFormValues } from "../types/types";
import { educatorSignupSchema } from "../schemas/educatorSignupSchema";
import { registerEducator } from "@/features/auth/services/authService";
import useAuth from "@/features/auth/hooks/useAuth";
import type { User } from "@/features/auth/types/authTypes";

const initialFormValues: EducatorSignupFormValues = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
  isIndependent: false,
  organizationName: "",
  expertiseAreas: [""],
  yearsOfExperience: "",
  bio: "",
};

type EducatorFieldKey = keyof EducatorSignupFormValues;

export default function useEducatorSignupForm() {
  const [formValues, setFormValues] = useState<EducatorSignupFormValues>(initialFormValues);
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<EducatorFieldKey | `expertiseAreas.${number}`, string>>
  >({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const { login: authenticate } = useAuth();

  function handleChange(field: EducatorFieldKey, value: string | boolean | string[]) {
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

  function handleAddExpertise() {
    setFormValues((previousValues) => ({
      ...previousValues,
      expertiseAreas: [...previousValues.expertiseAreas, ""],
    }));
  }

  function handleRemoveExpertise(index: number) {
    setFormValues((previousValues) => {
      const updatedAreas = previousValues.expertiseAreas.filter((_, i) => i !== index);
      return {
        ...previousValues,
        expertiseAreas: updatedAreas.length > 0 ? updatedAreas : [""],
      };
    });
  }

  function handleExpertiseChange(index: number, value: string) {
    setFormValues((previousValues) => {
      const updatedAreas = [...previousValues.expertiseAreas];
      updatedAreas[index] = value;
      return { ...previousValues, expertiseAreas: updatedAreas };
    });
  }

  async function handleSubmit(): Promise<boolean> {
    setApiError(null);

    const result = educatorSignupSchema.safeParse(formValues);
    if (!result.success) {
      const errors: Partial<Record<EducatorFieldKey | `expertiseAreas.${number}`, string>> = {};
      for (const issue of result.error.issues) {
        const field = issue.path.join(".") as EducatorFieldKey | `expertiseAreas.${number}`;
        if (!errors[field as keyof typeof errors]) {
          (errors as Record<string, string>)[field] = issue.message;
        }
      }
      setFieldErrors(errors);
      return false;
    }

    setIsLoading(true);
    try {
      const response = await registerEducator({
        firstName: result.data.firstName,
        lastName: result.data.lastName,
        email: result.data.email,
        password: result.data.password,
        isIndependent: result.data.isIndependent,
        organizationName: result.data.organizationName ?? undefined,
        expertiseAreas: result.data.expertiseAreas,
        yearsOfExperience: result.data.yearsOfExperience
          ? Number(result.data.yearsOfExperience)
          : undefined,
        bio: result.data.bio,
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
    handleAddExpertise,
    handleRemoveExpertise,
    handleExpertiseChange,
    handleSubmit,
  };
}
