import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthProvider from "@/features/auth/context/AuthProvider";
import ProtectedRoute from "@/features/auth/components/ProtectedRoute";
import GuestRoute from "@/features/auth/components/GuestRoute";
import GuestLayout from "@/features/auth/components/GuestLayout";
import AuthenticatedLayout from "@/features/auth/components/AuthenticatedLayout";
import LandingPage from "@/features/public/LandingPage";
import LoginPage from "@/features/public/LoginPage";
import SignupPage from "@/features/public/SignupPage";
import EducatorSignupPage from "@/features/public/EducatorSignupPage";
import DashboardPage from "@/features/dashboard/DashboardPage";
import ProfilePage from "@/features/profile/ProfilePage";
import EditProfilePage from "@/features/profile/EditProfilePage";
import ChangePasswordPage from "@/features/profile/ChangePasswordPage";
import CoursesCatalogPage from "@/features/courses/CoursesCatalogPage";
import MyCoursesPage from "@/features/courses/MyCoursesPage";
import MyLearningPage from "@/features/courses/MyLearningPage";
import CourseDetailPage from "@/features/courses/CourseDetailPage";
import CourseContentPage from "@/features/courses/CourseContentPage";
import CourseLearnPage from "@/features/courses/CourseLearnPage";
import CourseStudentsPage from "@/features/courses/CourseStudentsPage";
import StudentDetailPage from "@/features/courses/StudentDetailPage";
import CreateCoursePage from "@/features/courses/CreateCoursePage";
import NotFoundPage from "@/pages/NotFoundPage";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<GuestLayout />}>
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
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>

          <Route
            element={
              <ProtectedRoute>
                <AuthenticatedLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/profile/edit" element={<EditProfilePage />} />
            <Route path="/profile/change-password" element={<ChangePasswordPage />} />
            <Route path="/courses" element={<CoursesCatalogPage />} />
            <Route path="/courses/my-courses" element={<MyCoursesPage />} />
            <Route path="/my-learning" element={<MyLearningPage />} />
            <Route path="/courses/create" element={<CreateCoursePage />} />
            <Route path="/courses/:id" element={<CourseDetailPage />} />
            <Route path="/courses/:id/content" element={<CourseContentPage />} />
            <Route path="/courses/:id/learn" element={<CourseLearnPage />} />
            <Route path="/courses/:id/students" element={<CourseStudentsPage />} />
            <Route path="/courses/:id/students/:userId" element={<StudentDetailPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
