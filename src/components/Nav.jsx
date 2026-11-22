import { useEffect, useState } from "react";
import { scrollToTarget, stopScroll, startScroll } from "../lib/scroll";
import { useTheme } from "../lib/theme";

const links = [
  { id: "services", label: "Services" },
  { id: "work", label: "Work" },
  { id: "process", label: "Process" },
  { id: "about", label: "About" },
  { id: "faq", label: "FAQ" },
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
  const [open, setOpen] = useState(false);

  // Mobile menu: locks page scroll while open, closes on Escape or when the viewport grows.
  useEffect(() => {
    if (!open) return;
    stopScroll();
    document.documentElement.classList.add("menu-open");
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    const mq = window.matchMedia("(min-width: 761px)");
    const onMq = () => mq.matches && setOpen(false);
    window.addEventListener("keydown", onKey);
    mq.addEventListener("change", onMq);
    return () => {
      startScroll();
      document.documentElement.classList.remove("menu-open");
      window.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onMq);
    };
  }, [open]);

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
    setOpen(false);
    // Let the scroll lock release before travelling.
    requestAnimationFrame(() => goTo(id));
  };

  return (
    <header className={`nav${hidden && !open ? " is-hidden" : ""}${open ? " is-open" : ""}`}>
      <div className="nav__pill">
        <a href="#home" className="nav__logo" aria-label="Samay Bhavsar, back to top" onClick={(e) => go(e, "home")}>
          Samay <em>Bhavsar</em>
        </a>
        <span className="nav__div" aria-hidden="true" />
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
        <span className="nav__div" aria-hidden="true" />
        <ThemeSwitch />
        <a className="nav__cta" href="#contact" onClick={(e) => go(e, "contact")}>
          Start a project <span aria-hidden="true">↗</span>
        </a>
        <button type="button" className="nav__menu" aria-expanded={open} aria-controls="nav-sheet" onClick={() => setOpen((o) => !o)}>
          <span>{open ? "Close" : "Menu"}</span>
          <i aria-hidden="true" />
        </button>
      </div>
      <nav id="nav-sheet" className="nav__sheet" aria-label="Menu" hidden={!open}>
        <ol>
          {links.map((l, i) => (
            <li key={l.id} style={{ "--i": i }}>
              <a href={"#" + l.id} aria-current={current === l.id ? "page" : undefined} onClick={(e) => go(e, l.id)}>
                <span className="mono-label">{String(i + 1).padStart(2, "0")}</span>
                {l.label}
              </a>
            </li>
          ))}
        </ol>
        <a className="btn btn--solid nav__sheet-cta" href="#contact" onClick={(e) => go(e, "contact")}>
          Start a project <span aria-hidden="true" className="btn__ic">↗</span>
        </a>
      </nav>
    </header>
  );
}
