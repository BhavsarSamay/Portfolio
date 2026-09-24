import React, { useState, useEffect } from "react";
import { Activity } from "lucide-react";

export default function ExperienceTicker({ className = "" }) {
  const [elapsed, setElapsed] = useState({
    years: 0,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const startDate = new Date("2024-12-01T00:00:00+05:30");

    const calculateTime = () => {
      const now = new Date();

      let years = now.getFullYear() - startDate.getFullYear();
      let months = now.getMonth() - startDate.getMonth();
      let days = now.getDate() - startDate.getDate();
      let hours = now.getHours() - startDate.getHours();
      let minutes = now.getMinutes() - startDate.getMinutes();
      let seconds = now.getSeconds() - startDate.getSeconds();

      if (seconds < 0) {
        seconds += 60;
        minutes--;
      }
      if (minutes < 0) {
        minutes += 60;
        hours--;
      }
      if (hours < 0) {
        hours += 24;
        days--;
      }
      if (days < 0) {
        const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        days += prevMonth.getDate();
        months--;
      }
      if (months < 0) {
        months += 12;
        years--;
      }

      setElapsed({
        years,
        months,
        days,
        hours,
        minutes,
        seconds,
      });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const pad = (num) => String(num).padStart(2, "0");

  return (
    <div
      className={`inline-flex flex-wrap items-center gap-2 sm:gap-3 px-3.5 sm:px-4 py-2 rounded-2xl border border-emerald-500/35 bg-[var(--bg-card)]/90 backdrop-blur-md shadow-[0_0_20px_rgba(16,185,129,0.12)] font-mono text-xs ${className}`}
    >
      <div className="flex items-center gap-2">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
        </span>
        <span className="text-[10px] sm:text-[11px] uppercase tracking-wider font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
          <Activity size={13} className="text-emerald-500 animate-pulse" />
          <span>Realtime Total Experience:</span>
        </span>
      </div>

      <div className="flex items-center gap-1 font-bold text-[var(--text-primary)] tracking-tight">
        <span className="px-1.5 py-0.5 rounded bg-[var(--bg-surface-raised)] border border-[var(--border-line-strong)] text-emerald-600 dark:text-emerald-400" title="Years">
          {elapsed.years}y
        </span>
        <span className="text-[var(--text-dim)]">:</span>
        <span className="px-1.5 py-0.5 rounded bg-[var(--bg-surface-raised)] border border-[var(--border-line-strong)] text-emerald-600 dark:text-emerald-400" title="Months">
          {pad(elapsed.months)}m
        </span>
        <span className="text-[var(--text-dim)]">:</span>
        <span className="px-1.5 py-0.5 rounded bg-[var(--bg-surface-raised)] border border-[var(--border-line-strong)] text-sky-600 dark:text-sky-400" title="Days">
          {pad(elapsed.days)}d
        </span>
        <span className="text-[var(--text-dim)]">:</span>
        <span className="px-1.5 py-0.5 rounded bg-[var(--bg-surface-raised)] border border-[var(--border-line-strong)] text-amber-600 dark:text-amber-400" title="Hours">
          {pad(elapsed.hours)}h
        </span>
        <span className="text-[var(--text-dim)]">:</span>
        <span className="px-1.5 py-0.5 rounded bg-[var(--bg-surface-raised)] border border-[var(--border-line-strong)] text-emerald-600 dark:text-emerald-400" title="Minutes">
          {pad(elapsed.minutes)}m
        </span>
        <span className="text-[var(--text-dim)]">:</span>
        <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/40 text-emerald-600 dark:text-emerald-300 min-w-[28px] text-center" title="Seconds (Live Ticker)">
          {pad(elapsed.seconds)}s
        </span>
      </div>
    </div>
  );
}
