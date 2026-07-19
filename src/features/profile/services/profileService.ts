import apiClient from "@/lib/apiClient";
import type { ProfileResponse } from "../types/profileTypes";

export async function changePassword(data: {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}) {
  const response = await apiClient.put("/auth/change-password", data);
  return response.data;
}

export async function getProfile(): Promise<ProfileResponse> {
  const response = await apiClient.get<ProfileResponse>("/profile");
  return response.data;
}

export async function updateProfile(data: { firstName?: string; lastName?: string }) {
  const response = await apiClient.put("/profile", data);
  return response.data;
}

export async function updateStudentProfile(data: { schoolName?: string; grade?: string }) {
  const response = await apiClient.put("/profile/student", data);
  return response.data;
}

export async function updateEducatorProfile(data: {
  isIndependent?: boolean;
  organizationName?: string;
  expertiseAreas?: string[];
  yearsOfExperience?: number;
  bio?: string;
}) {
  const response = await apiClient.put("/profile/educator", data);
  return response.data;
}
