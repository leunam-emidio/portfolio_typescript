import React, { useState } from "react";
import { Terminal, Lightbulb, Mail, HeartPulse, Activity, Trash2, Cpu, HardDrive } from "lucide-react";
import { ActivityLog, Message } from "../types";
import { updateAvailability } from "../lib/api";

interface AdminOverviewProps {
  stats: {
    totalProjects: number;
    newSkills: number;
    messagesCount: number;
    availability: boolean;
    activities: ActivityLog[];
    cpuLoad: number;
    memUsage: number;
  };
  messages: Message[];
  onToggleAvailability: (val: boolean) => void;
  onForwardToManager: () => void;
}

export default function AdminOverview({
  stats,
  messages,
  onToggleAvailability,
  onForwardToManager,
}: AdminOverviewProps) {
  const [activeToggle, setActiveToggle] = useState(stats.availability);
  const [healthStatus, setHealthStatus] = useState("OPTIMAL");

  const handleToggle = async () => {
    const newVal = !activeToggle;
    setActiveToggle(newVal);
    onToggleAvailability(newVal);
  };

  return (
    <div className="relative min-h-screen pt-24 pb-20 select-none">
      <div className="max-w-(--breakpoint-xl) mx-auto px-6 md:px-margin-desktop space-y-12">
        {/* Welcome Header Section */}
        <header className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="font-display text-4xl font-bold text-on-surface tracking-tight">Welcome back, Admin</h1>
              <p className="font-sans text-base text-on-surface-variant/70 mt-2">
                Your ecosystem is performing within <span className="text-secondary font-semibold font-label-mono text-xs">OPTIMAL</span> parameters.
              </p>
            </div>

            {/* Availability Toggle Box */}
            <div className="flex items-center gap-4 bg-surface-container-low p-4 rounded-xl border border-outline-variant/20 neo-glass">
              <span className="text-[10px] font-label-mono text-tertiary">AVAILABILITY DIRECTIVE</span>
              <div 
                onClick={handleToggle}
                className="relative inline-flex items-center h-7 w-14 rounded-full bg-surface-variant cursor-pointer transition-colors duration-300"
                style={{ backgroundColor: activeToggle ? "#00cbe6" : "#2f3445" }}
              >
                <span 
                  className="inline-block w-5 h-5 transform bg-white rounded-full transition-transform duration-300"
                  style={{ transform: activeToggle ? "translateX(32px)" : "translateX(4px)" }}
                />
              </div>
            </div>
          </div>
        </header>

        {/* Bento Stats Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Box 1: Projects */}
          <div 
            onClick={onForwardToManager}
            className="neo-glass p-8 rounded-2xl group transition-all duration-300 hover:-translate-y-1 cursor-pointer border border-outline-variant/10 relative"
          >
            <div className="flex items-start justify-between mb-8">
              <div className="p-3 bg-primary/10 rounded-xl text-primary group-hover:bg-primary/25 transition-all">
                <Terminal size={24} />
              </div>
              <span className="font-label-mono text-[10px] text-secondary">+2 this week</span>
            </div>
            <h3 className="font-label-mono text-xs text-on-surface-variant/65 uppercase tracking-wider">Total Projects</h3>
            <p className="font-display text-5xl font-extrabold text-on-surface mt-2">{stats.totalProjects}</p>
            <span className="absolute bottom-4 right-4 text-[10px] font-label-mono text-primary group-hover:underline opacity-0 group-hover:opacity-100 transition-opacity">
              Manage / Customize →
            </span>
          </div>

          {/* Box 2: Skills */}
          <div className="neo-glass p-8 rounded-2xl group transition-all duration-300 hover:-translate-y-1 border border-outline-variant/10">
            <div className="flex items-start justify-between mb-8">
              <div className="p-3 bg-secondary/10 rounded-xl text-secondary">
                <Lightbulb size={24} />
              </div>
              <span className="font-label-mono text-[10px] text-secondary">Verified</span>
            </div>
            <h3 className="font-label-mono text-xs text-on-surface-variant/65 uppercase tracking-wider">Mastered Skills</h3>
            <p className="font-display text-5xl font-extrabold text-on-surface mt-2">{stats.newSkills}</p>
          </div>

          {/* Box 3: Messages */}
          <div className="neo-glass p-8 rounded-2xl group transition-all duration-300 hover:-translate-y-1 border border-outline-variant/10 relative">
            <div className="flex items-start justify-between mb-8">
              <div className="p-3 bg-error/10 rounded-xl text-error">
                <Mail size={24} />
              </div>
              <div className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-error opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-error"></span>
              </div>
            </div>
            <h3 className="font-label-mono text-xs text-on-surface-variant/65 uppercase tracking-wider">Contact Messages</h3>
            <p className="font-display text-5xl font-extrabold text-on-surface mt-2">{stats.messagesCount}</p>
            <span className="absolute bottom-4 right-4 text-[10px] font-label-mono text-error">
              Active directory
            </span>
          </div>
        </section>

        {/* Dynamic Activity Feed and Health Statistics Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left panel: Recent Activity (8 columns) */}
          <div className="lg:col-span-8 neo-glass rounded-3xl overflow-hidden flex flex-col border border-outline-variant/10">
            <div className="p-6 border-b border-outline-variant/10 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Activity size={18} className="text-primary" />
                <h2 className="font-display text-lg font-bold text-on-surface">Telemetry Activity Feed</h2>
              </div>
              <span className="font-label-mono text-[10px] text-outline">v2.1.0</span>
            </div>

            <div className="divide-y divide-outline-variant/10 max-h-[400px] overflow-y-auto custom-scrollbar">
              {stats.activities && stats.activities.length > 0 ? (
                stats.activities.map((act) => (
                  <div key={act.id} className="p-5 flex items-center gap-5 hover:bg-surface-bright/5 transition-colors group">
                    <div className="w-10 h-10 rounded-full neo-glass flex items-center justify-center shrink-0 border-primary/20 bg-surface-container-low text-primary">
                      <span className="material-symbols-outlined text-[20px]">{act.icon || "sync"}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-on-surface truncate">{act.title}</p>
                      <p className="text-xs text-on-surface-variant/60 truncate">{act.description}</p>
                    </div>
                    <span className="text-[10px] font-label-mono text-on-surface-variant/40 shrink-0">
                      {act.timestamp}
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-xs text-on-surface-variant font-label-mono">
                  No telemetry logged. Initiating systems...
                </div>
              )}
            </div>
          </div>

          {/* Right panel: System Diagnostics (4 columns) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Health Meter Card */}
            <div className="neo-glass rounded-3xl p-6 space-y-6 border border-outline-variant/10">
              <div className="flex justify-between items-center">
                <h3 className="font-display text-base font-bold text-on-surface flex items-center gap-2">
                  <Cpu size={16} className="text-secondary" />
                  Diag Engine
                </h3>
                <span className="text-[9px] bg-secondary/15 text-secondary px-2.5 py-0.5 rounded font-label-mono">
                  {healthStatus}
                </span>
              </div>

              <div className="space-y-4">
                {/* CPU Gauge */}
                <div className="space-y-2">
                  <div className="flex justify-between text-[11px] font-label-mono">
                    <span className="text-on-surface-variant">CPU LOAD</span>
                    <span className="text-primary">{stats.cpuLoad}%</span>
                  </div>
                  <div className="w-full bg-surface-container-highest rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="bg-primary h-full rounded-full transition-all duration-500" 
                      style={{ width: `${stats.cpuLoad}%` }}
                    />
                  </div>
                </div>

                {/* MEM Gauge */}
                <div className="space-y-2">
                  <div className="flex justify-between text-[11px] font-label-mono">
                    <span className="text-on-surface-variant">MEM OVERHEAD</span>
                    <span className="text-secondary">{stats.memUsage}%</span>
                  </div>
                  <div className="w-full bg-surface-container-highest rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="bg-secondary h-full rounded-full transition-all duration-500" 
                      style={{ width: `${stats.memUsage}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Draft Actions Card */}
            <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-3xl p-6 border border-white/5 relative overflow-hidden group">
              <p className="font-display text-xl text-on-surface leading-snug">
                Configure next Project cover asset?
              </p>
              <button 
                onClick={onForwardToManager}
                className="mt-6 px-5 py-2.5 bg-primary text-on-primary rounded-xl font-label-mono text-xs font-bold hover:shadow-[0_0_20px_rgba(192,193,255,0.4)] transition-all cursor-pointer"
              >
                LAUNCH SYSTEM CONSOLE
              </button>
            </div>
          </div>
        </section>

        {/* Messaging Directory View */}
        {messages && messages.length > 0 && (
          <section className="neo-glass rounded-3xl p-6 border border-outline-variant/10 space-y-6">
            <h3 className="font-display text-lg font-bold text-on-surface flex items-center gap-2">
              <Mail className="text-secondary" size={18} />
              Received Client Messages Payload
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {messages.map((msg) => (
                <div key={msg.id} className="glass-card p-6 rounded-2xl space-y-3 relative border border-outline-variant/15">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-display text-sm font-bold text-white leading-none">{msg.name}</h4>
                      <span className="font-label-mono text-[10px] text-primary mt-1 block">{msg.email}</span>
                    </div>
                    <span className="text-[9px] font-label-mono text-outline">{msg.timestamp}</span>
                  </div>
                  <p className="font-sans text-xs text-on-surface-variant leading-relaxed h-16 overflow-y-auto custom-scrollbar">
                    {msg.message}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
