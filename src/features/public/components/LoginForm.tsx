import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Eye, EyeOff, Lock as LockIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import LoadingBubbles from "@/components/shared/LoadingBubbles";
import useLoginForm from "../hooks/useLoginForm";

export default function LoginForm() {
  const { formValues, fieldErrors, apiError, isLoading, handleChange, handleSubmit } =
    useLoginForm();
  const [showPassword, setShowPassword] = useState(false);

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    handleSubmit();
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="bg-card rounded-xl border p-6 shadow-sm sm:p-8">
        <div className="text-center">
          <h1 className="text-foreground text-2xl font-bold">Welcome back</h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Log in to your EduElevate account to continue learning.
          </p>
        </div>

        {apiError && (
          <div className="border-destructive/50 bg-destructive/10 text-destructive mt-6 rounded-lg border px-4 py-3 text-sm">
            {apiError}
          </div>
        )}

        <form onSubmit={onSubmit} className="mt-8 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="login-email">Email Address</Label>
            <div className="relative">
              <Mail className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
              <Input
                id="login-email"
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
            <Label htmlFor="login-password">Password</Label>
            <div className="relative">
              <LockIcon className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
              <Input
                id="login-password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="pr-10 pl-10"
                value={formValues.password}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  handleChange("password", event.target.value)
                }
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
            {fieldErrors.password && (
              <p className="text-destructive text-sm">{fieldErrors.password}</p>
            )}
          </div>

          <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
            {isLoading ? <LoadingBubbles size="sm" /> : "Log In"}
          </Button>
        </form>

        <p className="text-muted-foreground mt-6 text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link to="/signup" className="text-primary font-medium hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
