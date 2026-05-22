import React from "react";
import { Terminal } from "lucide-react";

interface NavigationProps {
  currentView: "portfolio" | "project_detail" | "admin_dashboard" | "project_manager";
  onViewChange: (view: "portfolio" | "project_detail" | "admin_dashboard" | "project_manager") => void;
  availability: boolean;
  avatarUrl: string;
}

export default function Navigation({
  currentView,
  onViewChange,
  availability,
  avatarUrl,
}: NavigationProps) {
  const isAdmin = currentView === "admin_dashboard" || currentView === "project_manager";

  return (
    <header className="fixed top-0 w-full z-50 bg-surface-container/60 dark:bg-surface-container/60 backdrop-blur-xl border-b border-outline-variant/30 shadow-[0_0_15px_rgba(99,102,241,0.1)]">
      <div className="flex items-center justify-between px-margin-mobile md:px-margin-desktop py-4 w-full max-w-(--breakpoint-xl) mx-auto">
        {/* Logo and Mobile Menu toggle */}
        <div className="flex items-center gap-4">
          <span 
            className="font-display text-2xl font-bold text-primary tracking-tight cursor-pointer active:scale-95 transition-transform"
            onClick={() => onViewChange("portfolio")}
          >
            DevCanvas
          </span>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          <button
            onClick={() => onViewChange("portfolio")}
            className={`font-label-mono text-xs py-1 transition-colors duration-300 ${
              currentView === "portfolio"
                ? "text-secondary font-bold border-b-2 border-secondary"
                : "text-on-surface-variant font-medium hover:text-primary"
            }`}
          >
            Portfolio
          </button>
          <button
            onClick={() => onViewChange("admin_dashboard")}
            className={`font-label-mono text-xs py-1 transition-colors duration-300 ${
              currentView === "admin_dashboard"
                ? "text-secondary font-bold border-b-2 border-secondary"
                : "text-on-surface-variant font-medium hover:text-primary"
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => onViewChange("project_manager")}
            className={`font-label-mono text-xs py-1 transition-colors duration-300 ${
              currentView === "project_manager"
                ? "text-secondary font-bold border-b-2 border-secondary"
                : "text-on-surface-variant font-medium hover:text-primary"
            }`}
          >
            Manager
          </button>
          <a
            href="#contact"
            onClick={() => {
              onViewChange("portfolio");
              setTimeout(() => {
                document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
              }, 100);
            }}
            className="font-label-mono text-xs text-on-surface-variant font-medium hover:text-primary py-1"
          >
            Contact
          </a>
        </nav>

        {/* Right Controls: Availability, Avatar and Console command */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full neo-glass">
            <span className={`w-2.5 h-2.5 rounded-full ${availability ? "bg-green-500 animate-pulse" : "bg-gray-500 animate-none"}`}></span>
            <span className="text-[10px] font-label-mono text-on-surface-variant uppercase">
              {availability ? "Available" : "Busy"}
            </span>
          </div>
          
          <div 
            className="w-10 h-10 rounded-full overflow-hidden border border-primary/30 cursor-pointer hover:border-secondary transition-colors"
            onClick={() => onViewChange("admin_dashboard")}
            title="Go to Admin Dashboard"
          >
            <img 
              alt="Admin Profile" 
              className="w-full h-full object-cover" 
              src={avatarUrl}
            />
          </div>

          <button 
            onClick={() => onViewChange(isAdmin ? "portfolio" : "admin_dashboard")}
            className="p-2 text-primary hover:text-secondary hover:scale-110 active:scale-90 transition-all rounded-lg hover:bg-primary/5 cursor-pointer"
            title={isAdmin ? "View Public Portfolio" : "View Admin Suite"}
          >
            <Terminal size={22} />
          </button>
        </div>
      </div>
    </header>
  );
}
