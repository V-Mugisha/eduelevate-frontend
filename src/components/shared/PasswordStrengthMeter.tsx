import { Check, X } from "lucide-react";

interface PasswordStrengthMeterProps {
  password: string;
  confirmPassword: string;
}

interface CriteriaItem {
  label: string;
  met: boolean;
}

export default function PasswordStrengthMeter({
  password,
  confirmPassword,
}: PasswordStrengthMeterProps) {
  const hasMinLength = password.length >= 8;
  const hasLowercase = /[a-z]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[^a-zA-Z0-9\s\t]/.test(password);
  const passwordsMatch = password.length > 0 && password === confirmPassword;

  const criteriaItems: CriteriaItem[] = [
    { label: "At least 8 characters", met: hasMinLength },
    { label: "Contains a lowercase letter", met: hasLowercase },
    { label: "Contains an uppercase letter", met: hasUppercase },
    { label: "Contains a number", met: hasNumber },
    { label: "Contains a special character", met: hasSpecialChar },
    { label: "Passwords match", met: passwordsMatch },
  ];

  return (
    <div className="mt-2 space-y-1">
      <p className="text-muted-foreground text-xs font-medium">Password strength</p>
      <ul className="space-y-0.5">
        {criteriaItems.map((item) => (
          <li key={item.label} className="flex items-center gap-1.5 text-xs">
            {item.met ? (
              <Check className="size-3.5 text-green-600 dark:text-green-400" />
            ) : (
              <X className="text-muted-foreground size-3.5" />
            )}
            <span className={item.met ? "text-foreground" : "text-muted-foreground"}>
              {item.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
