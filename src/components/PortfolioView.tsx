import React, { useState } from "react";
import { Link, Code, Users, Mail, MapPin, CheckCircle, ExternalLink, Github, Sparkles } from "lucide-react";
import { Project } from "../types";
import { submitMessage } from "../lib/api";

interface PortfolioViewProps {
  projects: Project[];
  availability: boolean;
  avatarUrl: string;
  onSelectProject: (project: Project) => void;
  onRefreshDashboard: () => void;
}

export default function PortfolioView({
  projects,
  availability,
  avatarUrl,
  onSelectProject,
  onRefreshDashboard,
}: PortfolioViewProps) {
  const [filter, setFilter] = useState<"ALL" | "FRONTEND" | "BACKEND">("ALL");
  
  // Contact state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const featuredProjects = projects.filter((p) => p.featured);
  const regularProjects = projects.filter((p) => !p.featured);

  // Skill definitions
  const skills = [
    { name: "React", level: "Expert", category: "FRONTEND", icon: "code" },
    { name: "Rust", level: "Advanced", category: "BACKEND", icon: "cpu" },
    { name: "Tailwind", level: "Expert", category: "FRONTEND", icon: "brush" },
    { name: "Next.js", level: "Expert", category: "FRONTEND", icon: "cloud" },
    { name: "Node.js", level: "Expert", category: "BACKEND", icon: "server" },
    { name: "PostgreSQL", level: "Advanced", category: "BACKEND", icon: "database" },
  ];

  const filteredSkills = skills.filter(
    (s) => filter === "ALL" || s.category === filter
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      setErrorMsg("All parameters are required.");
      return;
    }
    setErrorMsg("");
    setIsSubmitting(true);
    try {
      await submitMessage(name, email, message);
      setSuccess(true);
      setName("");
      setEmail("");
      setMessage("");
      // Refresh dashboard counters on backend
      onRefreshDashboard();
      setTimeout(() => setSuccess(false), 5000);
    } catch (e: any) {
      setErrorMsg("Failed to relay message. Try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen">
      {/* Decorative ambient background glows */}
      <div className="ambient-glow -top-20 -left-20"></div>
      <div className="ambient-glow bottom-40 right-10" style={{ background: "radial-gradient(circle, rgba(93, 230, 255, 0.1) 0%, transparent 70%)" }}></div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col justify-center items-center px-margin-mobile pt-32 pb-20 select-none overflow-hidden" id="home">
        <div className="text-center z-10 max-w-4xl mx-auto">
          {/* Availability Badge */}
          <div className="inline-flex items-center gap-2 bg-secondary/10 border border-secondary/20 rounded-full px-4 py-1.5 mb-8 animate-pulse">
            <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
            <span className="font-label-mono text-[10px] text-secondary uppercase tracking-wider">
              {availability ? "Open to Select Contracts" : "Engaged / Selective Consulting"}
            </span>
          </div>

          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-extrabold text-on-background mb-6 leading-none tracking-tight">
            Full-Stack Developer <br />
            <span className="text-primary text-glow">&amp; Creative Coder</span>
          </h1>

          <p className="max-w-2xl mx-auto font-sans text-base sm:text-lg md:text-xl text-on-surface-variant mb-10 leading-relaxed">
            Crafting high-performance digital experiences where technical precision meets editorial aesthetics. Specialized in Neo-Glassmorphism and Scalable Node Architectures.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
            <a
              href="#projects"
              className="w-full sm:w-auto bg-primary text-on-primary font-label-mono text-xs px-8 py-4 rounded-lg shadow-[0_0_20px_rgba(192,193,255,0.3)] hover:shadow-[0_0_30px_rgba(192,193,255,0.5)] transition-all duration-300 active:scale-95 text-center"
            >
              VIEW FEATURED WORKS
            </a>
            <div className="flex items-center gap-3">
              <a href="https://github.com" target="_blank" rel="noreferrer" className="w-12 h-12 glass-card rounded-full flex items-center justify-center text-on-surface-variant hover:text-secondary hover:scale-105 transition-all">
                <Github size={20} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="w-12 h-12 glass-card rounded-full flex items-center justify-center text-on-surface-variant hover:text-secondary hover:scale-105 transition-all">
                <ExternalLink size={20} />
              </a>
              <a href="#contact" className="w-12 h-12 glass-card rounded-full flex items-center justify-center text-on-surface-variant hover:text-secondary hover:scale-105 transition-all">
                <Mail size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Hero Decorative scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-55 animate-bounce">
          <span className="font-label-mono text-[10px] uppercase tracking-widest text-outline">Scroll to explore</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-primary to-transparent"></div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 px-margin-mobile md:px-margin-desktop bg-surface-container-lowest/40 border-y border-outline-variant/10">
        <div className="max-w-(--breakpoint-xl) mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 relative">
            <div className="aspect-square rounded-2xl glass-card p-2 overflow-hidden">
              <img
                alt="Coding workspace"
                className="w-full h-full object-cover rounded-xl grayscale hover:grayscale-0 transition-all duration-700"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAk-oyjucLTNHBnhnQ2omiYRPhHVsAn5D7jpVjebvFXDNVCqZnIIQCaEVb_BRFGuhdIbmW-7WSMWs3E9GGtRYB4ypPvA4vXLvppaRw1YLpN76HHx9RliiTM7AE-B9qJqMbNx_4hOXG6OqrT6FKG_nTVsw6DE3Zh7NLMFfZRx9J9MUWXcq1Hcxf9EGpLxBboOtdiwbU89k41rL9kQL5PkvGPsIsmzLK1JApv7DxOras1GXcrzEeQFbPRwUtacDJYTLxSSyKEEvM125g"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 glass-card p-6 rounded-xl hidden md:block border border-secondary/20">
              <div className="text-secondary font-display text-4xl font-bold mb-1">8+</div>
              <div className="font-label-mono text-[10px] text-on-surface-variant leading-tight">
                YEARS OF <br />EXPERIENCE
              </div>
            </div>
          </div>
          <div className="lg:col-span-7 lg:pl-8">
            <span className="font-label-mono text-xs uppercase tracking-widest text-secondary mb-2 block">Vision Alignment</span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-primary mb-6">Engineering Art <br />Through Logic</h2>
            <p className="font-sans text-base sm:text-lg text-on-surface-variant/90 leading-relaxed mb-6">
              I believe that software should be as beautiful as it is functional. My journey started in traditional backend engineering, but my passion for aesthetics led me to bridge the gap between heavy-duty systems and user-centric frontend rendering using modern declarative architectures. We structure data strictly and design fluidly.
            </p>
            <div className="grid grid-cols-3 gap-4 mt-8">
              <div className="p-4 rounded-xl border border-outline-variant/10 bg-surface-container-low">
                <div className="text-primary font-display text-2xl sm:text-3xl font-bold mb-1">120+</div>
                <div className="font-label-mono text-[10px] opacity-65 text-on-surface-variant">PROJECTS DONE</div>
              </div>
              <div className="p-4 rounded-xl border border-outline-variant/10 bg-surface-container-low">
                <div className="text-secondary font-display text-2xl sm:text-3xl font-bold mb-1">45k</div>
                <div className="font-label-mono text-[10px] opacity-65 text-on-surface-variant">GITHUB STARS</div>
              </div>
              <div className="p-4 rounded-xl border border-outline-variant/10 bg-surface-container-low">
                <div className="text-on-surface font-display text-2xl sm:text-3xl font-bold mb-1">15+</div>
                <div className="font-label-mono text-[10px] opacity-65 text-on-surface-variant">GLOBAL AWARDS</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-24 px-margin-mobile md:px-margin-desktop">
        <div className="max-w-(--breakpoint-xl) mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <span className="font-label-mono text-xs text-secondary uppercase tracking-widest block mb-2">Capabilities</span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-on-background">The Control Stack</h2>
            </div>
            <div className="flex gap-1 glass-card p-1 rounded-full border border-outline-variant/20">
              {(["ALL", "FRONTEND", "BACKEND"] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-5 py-2 rounded-full font-label-mono text-[10px] transition-all cursor-pointer ${
                    filter === cat ? "bg-primary text-on-primary" : "text-on-surface-variant hover:bg-surface-bright/20"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {filteredSkills.map((s, idx) => (
              <div key={idx} className="glass-card p-6 rounded-2xl group hover:border-primary/50 transition-all duration-300">
                <div className="w-12 h-12 mb-4 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <Sparkles size={18} />
                </div>
                <div className="font-display text-lg font-bold mb-1 text-on-surface">{s.name}</div>
                <div className="font-label-mono text-[10px] text-secondary">{s.level}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Bento Grid */}
      <section className="py-24 px-margin-mobile md:px-margin-desktop bg-surface-container-low/40 border-t border-outline-variant/10" id="projects">
        <div className="max-w-(--breakpoint-xl) mx-auto">
          <div className="text-center mb-16">
            <span className="font-label-mono text-xs uppercase tracking-widest text-secondary">Aesthetic Portfolios</span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-on-background mt-2">Featured Engineering Systems</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Big Bento Left Box - Dynamic Rendering First Project */}
            {featuredProjects.length > 0 && (
              <div 
                className="md:col-span-2 md:row-span-2 glass-card rounded-3xl group cursor-pointer hover:border-primary/30"
                onClick={() => onSelectProject(featuredProjects[0])}
              >
                <div className="h-[280px] sm:h-[400px] w-full overflow-hidden relative">
                  <img
                    alt={featuredProjects[0].name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-90"
                    src={featuredProjects[0].imageUrl}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-60"></div>
                </div>
                <div className="p-8">
                  <div className="flex justify-between items-start mb-4 gap-4">
                    <div>
                      <span className="font-label-mono text-[10px] text-secondary uppercase tracking-widest mb-2 block">
                        SYSTEM ARCHITECTURE • ACTIVE
                      </span>
                      <h3 className="font-display text-2xl sm:text-3xl font-bold text-on-background">{featuredProjects[0].name}</h3>
                    </div>
                    <span className="bg-primary/20 text-primary px-4 py-1 rounded-full font-label-mono text-[10px] border border-primary/30">
                      FEATURED
                    </span>
                  </div>
                  <p className="font-sans text-sm sm:text-base text-on-surface-variant leading-relaxed max-w-xl mb-6 truncate-2-lines">
                    {featuredProjects[0].description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {featuredProjects[0].techTags.map((t, i) => (
                      <span key={i} className="px-3 py-1 bg-surface-container rounded-md font-label-mono text-[9px] uppercase border border-outline-variant/10">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Other grid boxes */}
            {projects.slice(1, 3).map((p) => (
              <div 
                key={p.id} 
                className="glass-card rounded-3xl group cursor-pointer hover:border-secondary/30"
                onClick={() => onSelectProject(p)}
              >
                <div className="h-56 sm:h-64 w-full overflow-hidden relative">
                  <img
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 brightness-95"
                    src={p.imageUrl}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-40"></div>
                </div>
                <div className="p-6">
                  <h3 className="font-display text-xl font-bold mb-2 text-on-background group-hover:text-secondary transition-colors">{p.name}</h3>
                  <p className="font-sans text-xs text-on-surface-variant/80 mb-4 line-clamp-2 h-10 overflow-hidden">
                    {p.description}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {p.techTags.slice(0, 2).map((t, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-surface-container rounded font-label-mono text-[9px] uppercase border border-outline-variant/10">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Remaining General Projects Section */}
          {projects.length > 3 && (
            <div className="mt-16">
              <h3 className="font-display text-lg font-bold text-primary mb-6">Additional Microservices Directory</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.slice(3).map((p) => (
                  <div 
                    key={p.id}
                    className="glass-card p-6 rounded-2xl cursor-pointer hover:border-secondary/25 transition-all"
                    onClick={() => onSelectProject(p)}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="font-display text-base font-bold text-on-background">{p.name}</h4>
                      <span className="text-[10px] font-label-mono text-outline">{p.uptime || "99.9% uptime"}</span>
                    </div>
                    <p className="text-xs text-on-surface-variant line-clamp-2 mb-4 h-8 overflow-hidden">{p.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {p.techTags.map((t, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-surface-container rounded text-[9px] font-label-mono opacity-80 uppercase">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Experience / Career Journey Section */}
      <section className="py-24 px-margin-mobile md:px-margin-desktop bg-background" id="experience">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <span className="font-label-mono text-xs uppercase tracking-widest text-secondary">Log Iteration</span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-on-background">Career Control Path</h2>
          </div>

          <div className="relative border-l border-outline-variant/30 ml-4 md:ml-0">
            {/* Timeline Item 1 */}
            <div className="mb-12 ml-10 relative">
              <div className="absolute -left-[51px] top-1 w-5 h-5 rounded-full border-4 border-background bg-primary shadow-[0_0_10px_rgba(192,193,255,1)]"></div>
              <span className="font-label-mono text-xs text-secondary mb-1 block">2022 - PRESENT</span>
              <h3 className="font-display text-xl font-bold text-on-surface">Lead Creative Developer</h3>
              <p className="font-label-mono text-xs text-primary mb-3">Nebula Studio Suite</p>
              <p className="font-sans text-sm text-on-surface-variant/90 leading-relaxed">
                Leading a team of 12 designers and full-stack creators. Architecting robust low-latency control dashboards, telemetry visualization utilities, and bespoke microservice directory layouts.
              </p>
            </div>

            {/* Timeline Item 2 */}
            <div className="mb-12 ml-10 relative">
              <div className="absolute -left-[51px] top-1 w-5 h-5 rounded-full border-4 border-background bg-secondary/50"></div>
              <span className="font-label-mono text-xs text-on-surface-variant/70 mb-1 block">2020 - 2022</span>
              <h3 className="font-display text-xl font-bold text-on-surface">Senior Software Engineer</h3>
              <p className="font-label-mono text-xs text-primary mb-3">Synth Labs Core UI</p>
              <p className="font-sans text-sm text-on-surface-variant/90 leading-relaxed">
                Specialized in performance metrics optimization, WebGL interface rendering, and global design systems. Streamlined client bundle files, minimizing latency overhead by 40% across core servers.
              </p>
            </div>

            {/* Timeline Item 3 */}
            <div className="mb-12 ml-10 relative">
              <div className="absolute -left-[51px] top-1 w-5 h-5 rounded-full border-4 border-background bg-secondary/30"></div>
              <span className="font-label-mono text-xs text-on-surface-variant/50 mb-1 block">2018 - 2020</span>
              <h3 className="font-display text-xl font-bold text-on-surface">Full-Stack Developer</h3>
              <p className="font-label-mono text-xs text-primary mb-3">Innova Interactive</p>
              <p className="font-sans text-sm text-on-surface-variant/90 leading-relaxed">
                Designed fully responsive single page applications and Express backend endpoints. Structured file relays and integrated third-party secure OAuth directories.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 px-margin-mobile md:px-margin-desktop bg-surface-container-lowest" id="contact">
        <div className="max-w-(--breakpoint-xl) mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-display text-4xl sm:text-5xl font-extrabold text-on-surface mb-6 leading-tight">
                Let's construct <br />
                <span className="text-secondary text-glow">something extraordinary.</span>
              </h2>
              <p className="font-sans text-base sm:text-lg text-on-surface-variant leading-relaxed mb-10">
                I am currently open for selective engineering projects and technical integrations. If you represent an organization or need a technical architect with an uncompromising sense of detail, initiate a connection:
              </p>
              <div className="flex flex-col gap-5">
                <div className="flex items-center gap-4">
                  <span className="p-3 rounded-xl bg-primary/10 text-primary">
                    <Mail size={18} />
                  </span>
                  <span className="font-label-mono text-sm text-on-surface">hello@devcanvas.io</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="p-3 rounded-xl bg-primary/10 text-primary">
                    <MapPin size={18} />
                  </span>
                  <span className="font-label-mono text-sm text-on-surface">Remote / NYC Interface, US</span>
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="glass-card p-8 rounded-3xl relative border border-outline-variant/30">
              <div className="mb-6">
                <label className="block font-label-mono text-xs text-secondary uppercase mb-2">Your Name</label>
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:border-secondary transition-colors text-sm"
                />
              </div>
              <div className="mb-6">
                <label className="block font-label-mono text-xs text-secondary uppercase mb-2">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:border-secondary transition-colors text-sm"
                />
              </div>
              <div className="mb-6">
                <label className="block font-label-mono text-xs text-secondary uppercase mb-2">Message Payload</label>
                <textarea
                  required
                  placeholder="Your system requirements..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:border-secondary transition-colors text-sm"
                />
              </div>

              {errorMsg && (
                <div className="mb-6 text-xs text-error font-label-mono">{errorMsg}</div>
              )}

              {success && (
                <div className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/30 flex items-center gap-2 text-xs text-green-400 font-label-mono">
                  <CheckCircle size={16} />
                  <span>Message relayed successfully, check activity feed!</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary text-on-primary font-label-mono text-xs font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(192,193,255,0.3)] hover:brightness-110 active:scale-95 transition-all text-center cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? "TRANSMITTING..." : "TRANSMIT MESSAGE"}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="w-full py-20 border-t border-outline-variant/10 bg-background">
        <div className="flex flex-col md:flex-row justify-between items-center px-margin-mobile md:px-margin-desktop w-full max-w-(--breakpoint-xl) mx-auto gap-8">
          <div className="flex flex-col items-center md:items-start gap-2">
            <span className="text-on-surface font-display text-xl font-bold">DevCanvas</span>
            <p className="font-label-mono text-xs text-tertiary/60">© 2026 DevCanvas. Built with Neo-Glassmorphism.</p>
          </div>
          <div className="flex gap-6">
            <a className="font-label-mono text-xs text-tertiary/60 hover:text-secondary underline decoration-secondary/30 transition-all cursor-pointer" href="#">Github</a>
            <a className="font-label-mono text-xs text-tertiary/60 hover:text-secondary underline decoration-secondary/30 transition-all cursor-pointer" href="#">LinkedIn</a>
            <a className="font-label-mono text-xs text-tertiary/60 hover:text-secondary underline decoration-secondary/30 transition-all cursor-pointer" href="#">Twitter</a>
          </div>
          <div className="font-label-mono text-[10px] text-tertiary/40">
            STACK: EXPRESS • REACT • TAILWIND • FILE_DB
          </div>
        </div>
      </footer>
    </div>
  );
}
