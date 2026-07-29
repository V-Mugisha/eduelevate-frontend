import { Link } from "react-router-dom";
import { ChevronRight, ShieldCheck } from "lucide-react";
import LoadingBubbles from "@/components/shared/LoadingBubbles";
import type { UserSummary } from "../types/usersTypes";

interface UsersTableProps {
  users: UserSummary[];
  isLoading: boolean;
  totalPages: number;
  page: number;
  limit: number;
  total: number;
  onPageChange: (page: number) => void;
}

function roleBadgeStyles(role: string) {
  if (role === "admin") return "bg-purple-500/10 text-purple-600";
  if (role === "educator") return "bg-blue-500/10 text-blue-600";
  return "bg-green-500/10 text-green-600";
}

export default function UsersTable({
  users,
  isLoading,
  totalPages,
  page,
  limit,
  total,
  onPageChange,
}: UsersTableProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <LoadingBubbles size="md" />
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <ShieldCheck className="text-muted-foreground mb-4 size-12" />
        <h3 className="text-foreground text-lg font-semibold">No users found</h3>
        <p className="text-muted-foreground mt-1 text-sm">
          Try adjusting your search or filters.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-card overflow-hidden rounded-xl border">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/30 border-b text-left">
              <th className="px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Joined
              </th>
              <th className="px-5 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-muted/20 transition-colors">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <div className="bg-primary/10 text-primary flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-bold">
                      {u.firstName[0]}
                      {u.lastName[0]}
                    </div>
                    <span className="text-foreground font-medium">
                      {u.firstName} {u.lastName}
                    </span>
                  </div>
                </td>
                <td className="text-muted-foreground px-5 py-4 text-xs">{u.email}</td>
                <td className="px-5 py-4">
                  <span
                    className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium capitalize ${roleBadgeStyles(u.role.name)}`}
                  >
                    {u.role.name}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <span
                    className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                      u.isActive
                        ? "bg-green-500/10 text-green-600"
                        : "bg-red-500/10 text-red-600"
                    }`}
                  >
                    {u.isActive ? "Active" : "Disabled"}
                  </span>
                </td>
                <td className="text-muted-foreground px-5 py-4 text-xs">
                  {new Date(u.createdAt).toLocaleDateString()}
                </td>
                <td className="px-5 py-4 text-right">
                  <Link
                    to={`/admin/users/${u.id}`}
                    className="text-muted-foreground hover:text-primary inline-flex items-center gap-1 text-xs"
                  >
                    View
                    <ChevronRight className="size-3" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground text-xs">
            Showing {(page - 1) * limit + 1}–{Math.min(page * limit, total)} of {total} users
          </p>
          <div className="flex gap-1">
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
              className="hover:bg-muted disabled:text-muted-foreground/40 rounded-lg px-3 py-1.5 text-sm transition-colors disabled:cursor-not-allowed"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => onPageChange(i + 1)}
                className={`rounded-lg px-3 py-1.5 text-sm transition-colors ${
                  page === i + 1
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted text-muted-foreground"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
              className="hover:bg-muted disabled:text-muted-foreground/40 rounded-lg px-3 py-1.5 text-sm transition-colors disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
