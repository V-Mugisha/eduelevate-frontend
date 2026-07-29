import apiClient from "@/lib/apiClient";
import type {
  UserListResponse,
  UserDetail,
  CreateUserPayload,
  UpdateUserPayload,
} from "../types/usersTypes";

export async function listUsers(params: {
  q?: string;
  role?: string;
  isActive?: string;
  page?: number;
  limit?: number;
}): Promise<UserListResponse> {
  const res = await apiClient.get<UserListResponse>("/users", { params });
  return res.data;
}

export async function getUser(id: string): Promise<{ data: UserDetail }> {
  const res = await apiClient.get<{ data: UserDetail }>(`/users/${id}`);
  return res.data;
}

export async function createUser(payload: CreateUserPayload): Promise<{ message: string; data: UserDetail }> {
  const res = await apiClient.post<{ message: string; data: UserDetail }>("/users", payload);
  return res.data;
}

export async function updateUser(
  id: string,
  payload: UpdateUserPayload,
): Promise<{ message: string; data: UserDetail }> {
  const res = await apiClient.put<{ message: string; data: UserDetail }>(`/users/${id}`, payload);
  return res.data;
}

export async function toggleUserStatus(
  id: string,
): Promise<{ message: string; data: { id: string; isActive: boolean } }> {
  const res = await apiClient.put<{ message: string; data: { id: string; isActive: boolean } }>(
    `/users/${id}/toggle-status`,
  );
  return res.data;
}

export async function deleteUser(id: string): Promise<{ message: string }> {
  const res = await apiClient.delete<{ message: string }>(`/users/${id}`);
  return res.data;
}
