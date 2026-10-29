import { useSyncExternalStore } from "react";

const KEY = "sb-theme";
const listeners = new Set();

export const getTheme = () => document.documentElement.dataset.theme || "dark";

// Colours that canvas code needs. CSS reads the same choice through [data-theme].
export const palettes = {
  dark: {
    ink: "243,240,232", mono: "#F3F0E8", hot: "#C7FF3D", metaBg: "#080808",
    glowA: ["199,255,61", 0.045], glowB: ["243,240,232", 0.03], spot: ["199,255,61", 0.06], link: "199,255,61", fill: "#C7FF3D",
  },
  light: {
    ink: "8,8,8", mono: "#0B0B0B", hot: "#4F8F00", metaBg: "#F3F0E8",
    glowA: ["160,220,20", 0.2], glowB: ["8,8,8", 0.035], spot: ["160,220,20", 0.22], link: "58,90,0", fill: "#3A5A00",
  },
};
export const palette = () => palettes[getTheme()];

export function setTheme(next) {
  const root = document.documentElement;
  // Brief colour transition only while switching, so normal interactions stay snappy.
  root.classList.add("theme-anim");
  root.dataset.theme = next;
  try {
    localStorage.setItem(KEY, next);
  } catch {
    /* storage unavailable */
  }
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", palettes[next].metaBg);
  listeners.forEach((l) => l());
  window.dispatchEvent(new Event("themechange"));
  clearTimeout(setTheme.t);
  setTheme.t = setTimeout(() => root.classList.remove("theme-anim"), 600);
}

const subscribe = (cb) => {
  listeners.add(cb);
  return () => listeners.delete(cb);
};

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getTheme, () => "dark");
  return [theme, () => setTheme(theme === "dark" ? "light" : "dark")];
}
