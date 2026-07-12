import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Lock as LockIcon, School, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SearchableSelectDropdown from "@/components/shared/SearchableSelectDropdown";
import PasswordStrengthMeter from "@/components/shared/PasswordStrengthMeter";
import useStudentSignupForm from "../hooks/useStudentSignupForm";

const gradeOptions = [
  { value: "S4", label: "Senior 4 (S4)" },
  { value: "S5", label: "Senior 5 (S5)" },
  { value: "S6", label: "Senior 6 (S6)" },
];

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

export default function StudentSignupForm() {
  const { formValues, fieldErrors, handleChange, handleSubmit } = useStudentSignupForm();

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    handleSubmit();
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="bg-card rounded-xl border p-6 shadow-sm sm:p-8">
        <div className="text-center">
          <h1 className="text-foreground text-2xl font-bold">Create your student account</h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Join EduElevate and start building real-world tech skills today.
          </p>
        </div>

        <form onSubmit={onSubmit} className="mt-8 space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="signup-first-name">First Name</Label>
              <Input
                id="signup-first-name"
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
              <Label htmlFor="signup-last-name">Last Name</Label>
              <Input
                id="signup-last-name"
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
            <Label htmlFor="signup-email">Email Address</Label>
            <div className="relative">
              <Mail className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
              <Input
                id="signup-email"
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

          <div className="space-y-2">
            <Label htmlFor="signup-school">School Name</Label>
            <div className="relative">
              <School className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
              <Input
                id="signup-school"
                placeholder="Your school name"
                className="pl-10"
                value={formValues.schoolName}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  handleChange("schoolName", event.target.value)
                }
              />
            </div>
            {fieldErrors.schoolName && (
              <p className="text-destructive text-sm">{fieldErrors.schoolName}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="signup-grade">Grade Level</Label>
            <SearchableSelectDropdown
              options={gradeOptions}
              value={formValues.grade}
              onChange={(value) => handleChange("grade", value)}
              placeholder="Select your grade"
              searchPlaceholder="Search grade..."
              emptyMessage="No grade found."
            />
            {fieldErrors.grade && <p className="text-destructive text-sm">{fieldErrors.grade}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="signup-password">Password</Label>
            <PasswordInput
              id="signup-password"
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
            <Label htmlFor="signup-confirm-password">Confirm Password</Label>
            <PasswordInput
              id="signup-confirm-password"
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
            Create Account
          </Button>
        </form>

        <p className="text-muted-foreground mt-6 text-center text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-primary font-medium hover:underline">
            Log in
          </Link>
        </p>

        <p className="text-muted-foreground mt-2 text-center text-sm">
          Are you an educator?{" "}
          <Link to="/signup/educator" className="text-primary font-medium hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
