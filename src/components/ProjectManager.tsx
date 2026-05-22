import React, { useState } from "react";
import { Plus, Search, HelpCircle, Edit, Trash2, Sliders, Check, FolderDot, AlertTriangle } from "lucide-react";
import { Project } from "../types";

interface ProjectManagerProps {
  projects: Project[];
  onCreateProject: (project: Partial<Project>) => void;
  onUpdateProject: (id: string, project: Partial<Project>) => void;
  onDeleteProject: (id: string) => void;
}

export default function ProjectManager({
  projects,
  onCreateProject,
  onUpdateProject,
  onDeleteProject,
}: ProjectManagerProps) {
  // Filters and lookup state
  const [searchQuery, setSearchQuery] = useState("");
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);

  // Modal properties
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form parameters
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [techTagsStr, setTechTagsStr] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [featured, setFeatured] = useState(false);
  const [vision, setVision] = useState("");
  const [architecture, setArchitecture] = useState("");
  const [challenges, setChallenges] = useState("");

  const handleOpenCreateModal = () => {
    setEditingId(null);
    setName("");
    setSlug("");
    setDescription("");
    setTechTagsStr("");
    setImageUrl("https://lh3.googleusercontent.com/aida-public/AB6AXuBrFr7OCP0hzqg0mgUzWmbQzMBNr0RAcYh0VpC5rwF_qd0Sp979jQQP0yMcipCxB55AvKtjlVxuHfl13i6Vgs4lAHBUQe65ATpi9MjDIgr34yqACoj7bMkBt_F3IsV--Pf3ZHqOpubg3TTU0PE0V_IsFVSoMIWkevmcUzf-e_hRZ8hcZQm6rKyVbWniC_lJ-pmswcIMmgmsIS4Rc-_HPJ1fT1J0WVUb2AXN24UZPy7XHakAma76Cjpm-SRvd5CGGdzREF1Lv5YcKSg");
    setFeatured(false);
    setVision("");
    setArchitecture("");
    setChallenges("");
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (project: Project) => {
    setEditingId(project.id);
    setName(project.name);
    setSlug(project.slug);
    setDescription(project.description);
    setTechTagsStr(project.techTags.join(", "));
    setImageUrl(project.imageUrl);
    setFeatured(project.featured);
    setVision(project.vision || "");
    setArchitecture(project.architecture || "");
    setChallenges(project.challenges ? project.challenges.join("\n") : "");
    setIsModalOpen(true);
  };

  const handleModalSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !slug || !description) return;

    // parse tags
    const techTags = techTagsStr
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    // parse challenges
    const parsedChallenges = challenges
      .split("\n")
      .map((c) => c.trim())
      .filter((c) => c.length > 0);

    const projectPayload: Partial<Project> = {
      name,
      slug: slug.toLowerCase().replace(/\s+/g, '-'),
      description,
      techTags,
      imageUrl,
      featured,
      vision: vision || `To establish a modern interface visualization platform for ${name}.`,
      architecture: architecture || "Constructed using Node module routers paired with Vite declarations.",
      challenges: parsedChallenges.length > 0 ? parsedChallenges : [
        "WebGL optimization bottlenecks: Solved using modular buffers.",
        "Latency constraints: Mitigated via localized state logic."
      ]
    };

    if (editingId) {
      onUpdateProject(editingId, projectPayload);
    } else {
      onCreateProject(projectPayload);
    }
    setIsModalOpen(false);
  };

  const toggleFeatured = (project: Project) => {
    onUpdateProject(project.id, { featured: !project.featured });
  };

  // Filter projects dynamically
  const filteredProjects = projects.filter((p) => {
    const query = searchQuery.toLowerCase();
    const matchesQuery =
      p.name.toLowerCase().includes(query) ||
      p.slug.toLowerCase().includes(query) ||
      p.techTags.some((tag) => tag.toLowerCase().includes(query));
    
    if (showFeaturedOnly) {
      return matchesQuery && p.featured;
    }
    return matchesQuery;
  });

  return (
    <div className="relative min-h-screen pt-24 pb-20 select-none">
      <div className="max-w-(--breakpoint-xl) mx-auto px-margin-mobile md:px-margin-desktop space-y-6">
        
        {/* Search, Filter controls */}
        <div className="glass-panel p-4 rounded-2xl flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-outline w-5 h-5" />
            <input
              type="text"
              className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl py-3 pl-12 pr-4 text-on-surface focus:outline-none focus:border-secondary transition-colors font-sans text-sm"
              placeholder="Search directory by name, tag, or slug..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <button
              onClick={() => setShowFeaturedOnly(!showFeaturedOnly)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl transition-all border font-label-mono text-xs cursor-pointer ${
                showFeaturedOnly 
                  ? "bg-secondary/20 border-secondary text-secondary" 
                  : "glass-card text-on-surface-variant border-outline-variant/20 hover:text-primary"
              }`}
            >
              <Sliders size={16} />
              Featured Filters
            </button>
          </div>
        </div>

        {/* Dynamic Project Manager Row Listing */}
        <div className="space-y-4">
          {filteredProjects.length > 0 ? (
            filteredProjects.map((p) => (
              <div 
                key={p.id}
                className="glass-panel group p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-outline-variant/15 hover:border-secondary/35 transition-all duration-300"
              >
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-surface-container-high border border-outline-variant/20 shrink-0">
                    <img className="w-full h-full object-cover" src={p.imageUrl} alt={p.name} />
                  </div>
                  <div>
                    <h3 className="font-display text-base font-bold text-on-surface leading-tight">{p.name}</h3>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      {p.techTags.map((t, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-secondary/15 text-secondary text-[9px] font-label-mono rounded-full border border-secondary/10">
                          {t}
                        </span>
                      ))}
                      <span className="text-outline font-label-mono text-[9px] ml-2">/{p.slug}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between w-full sm:w-auto gap-6 mt-4 sm:mt-0">
                  {/* Dynamic Featured Trigger Toggle Widget */}
                  <div className="flex flex-col items-end">
                    <span className="font-label-mono text-[9px] text-outline uppercase tracking-wider">FEATURE DIRECTIVE</span>
                    <button
                      onClick={() => toggleFeatured(p)}
                      className="w-12 h-6 rounded-full relative transition-colors duration-300 mt-1.5 focus:outline-none"
                      style={{ backgroundColor: p.featured ? "#00cbe6" : "#2f3445" }}
                    >
                      <div 
                        className="absolute top-1 w-4 h-4 rounded-full bg-white transition-transform duration-300"
                        style={{ transform: p.featured ? "translateX(24px)" : "translateX(4px)" }}
                      />
                    </button>
                  </div>

                  <div className="h-10 w-[1px] bg-outline-variant/20 hidden md:block"></div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleOpenEditModal(p)}
                      className="p-2.5 flex items-center justify-center rounded-xl bg-surface-container-high text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-all border border-outline-variant/10 cursor-pointer"
                      title="Edit parameters"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => onDeleteProject(p.id)}
                      className="p-2.5 flex items-center justify-center rounded-xl bg-surface-container-high text-on-surface-variant hover:text-error hover:bg-error/10 transition-all border border-outline-variant/10 cursor-pointer"
                      title="Deregister project"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="neo-glass p-12 text-center rounded-2xl border border-outline-variant/20">
              <FolderDot className="mx-auto w-10 h-10 text-outline mb-4 animate-bounce" />
              <p className="font-display font-medium text-base text-on-surface">No matching records found</p>
              <p className="text-xs text-on-surface-variant mt-1">Refine filters or construct a new registry below.</p>
            </div>
          )}
        </div>

        {/* Floating Add Project FAB Trigger */}
        <button
          onClick={handleOpenCreateModal}
          className="fixed bottom-10 right-10 w-14 h-14 bg-primary text-on-primary rounded-full shadow-[0_0_25px_rgba(99,102,241,0.5)] hover:scale-110 active:scale-95 transition-all flex items-center justify-center z-40 cursor-pointer"
          title="Create New Project"
        >
          <Plus size={28} />
        </button>

        {/* Creator / Editor Modal Panel Container */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-background/85 backdrop-blur-md" onClick={() => setIsModalOpen(false)}></div>
            <div className="relative w-full max-w-2xl glass-panel rounded-3xl overflow-hidden shadow-2xl border border-primary/25 animate-in fade-in zoom-in-95 duration-200">
              {/* Header */}
              <div className="p-6 border-b border-outline-variant/20 flex justify-between items-center bg-surface-container-low/40">
                <h2 className="font-display text-xl font-bold text-primary">
                  {editingId ? "Update Project Parameters" : "Register New Project"}
                </h2>
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)} 
                  className="text-on-surface-variant hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Form Scroll Body */}
              <form onSubmit={handleModalSave} className="p-6 space-y-5 max-h-[550px] overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block font-label-mono text-[10px] text-secondary uppercase tracking-wider">Project Name</label>
                    <input
                      type="text"
                      className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl py-3 px-4 text-on-surface focus:outline-none focus:border-secondary transition-colors font-sans text-xs"
                      placeholder="e.g. Nexus Core"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (!editingId) {
                          setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'));
                        }
                      }}
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block font-label-mono text-[10px] text-secondary uppercase tracking-wider">Slug Path</label>
                    <input
                      type="text"
                      className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl py-3 px-4 text-on-surface focus:outline-none focus:border-secondary transition-colors font-sans text-xs"
                      placeholder="e.g. nexus-core"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block font-label-mono text-[10px] text-secondary uppercase tracking-wider">Core description</label>
                  <textarea
                    rows={2}
                    className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl py-3 px-4 text-on-surface focus:outline-none focus:border-secondary transition-colors font-sans text-xs"
                    placeholder="Short conceptual summary details..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-label-mono text-[10px] text-secondary uppercase tracking-wider">Tech Tags (comma separated)</label>
                  <input
                    type="text"
                    className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl py-3 px-4 text-on-surface focus:outline-none focus:border-secondary transition-colors font-sans text-xs"
                    placeholder="e.g. React 18, Go, Rust"
                    value={techTagsStr}
                    onChange={(e) => setTechTagsStr(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-label-mono text-[10px] text-secondary uppercase tracking-wider">Cover Image URL</label>
                  <input
                    type="text"
                    className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl py-3 px-4 text-on-surface focus:outline-none focus:border-secondary transition-colors font-sans text-xs"
                    placeholder="Image URL"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                  />
                </div>

                {/* Advanced Fields */}
                <div className="p-4 rounded-xl border border-outline-variant/15 bg-surface-container-low/30 space-y-4">
                  <h4 className="font-display text-xs text-primary font-bold">Supplemental Vision &amp; Challenges Docs</h4>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="block font-label-mono text-[9px] text-on-surface-variant uppercase">Vision Statement</label>
                      <textarea
                        rows={2}
                        className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-xl py-2 px-3 text-on-surface focus:outline-none focus:border-primary transition-colors font-sans text-xs"
                        placeholder="What problem does this project solve?"
                        value={vision}
                        onChange={(e) => setVision(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block font-label-mono text-[9px] text-on-surface-variant uppercase">Challenged Resolves (one per line)</label>
                      <textarea
                        rows={2}
                        className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-xl py-2 px-3 text-on-surface focus:outline-none focus:border-primary transition-colors font-sans text-xs"
                        placeholder="WebGL Bottleneck: optimized octree drawings&#10;Latency constraints: set custom stream sliding window"
                        value={challenges}
                        onChange={(e) => setChallenges(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block font-label-mono text-[9px] text-on-surface-variant uppercase">Technical Architecture Details</label>
                      <textarea
                        rows={2}
                        className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-xl py-2 px-3 text-on-surface focus:outline-none focus:border-primary transition-colors font-sans text-xs"
                        placeholder="e.g. The core engine is structured on top of WebGL canvases..."
                        value={architecture}
                        onChange={(e) => setArchitecture(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Save options */}
                <div className="flex items-center gap-3 py-1">
                  <button
                    type="button"
                    onClick={() => setFeatured(!featured)}
                    className="w-10 h-5 rounded-full relative transition-colors duration-300 focus:outline-none"
                    style={{ backgroundColor: featured ? "#00cbe6" : "#2f3445" }}
                  >
                    <div 
                      className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform duration-300"
                      style={{ transform: featured ? "translateX(20px)" : "translateX(2px)" }}
                    />
                  </button>
                  <span className="font-sans text-xs text-on-surface">Publish as Featured Project System</span>
                </div>

                {/* Footer Buttons */}
                <div className="p-4 border-t border-outline-variant/15 flex gap-4 bg-surface-container-low/20">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-5 py-3 rounded-xl border border-outline-variant/30 font-label-mono text-xs text-on-surface-variant hover:bg-surface-variant/20 transition-all cursor-pointer text-center"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-5 py-3 rounded-xl bg-primary text-on-primary font-bold font-label-mono text-xs shadow-[0_0_15px_rgba(99,102,241,0.3)] hover:scale-[1.01] active:scale-95 transition-all cursor-pointer text-center"
                  >
                    Commit Parameters
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
