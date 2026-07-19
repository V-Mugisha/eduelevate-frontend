import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2 } from "lucide-react";
import SearchableSelectDropdown from "@/components/shared/SearchableSelectDropdown";
import LoadingBubbles from "@/components/shared/LoadingBubbles";
import { updateProfileSchema } from "./schemas/profileSchemas";
import useProfile from "./hooks/useProfile";

const gradeOptions = [
  { value: "S4", label: "Senior 4 (S4)" },
  { value: "S5", label: "Senior 5 (S5)" },
  { value: "S6", label: "Senior 6 (S6)" },
];

export default function EditProfilePage() {
  const navigate = useNavigate();
  const {
    profile,
    isLoading,
    handleUpdateBasicInfo,
    handleUpdateStudentProfile,
    handleUpdateEducatorProfile,
  } = useProfile();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [grade, setGrade] = useState("");
  const [bio, setBio] = useState("");
  const [expertiseAreas, setExpertiseAreas] = useState<string[]>([""]);
  const [yearsOfExperience, setYearsOfExperience] = useState("");
  const [isIndependent, setIsIndependent] = useState(false);
  const [organizationName, setOrganizationName] = useState("");

  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (!profile) return;
    setFirstName(profile.firstName);
    setLastName(profile.lastName);
    if (profile.studentProfile) {
      setSchoolName(profile.studentProfile.schoolName);
      setGrade(profile.studentProfile.grade);
    }
    if (profile.educatorProfile) {
      setBio(profile.educatorProfile.bio);
      setExpertiseAreas(
        profile.educatorProfile.expertiseAreas.length > 0
          ? profile.educatorProfile.expertiseAreas
          : [""],
      );
      setYearsOfExperience(profile.educatorProfile.yearsOfExperience?.toString() ?? "");
      setIsIndependent(profile.educatorProfile.isIndependent);
      setOrganizationName(profile.educatorProfile.organizationName ?? "");
    }
  }, [profile]);

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
    setFormError(null);
    setIsSaving(true);

    const basicResult = updateProfileSchema.safeParse({ firstName, lastName });
    if (!basicResult.success) {
      setFormError(basicResult.error.issues.map((i) => i.message).join(", "));
      setIsSaving(false);
      return;
    }

    let success = await handleUpdateBasicInfo(basicResult.data);

    if (profile?.role === "student" && schoolName && grade) {
      success = await handleUpdateStudentProfile({ schoolName, grade });
    }

    if (profile?.role === "educator") {
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

  if (isLoading) {
    return <LoadingBubbles size="lg" />;
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center px-4 py-20">
        <p className="text-muted-foreground">Profile not found.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-4xl space-y-8 px-6 py-10 lg:px-8">
      <Button variant="ghost" onClick={() => navigate("/profile")} className="-ml-3">
        <ArrowLeft className="mr-1.5 size-4" />
        Back to Profile
      </Button>

      {formError && (
        <div className="border-destructive/50 bg-destructive/10 text-destructive rounded-lg border px-4 py-3 text-sm">
          {formError}
        </div>
      )}

      <div className="bg-card rounded-xl border p-6 shadow-sm sm:p-8">
        <h2 className="text-foreground text-lg font-semibold">Personal Information</h2>
        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
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

          <div className="flex items-center gap-3 rounded-lg border px-4 py-3">
            <Mail className="text-muted-foreground size-4 shrink-0" />
            <span className="text-muted-foreground text-sm">{profile.email}</span>
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
              {isSaving ? <LoadingBubbles size="sm" /> : "Save Changes"}
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate("/profile")}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
