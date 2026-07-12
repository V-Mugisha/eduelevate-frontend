import apiClient from "@/lib/apiClient";
import type { AuthResponse } from "../types/authTypes";

export interface StudentRegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  schoolName: string;
  grade: string;
}

export interface EducatorRegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  isIndependent: boolean;
  organizationName?: string;
  expertiseAreas: string[];
  yearsOfExperience?: number;
  bio: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export async function registerStudent(payload: StudentRegisterPayload): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>("/auth/register/student", payload);
  return response.data;
}

export async function registerEducator(payload: EducatorRegisterPayload): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>("/auth/register/educator", payload);
  return response.data;
}

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>("/auth/login", payload);
  return response.data;
}
