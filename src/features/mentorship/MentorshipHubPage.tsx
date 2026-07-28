import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Handshake, ChevronRight, Plus, X as XIcon, CheckCircle, Star, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import LoadingBubbles from "@/components/shared/LoadingBubbles";
import useAuth from "@/features/auth/hooks/useAuth";
import * as mentorshipService from "./services/mentorshipService";
import type { EducatorListing, MentorshipApplication, Mentorship } from "./services/mentorshipService";

export default function MentorshipHubPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isEducatorOrAdmin = user?.role === "educator" || user?.role === "admin";
  const [activeTab, setActiveTab] = useState<"hub" | "applications" | "active">("hub");
  const [educators, setEducators] = useState<EducatorListing[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const [showOptIn, setShowOptIn] = useState(false);
  const [topics, setTopics] = useState<string[]>([""]);
  const [bio, setBio] = useState("");
  const [isOptedIn, setIsOptedIn] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [applications, setApplications] = useState<MentorshipApplication[]>([]);
  const [activeMentorships, setActiveMentorships] = useState<Mentorship[]>([]);
  const [rejectionReason, setRejectionReason] = useState("");
  const [rejectingId, setRejectingId] = useState<string | null>(null);

  useEffect(() => {
    mentorshipService.searchEducators(search || undefined)
      .then((results) => {
        setEducators(results);
        if (isEducatorOrAdmin && user) {
          const found = results.find((e) => e.id === user.id);
          setIsOptedIn(!!found);
        }
      })
      .catch(() => setEducators([]))
      .finally(() => setIsLoading(false));
  }, [search]);

  async function handleSearch() {
    setIsLoading(true);
    try {
      const results = await mentorshipService.searchEducators(search || undefined);
      setEducators(results);
    } catch {
      toast.error("Failed to search educators");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleOptIn() {
    const validTopics = topics.filter((t) => t.trim());
    if (validTopics.length === 0) return;
    setIsSaving(true);
    try {
      if (isOptedIn) {
        await mentorshipService.updateProfile({ topics: validTopics, bio: bio || undefined });
        toast.success("Profile updated.");
      } else {
        await mentorshipService.createProfile({ topics: validTopics, bio: bio || undefined });
        setIsOptedIn(true);
        toast.success("You are now listed in the mentorship hub.");
      }
      setShowOptIn(false);
      setTopics([""]);
      setBio("");
    } catch {
      toast.error("Failed to save profile.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleOptOut() {
    if (!confirm("Remove yourself from the mentorship hub?")) return;
    try {
      await mentorshipService.removeProfile();
      setIsOptedIn(false);
      setShowOptIn(false);
      toast.success("Removed from mentorship hub.");
    } catch {
      toast.error("Failed to remove profile.");
    }
  }

  async function loadApplications() {
    try {
      const apps = isEducatorOrAdmin
        ? await mentorshipService.listReceivedApplications()
        : await mentorshipService.listMyApplications();
      setApplications(apps);
    } catch {
      toast.error("Failed to load applications.");
    }
  }

  async function loadActive() {
    try {
      const list = await mentorshipService.listMentorships();
      setActiveMentorships(list);
    } catch {
      toast.error("Failed to load mentorships.");
    }
  }

  function handleTabChange(tab: "hub" | "applications" | "active") {
    setActiveTab(tab);
    if (tab === "applications") loadApplications();
    if (tab === "active") loadActive();
  }

  async function handleAccept(id: string) {
    try {
      await mentorshipService.acceptApplication(id);
      toast.success("Application accepted.");
      loadApplications();
      loadActive();
    } catch (e: unknown) {
      toast.error((e as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Failed to accept.");
    }
  }

  async function handleReject(id: string) {
    try {
      await mentorshipService.rejectApplication(id, rejectionReason || undefined);
      toast.success("Application rejected.");
      setRejectingId(null);
      setRejectionReason("");
      loadApplications();
    } catch {
      toast.error("Failed to reject.");
    }
  }

  async function handleEndMentorship(id: string) {
    if (!confirm("End this mentorship?")) return;
    try {
      await mentorshipService.endMentorship(id);
      toast.success("Mentorship ended.");
      loadActive();
    } catch {
      toast.error("Failed to end mentorship.");
    }
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Mentorship Hub</h1>
        <p className="mt-1 text-muted-foreground">Connect with educators and get guidance</p>
      </div>

      <div className="mb-6 border-b">
        <nav className="flex gap-6">
          <button
            onClick={() => handleTabChange("hub")}
            className={`border-b-2 pb-2 text-sm font-medium ${activeTab === "hub" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
          >
            Browse Educators
          </button>
          <button
            onClick={() => handleTabChange("applications")}
            className={`border-b-2 pb-2 text-sm font-medium ${activeTab === "applications" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
          >
            {isEducatorOrAdmin ? "Received" : "My"} Applications
          </button>
          <button
            onClick={() => handleTabChange("active")}
            className={`border-b-2 pb-2 text-sm font-medium ${activeTab === "active" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
          >
            Active
          </button>
        </nav>
      </div>

      {activeTab === "hub" && (
        <div className="space-y-6">
          {isEducatorOrAdmin && (
            <div className="space-y-3">
              {isOptedIn ? (
                <div className="flex items-center justify-between rounded-lg border border-green-500/30 bg-green-500/5 p-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="size-5 text-green-500" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Mentorship profile active</p>
                      <p className="text-xs text-muted-foreground">Students can find and apply to be mentored by you.</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setShowOptIn(!showOptIn)}>
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm" className="text-destructive" onClick={handleOptOut}>
                      Opt Out
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between rounded-lg border bg-muted/30 p-4">
                  <div>
                    <p className="text-sm font-medium text-foreground">Become a mentor</p>
                    <p className="text-xs text-muted-foreground">Opt in to be discoverable by students seeking mentorship.</p>
                  </div>
                  <Button size="sm" onClick={() => setShowOptIn(true)}>
                    <Plus className="mr-1.5 size-4" /> Opt In
                  </Button>
                </div>
              )}

              {showOptIn && (
                <div className="mt-4 space-y-3 border-t pt-4">
                  <div className="space-y-2">
                    <Label>Topics you can mentor on</Label>
                    {topics.map((t, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <Input
                          value={t}
                          onChange={(e) => {
                            const next = [...topics];
                            next[i] = e.target.value;
                            setTopics(next);
                          }}
                          placeholder={`Topic ${i + 1}`}
                        />
                        {topics.length > 1 && (
                          <Button variant="ghost" size="icon" onClick={() => setTopics(topics.filter((_, j) => j !== i))}>
                            <XIcon className="size-3" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button variant="ghost" size="sm" onClick={() => setTopics([...topics, ""])}>
                      <Plus className="mr-1 size-3" /> Add Topic
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <Label>Bio (optional)</Label>
                    <Textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Tell students about yourself..." />
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleOptIn} disabled={isSaving}>
                      {isSaving ? "Saving..." : "Save"}
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setShowOptIn(false)}>Cancel</Button>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex gap-2">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or topic..."
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <Button onClick={handleSearch} disabled={isLoading}>
              <Search className="size-4" />
            </Button>
          </div>

          {isLoading ? (
            <LoadingBubbles size="md" />
          ) : educators.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Handshake className="size-12 text-muted-foreground" />
              <p className="mt-4 text-muted-foreground">No educators found.</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {educators
                .filter((e) => e.id !== user?.id)
                .map((e) => (
                  <Link
                    key={e.id}
                    to={`/mentorship/educators/${e.id}`}
                    className="group rounded-xl border bg-card p-5 transition-shadow hover:shadow-md"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                        {e.firstName[0]}{e.lastName[0]}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground group-hover:text-primary">
                          {e.firstName} {e.lastName}
                        </p>
                        <p className="text-xs text-muted-foreground">{e.email}</p>
                        {e.rating && e.rating.average !== null && (
                          <p className="mt-0.5 flex items-center gap-1 text-xs">
                            <Star className="size-3 text-yellow-500" />
                            <span className="text-foreground">{e.rating.average}</span>
                            <span className="text-muted-foreground">({e.rating.count})</span>
                          </p>
                        )}
                      </div>
                      <ChevronRight className="size-4 text-muted-foreground" />
                    </div>
                    <div className="mt-3 flex flex-wrap gap-1">
                      {e.mentorshipProfile.topics.slice(0, 3).map((t) => (
                        <span key={t} className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">{t}</span>
                      ))}
                      {e.mentorshipProfile.topics.length > 3 && (
                        <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">+{e.mentorshipProfile.topics.length - 3}</span>
                      )}
                    </div>
                  </Link>
                ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "applications" && (
        <div>
          {applications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Handshake className="size-12 text-muted-foreground" />
              <p className="mt-4 text-muted-foreground">No applications.</p>
            </div>
          ) : (
            <div className="divide-y rounded-xl border bg-card">
              {applications.map((app) => (
                <div key={app.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {isEducatorOrAdmin ? `${app.student?.firstName} ${app.student?.lastName}` : `${app.educator?.firstName} ${app.educator?.lastName}`}
                      </p>
                      {isEducatorOrAdmin && app.student?.email && (
                        <p className="text-xs text-muted-foreground">{app.student.email}</p>
                      )}
                      <p className="mt-1 text-sm text-muted-foreground">{app.message}</p>
                      {app.topic && <p className="text-xs text-muted-foreground">Topic: {app.topic}</p>}
                      <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs ${
                        app.status === "pending" ? "bg-yellow-500/10 text-yellow-600" :
                        app.status === "accepted" ? "bg-green-500/10 text-green-600" :
                        "bg-red-500/10 text-red-600"
                      }`}>
                        {app.status}
                        {app.rejectionReason && ` — ${app.rejectionReason}`}
                      </span>
                    </div>
                    {isEducatorOrAdmin && app.status === "pending" && (
                      <div className="flex gap-2">
                        {rejectingId === app.id ? (
                          <div className="flex items-center gap-1">
                            <input
                              className="w-32 rounded border px-2 py-1 text-xs"
                              placeholder="Reason (optional)"
                              value={rejectionReason}
                              onChange={(e) => setRejectionReason(e.target.value)}
                            />
                            <Button size="sm" variant="destructive" onClick={() => handleReject(app.id)}>
                              Confirm
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => setRejectingId(null)}>
                              Cancel
                            </Button>
                          </div>
                        ) : (
                          <>
                            <Button size="sm" onClick={() => handleAccept(app.id)}>Accept</Button>
                            <Button size="sm" variant="outline" onClick={() => setRejectingId(app.id)}>Reject</Button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "active" && (
        <div>
          {activeMentorships.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Handshake className="size-12 text-muted-foreground" />
              <p className="mt-4 text-muted-foreground">No active mentorships.</p>
            </div>
          ) : (
            <div className="divide-y rounded-xl border bg-card">
              {activeMentorships.map((m) => {
                const otherPerson = m.studentId === user?.id ? m.educator : m.student;
                return (
                  <div key={m.id} className="flex items-center justify-between p-4">
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {otherPerson.firstName} {otherPerson.lastName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {m.studentId === user?.id ? "Educator" : "Student"} • Since {new Date(m.startedAt).toLocaleDateString()}
                      </p>
                      {m.endedAt && (
                        <span className="mt-1 inline-block rounded-full bg-red-500/10 px-2 py-0.5 text-xs text-red-600">
                          Ended
                        </span>
                      )}
                    </div>
                    {!m.endedAt && (
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => navigate(`/mentorship/${m.id}`)}>
                          <MessageSquare className="mr-1 size-3" /> Chat
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleEndMentorship(m.id)}>
                          End
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
