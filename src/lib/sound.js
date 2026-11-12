import { useSyncExternalStore } from "react";
import { getTheme } from "./theme";

// Generative space soundtrack, built live with the Web Audio API: no audio files to download or license.
//   - a slow ambient pad whose chords drift every ~14 s (minor and dark in dark mode, brighter in light mode)
//   - a deep sub drone
//   - sparse star-like chimes in a pentatonic scale, drenched in reverb
//   - a soft whoosh that follows how fast you scroll, with the pad opening up as you travel down the page
// It never starts by itself: browsers require a click, and the site respects that.

const midi = (n) => 440 * Math.pow(2, (n - 69) / 12);
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

const PROGRESSIONS = {
  dark: [[38, 45, 50, 53, 57, 64], [34, 46, 50, 53, 57, 62], [31, 43, 50, 53, 57, 62], [33, 45, 52, 55, 59, 64]],
  light: [[38, 45, 50, 54, 57, 64], [31, 43, 50, 54, 59, 62], [35, 47, 54, 57, 61, 64], [33, 45, 52, 57, 61, 64]],
};
const CHIMES = { dark: [74, 77, 79, 81, 84, 86], light: [74, 76, 79, 81, 83, 86] };

let ctx = null;
let g = null; // audio graph
let on = false;
let chord = 0;
let timers = [];
const listeners = new Set();
const emit = () => listeners.forEach((l) => l());
const subscribe = (cb) => {
  listeners.add(cb);
  return () => listeners.delete(cb);
};

function reverbImpulse(c) {
  const len = Math.floor(c.sampleRate * 3.6);
  const buf = c.createBuffer(2, len, c.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const d = buf.getChannelData(ch);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.8);
  }
  return buf;
}
function noiseBuffer(c) {
  const len = c.sampleRate * 2;
  const buf = c.createBuffer(1, len, c.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
  return buf;
}

function build() {
  const c = new (window.AudioContext || window.webkitAudioContext)();
  const master = c.createGain();
  master.gain.value = 0;
  const comp = c.createDynamicsCompressor();
  comp.threshold.value = -20;
  comp.ratio.value = 3;
  master.connect(comp);
  comp.connect(c.destination);

  const dry = c.createGain();
  dry.gain.value = 0.7;
  dry.connect(master);
  const reverb = c.createConvolver();
  reverb.buffer = reverbImpulse(c);
  const wet = c.createGain();
  wet.gain.value = 0.9;
  reverb.connect(wet);
  wet.connect(master);
  const send = c.createGain();
  send.gain.value = 0.6;
  send.connect(reverb);

  // pad: two detuned oscillators per chord note, through a slowly breathing low-pass filter
  const filter = c.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 620;
  filter.Q.value = 0.6;
  const pad = c.createGain();
  filter.connect(pad);
  pad.connect(dry);
  pad.connect(send);
  const lfo = c.createOscillator();
  lfo.frequency.value = 0.045;
  const lfoDepth = c.createGain();
  lfoDepth.gain.value = 260;
  lfo.connect(lfoDepth);
  lfoDepth.connect(filter.frequency);
  lfo.start();

  const voices = [];
  PROGRESSIONS[getTheme()][0].forEach((n, i) => {
    [["sawtooth", -6, 0.55], ["triangle", 7, 1]].forEach(([type, detune, k]) => {
      const o = c.createOscillator();
      o.type = type;
      o.frequency.value = midi(n);
      o.detune.value = detune;
      const v = c.createGain();
      v.gain.value = (i < 2 ? 0.07 : 0.045) * k;
      o.connect(v);
      v.connect(filter);
      o.start();
      voices.push({ o, i });
    });
  });

  // sub drone (D1)
  const sub = c.createOscillator();
  sub.frequency.value = midi(26);
  const subGain = c.createGain();
  subGain.gain.value = 0.08;
  sub.connect(subGain);
  subGain.connect(master);
  sub.start();

  // scroll whoosh
  const noise = c.createBufferSource();
  noise.buffer = noiseBuffer(c);
  noise.loop = true;
  const band = c.createBiquadFilter();
  band.type = "bandpass";
  band.frequency.value = 500;
  band.Q.value = 0.7;
  const whoosh = c.createGain();
  whoosh.gain.value = 0;
  noise.connect(band);
  band.connect(whoosh);
  whoosh.connect(dry);
  whoosh.connect(send);
  noise.start();

  return { c, master, dry, send, filter, voices, whoosh, band };
}

function glideTo(index) {
  if (!ctx) return;
  const notes = PROGRESSIONS[getTheme()][index % 4];
  const t = ctx.currentTime;
  g.voices.forEach((v) => v.o.frequency.setTargetAtTime(midi(notes[v.i]), t, 2.2));
}

function chime() {
  if (!ctx || !on) return;
  const set = CHIMES[getTheme()];
  const n = set[Math.floor(Math.random() * set.length)];
  const o = ctx.createOscillator();
  o.type = "sine";
  o.frequency.value = midi(n);
  const env = ctx.createGain();
  const t = ctx.currentTime;
  env.gain.setValueAtTime(0, t);
  env.gain.linearRampToValueAtTime(0.05, t + 0.02);
  env.gain.exponentialRampToValueAtTime(0.0001, t + 4.5);
  o.connect(env);
  env.connect(g.send);
  env.connect(g.dry);
  o.start(t);
  o.stop(t + 4.6);
}

function schedule() {
  let lastY = window.scrollY, lastT = performance.now(), smooth = 0;
  timers.push(setInterval(() => {
    if (!ctx || !on) return;
    const now = performance.now(), y = window.scrollY;
    const v = (Math.abs(y - lastY) / Math.max(1, now - lastT)) * 1000;
    lastY = y;
    lastT = now;
    smooth += (v - smooth) * 0.35;
    const k = clamp(smooth / 2500, 0, 1);
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const progress = clamp(y / max, 0, 1);
    const t = ctx.currentTime;
    g.whoosh.gain.setTargetAtTime(k * 0.16, t, 0.08);
    g.band.frequency.setTargetAtTime(300 + k * 2600, t, 0.1);
    g.filter.frequency.setTargetAtTime(520 + progress * 900 + k * 500, t, 0.4);
  }, 90));
  timers.push(setInterval(() => glideTo(++chord), 14000));
  const loop = () => {
    chime();
    timers.push(setTimeout(loop, 2500 + Math.random() * 3500));
  };
  timers.push(setTimeout(loop, 3000));
}

export async function startSound() {
  if (on) return;
  try {
    if (!ctx) {
      g = build();
      ctx = g.c;
      window.addEventListener("themechange", () => on && glideTo(chord));
      document.addEventListener("visibilitychange", () => {
        if (!ctx || !on) return;
        if (document.hidden) ctx.suspend();
        else ctx.resume();
      });
    }
    await ctx.resume();
  } catch {
    return; // audio unavailable; stay silent
  }
  on = true;
  const t = ctx.currentTime;
  g.master.gain.cancelScheduledValues(t);
  g.master.gain.setTargetAtTime(0.5, t, 1.4); // slow fade in
  schedule();
  emit();
}

export function stopSound() {
  if (!on) return;
  on = false;
  timers.forEach((id) => {
    clearInterval(id);
    clearTimeout(id);
  });
  timers = [];
  const t = ctx.currentTime;
  g.master.gain.cancelScheduledValues(t);
  g.master.gain.setTargetAtTime(0, t, 0.3);
  setTimeout(() => {
    if (!on) ctx.suspend();
  }, 1500);
  emit();
}

// Dev only (removed from production builds): lets me measure the output level while testing.
if (import.meta.env.DEV) window.__sound = () => ({ ctx, g });

export const toggleSound = () => (on ? stopSound() : startSound());
export const useSound = () => [useSyncExternalStore(subscribe, () => on, () => false), toggleSound];
