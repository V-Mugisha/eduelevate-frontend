import StudentSignupForm from "./components/StudentSignupForm";

export default function SignupPage() {
  return (
    <main className="flex min-h-[calc(100vh-12rem)] items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
      <StudentSignupForm />
    </main>
  );
}
