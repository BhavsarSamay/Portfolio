import { useSyncExternalStore } from "react";

const KEY = "sb-theme";
const listeners = new Set();

export const getTheme = () => document.documentElement.dataset.theme || "dark";

// Colours that canvas code needs. CSS reads the same choice through [data-theme].
export const palettes = {
  dark: {
    ink: "243,240,232", mono: "#F3F0E8", hot: "#E6C98A", metaBg: "#080808",
    glowA: ["232,201,138", 0.04], glowB: ["243,240,232", 0.03], spot: ["232,201,138", 0.05], link: "230,201,138", fill: "#E6C98A",
  },
  light: {
    ink: "8,8,8", mono: "#0B0B0B", hot: "#2F4BD8", metaBg: "#F3F0E8",
    glowA: ["120,140,255", 0.18], glowB: ["8,8,8", 0.035], spot: ["120,140,255", 0.2], link: "47,75,216", fill: "#2F4BD8",
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
