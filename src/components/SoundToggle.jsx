import { useSound, useSoundStatus, useTrack, TRACK_NAMES } from "../lib/sound";

// Floating controls for the soundtrack: an on/off switch, and, while it plays, a button that moves to the
// next track. Off by default; nothing plays without a click.
export default function SoundToggle() {
  const [on, toggle] = useSound();
  const status = useSoundStatus(); // on | armed (starts at the first tap) | off
  const [track, next] = useTrack();
  const name = TRACK_NAMES[track];
  const upcoming = TRACK_NAMES[(track + 1) % TRACK_NAMES.length];
  return (
    <div className="soundbar">
      <button type="button" className={`sound${on ? " is-on" : status === "armed" ? " is-armed" : ""}`} aria-pressed={status !== "off"} aria-label="Soundtrack" title={on ? "Sound on" : status === "armed" ? "Sound is on and starts at your first tap or click" : "Sound off"} onClick={toggle}>
        <span className="sound__bars" aria-hidden="true">
          <i /><i /><i /><i />
        </span>
        <span className="sound__label">{on ? "Sound on" : status === "armed" ? "Tap for sound" : "Sound off"}</span>
      </button>
      {on && (
        <button type="button" className="sound sound--next" aria-label={`Now playing ${name}. Switch to ${upcoming}`} title={`Now playing: ${name}. Click for ${upcoming}`} onClick={next}>
          <span className="sound__label">{name}</span>
          <span aria-hidden="true">›</span>
        </button>
      )}
    </div>
  );
}

