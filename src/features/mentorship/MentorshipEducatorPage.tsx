import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Send, MessageSquare, XCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import LoadingBubbles from "@/components/shared/LoadingBubbles";
import useAuth from "@/features/auth/hooks/useAuth";
import { getEducator, applyForMentorship, listMentorships, endMentorship, listMyApplications } from "./services/mentorshipService";
import type { EducatorListing, Mentorship, MentorshipApplication } from "./services/mentorshipService";

export default function MentorshipEducatorPage() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [educator, setEducator] = useState<EducatorListing | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [topic, setTopic] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [activeMentorship, setActiveMentorship] = useState<Mentorship | null>(null);
  const [pendingApplication, setPendingApplication] = useState<MentorshipApplication | null>(null);
  const [isEnding, setIsEnding] = useState(false);

  const isStudent = user?.role === "student";

  useEffect(() => {
    if (!userId) return;
    const promises: Promise<unknown>[] = [getEducator(userId)];

    if (isStudent) {
      promises.push(listMentorships(), listMyApplications());
    }

    Promise.all(promises)
      .then(([educatorData, mentorships, applications]) => {
        setEducator(educatorData as EducatorListing);

        if (isStudent && mentorships && applications) {
          const active = (mentorships as Mentorship[]).find(
            (m) => m.educatorId === userId && !m.endedAt,
          );
          const pending = (applications as MentorshipApplication[]).find(
            (a) => a.educatorId === userId && a.status === "pending",
          );
          setActiveMentorship(active ?? null);
          setPendingApplication(pending ?? null);
        }
      })
      .catch(() => toast.error("Failed to load educator profile"))
      .finally(() => setIsLoading(false));
  }, [userId, isStudent]);

  async function handleApply() {
    if (!userId || !message.trim()) return;
    setIsSubmitting(true);
    try {
      await applyForMentorship(userId, {
        message: message.trim(),
        topic: topic.trim() || undefined,
      });
      toast.success("Application submitted successfully.");
      navigate("/mentorship");
    } catch (e: unknown) {
      toast.error((e as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Failed to apply");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleEnd() {
    if (!activeMentorship || !confirm("End this mentorship?")) return;
    setIsEnding(true);
    try {
      await endMentorship(activeMentorship.id);
      setActiveMentorship(null);
      toast.success("Mentorship ended.");
    } catch {
      toast.error("Failed to end mentorship.");
    } finally {
      setIsEnding(false);
    }
  }

  if (isLoading) return <LoadingBubbles size="lg" />;
  if (!educator) return <div className="flex items-center justify-center px-4 py-20"><p className="text-muted-foreground">Educator not found.</p></div>;

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <Button variant="ghost" onClick={() => navigate("/mentorship")} className="mb-4 -ml-3">
        <ArrowLeft className="mr-1.5 size-4" /> Back to Mentorship Hub
      </Button>

      <div className="rounded-xl border bg-card p-6">
        <div className="flex items-center gap-3">
          <div className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
            {educator.firstName[0]}{educator.lastName[0]}
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">{educator.firstName} {educator.lastName}</h1>
            <p className="text-sm text-muted-foreground">{educator.email}</p>
          </div>
        </div>

        {educator.mentorshipProfile.bio && (
          <p className="mt-4 text-sm text-muted-foreground">{educator.mentorshipProfile.bio}</p>
        )}

        <div className="mt-4">
          <h3 className="text-sm font-medium text-foreground">Mentorship Topics</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {educator.mentorshipProfile.topics.map((t) => (
              <span key={t} className="rounded-full bg-primary/10 px-3 py-1 text-xs text-primary">{t}</span>
            ))}
          </div>
        </div>

        <div className="mt-8 border-t pt-6">
          {activeMentorship ? (
            <div className="rounded-lg border border-green-500/30 bg-green-500/5 p-4">
              <p className="text-sm font-medium text-foreground">Active mentorship with {educator.firstName}</p>
              <p className="mt-1 text-xs text-muted-foreground">You are currently being mentored by this educator.</p>
              <div className="mt-4 flex gap-2">
                <Button onClick={() => navigate(`/mentorship/${activeMentorship.id}`)}>
                  <MessageSquare className="mr-2 size-4" /> Open Chat
                </Button>
                <Button variant="outline" className="text-destructive" onClick={handleEnd} disabled={isEnding}>
                  <XCircle className="mr-2 size-4" />
                  {isEnding ? "Ending..." : "End Mentorship"}
                </Button>
              </div>
            </div>
          ) : pendingApplication ? (
            <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/5 p-4">
              <p className="text-sm font-medium text-foreground">Application pending</p>
              <p className="mt-1 text-xs text-muted-foreground">
                You have already applied for mentorship. Awaiting response from {educator.firstName}.
              </p>
            </div>
          ) : isStudent ? (
            <>
              <h3 className="text-lg font-semibold text-foreground">Apply for Mentorship</h3>
              <div className="mt-4 space-y-4">
                <div className="space-y-2">
                  <Label>Message</Label>
                  <Textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Introduce yourself and explain why you want to be mentored..."
                    className="min-h-30"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Topic (optional)</Label>
                  <input
                    className="w-full rounded-lg border px-3 py-2 text-sm"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="What topic would you like mentorship on?"
                  />
                </div>
                <Button onClick={handleApply} disabled={isSubmitting || !message.trim()}>
                  <Send className="mr-2 size-4" />
                  {isSubmitting ? "Submitting..." : "Submit Application"}
                </Button>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}

