import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import useUserForm from "@/features/users/hooks/useUserForm";
import UserForm from "@/features/users/components/UserForm";
import type { CreateUserPayload } from "@/features/users/types/usersTypes";

export default function CreateUserPage() {
  const navigate = useNavigate();
  const { isSaving, createUser } = useUserForm();

  function handleSubmit(payload: CreateUserPayload) {
    createUser(payload, navigate);
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        to="/admin/users"
        className="text-muted-foreground hover:text-foreground mb-6 inline-flex items-center gap-1 text-sm"
      >
        <ArrowLeft className="size-4" />
        Back to Users
      </Link>

      <div className="mb-8">
        <h1 className="text-foreground text-2xl font-bold sm:text-3xl">Create User</h1>
        <p className="text-muted-foreground mt-1">Add a new student, educator, or admin</p>
      </div>

      <div className="bg-card rounded-xl border p-6">
        <UserForm
          isSaving={isSaving}
          onSubmit={handleSubmit}
          onCancel={() => navigate("/admin/users")}
        />
      </div>
    </div>
  );
}
