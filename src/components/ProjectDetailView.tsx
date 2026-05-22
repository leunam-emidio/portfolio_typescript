import React from "react";
import { ArrowLeft, Rocket, Github, CheckCircle, Cpu, Calendar, ShieldCheck, HeartPulse } from "lucide-react";
import { Project } from "../types";

interface ProjectDetailViewProps {
  project: Project;
  onBack: () => void;
}

export default function ProjectDetailView({ project, onBack }: ProjectDetailViewProps) {
  // Safe default challenge statements if they are undefined or flat
  const safeChallenges = project.challenges || [
    "Scale bottlenecks resolved through strategic path rendering pipelines.",
    "Responsive viewport configurations designed leveraging Tailwind CSS themes."
  ];

  return (
    <div className="relative min-h-screen pt-24 pb-20 select-none">
      {/* Hero Header with Background Banner */}
      <section className="relative w-full h-[360px] md:h-[500px] overflow-hidden">
        <div className="absolute inset-0 z-0 hero-mask">
          <img
            className="w-full h-full object-cover grayscale-[0.2] brightness-50"
            alt={project.name}
            src={project.imageUrl}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent"></div>
        </div>

        <div className="relative z-10 w-full h-full max-w-(--breakpoint-xl) mx-auto px-margin-mobile md:px-margin-desktop flex flex-col justify-end pb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-primary mb-6 group w-fit cursor-pointer hover:text-secondary"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span className="font-label-mono text-xs">Return to directory</span>
          </button>
          
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl text-white tracking-tight leading-none text-glow">
              {project.name}
            </h1>
            <div className="px-4 py-1.5 rounded-full bg-secondary/10 border border-secondary/30 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-secondary animate-pulse"></span>
              <span className="font-label-mono text-[10px] text-secondary">Live</span>
            </div>
          </div>

          <p className="font-sans text-base sm:text-lg text-on-surface-variant max-w-2xl mb-6">
            {project.description}
          </p>

          <div className="flex flex-wrap gap-4">
            <a
              href={project.liveUrl || "#"}
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3 bg-primary text-on-primary font-bold rounded-xl shadow-[0_0_15px_rgba(99,102,241,0.4)] hover:shadow-[0_0_25px_rgba(99,102,241,0.6)] transition-all active:scale-95 flex items-center gap-2 text-xs font-label-mono"
            >
              <Rocket size={16} />
              View Live Demo
            </a>
            <a
              href={project.githubUrl || "#"}
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3 glass-panel text-white font-bold rounded-xl border border-white/20 hover:border-white/100 transition-all active:scale-95 flex items-center gap-2 text-xs font-label-mono"
            >
              <Github size={16} />
              GitHub Repo
            </a>
          </div>
        </div>
      </section>

      {/* Details Grid */}
      <section className="max-w-(--breakpoint-xl) mx-auto px-margin-mobile md:px-margin-desktop grid grid-cols-1 lg:grid-cols-12 gap-8 mt-12">
        {/* Left column (Markdown write-up) */}
        <div className="lg:col-span-8 space-y-8">
          <div className="glass-card p-8 rounded-2xl border border-outline-variant/10">
            <h2 className="font-display text-2xl sm:text-3xl text-primary mb-6">The Vision</h2>
            <p className="text-on-surface-variant leading-relaxed mb-8 text-base">
              {project.vision || `Constructed during Nebula-Hackathon as a reliable, secure alternative to standard visualizations. The aim of this tool was to deliver unprecedented modular support while maintaining incredibly responsive browser frame telemetry.`}
            </p>

            <h3 className="font-display text-xl text-secondary mb-4 mt-8">Architecture &amp; Design</h3>
            <p className="text-on-surface-variant leading-relaxed mb-6 text-sm">
              {project.architecture || `Developed using strict ES type checking constraints. The backend interfaces with static db storage streams that process high-volume events instantly, completely separated from visual layout tasks to ensure consistent performance.`}
            </p>

            <div className="space-y-3 mt-6">
              <div className="flex items-start gap-3 text-sm">
                <CheckCircle className="text-secondary shrink-0 mt-0.5" size={16} />
                <span className="text-on-surface/90">Real-time state synchronization across active clients.</span>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <CheckCircle className="text-secondary shrink-0 mt-0.5" size={16} />
                <span className="text-on-surface/90">Responsive and customized shader metrics displays.</span>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <CheckCircle className="text-secondary shrink-0 mt-0.5" size={16} />
                <span className="text-on-surface/90">Integrated logger with automated notification alerts.</span>
              </div>
            </div>
          </div>

          {/* Learnings box */}
          <div className="glass-panel p-8 rounded-2xl border-l-4 border-l-secondary border border-outline-variant/10">
            <div className="flex items-center gap-3 mb-6">
              <span className="p-2 bg-secondary/10 rounded-lg text-secondary">
                <ShieldCheck size={18} />
              </span>
              <h3 className="font-display text-xl text-secondary">Challenges &amp; Learnings</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {safeChallenges.map((challenge, i) => {
                const parts = challenge.split(":");
                const hasLabel = parts.length > 1;
                return (
                  <div key={i} className="space-y-2">
                    <h4 className="font-label-mono text-xs text-white uppercase tracking-wider">
                      {hasLabel ? parts[0] : `Challenge #${i + 1}`}
                    </h4>
                    <p className="text-xs text-on-surface-variant/80 leading-relaxed">
                      {hasLabel ? parts.slice(1).join(":") : challenge}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right column (Metadata sidebar) */}
        <aside className="lg:col-span-4 space-y-6">
          {/* Tech Stack Metadata Card */}
          <div className="glass-card p-6 rounded-2xl">
            <h3 className="font-label-mono text-xs text-primary mb-6 uppercase tracking-widest">Tech Stack Details</h3>
            <div className="flex flex-col gap-3">
              {project.techTags.map((tech, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-surface-container-high border border-outline-variant/20">
                  <div className="flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
                    <span className="text-xs text-on-surface font-medium">{tech}</span>
                  </div>
                  <span className="text-[10px] font-label-mono text-on-surface-variant/50">Core tech</span>
                </div>
              ))}
            </div>
          </div>

          {/* Metrics Bento Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="glass-panel p-4 rounded-xl flex flex-col items-center justify-center text-center">
              <span className="font-display text-lg text-secondary font-bold">{project.uptime || "99.9%"}</span>
              <span className="text-[10px] font-label-mono text-on-surface-variant/60 uppercase">Uptime</span>
            </div>
            <div className="glass-panel p-4 rounded-xl flex flex-col items-center justify-center text-center">
              <span className="font-display text-lg text-secondary font-bold">{project.latency || "15ms"}</span>
              <span className="text-[10px] font-label-mono text-on-surface-variant/60 uppercase">Latency</span>
            </div>
          </div>

          {/* Snapshot Gallery image panel */}
          <div className="glass-card rounded-2xl overflow-hidden group">
            <img
              className="w-full aspect-video object-cover transition-transform duration-700 group-hover:scale-105"
              alt="System visualization interface preview"
              src={project.imageUrl}
            />
            <div className="p-4 bg-surface-container-low/80 backdrop-blur-md border-t border-outline-variant/15">
              <p className="text-[10px] font-label-mono text-primary uppercase">Snapshot: Active Telemetry Workspace</p>
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}
