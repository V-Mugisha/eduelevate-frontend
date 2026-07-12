import { useState } from "react";
import type { ContactFormValues } from "../types/types";
import { contactSchema } from "../schemas/contactSchema";

const initialFormValues: ContactFormValues = {
  name: "",
  email: "",
  message: "",
};

export default function useContactForm() {
  const [formValues, setFormValues] = useState<ContactFormValues>(initialFormValues);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof ContactFormValues, string>>>(
    {},
  );

  function handleChange(field: keyof ContactFormValues, value: string) {
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
    const result = contactSchema.safeParse(formValues);
    if (!result.success) {
      const errors: Partial<Record<keyof ContactFormValues, string>> = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof ContactFormValues;
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
