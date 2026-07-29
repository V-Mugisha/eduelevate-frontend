import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import useUsers from "@/features/users/hooks/useUsers";
import UserFilters from "./components/UserFilters";
import UsersTable from "./components/UsersTable";

export default function UserManagementPage() {
  const {
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
  } = useUsers();

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-foreground text-2xl font-bold sm:text-3xl">User Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage all users, roles, and account status
          </p>
        </div>
        <Link to="/admin/users/create">
          <Button>
            <Plus className="mr-1.5 size-4" />
            Create User
          </Button>
        </Link>
      </div>

      <div className="mb-6">
        <UserFilters
          search={search}
          roleFilter={roleFilter}
          statusFilter={statusFilter}
          onSearchChange={handleSearch}
          onRoleChange={handleRoleFilter}
          onStatusChange={handleStatusFilter}
        />
      </div>

      <UsersTable
        users={users}
        isLoading={isLoading}
        totalPages={totalPages}
        page={page}
        limit={limit}
        total={total}
        onPageChange={setPage}
      />
    </div>
  );
}
