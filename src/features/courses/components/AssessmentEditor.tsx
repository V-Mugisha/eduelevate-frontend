import { useState, useEffect } from "react";
import { Plus, Trash2, Pencil, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import TiptapEditor from "@/components/shared/TiptapEditor";
import LoadingBubbles from "@/components/shared/LoadingBubbles";
import DOMPurify from "isomorphic-dompurify";
import * as assessmentService from "../services/assessmentService";
import type { Assessment, AssessmentQuestion } from "../services/assessmentService";

interface AssessmentEditorProps {
  lessonId: string;
}

export default function AssessmentEditor({ lessonId }: AssessmentEditorProps) {
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [questions, setQuestions] = useState<AssessmentQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editQuestionId, setEditQuestionId] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [instructions, setInstructions] = useState("");
  const [isGraded, setIsGraded] = useState(true);

  const [qTitle, setQTitle] = useState("");
  const [qOptions, setQOptions] = useState<string[]>(["", ""]);
  const [qCorrect, setQCorrect] = useState<Set<string>>(new Set());
  const [qGrade, setQGrade] = useState(1);

  useEffect(() => {
    assessmentService
      .getAssessment(lessonId)
      .then((a) => {
        if (a) {
          setAssessment(a);
          setTitle(a.title ?? "");
          setInstructions(a.instructions ?? "");
          setIsGraded(a.isGraded);
          return assessmentService.getQuestionsOwner(a.id);
        }
        setAssessment(null);
        setTitle("");
        setInstructions("");
        setIsGraded(true);
        setShowCreateForm(false);
        return [];
      })
      .then((qs) => setQuestions(qs))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [lessonId]);

  function resetQuestionForm() {
    setQTitle("");
    setQOptions(["", ""]);
    setQCorrect(new Set());
    setQGrade(1);
    setEditQuestionId(null);
  }

  function handleToggleOptionCorrect(option: string) {
    setQCorrect((prev) => {
      const next = new Set(prev);
      if (next.has(option)) next.delete(option);
      else next.add(option);
      return next;
    });
  }

  async function handleSaveMetadata() {
    if (!assessment) return;
    setIsSaving(true);
    setError(null);
    try {
      const updated = await assessmentService.updateAssessment(assessment.id, {
        title: title || undefined,
        instructions: instructions || undefined,
        isGraded,
      });
      setAssessment(updated);
    } catch {
      setError("Failed to save assessment");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleCreateAssessment() {
    setIsSaving(true);
    setError(null);
    try {
      const created = await assessmentService.createAssessment(lessonId, {
        title: title || undefined,
        instructions: instructions || undefined,
        isGraded,
      });
      setAssessment(created);
      setQuestions([]);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to create assessment";
      setError(
        (e as { response?: { data?: { message?: string } } })?.response?.data?.message ?? msg,
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDeleteAssessment() {
    if (!assessment || !confirm("Delete this assessment and all its questions?")) return;
    setIsSaving(true);
    try {
      await assessmentService.deleteAssessment(assessment.id);
      setAssessment(null);
      setQuestions([]);
      setTitle("");
      setInstructions("");
    } catch {
      setError("Failed to delete assessment");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleCreateQuestion() {
    if (!assessment || !qTitle.trim() || qOptions.length < 2 || qCorrect.size === 0) return;
    setIsSaving(true);
    setError(null);
    try {
      const created = await assessmentService.createQuestion(assessment.id, {
        title: qTitle.trim(),
        answerOptions: qOptions.filter((o) => o.trim()),
        correctAnswers: [...qCorrect],
        grade: qGrade,
      });
      setQuestions((prev) => [...prev, created]);
      resetQuestionForm();
      setShowCreateForm(false);
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg ?? "Failed to add question");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDeleteQuestion(questionId: string) {
    setIsSaving(true);
    try {
      await assessmentService.deleteQuestion(questionId);
      setQuestions((prev) => prev.filter((q) => q.id !== questionId));
    } catch {
      setError("Failed to delete question");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleSaveQuestion(questionId: string) {
    if (!qTitle.trim() || qOptions.length < 2 || qCorrect.size === 0) return;
    setIsSaving(true);
    setError(null);
    try {
      const updated = await assessmentService.updateQuestion(questionId, {
        title: qTitle.trim(),
        answerOptions: qOptions.filter((o) => o.trim()),
        correctAnswers: [...qCorrect],
        grade: qGrade,
      });
      setQuestions((prev) => prev.map((q) => (q.id === questionId ? updated : q)));
      resetQuestionForm();
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg ?? "Failed to update question");
    } finally {
      setIsSaving(false);
    }
  }

  function startEditQuestion(q: AssessmentQuestion) {
    setEditQuestionId(q.id);
    setQTitle(q.title);
    setQOptions(q.answerOptions.length > 0 ? q.answerOptions : ["", ""]);
    setQCorrect(new Set(q.correctAnswers ?? []));
    setQGrade(q.grade);
  }

  function handleSetOption(index: number, value: string) {
    const next = [...qOptions];
    next[index] = value;
    setQOptions(next);
  }

  if (isLoading) return <LoadingBubbles size="sm" />;

  if (!assessment) {
    return (
      <div className="space-y-3">
        <h3 className="text-foreground font-semibold">Assessment</h3>
        <p className="text-muted-foreground text-sm">No assessment added yet.</p>
        {!showCreateForm ? (
          <Button variant="outline" size="sm" onClick={() => setShowCreateForm(true)}>
            <Plus className="mr-1.5 size-4" />
            Add Assessment
          </Button>
        ) : (
          <div className="space-y-3 rounded-lg border p-4">
            <div className="space-y-2">
              <Label>Title (optional)</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Instructions (optional)</Label>
              <TiptapEditor value={instructions} onChange={setInstructions} />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={isGraded}
                onChange={(e) => setIsGraded(e.target.checked)}
                className="size-4"
              />
              Graded (required to complete lesson)
            </label>
            {error && <p className="text-destructive text-sm">{error}</p>}
            <div className="flex gap-2">
              <Button size="sm" onClick={handleCreateAssessment} disabled={isSaving}>
                Create
              </Button>
              <Button variant="outline" size="sm" onClick={() => setShowCreateForm(false)}>
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-foreground font-semibold">Assessment</h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleDeleteAssessment}
          title="Delete assessment"
        >
          <Trash2 className="text-destructive size-4" />
        </Button>
      </div>

      {error && <p className="text-destructive text-sm">{error}</p>}

      <div className="space-y-3 rounded-lg border p-4">
        <div className="space-y-2">
          <Label>Title (optional)</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Instructions (optional)</Label>
          <TiptapEditor value={instructions} onChange={setInstructions} />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={isGraded}
            onChange={(e) => setIsGraded(e.target.checked)}
            className="size-4"
          />
          Graded (required to complete lesson)
        </label>
        <Button size="sm" variant="outline" onClick={handleSaveMetadata} disabled={isSaving}>
          Save Metadata
        </Button>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="text-foreground text-sm font-medium">Questions ({questions.length})</h4>
        </div>

        {!editQuestionId && (
          <div className="space-y-3 rounded-lg border p-3">
            <div className="space-y-1">
              <Label className="text-xs">Question</Label>
              <TiptapEditor
                value={qTitle}
                onChange={setQTitle}
                placeholder="Enter the question..."
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Answer Options</Label>
              {qOptions.map((opt, i) => (
                <div key={i} className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    checked={qCorrect.has(opt)}
                    onChange={() => handleToggleOptionCorrect(opt)}
                    className="mt-2.5 size-3.5"
                  />
                  <div className="flex-1">
                    <TiptapEditor value={opt} onChange={(v) => handleSetOption(i, v)} />
                  </div>
                  {qOptions.length > 2 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setQOptions(qOptions.filter((_, j) => j !== i))}
                    >
                      <X className="size-3" />
                    </Button>
                  )}
                </div>
              ))}
              <Button variant="ghost" size="sm" onClick={() => setQOptions([...qOptions, ""])}>
                <Plus className="mr-1 size-3" /> Add Option
              </Button>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Grade (points)</Label>
              <Input
                type="number"
                min="1"
                value={qGrade}
                onChange={(e) => setQGrade(parseInt(e.target.value, 10) || 1)}
                className="w-24 text-sm"
              />
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={handleCreateQuestion} disabled={isSaving}>
                <Plus className="mr-1 size-3" /> Add
              </Button>
            </div>
          </div>
        )}

        {questions.map((q) => (
          <div key={q.id} className="rounded-lg border p-3">
            {editQuestionId === q.id ? (
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label className="text-xs">Question</Label>
                  <TiptapEditor value={qTitle} onChange={setQTitle} />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Answer Options</Label>
                  {qOptions.map((opt, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <input
                        type="checkbox"
                        checked={qCorrect.has(opt)}
                        onChange={() => handleToggleOptionCorrect(opt)}
                        className="mt-2.5 size-3.5"
                      />
                      <div className="flex-1">
                        <TiptapEditor value={opt} onChange={(v) => handleSetOption(i, v)} />
                      </div>
                      {qOptions.length > 2 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setQOptions(qOptions.filter((_, j) => j !== i))}
                        >
                          <X className="size-3" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button variant="ghost" size="sm" onClick={() => setQOptions([...qOptions, ""])}>
                    <Plus className="mr-1 size-3" /> Add Option
                  </Button>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Grade (points)</Label>
                  <Input
                    type="number"
                    min="1"
                    value={qGrade}
                    onChange={(e) => setQGrade(parseInt(e.target.value, 10) || 1)}
                    className="w-24 text-sm"
                  />
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => handleSaveQuestion(q.id)} disabled={isSaving}>
                    <Check className="mr-1 size-3" /> Save
                  </Button>
                  <Button size="sm" variant="outline" onClick={resetQuestionForm}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div
                      className="text-foreground text-sm font-medium prose prose-sm dark:prose-invert max-w-none"
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(q.title),
                      }}
                    />
                    <p className="text-muted-foreground mt-0.5 text-xs">
                      {q.answerOptions.length} options, {q.grade} pt(s)
                    </p>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {q.answerOptions.map((o) => (
                        <span
                          key={o}
                          className={`rounded px-1.5 py-0.5 text-xs ${
                            q.correctAnswers?.includes(o)
                              ? "bg-green-500/10 text-green-600 dark:text-green-400"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          <span
                            dangerouslySetInnerHTML={{
                              __html: DOMPurify.sanitize(o),
                            }}
                          />
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => startEditQuestion(q)}
                    >
                      <Pencil className="size-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteQuestion(q.id)}
                    >
                      <Trash2 className="text-destructive size-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
