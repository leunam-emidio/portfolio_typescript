import React, { useEffect, useState } from "react";
import { 
  Project, 
  Message, 
  ActivityLog, 
  DashboardStats 
} from "./types";
import { 
  fetchProjects, 
  fetchDashboard, 
  createProject, 
  updateProject, 
  deleteProject, 
  updateAvailability, 
  fetchMessages 
} from "./lib/api";

import Navigation from "./components/Navigation";
import GrainOverlay from "./components/GrainOverlay";
import PortfolioView from "./components/PortfolioView";
import ProjectDetailView from "./components/ProjectDetailView";
import AdminOverview from "./components/AdminOverview";
import ProjectManager from "./components/ProjectManager";

import { Loader2, RefreshCw, AlertCircle } from "lucide-react";

export default function App() {
  const [activeView, setActiveView] = useState<"portfolio" | "project_detail" | "admin_dashboard" | "project_manager">("portfolio");
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  
  // Dashboard Metrics
  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 0,
    newSkills: 5,
    messagesCount: 0,
    availability: true,
    cpuLoad: 12,
    memUsage: 42
  });
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);

  // Loading & Error States
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const avatarUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuC7WwyTK0-fM6QgSoNl4xxmwq-v6uFn5zBtR4PB-fYBKnunKmYa9OT4ixJmD6WniEIuHxXXFJOuSJZM4uk9EdlI6K1mO_lDZOQYtv81ikD5eb1ebSWBlpwIrz78XBa3k-kYovz5IE2x_e6Mb9EIwr1R-xOL-B2ko_TPbylxCrK_iR3wep3LkRmXJcXiV5BR4O83sGNI55KnL9Vr4K340qFdGeV5LVLXteQqZjtbbUf20qOyoRfguVNgPAX381StJ6sd9-GwfVgSch0";

  // Bootstrap initial values
  const loadAppData = async () => {
    try {
      setErrorMsg("");
      const [projData, dashData, msgData] = await Promise.all([
        fetchProjects(),
        fetchDashboard(),
        fetchMessages()
      ]);

      setProjects(projData);
      setStats({
        totalProjects: dashData.totalProjects,
        newSkills: dashData.newSkills,
        messagesCount: dashData.messagesCount,
        availability: dashData.availability,
        cpuLoad: dashData.cpuLoad,
        memUsage: dashData.memUsage
      });
      setActivities(dashData.activities || []);
      setMessages(msgData);
    } catch (e: any) {
      console.error(e);
      setErrorMsg("Failed to synchronize parameters with full-stack DevCanvas API layer.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAppData();
  }, []);

  // Sync dashboard stats
  const refreshStatsOnly = async () => {
    try {
      const dashData = await fetchDashboard();
      const msgData = await fetchMessages();
      setStats({
        totalProjects: dashData.totalProjects,
        newSkills: dashData.newSkills,
        messagesCount: dashData.messagesCount,
        availability: dashData.availability,
        cpuLoad: dashData.cpuLoad,
        memUsage: dashData.memUsage
      });
      setActivities(dashData.activities || []);
      setMessages(msgData);
    } catch (e) {
      console.error("Dashboard refresh failed", e);
    }
  };

  // CRUD Implementations
  const handleCreateProject = async (payload: Partial<Project>) => {
    try {
      const created = await createProject(payload);
      setProjects((prev) => [...prev, created]);
      await refreshStatsOnly();
    } catch (e) {
      alert("Failed to create project");
    }
  };

  const handleUpdateProject = async (id: string, payload: Partial<Project>) => {
    try {
      const updated = await updateProject(id, payload);
      setProjects((prev) => prev.map((p) => (p.id === id ? updated : p)));
      if (selectedProject?.id === id) {
        setSelectedProject(updated);
      }
      await refreshStatsOnly();
    } catch (e) {
      alert("Failed to synchronize project parameters");
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!window.confirm("Are you certain you want to deregister this project?")) return;
    try {
      await deleteProject(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
      await refreshStatsOnly();
    } catch (e) {
      alert("Failed to delete project");
    }
  };

  const handleToggleAvailability = async (availability: boolean) => {
    try {
      await updateAvailability(availability);
      setStats((prev) => ({ ...prev, availability }));
      await refreshStatsOnly();
    } catch (e) {
      alert("Failed to synchronize availability directives");
    }
  };

  const handleSelectProject = (project: Project) => {
    setSelectedProject(project);
    setActiveView("project_detail");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Navigation callbacks
  const handleViewChange = (view: typeof activeView) => {
    setActiveView(view);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-on-background flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <p className="font-label-mono text-xs uppercase tracking-widest text-outline">Booting DevCanvas Telemetry...</p>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="min-h-screen bg-background text-on-background flex flex-col items-center justify-center p-6 space-y-4 text-center">
        <AlertCircle className="w-12 h-12 text-error animate-pulse" />
        <h2 className="font-display text-2xl font-bold">API Synchronization Fault</h2>
        <p className="font-sans text-sm text-on-surface-variant max-w-md leading-relaxed">{errorMsg}</p>
        <button 
          onClick={loadAppData}
          className="px-6 py-3 bg-primary text-on-primary font-label-mono text-xs font-bold rounded-xl flex items-center gap-2 cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          RETRY PARAMETERS SYNC
        </button>
      </div>
    );
  }

  return (
    <div className="bg-background text-on-background font-sans min-h-screen">
      {/* Global Grain Overlay for Cinematic Atmosphere */}
      <GrainOverlay />

      <Navigation 
        currentView={activeView}
        onViewChange={handleViewChange}
        availability={stats.availability}
        avatarUrl={avatarUrl}
      />

      {/* Main Container Views conditional rendering */}
      <main className="min-h-screen">
        {activeView === "portfolio" && (
          <PortfolioView 
            projects={projects}
            availability={stats.availability}
            avatarUrl={avatarUrl}
            onSelectProject={handleSelectProject}
            onRefreshDashboard={refreshStatsOnly}
          />
        )}

        {activeView === "project_detail" && selectedProject && (
          <ProjectDetailView 
            project={selectedProject}
            onBack={() => handleViewChange("portfolio")}
          />
        )}

        {activeView === "admin_dashboard" && (
          <AdminOverview 
            stats={{
              totalProjects: stats.totalProjects,
              newSkills: stats.newSkills,
              messagesCount: stats.messagesCount,
              availability: stats.availability,
              activities: activities,
              cpuLoad: stats.cpuLoad,
              memUsage: stats.memUsage
            }}
            messages={messages}
            onToggleAvailability={handleToggleAvailability}
            onForwardToManager={() => handleViewChange("project_manager")}
          />
        )}

        {activeView === "project_manager" && (
          <ProjectManager 
            projects={projects}
            onCreateProject={handleCreateProject}
            onUpdateProject={handleUpdateProject}
            onDeleteProject={handleDeleteProject}
          />
        )}
      </main>

      {/* Mobile Sticky Navigation Pill */}
      <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%]">
        <div className="flex justify-around items-center bg-surface-container-low/80 backdrop-blur-2xl border border-outline-variant/30 rounded-full shadow-2xl p-2 h-14">
          <button 
            type="button"
            onClick={() => handleViewChange("portfolio")}
            className={`px-4 py-2 rounded-full font-label-mono text-[10px] uppercase cursor-pointer ${
              activeView === "portfolio" || activeView === "project_detail" ? "bg-secondary/15 text-secondary" : "text-outline"
            }`}
          >
            Home
          </button>
          <button 
            type="button"
            onClick={() => handleViewChange("admin_dashboard")}
            className={`px-4 py-2 rounded-full font-label-mono text-[10px] uppercase cursor-pointer ${
              activeView === "admin_dashboard" ? "bg-secondary/15 text-secondary" : "text-outline"
            }`}
          >
            Diag
          </button>
          <button 
            type="button"
            onClick={() => handleViewChange("project_manager")}
            className={`px-4 py-2 rounded-full font-label-mono text-[10px] uppercase cursor-pointer ${
              activeView === "project_manager" ? "bg-secondary/15 text-secondary" : "text-outline"
            }`}
          >
            Dir
          </button>
        </div>
      </div>
    </div>
  );
}
