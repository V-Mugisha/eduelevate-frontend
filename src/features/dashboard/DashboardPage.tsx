import useAuth from "@/features/auth/hooks/useAuth";
import StudentDashboard from "./StudentDashboard";
import EducatorDashboard from "./EducatorDashboard";
import AdminDashboard from "./AdminDashboard";

export default function DashboardPage() {
  const { user } = useAuth();

  if (!user) return null;

  if (user.role === "student") return <StudentDashboard />;
  if (user.role === "educator") return <EducatorDashboard />;
  if (user.role === "admin") return <AdminDashboard />;

  return null;
}
