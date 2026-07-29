import { useState } from "react";
import { toast } from "sonner";
import * as usersService from "../services/usersService";
import type { CreateUserPayload, UpdateUserPayload } from "../types/usersTypes";

export default function useUserForm() {
  const [isSaving, setIsSaving] = useState(false);

  async function createUser(payload: CreateUserPayload, navigate: (path: string) => void) {
    setIsSaving(true);
    try {
      await usersService.createUser(payload);
      toast.success("User created successfully");
      navigate("/admin/users");
    } catch (e: unknown) {
      toast.error(
        (e as { response?: { data?: { message?: string } } })?.response?.data?.message ??
          "Failed to create user",
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function updateUser(
    id: string,
    payload: UpdateUserPayload,
    onSuccess: () => void,
  ) {
    setIsSaving(true);
    try {
      await usersService.updateUser(id, payload);
      toast.success("User updated successfully");
      onSuccess();
    } catch (e: unknown) {
      toast.error(
        (e as { response?: { data?: { message?: string } } })?.response?.data?.message ??
          "Failed to update user",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return { isSaving, createUser, updateUser };
}
