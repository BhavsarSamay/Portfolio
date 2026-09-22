import React, { useState } from 'react';
import { Mail, Phone, ArrowUpRight, Send, CheckCircle2, MessageSquare } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './Icons';
import { samayProfile } from '../data/samayProfile';
import { playCyberClick, playCyberChirp } from '../utils/soundEffects';
import confetti from 'canvas-confetti';

const channels = [
  { icon: Mail, label: 'Email', value: samayProfile.email, href: `mailto:${samayProfile.email}` },
  { icon: Phone, label: 'Phone', value: samayProfile.phone, href: `tel:${samayProfile.phone.replace(/\s+/g, '')}` },
  { icon: LinkedinIcon, label: 'LinkedIn', value: 'Connect on LinkedIn', href: samayProfile.linkedin, external: true },
  { icon: GithubIcon, label: 'GitHub', value: 'Explore Repositories', href: samayProfile.github, external: true },
];

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setIsSubmitting(true);
    playCyberClick();

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      playCyberChirp();

      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.8 },
          colors: ['#10B981', '#0A7A5F', '#34D399', '#6EE7B7']
        });
      } catch { }
    }, 600);
  };

  return (
    <section id="contact" className="relative scroll-mt-24 sm:scroll-mt-28 bg-[#12151B] dark:bg-[#07090D] grid-veil text-white border-t border-[rgba(255,255,255,0.08)] pt-24 sm:pt-28 pb-20 sm:pb-24">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left Column: Editorial Headline & Direct Channels (7 cols) */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-beacon" />
              <span className="font-mono text-xs uppercase tracking-[0.14em] text-emerald-400 font-semibold">
                Let's Connect
              </span>
            </div>

            <h2 className="mt-5 font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-[1.12]">
              Have a hard problem? Let's talk.
            </h2>

            <p className="mt-4 text-sm sm:text-base leading-relaxed text-slate-300 max-w-xl">
              I'm open to freelance and consulting work across product management, full-stack engineering,
              systems architecture, and AI automation — and always happy to talk through a complex problem.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <a
                href={`mailto:${samayProfile.email}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs sm:text-sm transition-all hover:-translate-y-0.5 shadow-md shadow-emerald-600/30"
              >
                <span>Email Samay Directly</span>
                <ArrowUpRight size={15} />
              </a>
              <a
                href={samayProfile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-white font-medium text-xs sm:text-sm transition-all hover:-translate-y-0.5"
              >
                <span>View LinkedIn Profile</span>
                <ArrowUpRight size={15} />
              </a>
            </div>

            {/* 4 Quick Channel Cards with Protected Icon Dimensions */}
            <div className="mt-9 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {channels.map((ch) => (
                <a
                  key={ch.label}
                  href={ch.href}
                  target={ch.external ? '_blank' : undefined}
                  rel={ch.external ? 'noopener noreferrer' : undefined}
                  className="group flex items-center gap-3.5 p-3.5 sm:p-4 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.07] hover:border-emerald-500/40 transition-all duration-200 hover:-translate-y-0.5 shadow-sm"
                >
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 group-hover:bg-emerald-500/20 group-hover:border-emerald-500/40 group-hover:scale-105 transition-all">
                    <ch.icon size={18} className="w-[18px] h-[18px] text-emerald-400 shrink-0" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-mono text-[10px] uppercase tracking-wider text-slate-400">
                      {ch.label}
                    </div>
                    <div
                      className="mt-0.5 text-xs sm:text-sm font-medium text-white truncate group-hover:text-emerald-300 transition-colors"
                      title={ch.value}
                    >
                      {ch.value}
                    </div>
                  </div>
                  <ArrowUpRight size={14} className="text-slate-500 group-hover:text-emerald-400 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Right Column: Clean Direct Message Box (5 cols) */}
          <div className="lg:col-span-5 relative rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6 sm:p-8 shadow-2xl overflow-hidden">
            {/* Top specular light highlight line */}
            <div className="absolute inset-x-8 top-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent pointer-events-none" />

            <div className="flex items-center justify-between font-mono text-xs text-emerald-400 font-semibold mb-6">
              <div className="flex items-center gap-2">
                <MessageSquare size={16} />
                <span>Direct Transmission</span>
              </div>
              <span className="text-[10px] text-slate-500 uppercase tracking-widest font-normal">Encrypted</span>
            </div>

            {submitted ? (
              <div className="text-center py-10 space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="font-display text-xl font-bold text-white">Message Dispatched</h3>
                <p className="text-sm text-slate-300 max-w-sm mx-auto">
                  Thank you for reaching out! I've received your note and will get back to you within 24 hours.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: '', email: '', message: '' });
                  }}
                  className="mt-4 font-mono text-xs text-emerald-400 underline hover:text-emerald-300 transition-colors"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                <div>
                  <label className="block font-mono text-[11px] uppercase tracking-wider text-slate-300 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Alex Mercer"
                    className="w-full px-4 py-2.5 sm:py-3 rounded-xl border border-white/15 bg-black/40 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[11px] uppercase tracking-wider text-slate-300 mb-2">
                    Your Email
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="alex@company.com"
                    className="w-full px-4 py-2.5 sm:py-3 rounded-xl border border-white/15 bg-black/40 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[11px] uppercase tracking-wider text-slate-300 mb-2">
                    Message / Problem Outline
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell me about the system, product problem, or opportunity you want to discuss..."
                    className="w-full px-4 py-2.5 sm:py-3 rounded-xl border border-white/15 bg-black/40 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 hover:shadow-emerald-600/40 active:translate-y-0"
                >
                  {isSubmitting ? (
                    <span className="font-mono text-xs tracking-wider">Transmitting...</span>
                  ) : (
                    <>
                      <span>Transmit Message</span>
                      <Send size={15} />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
