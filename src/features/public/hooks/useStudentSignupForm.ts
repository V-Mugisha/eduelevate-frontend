import { useState } from "react";
import type { StudentSignupFormValues, GradeLevel } from "../types/types";
import { studentSignupSchema } from "../schemas/studentSignupSchema";

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
  }

  function handleSubmit(): boolean {
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
    return true;
  }

  return {
    formValues,
    fieldErrors,
    handleChange,
    handleSubmit,
  };
}
