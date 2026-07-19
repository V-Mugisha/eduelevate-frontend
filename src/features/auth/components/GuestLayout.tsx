import { Outlet } from "react-router-dom";
import PublicNavbar from "@/features/public/components/PublicNavbar";
import PublicFooter from "@/features/public/components/PublicFooter";
import useDarkMode from "@/hooks/useDarkMode";

export default function GuestLayout() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <div className="flex min-h-screen flex-col">
      <PublicNavbar isDarkMode={isDarkMode} onToggleDarkMode={toggleDarkMode} />
      <Outlet />
      <PublicFooter />
    </div>
  );
}
