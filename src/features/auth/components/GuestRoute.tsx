import { Navigate } from "react-router-dom";
import useAuth from "@/features/auth/hooks/useAuth";

export default function GuestRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
