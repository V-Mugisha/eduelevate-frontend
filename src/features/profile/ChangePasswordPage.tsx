import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock as LockIcon, Eye, EyeOff, CheckCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import LoadingBubbles from "@/components/shared/LoadingBubbles";
import PasswordStrengthMeter from "@/components/shared/PasswordStrengthMeter";
import { changePasswordSchema } from "./schemas/profileSchemas";
import useProfile from "./hooks/useProfile";

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
        tabIndex={-1}
        aria-label={showPassword ? "Hide password" : "Show password"}
      >
        {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </button>
    </div>
  );
}

export default function ChangePasswordPage() {
  const navigate = useNavigate();
  const { handleChangePassword } = useProfile();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordChanged, setPasswordChanged] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setPasswordChanged(false);

    const result = changePasswordSchema.safeParse({
      currentPassword,
      newPassword,
      confirmNewPassword,
    });
    if (!result.success) {
      setError(result.error.issues.map((i) => i.message).join(", "));
      return;
    }

    setIsSubmitting(true);
    const response = await handleChangePassword(result.data);
    setIsSubmitting(false);

    if (response.success) {
      setPasswordChanged(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    }
  }

  return (
    <div className="mx-auto w-full max-w-4xl space-y-8 px-6 py-10 lg:px-8">
      <Button variant="ghost" onClick={() => navigate("/profile")} className="-ml-3">
        <ArrowLeft className="mr-1.5 size-4" />
        Back to Profile
      </Button>

      {error && (
        <div className="border-destructive/50 bg-destructive/10 text-destructive rounded-lg border px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {passwordChanged && (
        <div className="flex items-center gap-2 rounded-lg border border-green-500/50 bg-green-500/10 px-4 py-3 text-sm text-green-600 dark:text-green-400">
          <CheckCircle className="size-4" />
          Password changed successfully.
        </div>
      )}

      <div className="bg-card rounded-xl border p-6 shadow-sm sm:p-8">
        <h2 className="text-foreground text-lg font-semibold">Change Password</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Update your account password. Your new password must be at least 8 characters long.
        </p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="current-password">Current Password</Label>
            <PasswordInput
              id="current-password"
              placeholder="Enter your current password"
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-password">New Password</Label>
            <PasswordInput
              id="new-password"
              placeholder="Enter a new password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-new-password">Confirm New Password</Label>
            <PasswordInput
              id="confirm-new-password"
              placeholder="Confirm your new password"
              value={confirmNewPassword}
              onChange={(event) => setConfirmNewPassword(event.target.value)}
            />
            <PasswordStrengthMeter password={newPassword} confirmPassword={confirmNewPassword} />
          </div>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? <LoadingBubbles size="sm" /> : "Change Password"}
          </Button>
        </form>
      </div>
    </div>
  );
}
