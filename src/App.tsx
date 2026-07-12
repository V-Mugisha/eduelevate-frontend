import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthProvider from "@/features/auth/context/AuthProvider";
import ProtectedRoute from "@/features/auth/components/ProtectedRoute";
import GuestRoute from "@/features/auth/components/GuestRoute";
import PublicNavbar from "@/features/public/components/PublicNavbar";
import PublicFooter from "@/features/public/components/PublicFooter";
import LandingPage from "@/features/public/LandingPage";
import LoginPage from "@/features/public/LoginPage";
import SignupPage from "@/features/public/SignupPage";
import EducatorSignupPage from "@/features/public/EducatorSignupPage";
import DashboardPage from "@/features/dashboard/DashboardPage";
import useDarkMode from "@/hooks/useDarkMode";

export default function App() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="flex min-h-screen flex-col">
          <PublicNavbar isDarkMode={isDarkMode} onToggleDarkMode={toggleDarkMode} />
          <Routes>
            <Route
              path="/"
              element={
                <GuestRoute>
                  <LandingPage />
                </GuestRoute>
              }
            />
            <Route
              path="/login"
              element={
                <GuestRoute>
                  <LoginPage />
                </GuestRoute>
              }
            />
            <Route
              path="/signup"
              element={
                <GuestRoute>
                  <SignupPage />
                </GuestRoute>
              }
            />
            <Route
              path="/signup/educator"
              element={
                <GuestRoute>
                  <EducatorSignupPage />
                </GuestRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
          </Routes>
          <PublicFooter />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}
