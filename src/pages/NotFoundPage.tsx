import { Link } from "react-router-dom";
import { FileQuestion, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-20">
      <div className="text-center">
        <div className="bg-muted mx-auto flex size-16 items-center justify-center rounded-full">
          <FileQuestion className="text-muted-foreground size-8" />
        </div>
        <h1 className="text-foreground mt-6 text-4xl font-bold sm:text-5xl">404</h1>
        <p className="text-muted-foreground mt-3 text-lg">
          The page you are looking for does not exist or is still being built.
        </p>
        <div className="mt-8">
          <Link to="/dashboard">
            <Button>
              <ArrowLeft className="mr-2 size-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
