export interface FAQItem {
  question: string;
  answer: string;
}

export interface Feature {
  title: string;
  description: string;
  icon: string;
}

export interface HowItWorksStep {
  stepNumber: number;
  title: string;
  description: string;
}

export type GradeLevel = "S4" | "S5" | "S6";

export interface StudentSignupFormValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  schoolName: string;
  grade: GradeLevel | "";
}

export interface EducatorSignupFormValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  isIndependent: boolean;
  organizationName: string;
  expertiseAreas: string[];
  yearsOfExperience: string;
  bio?: string;
}

export interface LoginFormValues {
  email: string;
  password: string;
}

export interface ContactFormValues {
  name: string;
  email: string;
  message: string;
}
