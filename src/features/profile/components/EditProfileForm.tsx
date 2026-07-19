import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2 } from "lucide-react";
import SearchableSelectDropdown from "@/components/shared/SearchableSelectDropdown";
import type { UserProfile } from "../types/profileTypes";
import { updateProfileSchema } from "../schemas/profileSchemas";
import useProfile from "../hooks/useProfile";

interface EditProfileFormProps {
  profile: UserProfile;
}

const gradeOptions = [
  { value: "S4", label: "Senior 4 (S4)" },
  { value: "S5", label: "Senior 5 (S5)" },
  { value: "S6", label: "Senior 6 (S6)" },
];

export default function EditProfileForm({ profile }: EditProfileFormProps) {
  const navigate = useNavigate();
  const { handleUpdateBasicInfo, handleUpdateStudentProfile, handleUpdateEducatorProfile, error } =
    useProfile();

  const [firstName, setFirstName] = useState(profile.firstName);
  const [lastName, setLastName] = useState(profile.lastName);

  const [schoolName, setSchoolName] = useState(profile.studentProfile?.schoolName ?? "");
  const [grade, setGrade] = useState(profile.studentProfile?.grade ?? "");

  const [bio, setBio] = useState(profile.educatorProfile?.bio ?? "");
  const [expertiseAreas, setExpertiseAreas] = useState<string[]>(
    profile.educatorProfile?.expertiseAreas ?? [""],
  );
  const [yearsOfExperience, setYearsOfExperience] = useState(
    profile.educatorProfile?.yearsOfExperience?.toString() ?? "",
  );
  const [isIndependent, setIsIndependent] = useState(
    profile.educatorProfile?.isIndependent ?? false,
  );
  const [organizationName, setOrganizationName] = useState(
    profile.educatorProfile?.organizationName ?? "",
  );
  const [isSaving, setIsSaving] = useState(false);

  function handleAddExpertise() {
    setExpertiseAreas((previous) => [...previous, ""]);
  }

  function handleRemoveExpertise(index: number) {
    setExpertiseAreas((previous) => {
      const updated = previous.filter((_, i) => i !== index);
      return updated.length > 0 ? updated : [""];
    });
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setIsSaving(true);

    const basicResult = updateProfileSchema.safeParse({ firstName, lastName });
    if (!basicResult.success) {
      setIsSaving(false);
      return;
    }

    let success = await handleUpdateBasicInfo(basicResult.data);

    if (profile.role === "student" && schoolName && grade) {
      success = await handleUpdateStudentProfile({ schoolName, grade });
    }

    if (profile.role === "educator") {
      success = await handleUpdateEducatorProfile({
        bio,
        expertiseAreas: expertiseAreas.filter((e) => e.trim() !== ""),
        yearsOfExperience: yearsOfExperience ? Number(yearsOfExperience) : undefined,
        isIndependent,
        organizationName: isIndependent ? undefined : organizationName,
      });
    }

    setIsSaving(false);
    if (success) {
      navigate("/profile");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="border-destructive/50 bg-destructive/10 text-destructive rounded-lg border px-4 py-3 text-sm">
          {error}
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="profile-first-name">First Name</Label>
          <Input
            id="profile-first-name"
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="profile-last-name">Last Name</Label>
          <Input
            id="profile-last-name"
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
          />
        </div>
      </div>

      {profile.role === "student" && (
        <>
          <div className="space-y-2">
            <Label htmlFor="profile-school">School Name</Label>
            <Input
              id="profile-school"
              value={schoolName}
              onChange={(event) => setSchoolName(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="profile-grade">Grade Level</Label>
            <SearchableSelectDropdown
              options={gradeOptions}
              value={grade}
              onChange={setGrade}
              placeholder="Select your grade"
              searchPlaceholder="Search grade..."
              emptyMessage="No grade found."
            />
          </div>
        </>
      )}

      {profile.role === "educator" && (
        <>
          <div className="space-y-2">
            <Label htmlFor="profile-bio">Bio</Label>
            <Textarea
              id="profile-bio"
              value={bio}
              onChange={(event) => setBio(event.target.value)}
              className="min-h-[120px]"
            />
          </div>
          <div className="space-y-3">
            <Label>Areas of Expertise</Label>
            {expertiseAreas.map((area, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={area}
                  onChange={(event) => {
                    const updated = [...expertiseAreas];
                    updated[index] = event.target.value;
                    setExpertiseAreas(updated);
                  }}
                  placeholder={`Expertise ${index + 1}`}
                  className="flex-1"
                />
                {expertiseAreas.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveExpertise(index)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={handleAddExpertise}>
              <Plus className="mr-1.5 size-4" />
              Add Expertise
            </Button>
          </div>
          <div className="space-y-2">
            <Label htmlFor="profile-experience">Years of Experience</Label>
            <Input
              id="profile-experience"
              type="number"
              value={yearsOfExperience}
              onChange={(event) => setYearsOfExperience(event.target.value)}
            />
          </div>
          <div className="flex items-start gap-2">
            <Checkbox
              id="profile-independent"
              checked={isIndependent}
              onCheckedChange={(checked) => setIsIndependent(Boolean(checked))}
              className="mt-1"
            />
            <Label htmlFor="profile-independent" className="text-sm font-normal">
              I am an independent educator
            </Label>
          </div>
          {!isIndependent && (
            <div className="space-y-2">
              <Label htmlFor="profile-organization">Organization / School</Label>
              <Input
                id="profile-organization"
                value={organizationName}
                onChange={(event) => setOrganizationName(event.target.value)}
              />
            </div>
          )}
        </>
      )}

      <div className="flex gap-3">
        <Button type="submit" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
        <Button type="button" variant="outline" onClick={() => navigate("/profile")}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
