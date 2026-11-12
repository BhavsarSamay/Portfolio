import { useSyncExternalStore } from "react";
import { getTheme } from "./theme";

// Soundtrack, synthesised live with the Web Audio API: no audio files to download or license.
// A small step sequencer plays one of three tracks, all in D and all following the site:
//   Orbit        cinematic: strings and deep bass under a slow arpeggio
//   Night Drive  a soft, steady synthwave pulse with kick, clap and hats
//   Piano        a gentle, sparse piano with a warm bed underneath
// Dark mode plays in a minor key, light mode in a brighter major key (it changes at the next chord).
// The deeper you scroll, the more the music opens up, and a soft whoosh follows how fast you scroll.
// It never starts by itself: browsers require a click, and the site respects that.

const midi = (n) => 440 * Math.pow(2, (n - 69) / 12);
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Four-chord loops, voiced low to high. Dark: Dm Bb F C. Light: D A Bm G.
const CHORDS = {
  dark: [[50, 57, 62, 65, 69], [46, 53, 58, 62, 65], [41, 53, 57, 60, 65], [48, 55, 60, 64, 67]],
  light: [[50, 57, 62, 66, 69], [45, 57, 61, 64, 69], [47, 54, 59, 62, 66], [43, 55, 59, 62, 67]],
};

export const TRACK_NAMES = ["Orbit", "Night Drive", "Piano"];
const BPM = [72, 96, 66];

let ctx = null;
let g = null; // audio graph
let on = false;
let track = 0;
let energy = 0; // 0..1, how far down the page you are
let timers = [];
let step = 0;
let nextTime = 0;
const listeners = new Set();
const emit = () => listeners.forEach((l) => l());
const subscribe = (cb) => {
  listeners.add(cb);
  return () => listeners.delete(cb);
};
try {
  const saved = Number(localStorage.getItem("sb-track"));
  if (saved >= 0 && saved < TRACK_NAMES.length) track = saved;
} catch {
  /* storage unavailable */
}

// ---------- audio graph ----------
function reverbImpulse(c) {
  const len = Math.floor(c.sampleRate * 3.2);
  const buf = c.createBuffer(2, len, c.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const d = buf.getChannelData(ch);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.6);
  }
  return buf;
}
function noiseBuffer(c, seconds) {
  const len = Math.floor(c.sampleRate * seconds);
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
  comp.threshold.value = -22;
  comp.ratio.value = 3;
  master.connect(comp);
  comp.connect(c.destination);

  const dry = c.createGain();
  dry.connect(master);

  const rev = c.createGain(); // reverb send
  const convolver = c.createConvolver();
  convolver.buffer = reverbImpulse(c);
  const revOut = c.createGain();
  revOut.gain.value = 0.85;
  rev.connect(convolver);
  convolver.connect(revOut);
  revOut.connect(master);

  const del = c.createGain(); // tempo-synced echo send
  const delay = c.createDelay(2);
  const fb = c.createGain();
  fb.gain.value = 0.36;
  const tone = c.createBiquadFilter();
  tone.type = "lowpass";
  tone.frequency.value = 2600;
  const delOut = c.createGain();
  delOut.gain.value = 0.5;
  del.connect(delay);
  delay.connect(tone);
  tone.connect(fb);
  fb.connect(delay);
  tone.connect(delOut);
  delOut.connect(master);

  // scroll whoosh
  const noise = c.createBufferSource();
  noise.buffer = noiseBuffer(c, 2);
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
  whoosh.connect(rev);
  noise.start();

  return { c, master, dry, rev, del, delay, whoosh, band, hatNoise: noiseBuffer(c, 0.3) };
}

// Feed a finished voice to the dry, reverb and echo buses.
function send(node, dry = 1, rev = 0, del = 0) {
  [[g.dry, dry], [g.rev, rev], [g.del, del]].forEach(([bus, amt]) => {
    if (amt <= 0) return;
    const x = ctx.createGain();
    x.gain.value = amt;
    node.connect(x);
    x.connect(bus);
  });
}
function envelope(gain, t, attack, peak, decay) {
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.linearRampToValueAtTime(peak, t + attack);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + attack + decay);
}

// ---------- instruments ----------
function pluck(t, note, { dur = 0.6, gain = 0.05, cutoff = 2400, type = "triangle", dry = 0.8, rev = 0.35, del = 0.5 } = {}) {
  const o = ctx.createOscillator();
  o.type = type;
  o.frequency.value = midi(note);
  const f = ctx.createBiquadFilter();
  f.type = "lowpass";
  f.frequency.setValueAtTime(cutoff, t);
  f.frequency.exponentialRampToValueAtTime(Math.max(300, cutoff * 0.22), t + dur);
  const v = ctx.createGain();
  envelope(v, t, 0.006, gain, dur);
  o.connect(f);
  f.connect(v);
  send(v, dry, rev, del);
  o.start(t);
  o.stop(t + dur + 0.1);
}

function pad(t, notes, dur, gain = 0.03, bright = 0) {
  const lp = ctx.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = 700 + bright * 700;
  const v = ctx.createGain();
  v.gain.setValueAtTime(0.0001, t);
  v.gain.linearRampToValueAtTime(gain, t + 1.4);
  v.gain.setValueAtTime(gain, t + dur);
  v.gain.linearRampToValueAtTime(0.0001, t + dur + 2.2);
  notes.forEach((n) => {
    [["triangle", -7, 1], ["sawtooth", 7, 0.3]].forEach(([type, detune, k]) => {
      const o = ctx.createOscillator();
      o.type = type;
      o.frequency.value = midi(n);
      o.detune.value = detune;
      const og = ctx.createGain();
      og.gain.value = k;
      o.connect(og);
      og.connect(lp);
      o.start(t);
      o.stop(t + dur + 2.3);
    });
  });
  lp.connect(v);
  send(v, 0.7, 0.6, 0.1);
}

function bass(t, note, dur, gain = 0.12, type = "sine") {
  [[type, 0, 1], ["triangle", 12, 0.25]].forEach(([ty, oct, k]) => {
    const o = ctx.createOscillator();
    o.type = ty;
    o.frequency.value = midi(note + oct);
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = type === "sawtooth" ? 420 : 300;
    const v = ctx.createGain();
    v.gain.setValueAtTime(0.0001, t);
    v.gain.linearRampToValueAtTime(gain * k, t + 0.03);
    v.gain.setValueAtTime(gain * k, t + Math.max(0.05, dur - 0.2));
    v.gain.linearRampToValueAtTime(0.0001, t + dur + 0.25);
    o.connect(lp);
    lp.connect(v);
    v.connect(g.dry);
    o.start(t);
    o.stop(t + dur + 0.3);
  });
}

function piano(t, note, vel = 0.06) {
  const f = midi(note);
  const out = ctx.createGain();
  out.gain.setValueAtTime(0.0001, t);
  out.gain.linearRampToValueAtTime(vel, t + 0.004);
  out.gain.exponentialRampToValueAtTime(0.0001, t + 3.4);
  const lp = ctx.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = 3400;
  [[1, 1], [2, 0.42], [3, 0.2], [4, 0.09]].forEach(([m, a]) => {
    const o = ctx.createOscillator();
    o.type = "sine";
    o.frequency.value = f * m * (1 + (Math.random() - 0.5) * 0.0009);
    const pg = ctx.createGain();
    pg.gain.setValueAtTime(a, t);
    pg.gain.exponentialRampToValueAtTime(0.0001, t + (m === 1 ? 3.3 : 1.3 / m));
    o.connect(pg);
    pg.connect(lp);
    o.start(t);
    o.stop(t + 3.4);
  });
  lp.connect(out);
  send(out, 0.8, 0.5, 0.18);
}

function kick(t) {
  const o = ctx.createOscillator();
  o.frequency.setValueAtTime(130, t);
  o.frequency.exponentialRampToValueAtTime(42, t + 0.22);
  const v = ctx.createGain();
  v.gain.setValueAtTime(0.0001, t);
  v.gain.linearRampToValueAtTime(0.34, t + 0.004);
  v.gain.exponentialRampToValueAtTime(0.0001, t + 0.34);
  o.connect(v);
  v.connect(g.dry);
  o.start(t);
  o.stop(t + 0.36);
}
function hat(t, open = false) {
  const s = ctx.createBufferSource();
  s.buffer = g.hatNoise;
  const hp = ctx.createBiquadFilter();
  hp.type = "highpass";
  hp.frequency.value = 7200;
  const v = ctx.createGain();
  envelope(v, t, 0.002, open ? 0.05 : 0.032, open ? 0.2 : 0.045);
  s.connect(hp);
  hp.connect(v);
  send(v, 0.8, 0.12, 0);
  s.start(t);
  s.stop(t + 0.3);
}
function clap(t) {
  const s = ctx.createBufferSource();
  s.buffer = g.hatNoise;
  const bp = ctx.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.value = 1600;
  bp.Q.value = 0.8;
  const v = ctx.createGain();
  envelope(v, t, 0.003, 0.09, 0.17);
  s.connect(bp);
  bp.connect(v);
  send(v, 0.7, 0.35, 0);
  s.start(t);
  s.stop(t + 0.3);
}

// ---------- tracks ----------
// Each track is called once per sixteenth note with the global step number and the exact audio time.
function chordAt(s, stepsPerChord) {
  const progression = CHORDS[getTheme()];
  return { chord: progression[Math.floor(s / stepsPerChord) % 4], first: s % stepsPerChord === 0 };
}
const sixteenth = () => 60 / BPM[track] / 4;

const TRACKS = [
  // Orbit: slow, cinematic
  (s, t) => {
    const per = 32;
    const { chord, first } = chordAt(s, per);
    if (first) {
      pad(t, chord, per * sixteenth(), 0.03, energy);
      bass(t, chord[0] - 12, per * sixteenth(), 0.12);
    }
    if (s % 2 === 0) {
      const pattern = [1, 2, 3, 4, 3, 2];
      const note = chord[pattern[(s / 2) % pattern.length]] + 12;
      pluck(t, note, { dur: 1.1, gain: 0.034 * (0.45 + 0.55 * energy), cutoff: 1800 + energy * 1800 });
    }
    if (s % 16 === 8) pluck(t, chord[4] + 24, { dur: 2.6, gain: 0.02, type: "sine", rev: 0.7, del: 0.6 });
  },
  // Night Drive: steady, soft synthwave
  (s, t) => {
    const per = 16;
    const { chord, first } = chordAt(s, per);
    const b = s % 16;
    if (first) pad(t, chord, per * sixteenth(), 0.024, energy);
    if (b === 0 || b === 8) kick(t);
    if (b === 4 || b === 12) clap(t);
    if (s % 2 === 0) hat(t, b === 14);
    if ([0, 3, 6, 8, 11, 14].includes(b)) bass(t, chord[0] - 12, sixteenth() * 1.6, 0.13, "sawtooth");
    const arp = [0, 2, 1, 2][s % 4];
    pluck(t, chord[1 + arp] + 12, { dur: 0.32, gain: 0.016 * (0.4 + 0.6 * energy), cutoff: 2600, type: "sawtooth", del: 0.7, rev: 0.25 });
  },
  // Piano: sparse and gentle
  (s, t) => {
    const per = 32;
    const { chord, first } = chordAt(s, per);
    if (first) pad(t, chord, per * sixteenth(), 0.026, 0);
    if (s % 16 === 0) piano(t, chord[0], 0.17);
    if (s % 16 === 8) piano(t, chord[2], 0.12);
    if ([0, 3, 6, 10, 12, 14].includes(s % 16) && Math.random() < 0.55 + energy * 0.25) {
      const tone = chord[2 + Math.floor(Math.random() * 3)] + (Math.random() < 0.3 ? 24 : 12);
      piano(t, tone, 0.1 + Math.random() * 0.07);
    }
  },
];

// ---------- transport ----------
function pump() {
  if (!ctx || !on) return;
  while (nextTime < ctx.currentTime + 0.15) {
    TRACKS[track](step, nextTime);
    nextTime += sixteenth();
    step++;
  }
}

function setTempo() {
  g.delay.delayTime.value = (60 / BPM[track]) * 0.75; // dotted eighth echo
}

function startTransport() {
  step = 0;
  nextTime = ctx.currentTime + 0.12;
  setTempo();
  let lastY = window.scrollY, lastT = performance.now(), smooth = 0;
  timers.push(setInterval(pump, 25));
  timers.push(setInterval(() => {
    if (!ctx || !on) return;
    const now = performance.now(), y = window.scrollY;
    const v = (Math.abs(y - lastY) / Math.max(1, now - lastT)) * 1000;
    lastY = y;
    lastT = now;
    smooth += (v - smooth) * 0.35;
    const k = clamp(smooth / 2500, 0, 1);
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    energy = clamp(y / max, 0, 1);
    const t = ctx.currentTime;
    g.whoosh.gain.setTargetAtTime(k * 0.14, t, 0.08);
    g.band.frequency.setTargetAtTime(300 + k * 2600, t, 0.1);
  }, 90));
}

// ---------- public API ----------
export async function startSound() {
  if (on) return;
  try {
    if (!ctx) {
      g = build();
      ctx = g.c;
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
  g.master.gain.setTargetAtTime(0.5, t, 1.1); // fade in
  startTransport();
  emit();
}

export function stopSound() {
  if (!on) return;
  on = false;
  timers.forEach((id) => clearInterval(id));
  timers = [];
  const t = ctx.currentTime;
  g.master.gain.cancelScheduledValues(t);
  g.master.gain.setTargetAtTime(0, t, 0.3);
  setTimeout(() => {
    if (!on) ctx.suspend();
  }, 1500);
  emit();
}

export const toggleSound = () => (on ? stopSound() : startSound());

export function nextTrack() {
  track = (track + 1) % TRACKS.length;
  try {
    localStorage.setItem("sb-track", String(track));
  } catch {
    /* storage unavailable */
  }
  if (on) {
    // dip, restart the sequence on the new track, and bring it back up
    const t = ctx.currentTime;
    g.master.gain.cancelScheduledValues(t);
    g.master.gain.setTargetAtTime(0.1, t, 0.12);
    step = 0;
    nextTime = t + 0.3;
    setTempo();
    g.master.gain.setTargetAtTime(0.5, t + 0.35, 0.5);
  }
  emit();
}

// Dev only (removed from production builds): lets me measure the output level while testing.
if (import.meta.env.DEV) window.__sound = () => ({ ctx, g, track: () => track });

export const useSound = () => [useSyncExternalStore(subscribe, () => on, () => false), toggleSound];
export const useTrack = () => [useSyncExternalStore(subscribe, () => track, () => 0), nextTrack];
