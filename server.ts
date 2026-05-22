import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { Project, Message, ActivityLog } from "./src/types";

const app = express();
const PORT = 3000;
app.use(express.json());

// Path to data file
const DATA_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "db.json");

// Define Initial Seed Projects
const SEED_PROJECTS: Project[] = [
  {
    id: "project-1",
    name: "Quantum Terminal",
    slug: "quantum-terminal",
    description: "A high-performance IDE built for the next generation of cloud-native development, featuring real-time collaborative engines and AI-driven telemetry.",
    techTags: ["React 18", "Node.js", "PostgreSQL", "WebAssembly"],
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDrmuj77N6m-IxGFA16WN4yJQoLHxWjtQ64OrIdk-sI_LPG2qaPZIv3GgmvBjVMApanmR0Y82StwnhnbseVJAIS6Vjhr2J6lH5sLmxRA4nj8Xse0n20vK8ejggpPyr0Yqa8ZkDWwtjPKNMUU_zcBXc8aHBPN5-eNltdOS3X6lee1EgwQhFAItPORI2b8puKkysuhQfCMVxz5UatSDS6LF1pIZIpshAMF29JhEURcXYIMCmfzhv_-Vhj0tL3gBJ78EsiaREWAcf0CVQ",
    featured: true,
    uptime: "99.9%",
    latency: "15ms",
    vision: "Quantum Terminal was conceived during the 2023 Neo-Hackathon as an answer to the growing complexity of distributed systems management. We wanted to build a tool that didn't just display logs, but visualised the entire health of a cluster in real-time using WebGL and advanced spatial layouts.",
    architecture: "The core engine is powered by a custom Rust-based WebAssembly module that handles heavy data processing without blocking the UI thread. This ensures that even with thousands of concurrent data points, the interface remains at a buttery-smooth 60fps.",
    challenges: [
      "The WebGL Bottleneck: Initial renders struggled with over 10k nodes. Implementing an octree-based spatial partitioning system reduced draw calls by 75%.",
      "State Management: Switching from global stores to atomic state updates prevented unnecessary re-renders in the complex dashboard view."
    ],
    githubUrl: "https://github.com/developer/quantum-terminal",
    liveUrl: "https://quantum-terminal.devcanvas.io"
  },
  {
    id: "project-2",
    name: "Neo-Terminal Engine",
    slug: "neo-terminal",
    description: "A high-performance interactive interface for command executions and system logs visualization with customized themes.",
    techTags: ["Rust", "WebAssembly"],
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBrFr7OCP0hzqg0mgUzWmbQzMBNr0RAcYh0VpC5rwF_qd0Sp979jQQP0yMcipCxB55AvKtjlVxuHfl13i6Vgs4lAHBUQe65ATpi9MjDIgr34yqACoj7bMkBt_F3IsV--Pf3ZHqOpubg3TTU0PE0V_IsFVSoMIWkevmcUzf-e_hRZ8hcZQm6rKyVbWniC_lJ-pmswcIMmgmsIS4Rc-_HPJ1fT1J0WVUb2AXN24UZPy7XHakAma76Cjpm-SRvd5CGGdzREF1Lv5YcKSg",
    featured: true,
    uptime: "99.8%",
    latency: "10ms",
    vision: "To make command line terminal visualizations accessible in any responsive web application.",
    architecture: "WebAssembly compiled output paired with a pure-HTML5 canvas rendering tier for 120 FPS frame latency.",
    challenges: [
      "Cross-platform support constraint solved by responsive modular UI buffers.",
      "Vite HMR support bypassed for runtime stability."
    ],
    githubUrl: "https://github.com/developer/neo-terminal-engine",
    liveUrl: "https://neo-terminal.devcanvas.io"
  },
  {
    id: "project-3",
    name: "Cloud Mesh V2",
    slug: "cloud-mesh",
    description: "A detailed digital artwork representing network architecture with glowing fiber optic lines in shades of teal and indigo.",
    techTags: ["Go", "Kubernetes"],
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDf6CGQ7K7GIi3N1sl9GODZhRqaOiuUo9sVDphvC2u7o-gZyh4vShRligie8fH4ZUyRyh0JVPEwWzP-h-svOIwcl4kB6ZIzbbOAw9kBcA_2Yzm_S7qmnQACq5E2SBYRsh2paX6fLlEab6GPJYAppRSfh-yXmwDVg5uHVeZn3mdYWtVrKYBy6Hf808V-AW_Tgd_VH_eEnmELeIRkCTuWbv77rG84-bVyMAOWm-ytwXXo9McioOs88c4WkO-1qbsyJ1h4ujCys3yLAPI",
    featured: false,
    uptime: "99.95%",
    latency: "22ms",
    vision: "To provide microsecond-accurate pathing and mesh architecture monitoring for large Kubernetes environments.",
    architecture: "A highly resilient Go-based daemon tracking cluster health coupled with static reactive visual structures.",
    challenges: [
      "Scaling tracking structures solved using custom ring-buffer streaming pipelines.",
      "Authentication layers engineered on top of dynamic OAuth routines."
    ],
    githubUrl: "https://github.com/developer/cloud-mesh-v2",
    liveUrl: "https://cloudmesh.devcanvas.io"
  },
  {
    id: "project-4",
    name: "Data Streamer Pro",
    slug: "data-streamer",
    description: "An abstract visualization of data stream processing with vibrant particles floating in deep navy space for intelligent flow telemetry.",
    techTags: ["Python", "TensorFlow"],
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDYSaAKdifZX9PZam-OZdIFqWpTnYgErH9koXr18hE71T0KLkbHej-TfxdQWmaJviF-aHp0STTmCKwbrSE3iD2wuS9uqFgV9p_OwlictJc9Us5PfazjEeH1scp1ADHYr8TLTMwZBfUSUfTwpkKP09AdQ4Wzjr1dvtEvwXNKhZNnaKZVVvTEkON7BTJqD8rpmB9y1lfROSYrnAspCTf4sg8dJGuy4S6L0SvyS-uifhIZZ7Bwn81C-GxvE17g33pjE6X5CP0vOpALOaI",
    featured: true,
    uptime: "99.7%",
    latency: "35ms",
    vision: "Making AI decision pipeline explanations and visualizations real-time and understandable using abstract physics modeling.",
    architecture: "A Python API orchestrating data streams feeding lightweight WebGL particle simulations in the browser.",
    challenges: [
      "Vast amounts of data streams resolved using sliding-window calculations.",
      "Optimizing rendering performance with GPU vertex calculations rather than standard DOM trees."
    ],
    githubUrl: "https://github.com/developer/data-streamer-pro",
    liveUrl: "https://streamer.devcanvas.io"
  }
];

const SEED_ACTIVITIES: ActivityLog[] = [
  {
    id: "act-1",
    title: "Project X updated",
    description: "Deployment to production successful via CI/CD pipeline",
    timestamp: "2M AGO",
    icon: "architecture",
    color: "primary"
  },
  {
    id: "act-2",
    title: "New message from Sarah",
    description: "\"Really impressed with the Neo-Glass components...\"",
    timestamp: "1H AGO",
    icon: "person_add",
    color: "secondary"
  },
  {
    id: "act-3",
    title: "Skills Lab Audit",
    description: "Rust performance optimization module completed",
    timestamp: "4H AGO",
    icon: "bolt",
    color: "tertiary"
  }
];

const SEED_MESSAGES: Message[] = [
  {
    id: "msg-1",
    name: "Sarah Jenkins",
    email: "sarah@innovate.design",
    message: "Really impressed with the Neo-Glass components and interactive layouts. Let's schedule a call to talk about a design system contract!",
    timestamp: "1 hour ago"
  },
  {
    id: "msg-2",
    name: "Marcus Aurelius",
    email: "marcus@rome.net",
    message: "Stellar work. The division between deep logical architectures and front-end aesthetic details is rare to see.",
    timestamp: "Yesterday"
  }
];

interface DatabaseSchema {
  projects: Project[];
  messages: Message[];
  activities: ActivityLog[];
  availability: boolean;
  newSkillsCount: number;
}

// Ensure database file exists with seed data
function initDatabase() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DB_PATH)) {
    const defaultDb: DatabaseSchema = {
      projects: SEED_PROJECTS,
      messages: SEED_MESSAGES,
      activities: SEED_ACTIVITIES,
      availability: true,
      newSkillsCount: 5,
    };
    fs.writeFileSync(DB_PATH, JSON.stringify(defaultDb, null, 2), "utf-8");
  }
}

// Helper to read database
function getDb(): DatabaseSchema {
  initDatabase();
  try {
    const raw = fs.readFileSync(DB_PATH, "utf-8");
    return JSON.parse(raw);
  } catch (e) {
    // Fail-safe default
    return {
      projects: SEED_PROJECTS,
      messages: SEED_MESSAGES,
      activities: SEED_ACTIVITIES,
      availability: true,
      newSkillsCount: 5,
    };
  }
}

// Helper to write database
function saveDb(data: DatabaseSchema) {
  initDatabase();
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
}

// Start API handlers
// GET ALL PROJECTS
app.get("/api/projects", (req, res) => {
  const db = getDb();
  res.json(db.projects);
});

// GET PROJECT BY SLUG OR ID
app.get("/api/projects/:param", (req, res) => {
  const { param } = req.params;
  const db = getDb();
  const project = db.projects.find((p) => p.slug === param || p.id === param);
  if (project) {
    res.json(project);
  } else {
    res.status(404).json({ error: "Project not found" });
  }
});

// CREATE NEW PROJECT
app.post("/api/projects", (req, res) => {
  const db = getDb();
  const newProject: Project = {
    ...req.body,
    id: "project_" + Date.now(),
    featured: req.body.featured ?? false,
    uptime: req.body.uptime || "99.9%",
    latency: req.body.latency || "15ms",
    isCustom: true
  };

  // Auto fallback image
  if (!newProject.imageUrl) {
    newProject.imageUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuBrFr7OCP0hzqg0mgUzWmbQzMBNr0RAcYh0VpC5rwF_qd0Sp979jQQP0yMcipCxB55AvKtjlVxuHfl13i6Vgs4lAHBUQe65ATpi9MjDIgr34yqACoj7bMkBt_F3IsV--Pf3ZHqOpubg3TTU0PE0V_IsFVSoMIWkevmcUzf-e_hRZ8hcZQm6rKyVbWniC_lJ-pmswcIMmgmsIS4Rc-_HPJ1fT1J0WVUb2AXN24UZPy7XHakAma76Cjpm-SRvd5CGGdzREF1Lv5YcKSg";
  }

  db.projects.push(newProject);

  // Add activity log
  const newAction: ActivityLog = {
    id: "act_" + Date.now(),
    title: `Project Registered: ${newProject.name}`,
    description: `Added "${newProject.name}" to DevCanvas directory.`,
    timestamp: "JUST NOW",
    icon: "add_box",
    color: "primary"
  };
  db.activities.unshift(newAction);

  saveDb(db);
  res.status(201).json(newProject);
});

// UPDATE PROJECT
app.put("/api/projects/:id", (req, res) => {
  const { id } = req.params;
  const db = getDb();
  const index = db.projects.findIndex((p) => p.id === id);

  if (index !== -1) {
    db.projects[index] = {
      ...db.projects[index],
      ...req.body,
      id // Ensure index ID doesn't morph
    };

    // Add activity log
    const newAction: ActivityLog = {
      id: "act_" + Date.now(),
      title: `${db.projects[index].name} Updated`,
      description: `Project parameters synchronized successfully.`,
      timestamp: "JUST NOW",
      icon: "published_with_changes",
      color: "secondary"
    };
    db.activities.unshift(newAction);

    saveDb(db);
    res.json(db.projects[index]);
  } else {
    res.status(404).json({ error: "Project not found" });
  }
});

// DELETE PROJECT
app.delete("/api/projects/:id", (req, res) => {
  const { id } = req.params;
  const db = getDb();
  const index = db.projects.findIndex((p) => p.id === id);

  if (index !== -1) {
    const deletedName = db.projects[index].name;
    db.projects.splice(index, 1);

    // Add activity log
    const newAction: ActivityLog = {
      id: "act_" + Date.now(),
      title: `${deletedName} Removed`,
      description: `Project deregistred from control directory.`,
      timestamp: "JUST NOW",
      icon: "delete",
      color: "error"
    };
    db.activities.unshift(newAction);

    saveDb(db);
    res.json({ message: "Successfully deleted project", name: deletedName });
  } else {
    res.status(404).json({ error: "Project not found" });
  }
});

// GET DASHBOARD STATS
app.get("/api/dashboard", (req, res) => {
  const db = getDb();
  res.json({
    totalProjects: db.projects.length,
    newSkills: db.newSkillsCount,
    messagesCount: db.messages.length,
    availability: db.availability,
    activities: db.activities,
    cpuLoad: 12 + Math.floor(Math.random() * 6), // simulated
    memUsage: 42
  });
});

// POST UPDATE AVAILABILITY
app.post("/api/availability", (req, res) => {
  const { availability } = req.body;
  if (typeof availability !== "boolean") {
    res.status(400).json({ error: "availability must be a boolean" });
    return;
  }
  const db = getDb();
  db.availability = availability;

  // Add activity log
  const newAction: ActivityLog = {
    id: "act_" + Date.now(),
    title: `Availability Changed`,
    description: `Status updated to ${availability ? "Online & Available" : "Offline / Open to Select Roles"}.`,
    timestamp: "JUST NOW",
    icon: "swap_horiz",
    color: "tertiary"
  };
  db.activities.unshift(newAction);

  saveDb(db);
  res.json({ availability });
});

// GET RECEIVED MESSAGES
app.get("/api/messages", (req, res) => {
  const db = getDb();
  res.json(db.messages);
});

// SUBMIT NEW MESSAGE (Contact form)
app.post("/api/messages", (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    res.status(400).json({ error: "Required fields missing" });
    return;
  }
  const db = getDb();
  const newMessage: Message = {
    id: "msg_" + Date.now(),
    name,
    email,
    message,
    timestamp: "Just Now"
  };
  db.messages.unshift(newMessage);

  // Add to activity log for Admin overview
  const newAction: ActivityLog = {
    id: "act_" + Date.now(),
    title: `New message from ${name}`,
    description: `"${message.substring(0, 40)}${message.length > 40 ? "..." : ""}"`,
    timestamp: "JUST NOW",
    icon: "mail",
    color: "secondary"
  };
  db.activities.unshift(newAction);

  saveDb(db);
  res.status(201).json(newMessage);
});

// Integrate Vite setup for full-stack compatibility
async function startServer() {
  initDatabase();

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[DevCanvas] Full-Stack server booted at status: http://0.0.0.0:${PORT}`);
  });
}

startServer();
