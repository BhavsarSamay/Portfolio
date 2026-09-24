import { useState, useRef, useEffect } from "react";
import { X, Send, Bot, User } from "lucide-react";
import { samayProfile } from "../data/samayProfile";
import { playCyberClick, playCyberChirp } from "../utils/soundEffects";
import { useTheme } from "../context/ThemeContext";

const QUICK_PROMPTS = [
  "What does Samay work on?",
  "Tell me about the platforms",
  "What is Samay's role at Veracity?",
  "How to get in touch?"
];

export default function AIChatModal({ isOpen, onClose }) {
  const { isDark } = useTheme();
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hello! I am Samay AI — an assistant trained on Samay Bhavsar's systems architecture and full-stack engineering work at Veracity Supply Chain Limited. How can I help you today?"
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  // Auto scroll to latest chat message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Lock body scroll, pause background Lenis, and isolate wheel events
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.__lenis?.stop();

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    const container = messagesContainerRef.current;
    const handleWheel = (e) => {
      // Isolate wheel / 2-finger trackpad events inside the chat modal
      e.stopPropagation();
    };

    if (container) {
      container.addEventListener("wheel", handleWheel, { passive: true });
    }

    return () => {
      document.body.style.overflow = originalOverflow;
      window.__lenis?.start();
      window.removeEventListener("keydown", handleKeyDown);
      if (container) {
        container.removeEventListener("wheel", handleWheel);
      }
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSend = (textToSend) => {
    const query = (textToSend || input).trim();
    if (!query) return;

    playCyberClick();
    setMessages((prev) => [...prev, { role: "user", text: query }]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      let matchedAnswer = null;
      const lowerQuery = query.toLowerCase();

      for (const item of samayProfile.aiKnowledge) {
        if (item.keywords.some((kw) => lowerQuery.includes(kw))) {
          matchedAnswer = item.answer;
          break;
        }
      }

      if (!matchedAnswer) {
        matchedAnswer = `Samay Bhavsar is an Associate Product Manager & Systems Architect at Veracity Supply Chain Limited. He designs end-to-end systems architecture for workforce, recruitment, and compliance platforms. You can reach him at ${samayProfile.email}.`;
      }

      setMessages((prev) => [...prev, { role: "assistant", text: matchedAnswer }]);
      setIsTyping(false);
      playCyberChirp();
    }, 400);
  };

  return (
    <div
      data-lenis-prevent="true"
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 backdrop-blur-md transition-all ${
        isDark ? "bg-black/75" : "bg-slate-900/35"
      }`}
      onClick={() => {
        playCyberClick();
        onClose();
      }}
    >
      <div
        data-lenis-prevent="true"
        className="relative w-full max-w-lg rounded-2xl border border-[var(--border-line)] bg-[var(--bg-card)] flex flex-col h-[580px] shadow-2xl overflow-hidden text-[var(--text-primary)]"
        onClick={(e) => e.stopPropagation()}
      >

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[var(--bg-surface)] border-b border-[var(--border-line)]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-sm">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold font-display flex items-center gap-2">
                <span>Samay AI Assistant</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-beacon" />
              </div>
              <p className="text-[11px] text-[var(--text-dim)] font-mono">
                Model: Systems Architecture Knowledge Base
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              playCyberClick();
              onClose();
            }}
            className="p-1.5 rounded-lg border border-[var(--border-line)] hover:bg-[var(--bg-surface)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-all"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Chat Messages */}
        <div
          ref={messagesContainerRef}
          data-lenis-prevent="true"
          className="flex-1 p-5 overflow-y-auto overscroll-contain touch-pan-y space-y-4 text-xs sm:text-sm custom-scrollbar select-text"
        >
          {messages.map((m, idx) => {
            const isBot = m.role === "assistant";
            return (
              <div
                key={idx}
                className={`flex gap-3 ${isBot ? "justify-start" : "justify-end"}`}
              >
                {isBot && (
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-500 shrink-0 mt-0.5 shadow-sm">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`p-4 rounded-2xl max-w-[85%] leading-relaxed ${isBot
                    ? "bg-[var(--bg-surface)] border border-[var(--border-line)] text-[var(--text-primary)]"
                    : "bg-emerald-600 text-white font-medium shadow-sm"
                    }`}
                >
                  {m.text}
                </div>
                {!isBot && (
                  <div className="w-7 h-7 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-line)] flex items-center justify-center text-[var(--text-muted)] shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isTyping && (
            <div className="flex items-center gap-2 text-emerald-500 text-xs font-mono p-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-beacon" />
              <span>Synthesizing response...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts */}
        <div
          data-lenis-prevent="true"
          className="px-5 py-2.5 bg-[var(--bg-surface)] border-t border-[var(--border-line)] flex gap-2 overflow-x-auto text-xs overscroll-contain"
        >
          {QUICK_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              onClick={() => handleSend(prompt)}
              className="px-3 py-1.5 rounded-lg border border-[var(--border-line)] bg-[var(--bg-card)] text-[var(--text-muted)] hover:text-emerald-500 hover:border-emerald-500/40 whitespace-nowrap shrink-0 transition-all font-mono text-[11px]"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3.5 bg-[var(--bg-surface)] border-t border-[var(--border-line)] flex items-center gap-2.5"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about Samay's systems architecture work..."
            className="flex-1 bg-[var(--bg-card)] border border-[var(--border-line)] rounded-xl px-4 py-2.5 text-xs text-[var(--text-primary)] placeholder-[var(--text-dim)] outline-none focus:border-emerald-500 transition-colors font-sans"
          />
          <button
            type="submit"
            className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition-all font-bold shadow-sm"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
}
