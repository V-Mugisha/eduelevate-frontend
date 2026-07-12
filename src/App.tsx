import { BrowserRouter, Routes, Route } from "react-router-dom";
import PublicNavbar from "@/features/public/components/PublicNavbar";
import PublicFooter from "@/features/public/components/PublicFooter";
import LandingPage from "@/features/public/LandingPage";
import LoginPage from "@/features/public/LoginPage";
import SignupPage from "@/features/public/SignupPage";
import EducatorSignupPage from "@/features/public/EducatorSignupPage";
import useDarkMode from "@/hooks/useDarkMode";

export default function App() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <BrowserRouter>
      <div className="flex min-h-screen flex-col">
        <PublicNavbar isDarkMode={isDarkMode} onToggleDarkMode={toggleDarkMode} />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/signup/educator" element={<EducatorSignupPage />} />
        </Routes>
        <PublicFooter />
      </div>
    </BrowserRouter>
  );
}
