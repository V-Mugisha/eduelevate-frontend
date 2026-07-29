import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import * as usersService from "../services/usersService";
import type { UserDetail } from "../types/usersTypes";

export default function useUserDetail(userId: string | undefined) {
  const [user, setUser] = useState<UserDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    if (!userId) return;
    setIsLoading(true);
    try {
      const result = await usersService.getUser(userId);
      setUser(result.data);
    } catch {
      toast.error("Failed to load user");
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  async function handleToggleStatus() {
    if (!userId || !user) return;
    try {
      const result = await usersService.toggleUserStatus(userId);
      toast.success(result.message);
      setUser((prev) => (prev ? { ...prev, isActive: result.data.isActive } : prev));
    } catch (e: unknown) {
      toast.error(
        (e as { response?: { data?: { message?: string } } })?.response?.data?.message ??
          "Failed to update status",
      );
    }
  }

  async function handleDelete(navigate: (path: string) => void) {
    if (!userId || !user) return;
    try {
      await usersService.deleteUser(userId);
      toast.success("User deleted successfully");
      navigate("/admin/users");
    } catch (e: unknown) {
      toast.error(
        (e as { response?: { data?: { message?: string } } })?.response?.data?.message ??
          "Failed to delete user",
      );
    }
  }

  return { user, isLoading, refresh: fetchUser, handleToggleStatus, handleDelete };
}
