import { lazy, Suspense, useCallback, useEffect, useState } from "react";
import { ScrollTrigger, prefersReducedMotion } from "./lib/motion";
import { initScroll, destroyScroll, scrollToTarget } from "./lib/scroll";
import { useCaseRoute } from "./lib/route";
import Loader from "./components/Loader";
import Cursor from "./components/Cursor";
import Nav from "./components/Nav";
import Backdrop from "./components/Backdrop";
import Hero from "./components/Hero";
import Marquee from "./components/Marquee";
import Statement from "./components/Statement";
import Work from "./components/Work";
import Lab from "./components/Lab";
import About from "./components/About";
import Stack from "./components/Stack";
import Experience from "./components/Experience";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

const CaseStudy = lazy(() => import("./components/CaseStudy"));

const sections = ["home", "work", "lab", "about", "contact"];
const seen = () => {
  if (prefersReducedMotion()) return true;
  try {
    return sessionStorage.getItem("sb-intro") === "1";
  } catch {
    return false;
  }
};

export default function App() {
  const [ready, setReady] = useState(seen);
  const [section, setSection] = useState("home");
  const caseId = useCaseRoute();

  const [showLoader, setShowLoader] = useState(() => !seen());

  const done = useCallback(() => setShowLoader(false), []);
  const onReady = useCallback(() => {
    setReady(true);
    try {
      sessionStorage.setItem("sb-intro", "1");
    } catch {
      /* private mode: the loader simply plays again next visit */
    }
  }, []);

  useEffect(() => {
    initScroll();
    return destroyScroll;
  }, []);

  // Active section for the nav label.
  useEffect(() => {
    const els = [...sections, "stack", "experience"].map((id) => document.getElementById(id)).filter(Boolean);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setSection(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // Section hashes (a bookmark, the skip link, closing a deep-linked case study) scroll once and are then
  // removed from the URL, so a refresh never jumps back to that section.
  useEffect(() => {
    const clean = () => history.replaceState(null, "", location.pathname + location.search);
    const onHash = () => {
      const h = location.hash;
      if (!h || h.startsWith("#/")) return;
      scrollToTarget(h);
      clean();
    };
    window.addEventListener("hashchange", onHash);
    if (location.hash && !location.hash.startsWith("#/")) clean();
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  // Layout settles after fonts load, so recompute scroll positions once.
  useEffect(() => {
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
  }, []);

  return (
    <>
      <a className="skip" href="#work">Skip to work</a>
      {showLoader && <Loader onReady={onReady} onDone={done} />}
      <Backdrop />
      <Cursor />
      <Nav section={section} />
      <main>
        <Hero ready={ready} />
        <Marquee />
        <Statement />
        <Work />
        <Lab />
        <About />
        <Stack />
        <Experience />
        <Contact />
      </main>
      <Footer />
      {caseId && (
        <Suspense fallback={null}>
          <CaseStudy id={caseId} />
        </Suspense>
      )}
    </>
  );
}
