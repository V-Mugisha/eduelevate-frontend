import { useState } from "react";
import type { EducatorSignupFormValues } from "../types/types";
import { educatorSignupSchema } from "../schemas/educatorSignupSchema";

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
    const errorKey = `expertiseAreas.${index}` as const;
    if (fieldErrors[errorKey]) {
      setFieldErrors((previousErrors) => {
        const updatedErrors = { ...previousErrors };
        delete updatedErrors[errorKey];
        return updatedErrors;
      });
    }
  }

  function handleSubmit(): boolean {
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
    return true;
  }

  return {
    formValues,
    fieldErrors,
    handleChange,
    handleAddExpertise,
    handleRemoveExpertise,
    handleExpertiseChange,
    handleSubmit,
  };
}
