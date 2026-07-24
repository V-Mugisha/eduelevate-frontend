import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Send,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import LoadingBubbles from "@/components/shared/LoadingBubbles";
import useEnrollment from "./hooks/useEnrollment";
import { listModules } from "./services/contentService";
import * as assessmentService from "./services/assessmentService";
import type { Assessment, AssessmentQuestion, SubmitResult } from "./services/assessmentService";
import type { Module } from "./services/contentService";

interface FlatLesson {
  lessonId: string;
  module: Module;
}

function buildFlatLessonList(modules: Module[]): FlatLesson[] {
  const flat: FlatLesson[] = [];
  for (const mod of modules) {
    for (const lesson of mod.lessons) {
      flat.push({ lessonId: lesson.id, module: mod });
    }
  }
  return flat;
}

export default function AssessmentPage() {
  const { id: courseId, lessonId } = useParams<{ id: string; lessonId: string }>();
  const navigate = useNavigate();

  const { isEnrolled, handleCompleteLesson } = useEnrollment(courseId ?? "");

  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [questions, setQuestions] = useState<AssessmentQuestion[]>([]);
  const [moduleTitle, setModuleTitle] = useState("");
  const [lessonTitle, setLessonTitle] = useState("");
  const [flatList, setFlatList] = useState<FlatLesson[]>([]);

  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string[]>>({});
  const [result, setResult] = useState<SubmitResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!courseId || !lessonId) return;

    listModules(courseId)
      .then((modules) => {
        setFlatList(buildFlatLessonList(modules));

        for (const mod of modules) {
          const found = mod.lessons.find((l) => l.id === lessonId);
          if (found) {
            setModuleTitle(mod.title);
            setLessonTitle(found.title);
            break;
          }
        }

        return assessmentService.getAssessment(lessonId);
      })
      .then(async (a) => {
        if (!a) {
          setAssessment(null);
          setIsLoading(false);
          return;
        }
        setAssessment(a);
        const qs = await assessmentService.getQuestionsStudent(a.id);
        setQuestions(qs);

        const allSubmitted = qs.length > 0 && qs.every((q) => q.isSubmitted);
        if (!allSubmitted) {
          const initial: Record<string, string[]> = {};
          for (const q of qs) {
            initial[q.id] = [];
          }
          setSelectedAnswers(initial);
        }
      })
      .catch(() => setError("Failed to load assessment"))
      .finally(() => setIsLoading(false));
  }, [courseId, lessonId]);

  const handleToggleOption = useCallback(
    (questionId: string, option: string, isMulti: boolean) => {
      setSelectedAnswers((prev) => {
        const current = prev[questionId] ?? [];
        if (current.includes(option)) {
          return { ...prev, [questionId]: current.filter((o) => o !== option) };
        }
        if (isMulti) {
          return { ...prev, [questionId]: [...current, option] };
        }
        return { ...prev, [questionId]: [option] };
      });
    },
    [],
  );

  async function handleSubmit() {
    if (!assessment) return;
    setIsSubmitting(true);
    setError(null);
    try {
      const answers = questions.map((q) => ({
        questionId: q.id,
        providedAnswers: selectedAnswers[q.id] ?? [],
      }));
      const res = await assessmentService.submitAssessment(assessment.id, answers);
      setResult(res);
      if (assessment.isGraded) {
        await handleCompleteLesson(lessonId!);
      }
    } catch {
      setError("Failed to submit assessment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleContinue() {
    const currentIndex = flatList.findIndex((f) => f.lessonId === lessonId);
    if (currentIndex >= 0 && currentIndex < flatList.length - 1) {
      const nextId = flatList[currentIndex + 1].lessonId;
      navigate(`/courses/${courseId}/learn?lesson=${nextId}`);
    } else {
      navigate(`/courses/${courseId}/learn`);
    }
  }

  const isMultiPerQuestion = useMemo(
    () =>
      new Map(questions.map((q) => [q.id, (q.correctAnswers?.length ?? 0) > 1])),
    [questions],
  );

  const allAnswered = questions.every(
    (q) => (selectedAnswers[q.id]?.length ?? 0) > 0,
  );
  const isSubmitted = result !== null;

  if (isLoading) return <LoadingBubbles size="lg" />;
  if (!isEnrolled) return <Navigate to={`/courses/${courseId}`} replace />;
  if (!assessment) return <Navigate to={`/courses/${courseId}/learn?lesson=${lessonId}`} replace />;

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <Button
        variant="ghost"
        onClick={() => navigate(`/courses/${courseId}/learn?lesson=${lessonId}`)}
        className="mb-4 -ml-3"
      >
        <ArrowLeft className="mr-1.5 size-4" />
        Back
      </Button>

      <p className="text-sm text-muted-foreground">{moduleTitle}</p>
      <h1 className="text-2xl font-bold text-foreground">{lessonTitle}</h1>
      {assessment.title && (
        <p className="mt-1 text-lg text-muted-foreground">{assessment.title}</p>
      )}

      {assessment.isGraded && (
        <span className="mt-2 inline-block rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
          Graded
        </span>
      )}

      {assessment.instructions && (
        <div className="mt-4 rounded-lg border bg-card p-4">
          <p className="text-sm text-muted-foreground whitespace-pre-line">
            {assessment.instructions}
          </p>
        </div>
      )}

      {error && (
        <div className="mt-4 rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="mt-8 space-y-6">
        {questions.map((q, i) => {
          const isMulti = isMultiPerQuestion.get(q.id) ?? false;
          const current = selectedAnswers[q.id] ?? [];
          const qResult = result?.results.find((r) => r.questionId === q.id);

          return (
            <div key={q.id} className="rounded-lg border bg-card p-4">
              <p className="text-sm font-medium text-foreground">
                {i + 1}. {q.title}
                <span className="ml-2 text-xs text-muted-foreground">
                  ({q.grade} pt{q.grade !== 1 ? "s" : ""})
                </span>
              </p>

              <div className="mt-3 space-y-1.5">
                {q.answerOptions.map((option) => {
                  const isSelected = current.includes(option);
                  const isResultCorrect = qResult
                    ? qResult.correctAnswers.includes(option)
                    : false;
                  const showResult = !!qResult;

                  let optionClass = "text-foreground";
                  if (showResult) {
                    if (isResultCorrect) optionClass = "text-green-600 dark:text-green-400";
                    else if (isSelected && !isResultCorrect)
                      optionClass = "text-destructive";
                  }

                  return (
                    <label
                      key={option}
                      className={`flex items-center gap-2 rounded px-2 py-2 text-sm ${
                        showResult ? "" : "cursor-pointer hover:bg-muted"
                      }`}
                    >
                      {showResult ? (
                        isResultCorrect ? (
                          <CheckCircle className="size-4 shrink-0 text-green-500" />
                        ) : isSelected ? (
                          <XCircle className="size-4 shrink-0 text-destructive" />
                        ) : (
                          <div className="size-4 shrink-0 rounded-full border-2 border-muted-foreground/30" />
                        )
                      ) : (
                        <input
                          type={isMulti ? "checkbox" : "radio"}
                          name={`q-${q.id}`}
                          checked={isSelected}
                          onChange={() => handleToggleOption(q.id, option, isMulti)}
                          className="size-3.5 shrink-0"
                        />
                      )}
                      <span className={optionClass}>{option}</span>
                      {showResult && isSelected && !isResultCorrect && (
                        <span className="ml-auto text-xs text-muted-foreground">
                          <XCircle className="mr-1 inline-block size-3 text-destructive" />
                          Your answer
                        </span>
                      )}
                    </label>
                  );
                })}
              </div>

              {qResult && (
                <p className="mt-2 text-xs">
                  {qResult.isCorrect ? (
                    <span className="text-green-600 dark:text-green-400">
                      Correct (+{q.grade} pt{q.grade !== 1 ? "s" : ""})
                    </span>
                  ) : (
                    <span className="text-destructive">Incorrect</span>
                  )}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {isSubmitted && result ? (
        <div className="mt-8 rounded-lg border bg-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Your Score</p>
              <p className="text-2xl font-bold text-foreground">
                {result.totalScore} / {result.totalPossible}
              </p>
            </div>
            <Button onClick={handleContinue}>
              Continue
              <ChevronRight className="ml-1.5 size-4" />
            </Button>
          </div>
        </div>
      ) : (
        <div className="mt-8">
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !allAnswered || questions.length === 0}
            size="lg"
            className="w-full"
          >
            {isSubmitting ? (
              <LoadingBubbles size="sm" />
            ) : (
              <>
                <Send className="mr-2 size-4" />
                Submit Assessment
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
