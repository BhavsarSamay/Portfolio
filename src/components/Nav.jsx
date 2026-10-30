import { useEffect, useState } from "react";
import { scrollToTarget } from "../lib/scroll";
import { useTheme } from "../lib/theme";
import { samayProfile } from "../data/samayProfile";

const links = [
  { id: "work", label: "Work" },
  { id: "lab", label: "Lab" },
  { id: "about", label: "About" },
  { id: "stack", label: "Skills" },
  { id: "experience", label: "Experience", short: "Exp" },
  { id: "contact", label: "Contact" },
];

// Scrolls without writing section hashes into the URL, so a refresh stays where you are.
export function goTo(id) {
  scrollToTarget(id === "home" ? 0 : "#" + id);
}

function ThemeSwitch() {
  const [theme, toggle] = useTheme();
  const light = theme === "light";
  return (
    <button type="button" className="tswitch" role="switch" aria-checked={light} aria-label="Light mode" onClick={toggle}>
      <svg className="tswitch__moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5Z" /></svg>
      <svg className="tswitch__sun" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </svg>
      <span className="tswitch__thumb" />
    </button>
  );
}

// Floating pill: slides away while scrolling down and returns as soon as you scroll up.
export default function Nav({ section }) {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      if (Math.abs(y - last) > 6) {
        setHidden(y > last && y > 400);
        last = y;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const current = section;
  const go = (e, id) => {
    e.preventDefault();
    goTo(id);
  };

  return (
    <header className={`nav${hidden ? " is-hidden" : ""}`}>
      <div className="nav__pill">
        <a href="#home" className="nav__logo" aria-label="Samay Bhavsar, back to top" onClick={(e) => go(e, "home")}>
          SB<span>.</span>
        </a>
        <nav className="nav__links" aria-label="Primary">
          {links.map((l) => (
            <a key={l.id} href={"#" + l.id} className="nav__link" aria-current={current === l.id ? "page" : undefined} onClick={(e) => go(e, l.id)}>
              {l.short ? (
                <>
                  <span className="nav__full">{l.label}</span>
                  <span className="nav__short" aria-hidden="true">{l.short}</span>
                </>
              ) : (
                l.label
              )}
            </a>
          ))}
        </nav>
        <ThemeSwitch />
        <a className="nav__cta" href={`mailto:${samayProfile.email}`}>
          Say hello <span aria-hidden="true">↗</span>
        </a>
      </div>
    </header>
  );
}
