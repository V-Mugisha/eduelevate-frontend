import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import LoadingBubbles from "@/components/shared/LoadingBubbles";
import SearchableSelectDropdown from "@/components/shared/SearchableSelectDropdown";
import { toast } from "sonner";
import * as usersService from "./services/usersService";
import useUserForm from "./hooks/useUserForm";
import type { UserDetail, UpdateUserPayload } from "./types/usersTypes";

const roleIdToName: Record<string, string> = {};

const roleOptions = [
  { value: "student", label: "Student" },
  { value: "educator", label: "Educator" },
  { value: "admin", label: "Admin" },
];

const gradeOptions = [
  { value: "S4", label: "S4" },
  { value: "S5", label: "S5" },
  { value: "S6", label: "S6" },
];

function resolveRoleMap(user: UserDetail) {
  roleIdToName[user.role.id] = user.role.name;
}

function getRoleIdByName(name: string): string {
  for (const [id, n] of Object.entries(roleIdToName)) {
    if (n === name) return id;
  }
  return "";
}

export default function EditUserPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isSaving, updateUser } = useUserForm();

  const [user, setUser] = useState<UserDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [schoolName, setSchoolName] = useState("");
  const [grade, setGrade] = useState("");
  const [isIndependent, setIsIndependent] = useState(false);
  const [organizationName, setOrganizationName] = useState("");
  const [expertiseAreas, setExpertiseAreas] = useState<string[]>([""]);
  const [yearsOfExperience, setYearsOfExperience] = useState("");
  const [bio, setBio] = useState("");

  useEffect(() => {
    if (!id) return;
    usersService
      .getUser(id)
      .then((result: { data: UserDetail }) => {
        const u = result.data;
        setUser(u);
        resolveRoleMap(u);
        setEmail(u.email);
        setFirstName(u.firstName);
        setLastName(u.lastName);
        setRole(u.role.name);
        setIsActive(u.isActive);
        if (u.studentProfile) {
          setSchoolName(u.studentProfile.schoolName);
          setGrade(u.studentProfile.grade);
        }
        if (u.educatorProfile) {
          setIsIndependent(u.educatorProfile.isIndependent);
          setOrganizationName(u.educatorProfile.organizationName ?? "");
          setExpertiseAreas(
            u.educatorProfile.expertiseAreas.length > 0 ? u.educatorProfile.expertiseAreas : [""],
          );
          setYearsOfExperience(u.educatorProfile.yearsOfExperience?.toString() ?? "");
          setBio(u.educatorProfile.bio ?? "");
        }
      })
      .catch(() => toast.error("Failed to load user"))
      .finally(() => setIsLoading(false));
  }, [id]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!id || !user) return;

    const payload: UpdateUserPayload = {
      email,
      firstName,
      lastName,
    };

    const newRoleId = getRoleIdByName(role);
    if (newRoleId && newRoleId !== user.role.id) {
      payload.roleId = newRoleId;
    }

    if (isActive !== user.isActive) {
      payload.isActive = isActive;
    }

    if (user.studentProfile) {
      payload.schoolName = schoolName;
      payload.grade = grade;
    }

    if (user.educatorProfile) {
      payload.isIndependent = isIndependent;
      payload.organizationName = organizationName || null;
      payload.expertiseAreas = expertiseAreas.filter((a) => a.trim());
      payload.yearsOfExperience = yearsOfExperience ? parseInt(yearsOfExperience) : null;
      payload.bio = bio || undefined;
    }

    updateUser(id, payload, () => {
      setUser(null);
      navigate("/admin/users");
    });
  }

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

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        to={`/admin/users/${id}`}
        className="text-muted-foreground hover:text-foreground mb-6 inline-flex items-center gap-1 text-sm"
      >
        <ArrowLeft className="size-4" />
        Back to Details
      </Link>

      <div className="mb-8">
        <h1 className="text-foreground text-2xl font-bold sm:text-3xl">Edit User</h1>
        <p className="text-muted-foreground mt-1">
          {user.firstName} {user.lastName}
        </p>
      </div>

      <div className="bg-card rounded-xl border p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>First Name</Label>
              <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>Last Name</Label>
              <Input value={lastName} onChange={(e) => setLastName(e.target.value)} required />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Email</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Role</Label>
              <SearchableSelectDropdown
                options={roleOptions}
                value={role}
                onChange={setRole}
                placeholder="Select role..."
                searchPlaceholder="Filter..."
                emptyMessage="No roles."
                triggerClassName="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <div className="pt-3">
                <label className="inline-flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="size-4"
                  />
                  <span className="text-sm">{isActive ? "Active" : "Disabled"}</span>
                </label>
              </div>
            </div>
          </div>

          {user.studentProfile && (
            <div className="space-y-4 border-t pt-4">
              <h3 className="text-foreground text-sm font-medium">Student Profile</h3>
              <div className="space-y-2">
                <Label>School Name</Label>
                <Input
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Grade</Label>
                <SearchableSelectDropdown
                  options={gradeOptions}
                  value={grade}
                  onChange={setGrade}
                  placeholder="Select grade..."
                  searchPlaceholder="Filter..."
                  emptyMessage="No grades."
                  triggerClassName="w-full"
                />
              </div>
            </div>
          )}

          {user.educatorProfile && (
            <div className="space-y-4 border-t pt-4">
              <h3 className="text-foreground text-sm font-medium">Educator Profile</h3>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="edit-independent"
                  checked={isIndependent}
                  onChange={(e) => setIsIndependent(e.target.checked)}
                  className="size-4"
                />
                <Label htmlFor="edit-independent" className="cursor-pointer">
                  Independent Educator
                </Label>
              </div>
              {!isIndependent && (
                <div className="space-y-2">
                  <Label>Organization Name</Label>
                  <Input
                    value={organizationName}
                    onChange={(e) => setOrganizationName(e.target.value)}
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label>Expertise Areas</Label>
                {expertiseAreas.map((area, i) => (
                  <div key={i} className="flex gap-2">
                    <Input
                      value={area}
                      onChange={(e) => {
                        const next = [...expertiseAreas];
                        next[i] = e.target.value;
                        setExpertiseAreas(next);
                      }}
                      placeholder={`Area ${i + 1}`}
                    />
                    {expertiseAreas.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => setExpertiseAreas(expertiseAreas.filter((_, j) => j !== i))}
                      >
                        ×
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setExpertiseAreas([...expertiseAreas, ""])}
                >
                  + Add Area
                </Button>
              </div>
              <div className="space-y-2">
                <Label>Years of Experience</Label>
                <Input
                  type="number"
                  min="0"
                  value={yearsOfExperience}
                  onChange={(e) => setYearsOfExperience(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Bio</Label>
                <Textarea value={bio} onChange={(e) => setBio(e.target.value)} />
              </div>
            </div>
          )}

          <div className="flex gap-3 border-t pt-4">
            <Button type="submit" disabled={isSaving}>
              {isSaving ? <LoadingBubbles size="sm" /> : "Save Changes"}
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate("/admin/users")}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
