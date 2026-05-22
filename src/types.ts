export interface Project {
  id: string;
  name: string;
  slug: string;
  description: string;
  techTags: string[];
  imageUrl: string;
  featured: boolean;
  uptime?: string;
  latency?: string;
  vision?: string;
  architecture?: string;
  challenges?: string[];
  isCustom?: boolean;
  githubUrl?: string;
  liveUrl?: string;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  timestamp: string;
}

export interface ActivityLog {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  icon: string;
  color: string;
}

export interface DashboardStats {
  totalProjects: number;
  newSkills: number;
  messagesCount: number;
  availability: boolean;
  cpuLoad: number;
  memUsage: number;
}
