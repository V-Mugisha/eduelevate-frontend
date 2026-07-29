import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import useDebounce from "@/hooks/useDebounce";
import * as usersService from "../services/usersService";
import type { UserSummary } from "../types/usersTypes";

export default function useUsers() {
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(20);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const params: Record<string, string | number | undefined> = {
        page,
        limit,
      };
      if (debouncedSearch) params.q = debouncedSearch;
      if (roleFilter) params.role = roleFilter;
      if (statusFilter) params.isActive = statusFilter;

      const result = await usersService.listUsers(params);
      setUsers(result.data);
      setTotal(result.total);
    } catch {
      toast.error("Failed to load users");
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch, roleFilter, statusFilter, page, limit]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  function handleSearch(value: string) {
    setSearch(value);
    setPage(1);
  }

  function handleRoleFilter(value: string) {
    setRoleFilter(value);
    setPage(1);
  }

  function handleStatusFilter(value: string) {
    setStatusFilter(value);
    setPage(1);
  }

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return {
    users,
    total,
    isLoading,
    search,
    roleFilter,
    statusFilter,
    page,
    totalPages,
    limit,
    handleSearch,
    handleRoleFilter,
    handleStatusFilter,
    setPage,
    refresh: fetchUsers,
  };
}
