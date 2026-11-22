import { useSyncExternalStore } from "react";

const KEY = "sb-theme";
const listeners = new Set();

export const getTheme = () => document.documentElement.dataset.theme || "dark";

// Colours that canvas code needs. CSS reads the same choice through [data-theme].
export const palettes = {
  dark: {
    ink: "236,231,220", mono: "#ECE7DC", hot: "#E2C58C", metaBg: "#08080A",
    glowA: ["226,197,140", 0.04], glowB: ["236,231,220", 0.03], spot: ["226,197,140", 0.05], link: "226,197,140", fill: "#E2C58C",
  },
  light: {
    ink: "18,18,18", mono: "#121212", hot: "#8C6A2E", metaBg: "#F4F1EA",
    glowA: ["176,138,72", 0.14], glowB: ["18,18,18", 0.035], spot: ["176,138,72", 0.16], link: "140,106,46", fill: "#8C6A2E",
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
