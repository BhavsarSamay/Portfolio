import { useSound } from "../lib/sound";

// Small floating switch for the ambient soundtrack. Off by default; never plays without a click.
export default function SoundToggle() {
  const [on, toggle] = useSound();
  return (
    <button type="button" className={`sound${on ? " is-on" : ""}`} aria-pressed={on} aria-label="Ambient sound" title={on ? "Sound on" : "Sound off"} onClick={toggle}>
      <span className="sound__bars" aria-hidden="true">
        <i /><i /><i /><i />
      </span>
      <span className="sound__label">{on ? "Sound on" : "Sound off"}</span>
    </button>
  );
}
