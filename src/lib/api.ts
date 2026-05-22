import { Project, Message, ActivityLog } from "../types";

export interface DashboardResponse {
  totalProjects: number;
  newSkills: number;
  messagesCount: number;
  availability: boolean;
  activities: ActivityLog[];
  cpuLoad: number;
  memUsage: number;
}

export async function fetchProjects(): Promise<Project[]> {
  const res = await fetch("/api/projects");
  if (!res.ok) throw new Error("Failed to load projects");
  return res.json();
}

export async function fetchProject(slugOrId: string): Promise<Project> {
  const res = await fetch(`/api/projects/${slugOrId}`);
  if (!res.ok) throw new Error("Failed to load project details");
  return res.json();
}

export async function createProject(project: Partial<Project>): Promise<Project> {
  const res = await fetch("/api/projects", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(project)
  });
  if (!res.ok) throw new Error("Failed to create project");
  return res.json();
}

export async function updateProject(id: string, project: Partial<Project>): Promise<Project> {
  const res = await fetch(`/api/projects/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(project)
  });
  if (!res.ok) throw new Error("Failed to update project");
  return res.json();
}

export async function deleteProject(id: string): Promise<{ message: string; name: string }> {
  const res = await fetch(`/api/projects/${id}`, {
    method: "DELETE"
  });
  if (!res.ok) throw new Error("Failed to delete project");
  return res.json();
}

export async function fetchDashboard(): Promise<DashboardResponse> {
  const res = await fetch("/api/dashboard");
  if (!res.ok) throw new Error("Failed to fetch dashboard stats");
  return res.json();
}

export async function updateAvailability(availability: boolean): Promise<{ availability: boolean }> {
  const res = await fetch("/api/availability", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ availability })
  });
  if (!res.ok) throw new Error("Failed to update availability");
  return res.json();
}

export async function submitMessage(name: string, email: string, message: string): Promise<Message> {
  const res = await fetch("/api/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, message })
  });
  if (!res.ok) throw new Error("Failed to send message");
  return res.json();
}

export async function fetchMessages(): Promise<Message[]> {
  const res = await fetch("/api/messages");
  if (!res.ok) throw new Error("Failed to fetch messages");
  return res.json();
}
