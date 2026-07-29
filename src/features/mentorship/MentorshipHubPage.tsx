import { useNavigate } from "react-router-dom";
import useMentorshipHub from "./hooks/useMentorshipHub";
import SearchBar from "./components/SearchBar";
import OptInBanner from "./components/OptInBanner";
import EducatorList from "./components/EducatorList";
import ApplicationList from "./components/ApplicationList";
import ActiveMentorshipList from "./components/ActiveMentorshipList";

export default function MentorshipHubPage() {
  const navigate = useNavigate();
  const hub = useMentorshipHub();

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-foreground text-2xl font-bold sm:text-3xl">Mentorship Hub</h1>
        <p className="text-muted-foreground mt-1">Connect with educators and get guidance</p>
      </div>

      <div className="mb-6 border-b">
        <nav className="flex gap-6">
          <button
            onClick={() => hub.handleTabChange("hub")}
            className={`border-b-2 pb-2 text-sm font-medium ${hub.activeTab === "hub" ? "border-primary text-primary" : "text-muted-foreground hover:text-foreground border-transparent"}`}
          >
            Browse Educators
          </button>
          <button
            onClick={() => hub.handleTabChange("applications")}
            className={`border-b-2 pb-2 text-sm font-medium ${hub.activeTab === "applications" ? "border-primary text-primary" : "text-muted-foreground hover:text-foreground border-transparent"}`}
          >
            {hub.isEducatorOrAdmin ? "Received" : "My"} Applications
          </button>
          <button
            onClick={() => hub.handleTabChange("active")}
            className={`border-b-2 pb-2 text-sm font-medium ${hub.activeTab === "active" ? "border-primary text-primary" : "text-muted-foreground hover:text-foreground border-transparent"}`}
          >
            Active
          </button>
        </nav>
      </div>

      {hub.activeTab === "hub" && (
        <div className="space-y-6">
          <OptInBanner
            isEducator={hub.isEducatorOrAdmin}
            isOptedIn={hub.isOptedIn}
            isOpen={hub.showOptIn}
            topics={hub.topics}
            bio={hub.bio}
            isSaving={hub.isSaving}
            onToggle={() => hub.setShowOptIn(!hub.showOptIn)}
            onSave={hub.handleOptIn}
            onOptOut={hub.handleOptOut}
            onAddTopic={hub.addTopic}
            onRemoveTopic={hub.removeTopic}
            onTopicChange={hub.updateTopic}
            onBioChange={hub.setBio}
          />

          <SearchBar value={hub.search} onChange={hub.setSearch} isLoading={hub.isLoading} />

          <EducatorList
            educators={hub.educators}
            isLoading={hub.isLoading}
            currentUserId={hub.user?.id}
            hasSearch={hub.search.trim().length > 0}
          />
        </div>
      )}

      {hub.activeTab === "applications" && (
        <ApplicationList
          applications={hub.applications}
          isEducator={hub.isEducatorOrAdmin}
          rejectingId={hub.rejectingId}
          rejectionReason={hub.rejectionReason}
          onAccept={hub.handleAccept}
          onReject={hub.handleReject}
          onShowReject={hub.setRejectingId}
          onCancelReject={() => hub.setRejectingId(null)}
          onRejectionReasonChange={hub.setRejectionReason}
        />
      )}

      {hub.activeTab === "active" && (
        <ActiveMentorshipList
          mentorships={hub.activeMentorships}
          currentUser={hub.user!}
          onChat={(id) => navigate(`/mentorship/${id}`)}
          onEnd={hub.handleEndMentorship}
        />
      )}
    </div>
  );
}
