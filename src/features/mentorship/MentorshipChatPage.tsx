import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Send, Star } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import LoadingBubbles from "@/components/shared/LoadingBubbles";
import useAuth from "@/features/auth/hooks/useAuth";
import * as mentorshipService from "./services/mentorshipService";
import type { MentorshipMessage, Mentorship } from "./services/mentorshipService";

export default function MentorshipChatPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [mentorship, setMentorship] = useState<Mentorship | null>(null);
  const [messages, setMessages] = useState<MentorshipMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [rating, setRating] = useState<number | null>(null);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [isRating, setIsRating] = useState(false);

  useEffect(() => {
    if (!id) return;
    Promise.all([
      mentorshipService.listMessages(id),
      mentorshipService.listMentorships(),
    ])
      .then(([msgs, mentorships]) => {
        setMessages(msgs);
        const m = mentorships.find((ment: Mentorship) => ment.id === id);
        if (m) setMentorship(m);
      })
      .catch(() => toast.error("Failed to load chat"))
      .finally(() => setIsLoading(false));
  }, [id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend() {
    if (!id || !newMessage.trim()) return;
    setIsSending(true);
    try {
      const msg = await mentorshipService.sendMessage(id, newMessage.trim());
      setMessages((prev) => [...prev, msg]);
      setNewMessage("");
    } catch (e: unknown) {
      toast.error((e as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Failed to send message");
    } finally {
      setIsSending(false);
    }
  }

  async function handleEndMentorship() {
    if (!id || !confirm("End this mentorship?")) return;
    try {
      await mentorshipService.endMentorship(id);
      setMentorship((prev: Mentorship | null) => prev ? { ...prev, endedAt: new Date().toISOString(), endedBy: user?.id === prev.studentId ? "student" : "educator" } : null);
      toast.success("Mentorship ended.");
    } catch {
      toast.error("Failed to end mentorship.");
    }
  }

  async function handleRate(star: number) {
    if (!id || isRating) return;
    setIsRating(true);
    try {
      await mentorshipService.rateEducator(id, star);
      setRating(star);
      toast.success("Rating submitted.");
    } catch {
      toast.error("Failed to submit rating.");
    } finally {
      setIsRating(false);
    }
  }

  if (isLoading) return <LoadingBubbles size="lg" />;
  if (!mentorship) return <div className="flex items-center justify-center px-4 py-20"><p className="text-muted-foreground">Mentorship not found.</p></div>;

  const isStudent = mentorship.studentId === user?.id;
  const otherPerson: { id: string; firstName: string; lastName: string; email?: string } = isStudent ? mentorship.educator : mentorship.student;
  const isEnded = !!mentorship.endedAt;
  const hasRated = !!mentorship.rating;
  const showRating = isEnded && isStudent && !hasRated;

  return (
    <div className="mx-auto flex h-[calc(100dvh-3.5rem)] max-w-6xl flex-col px-4 py-4 sm:px-6">
      <div className="mb-4 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/mentorship")}>
          <ArrowLeft className="size-5" />
        </Button>
        <div>
          <p className="text-sm font-medium text-foreground">{otherPerson.firstName} {otherPerson.lastName}</p>
          <p className="text-xs text-muted-foreground">{isEnded ? "Mentorship ended" : "Active mentorship"}</p>
        </div>
      </div>

      <div className="flex flex-1 gap-6 overflow-hidden">
        <div className="flex flex-1 flex-col rounded-xl border bg-card">
          <div className="flex-1 space-y-3 overflow-y-auto p-4 [&::-webkit-scrollbar]:hidden">
            {messages.length === 0 ? (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                No messages yet. Start the conversation.
              </div>
            ) : (
              messages.map((msg) => {
                const isSender = msg.senderId === user?.id;
                return (
                  <div key={msg.id} className={`flex ${isSender ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[75%] rounded-lg px-4 py-2 text-sm ${
                      isSender ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                    }`}>
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                      <p className={`mt-1 text-right text-[10px] ${isSender ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {!isEnded && (
            <div className="flex items-center gap-2 border-t p-3">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <Button size="icon" onClick={handleSend} disabled={isSending || !newMessage.trim()}>
                <Send className="size-4" />
              </Button>
            </div>
          )}
        </div>

        <div className="hidden w-64 shrink-0 flex-col gap-4 sm:flex">
          <div className="rounded-xl border bg-card p-4">
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                {otherPerson.firstName[0]}{otherPerson.lastName[0]}
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{otherPerson.firstName} {otherPerson.lastName}</p>
                <p className="text-xs text-muted-foreground">{isStudent ? "Educator" : "Student"}</p>
              </div>
            </div>
            {otherPerson.email && (
              <p className="mt-2 text-xs text-muted-foreground">{otherPerson.email}</p>
            )}
          </div>

          {showRating && (
            <div className="rounded-xl border bg-card p-4">
              <p className="text-sm font-medium text-foreground">Rate your experience</p>
              <div className="mt-2 flex gap-1">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                  <button
                    key={star}
                    className="text-lg"
                    onMouseEnter={() => setHoveredStar(star)}
                    onMouseLeave={() => setHoveredStar(0)}
                    onClick={() => handleRate(star)}
                    disabled={isRating}
                  >
                    <Star
                      className={`size-4 ${star <= (hoveredStar || rating || 0) ? "fill-yellow-500 text-yellow-500" : "text-muted-foreground"}`}
                    />
                  </button>
                ))}
              </div>
              {rating && (
                <p className="mt-1 text-xs text-muted-foreground">
                  You rated {rating}/10
                </p>
              )}
            </div>
          )}

          {!isEnded && (
            <Button variant="outline" size="sm" className="w-full text-destructive" onClick={handleEndMentorship}>
              End Mentorship
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
