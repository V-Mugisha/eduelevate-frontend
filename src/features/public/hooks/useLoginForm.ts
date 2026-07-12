import { useState } from "react";
import type { LoginFormValues } from "../types/types";
import { loginSchema } from "../schemas/loginSchema";

const initialFormValues: LoginFormValues = {
  email: "",
  password: "",
};

export default function useLoginForm() {
  const [formValues, setFormValues] = useState<LoginFormValues>(initialFormValues);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof LoginFormValues, string>>>(
    {},
  );

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
  }

  function handleSubmit(): boolean {
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
    return true;
  }

  return {
    formValues,
    fieldErrors,
    handleChange,
    handleSubmit,
  };
}
