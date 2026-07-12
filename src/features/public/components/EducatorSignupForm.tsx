import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  Lock as LockIcon,
  Building,
  Briefcase,
  Clock,
  Plus,
  Trash2,
  Eye,
  EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import PasswordStrengthMeter from "@/components/shared/PasswordStrengthMeter";
import useEducatorSignupForm from "../hooks/useEducatorSignupForm";

function PasswordInput({
  id,
  placeholder,
  value,
  onChange,
}: {
  id: string;
  placeholder: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <LockIcon className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
      <Input
        id={id}
        type={showPassword ? "text" : "password"}
        placeholder={placeholder}
        className="pr-10 pl-10"
        value={value}
        onChange={onChange}
      />
      <button
        type="button"
        onClick={() => setShowPassword((previous) => !previous)}
        className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2"
        aria-label={showPassword ? "Hide password" : "Show password"}
        tabIndex={-1}
      >
        {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </button>
    </div>
  );
}

export default function EducatorSignupForm() {
  const {
    formValues,
    fieldErrors,
    handleChange,
    handleAddExpertise,
    handleRemoveExpertise,
    handleExpertiseChange,
    handleSubmit,
  } = useEducatorSignupForm();

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    handleSubmit();
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="bg-card rounded-xl border p-6 shadow-sm sm:p-8">
        <div className="text-center">
          <h1 className="text-foreground text-2xl font-bold">Educator registration</h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Share your knowledge and mentor the next generation of Rwandan developers. This is a
            temporary registration form. Invitation-based onboarding will replace this soon.
          </p>
        </div>

        <form onSubmit={onSubmit} className="mt-8 space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="educator-first-name">First Name</Label>
              <Input
                id="educator-first-name"
                placeholder="First name"
                value={formValues.firstName}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  handleChange("firstName", event.target.value)
                }
              />
              {fieldErrors.firstName && (
                <p className="text-destructive text-sm">{fieldErrors.firstName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="educator-last-name">Last Name</Label>
              <Input
                id="educator-last-name"
                placeholder="Last name"
                value={formValues.lastName}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  handleChange("lastName", event.target.value)
                }
              />
              {fieldErrors.lastName && (
                <p className="text-destructive text-sm">{fieldErrors.lastName}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="educator-email">Email Address</Label>
            <div className="relative">
              <Mail className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
              <Input
                id="educator-email"
                type="email"
                placeholder="you@example.com"
                className="pl-10"
                value={formValues.email}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  handleChange("email", event.target.value)
                }
              />
            </div>
            {fieldErrors.email && <p className="text-destructive text-sm">{fieldErrors.email}</p>}
          </div>

          <div className="flex items-start gap-2">
            <Checkbox
              id="educator-independent"
              checked={formValues.isIndependent}
              onCheckedChange={(checked) => handleChange("isIndependent", Boolean(checked))}
              className="mt-1"
            />
            <Label htmlFor="educator-independent" className="text-sm leading-relaxed font-normal">
              I am an independent educator (not affiliated with a school or organization)
            </Label>
          </div>

          {!formValues.isIndependent && (
            <div className="space-y-2">
              <Label htmlFor="educator-organization">School / Organization</Label>
              <div className="relative">
                <Building className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                <Input
                  id="educator-organization"
                  placeholder="Your school or organization name"
                  className="pl-10"
                  value={formValues.organizationName}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    handleChange("organizationName", event.target.value)
                  }
                />
              </div>
              {fieldErrors.organizationName && (
                <p className="text-destructive text-sm">{fieldErrors.organizationName}</p>
              )}
            </div>
          )}

          <div className="space-y-3">
            <Label>Areas of Expertise</Label>
            {formValues.expertiseAreas.map((expertise, index) => (
              <div key={index} className="flex items-start gap-2">
                <div className="relative flex-1">
                  <Briefcase className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                  <Input
                    placeholder={`Expertise ${index + 1}`}
                    className="pl-10"
                    value={expertise}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                      handleExpertiseChange(index, event.target.value)
                    }
                  />
                </div>
                {formValues.expertiseAreas.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveExpertise(index)}
                    aria-label="Remove expertise"
                  >
                    <Trash2 className="text-muted-foreground size-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddExpertise}
              className="w-full"
            >
              <Plus className="mr-1.5 size-4" />
              Add Expertise
            </Button>
            {typeof fieldErrors.expertiseAreas === "string" && (
              <p className="text-destructive text-sm">{fieldErrors.expertiseAreas}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="educator-experience">Years of Experience (optional)</Label>
            <div className="relative">
              <Clock className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
              <Input
                id="educator-experience"
                type="number"
                placeholder="Years of professional experience"
                className="pl-10"
                value={formValues.yearsOfExperience}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  handleChange("yearsOfExperience", event.target.value)
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="educator-bio">Bio</Label>
            <Textarea
              id="educator-bio"
              placeholder="Tell us about yourself, your background, and what you hope to achieve as an educator on EduElevate..."
              className="min-h-[120px]"
              value={formValues.bio}
              onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) =>
                handleChange("bio", event.target.value)
              }
            />
            {fieldErrors.bio && <p className="text-destructive text-sm">{fieldErrors.bio}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="educator-password">Password</Label>
            <PasswordInput
              id="educator-password"
              placeholder="Create a password (min. 8 characters)"
              value={formValues.password}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                handleChange("password", event.target.value)
              }
            />
            {fieldErrors.password && (
              <p className="text-destructive text-sm">{fieldErrors.password}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="educator-confirm-password">Confirm Password</Label>
            <PasswordInput
              id="educator-confirm-password"
              placeholder="Confirm your password"
              value={formValues.confirmPassword}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                handleChange("confirmPassword", event.target.value)
              }
            />
            {fieldErrors.confirmPassword && (
              <p className="text-destructive text-sm">{fieldErrors.confirmPassword}</p>
            )}
            <PasswordStrengthMeter
              password={formValues.password}
              confirmPassword={formValues.confirmPassword}
            />
          </div>

          <Button type="submit" className="w-full" size="lg">
            Register as Educator
          </Button>
        </form>

        <p className="text-muted-foreground mt-6 text-center text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-primary font-medium hover:underline">
            Log in
          </Link>
        </p>

        <p className="text-muted-foreground mt-2 text-center text-sm">
          Are you a student?{" "}
          <Link to="/signup" className="text-primary font-medium hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
