import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Pencil, ShieldOff, ShieldCheck, Trash2 } from "lucide-react";
import LoadingBubbles from "@/components/shared/LoadingBubbles";
import ActionsDropdown from "@/components/shared/ActionsDropdown";
import type { DropdownAction } from "@/components/shared/ActionsDropdown";
import useUserDetail from "../hooks/useUserDetail";
import useAuth from "@/features/auth/hooks/useAuth";

interface UserProfileCardProps {
  userId: string | undefined;
}

function roleBadgeStyles(role: string) {
  if (role === "admin") return "bg-purple-500/10 text-purple-600";
  if (role === "educator") return "bg-blue-500/10 text-blue-600";
  return "bg-green-500/10 text-green-600";
}

export default function UserProfileCard({ userId }: UserProfileCardProps) {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const { user, isLoading, handleToggleStatus, handleDelete } = useUserDetail(userId);

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <LoadingBubbles size="md" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-muted-foreground">User not found.</p>
      </div>
    );
  }

  const isSelf = currentUser?.id === user.id;

  const actions: DropdownAction[] = [
    {
      label: "Edit",
      icon: <Pencil className="size-4" />,
      onClick: () => navigate(`/admin/users/${user.id}/edit`),
    },
  ];

  if (!isSelf) {
    actions.push({
      label: user.isActive ? "Disable" : "Enable",
      icon: user.isActive ? <ShieldOff className="size-4" /> : <ShieldCheck className="size-4" />,
      onClick: handleToggleStatus,
    });
    actions.push({
      label: "Delete",
      icon: <Trash2 className="size-4" />,
      onClick: () => handleDelete(navigate),
      destructive: true,
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link
          to="/admin/users"
          className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-sm"
        >
          <ArrowLeft className="size-4" />
          Back to Users
        </Link>
        <ActionsDropdown actions={actions} />
      </div>

      <div className="bg-card rounded-xl border p-6">
        <div className="flex items-start gap-4">
          <div className="bg-primary/10 text-primary flex size-14 items-center justify-center rounded-full text-xl font-bold">
            {user.firstName[0]}
            {user.lastName[0]}
          </div>
          <div className="flex-1">
            <h2 className="text-foreground text-xl font-semibold">
              {user.firstName} {user.lastName}
            </h2>
            <p className="text-muted-foreground text-sm">{user.email}</p>
            <div className="mt-2 flex items-center gap-2">
              <span
                className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${roleBadgeStyles(user.role.name)}`}
              >
                {user.role.name}
              </span>
              <span
                className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  user.isActive ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-600"
                }`}
              >
                {user.isActive ? "Active" : "Disabled"}
              </span>
            </div>
            <p className="text-muted-foreground mt-1 text-xs">
              Joined {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {user.studentProfile && (
        <div className="bg-card rounded-xl border p-6">
          <h3 className="text-foreground text-sm font-semibold">Student Profile</h3>
          <div className="text-muted-foreground mt-3 grid gap-2 text-sm">
            <div>
              <span className="text-xs font-medium uppercase">School</span>
              <p>{user.studentProfile.schoolName}</p>
            </div>
            <div>
              <span className="text-xs font-medium uppercase">Grade</span>
              <p>{user.studentProfile.grade}</p>
            </div>
          </div>
        </div>
      )}

      {user.educatorProfile && (
        <div className="bg-card rounded-xl border p-6">
          <h3 className="text-foreground text-sm font-semibold">Educator Profile</h3>
          <div className="text-muted-foreground mt-3 grid gap-2 text-sm">
            <div>
              <span className="text-xs font-medium uppercase">Type</span>
              <p>{user.educatorProfile.isIndependent ? "Independent" : "Organization-based"}</p>
            </div>
            {user.educatorProfile.organizationName && (
              <div>
                <span className="text-xs font-medium uppercase">Organization</span>
                <p>{user.educatorProfile.organizationName}</p>
              </div>
            )}
            <div>
              <span className="text-xs font-medium uppercase">Expertise</span>
              <p>{user.educatorProfile.expertiseAreas.join(", ")}</p>
            </div>
            {user.educatorProfile.yearsOfExperience !== null && (
              <div>
                <span className="text-xs font-medium uppercase">Experience</span>
                <p>{user.educatorProfile.yearsOfExperience} years</p>
              </div>
            )}
            {user.educatorProfile.bio && (
              <div>
                <span className="text-xs font-medium uppercase">Bio</span>
                <p>{user.educatorProfile.bio}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
