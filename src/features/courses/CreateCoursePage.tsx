import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import CreateCourseForm from "./components/CreateCourseForm";

export default function CreateCoursePage() {
  const navigate = useNavigate();

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 px-6 py-10 lg:px-8">
      <Button variant="ghost" onClick={() => navigate("/courses")} className="-ml-3">
        <ArrowLeft className="mr-1.5 size-4" />
        Back to Courses
      </Button>

      <div className="bg-card rounded-xl border p-6 shadow-sm sm:p-8">
        <h1 className="text-foreground text-xl font-bold">Create a New Course</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Fill in the details below to publish a new course to the catalog.
        </p>
        <div className="mt-8">
          <CreateCourseForm />
        </div>
      </div>
    </div>
  );
}
