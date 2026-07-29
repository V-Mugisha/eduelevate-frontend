import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import SearchableSelectDropdown from "@/components/shared/SearchableSelectDropdown";
import LoadingBubbles from "@/components/shared/LoadingBubbles";
import type { CreateUserPayload } from "../types/usersTypes";

interface UserFormProps {
  isSaving: boolean;
  onSubmit: (payload: CreateUserPayload) => void;
  onCancel: () => void;
}

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

export default function UserForm({ isSaving, onSubmit, onCancel }: UserFormProps) {
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [schoolName, setSchoolName] = useState("");
  const [grade, setGrade] = useState("");

  const [isIndependent, setIsIndependent] = useState(false);
  const [organizationName, setOrganizationName] = useState("");
  const [expertiseAreas, setExpertiseAreas] = useState([""]);
  const [yearsOfExperience, setYearsOfExperience] = useState("");
  const [bio, setBio] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!role) return;

    const payload: CreateUserPayload = {
      role: role as "student" | "educator" | "admin",
      email,
      password,
      firstName,
      lastName,
    };

    if (role === "student") {
      payload.schoolName = schoolName;
      payload.grade = grade;
    }

    if (role === "educator") {
      payload.isIndependent = isIndependent;
      payload.organizationName = organizationName || undefined;
      payload.expertiseAreas = expertiseAreas.filter((a) => a.trim());
      payload.yearsOfExperience = yearsOfExperience ? parseInt(yearsOfExperience) : undefined;
      payload.bio = bio || undefined;
    }

    onSubmit(payload);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label>Role</Label>
        <SearchableSelectDropdown
          options={roleOptions}
          value={role}
          onChange={setRole}
          placeholder="Select a role..."
          searchPlaceholder="Filter..."
          emptyMessage="No roles."
          triggerClassName="w-full"
        />
      </div>

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

      <div className="space-y-2">
        <Label>Password</Label>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Min 8 chars, uppercase, lowercase, digit"
          required
        />
      </div>

      {role === "student" && (
        <div className="space-y-4 border-t pt-4">
          <div className="space-y-2">
            <Label>School Name</Label>
            <Input value={schoolName} onChange={(e) => setSchoolName(e.target.value)} required />
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

      {role === "educator" && (
        <div className="space-y-4 border-t pt-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isIndependent"
              checked={isIndependent}
              onChange={(e) => setIsIndependent(e.target.checked)}
              className="size-4"
            />
            <Label htmlFor="isIndependent" className="cursor-pointer">
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
            <Textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about this educator..."
            />
          </div>
        </div>
      )}

      <div className="flex gap-3 border-t pt-4">
        <Button type="submit" disabled={isSaving || !role}>
          {isSaving ? <LoadingBubbles size="sm" /> : "Create User"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
