import { useState, useRef, useEffect } from "react";
import { X, Maximize2, Minimize2, Terminal as TerminalIcon } from "lucide-react";
import { samayProfile } from "../data/samayProfile";
import { earlierProjects } from "../data/projects";
import { techEcosystem } from "../data/skills";
import { bharatGigData, ricRootData, payEazeData } from "../data/products";
import { playTerminalBeep, playCyberClick } from "../utils/soundEffects";

export default function TerminalDrawer({ isOpen, onClose }) {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([
    { type: "system", text: "SamayOS CLI v3.0 (Product & Systems Environment)" },
    { type: "system", text: "Type 'help' to list commands. Try 'bharatgig', 'ricroot', 'payeaze', or 'about'. Press [~] or click [X] to exit." },
  ]);
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isMatrixMode, setIsMatrixMode] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);

  const terminalEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  if (!isOpen) return null;

  const handleCommand = (cmdStr) => {
    const raw = cmdStr.trim();
    const cmd = raw.toLowerCase();

    if (!raw) return;

    setCommandHistory((prev) => [...prev, raw]);
    setHistoryIndex(-1);

    const newEntries = [{ type: "user", text: `samay@terminal-floor:~$ ${raw}` }];

    switch (cmd) {
      case "help":
        newEntries.push({
          type: "output",
          text: `AVAILABLE COMMANDS:
  help        - List all available terminal commands
  about       - Overview of Samay Bhavsar & operational background
  bharatgig   - Inspect BharatGIG 4-panel gig workforce platform & geo-pricing
  ricroot     - Inspect RicRoot hiring platform (92,250+ candidates & taxonomy)
  payeaze     - Inspect PayEaze multi-tenant statutory compliance HRMS
  projects    - Print all active systems & developer tooling
  skills      - View the 5 grouped technical ecosystems
  contact     - Reveal coordinates & transmission channels
  neofetch    - System telemetry & architecture ASCII
  matrix      - Toggle retro phosphor matrix effect
  date        - Current timestamp in UTC and IST
  clear       - Wipe the terminal buffer
  exit        - Close the CLI drawer`,
        });
        break;

      case "about":
        newEntries.push({
          type: "output",
          text: `SAMAY BHAVSAR // Product Manager + Full Stack Engineer
Role:       ${samayProfile.role}
Company:    ${samayProfile.company}
Product:    ${samayProfile.product}
Location:   ${samayProfile.location}
Philosophy: "Start with the operation. Build for the user that exists. Production behaviour is the real spec."`,
        });
        break;

      case "bharatgig":
        newEntries.push({
          type: "output",
          text: `BHARATGIG // Geographic Gig Workforce Deployment Platform
Organization: Veracity Supply Chain Limited
Role:         Product Manager (Product Flow, Architecture & Engineering)
Architecture: 4 Panels (Admin, Client, Branch Manager, GIG Worker App)
Pricing:      Branch-Wise (distance radius) & Pincode-Wise (inner/outer city zones)
Resolution:   Dual-Tier Independent (Client Billing Tier vs. Worker/Vendor Payout)
Core Engines: Dynamic Form Builder (Feed/Capture/Supervisor), SLA & Penalty Engine, GIG Wallet
Summary:      ${bharatGigData.summary}`,
        });
        break;

      case "ricroot":
        newEntries.push({
          type: "output",
          text: `RICROOT // Blue & Grey-Collar Recruitment Platform
Role:         Product Manager (Product Flow, Architecture & Engineering)
Platforms:    Candidate Mobile Apps & Enterprise Employer Web Portal
Taxonomy:     92,250+ Candidate Records | 212 Job Profiles | 709 Designations | 515 Degrees
Features:     AI Recruiter, Bulk Job Posting, Interview Scheduling, Automated Offer Letters
Compliance:   iOS App Store (Meta Ads SDK & Apple ATT Framework), DPDP Act 2023
Live URL:     https://ricroot.in
Summary:      ${ricRootData.summary}`,
        });
        break;

      case "payeaze":
        newEntries.push({
          type: "output",
          text: `PAYEAZE // Multi-Tenant Statutory Compliance HRMS
Role:         Product Manager (Product Flow, Architecture & Engineering)
Architecture: Subdomain-partitioned multi-tenant client instances
Compliance:   Pan-India State-Wise Statutory Rules (PF, ESI, Professional Tax, LWF)
Roles:        3 Dedicated Portals (Superadmin, SPOC Client Admin, Employee Self-Service)
GTM Phase:    Comprehensive 90-Day Launch Roadmap & Redesign in progress
Summary:      ${payEazeData.summary}`,
        });
        break;

      case "skills":
        let skillsOut = "PRODUCTION TECH ECOSYSTEM:\n";
        techEcosystem.forEach((group) => {
          skillsOut += `\n[${group.group.toUpperCase()}]\n  ${group.description}\n  Stack: ${group.items.join(', ')}\n`;
        });
        newEntries.push({ type: "output", text: skillsOut });
        break;

      case "projects":
        let projOut = "SELECTED SYSTEMS & AI PROJECTS:\n";
        earlierProjects.forEach((p, idx) => {
          projOut += `  [${idx + 1}] ${p.title} (${p.category})\n      ${p.description}\n      Stack: ${p.tech.join(", ")}\n\n`;
        });
        newEntries.push({ type: "output", text: projOut });
        break;

      case "contact":
        newEntries.push({
          type: "output",
          text: `COORDINATES & CHANNELS:
  Email:    ${samayProfile.email}
  Phone:    ${samayProfile.phone}
  LinkedIn: ${samayProfile.linkedin}
  GitHub:   ${samayProfile.github}
  Location: ${samayProfile.location}`,
        });
        break;

      case "matrix":
        setIsMatrixMode((prev) => !prev);
        newEntries.push({
          type: "output",
          text: `[SYSTEM] Matrix stream toggled: ${!isMatrixMode ? "ACTIVE" : "DISABLED"}`,
        });
        break;

      case "neofetch":
        newEntries.push({
          type: "output",
          text: `
     .---.      samay@veracity-core
    /     \\     -----------------------------
   | () () |    OS: SamayOS Linux 6.8
    \\  _  /     Organization: Veracity Supply Chain (RCSL)
                Role: Product Manager + Full Stack Engineer
                Platforms Architected: BharatGIG | RicRoot | PayEaze
                Candidate Taxonomy: 92,250+ Records (RicRoot)
                Core Engines: 4-Panel Gig Ops & Multi-Tenant HRMS
                Stack: Odoo 18, Python, FastAPI, React, SQL, iOS ATT
          `,
        });
        break;

      case "date":
        newEntries.push({
          type: "output",
          text: `Timestamp: ${new Date().toUTCString()} | IST: ${new Date().toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata" })}`,
        });
        break;

      case "sudo":
        newEntries.push({
          type: "error",
          text: "PERMISSION DENIED: Samay Bhavsar is the primary systems architect.",
        });
        break;

      case "clear":
        setHistory([]);
        setInput("");
        return;

      case "exit":
        onClose();
        return;

      default:
        newEntries.push({
          type: "error",
          text: `command not found: '${raw}'. Type 'help' to see valid operations.`,
        });
        break;
    }

    playTerminalBeep();
    setHistory((prev) => [...prev, ...newEntries]);
    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleCommand(input);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const nextIdx = historyIndex + 1 < commandHistory.length ? historyIndex + 1 : historyIndex;
        setHistoryIndex(nextIdx);
        setInput(commandHistory[commandHistory.length - 1 - nextIdx] || "");
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex > 0) {
        const nextIdx = historyIndex - 1;
        setHistoryIndex(nextIdx);
        setInput(commandHistory[commandHistory.length - 1 - nextIdx] || "");
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput("");
      }
    }
  };

  return (
    <div
      data-lenis-prevent="true"
      className={`fixed z-50 transition-all duration-300 ${isMaximized
          ? "inset-0 p-2 sm:p-4"
          : "bottom-0 right-0 left-0 sm:left-auto sm:right-6 sm:bottom-6 sm:w-[640px] sm:h-[480px] h-[75vh]"
        } flex flex-col`}
    >
      <div
        data-lenis-prevent="true"
        className={`relative flex flex-col h-full rounded-2xl border ${isMatrixMode
          ? "bg-black border-emerald-500 shadow-[0_0_40px_rgba(16,185,129,0.3)] text-emerald-400"
          : "bg-[#0B0E14] border-slate-700/80 shadow-2xl text-slate-200"
        } backdrop-blur-2xl overflow-hidden font-mono text-xs`}
      >

        {/* Titlebar */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#12151B] border-b border-slate-800 select-none">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <button
                onClick={() => {
                  playCyberClick();
                  onClose();
                }}
                className="w-3 h-3 rounded-full bg-rose-500/80 hover:bg-rose-500 transition-colors"
                title="Close"
              />
              <button
                onClick={() => setIsMaximized(!isMaximized)}
                className="w-3 h-3 rounded-full bg-amber-500/80 hover:bg-amber-500 transition-colors"
                title="Toggle Maximize"
              />
              <button
                onClick={() => setIsMatrixMode(!isMatrixMode)}
                className="w-3 h-3 rounded-full bg-emerald-500/80 hover:bg-emerald-500 transition-colors"
                title="Toggle Matrix Mode"
              />
            </div>
            <div className="flex items-center gap-1.5 ml-2 font-bold text-slate-300">
              <TerminalIcon size={14} className="text-emerald-400" />
              <span>samay@veracity-core:~</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-slate-400">
            <button
              onClick={() => setIsMaximized(!isMaximized)}
              className="p-1 hover:text-white rounded"
            >
              {isMaximized ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
            </button>
            <button
              onClick={() => {
                playCyberClick();
                onClose();
              }}
              className="p-1 hover:text-white rounded"
            >
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Scrollable Output */}
        <div
          data-lenis-prevent="true"
          onWheel={(e) => e.stopPropagation()}
          className="flex-1 p-4 overflow-y-auto overscroll-contain touch-pan-y space-y-2 select-text leading-relaxed custom-scrollbar"
        >
          {history.map((entry, idx) => (
            <div
              key={idx}
              className={`whitespace-pre-wrap ${entry.type === "user"
                  ? "text-sky-400 font-semibold"
                  : entry.type === "error"
                    ? "text-rose-400"
                    : entry.type === "system"
                      ? "text-slate-400 italic"
                      : isMatrixMode
                        ? "text-emerald-400"
                        : "text-slate-200"
                }`}
            >
              {entry.text}
            </div>
          ))}
          <div ref={terminalEndRef} />
        </div>

        {/* Prompt Input Line */}
        <div className="flex items-center gap-2 p-3 bg-[#07090D] border-t border-slate-800">
          <span className="text-emerald-400 font-bold select-none">$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type 'help' for command list..."
            className="flex-1 bg-transparent text-slate-100 placeholder-slate-600 focus:outline-none font-mono text-xs"
            autoFocus
          />
        </div>
      </div>
    </div>
  );
}
