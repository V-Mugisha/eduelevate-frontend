import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import LoadingBubbles from "@/components/shared/LoadingBubbles";
import AssessmentEditor from "./components/AssessmentEditor";
import { listModules } from "./services/contentService";

export default function AssessmentEditorPage() {
  const { id: courseId, lessonId } = useParams<{ id: string; lessonId: string }>();
  const navigate = useNavigate();
  const [moduleTitle, setModuleTitle] = useState("");
  const [lessonTitle, setLessonTitle] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!courseId || !lessonId) return;
    listModules(courseId)
      .then((modules) => {
        for (const mod of modules) {
          const found = mod.lessons.find((l) => l.id === lessonId);
          if (found) {
            setModuleTitle(mod.title);
            setLessonTitle(found.title);
            break;
          }
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [courseId, lessonId]);

  if (isLoading) return <LoadingBubbles size="lg" />;

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <Button
        variant="ghost"
        onClick={() => navigate(`/courses/${courseId}/content`)}
        className="mb-4 -ml-3"
      >
        <ArrowLeft className="mr-1.5 size-4" />
        Back to Course Content
      </Button>

      <p className="text-sm text-muted-foreground">{moduleTitle}</p>
      <h1 className="text-2xl font-bold text-foreground">{lessonTitle}</h1>

      <div className="mt-8">
        <AssessmentEditor lessonId={lessonId!} />
      </div>
    </div>
  );
}
