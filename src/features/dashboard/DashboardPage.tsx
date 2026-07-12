import useAuth from "@/features/auth/hooks/useAuth";
import DashboardCard from "./components/DashboardCard";

export default function DashboardPage() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <main className="bg-muted/30 min-h-[calc(100vh-12rem)] px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
      <DashboardCard user={user} />
    </main>
  );
}
