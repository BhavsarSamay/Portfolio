import { Component, lazy, Suspense, useCallback, useEffect, useMemo, useState } from "react";
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
import Services from "./components/Services";
import Work from "./components/Work";
import Lab from "./components/Lab";
import About from "./components/About";
import Stack from "./components/Stack";
import Experience from "./components/Experience";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import SoundToggle from "./components/SoundToggle";
import { webglTier } from "./three/gpu";
import { scene3d, syncScroll } from "./three/store";

const CaseStudy = lazy(() => import("./components/CaseStudy"));
const Cosmos3D = lazy(() => import("./three/Cosmos3D"));

// If WebGL fails at runtime (lost context, driver bug), fall back to the lightweight 2D scene.
class Guard3D extends Component {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(err) {
    console.error("3D scene failed, using the 2D fallback:", err);
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

const sections = ["home", "work", "services", "about", "experience", "lab", "contact"];
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
  const tier = useMemo(webglTier, []);
  const [show3d, setShow3d] = useState(false);
  const [cosmosOn, setCosmosOn] = useState(false);

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

  // Heavy 3D work starts only once the intro has played, so the loader and hero animate smoothly.
  useEffect(() => {
    if (tier === 0 || !ready) return;
    let idle;
    const t = setTimeout(() => {
      if ("requestIdleCallback" in window) idle = requestIdleCallback(() => setShow3d(true), { timeout: 2000 });
      else setShow3d(true);
    }, 1600);
    return () => {
      clearTimeout(t);
      if (idle && window.cancelIdleCallback) cancelIdleCallback(idle);
    };
  }, [tier, ready]);

  // Feed scroll position and pointer to the WebGL scene (plain state, no React renders).
  useEffect(() => {
    syncScroll();
    const onPointer = (e) => {
      scene3d.pointer.x = e.clientX / window.innerWidth - 0.5;
      scene3d.pointer.y = e.clientY / window.innerHeight - 0.5;
    };
    window.addEventListener("scroll", syncScroll, { passive: true });
    window.addEventListener("resize", syncScroll);
    window.addEventListener("pointermove", onPointer, { passive: true });
    const ro = new ResizeObserver(syncScroll);
    ro.observe(document.body);
    return () => {
      window.removeEventListener("scroll", syncScroll);
      window.removeEventListener("resize", syncScroll);
      window.removeEventListener("pointermove", onPointer);
      ro.disconnect();
    };
  }, []);

  // Active section for the nav label.
  useEffect(() => {
    const els = [...sections, "stack"].map((id) => document.getElementById(id)).filter(Boolean);
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
      {/* The light 2D scene is always there first; the 3D scene fades in over it after the intro. */}
      {(tier === 0 || !cosmosOn) && <Backdrop />}
      {tier > 0 && show3d && (
        <Guard3D fallback={null}>
          <Suspense fallback={null}>
            <Cosmos3D tier={tier} onShown={() => setCosmosOn(true)} />
          </Suspense>
        </Guard3D>
      )}
      <Cursor />
      <Nav section={section} />
      <SoundToggle />
      <main>
        <Hero ready={ready} tier={tier} />
        <Marquee />
        <Statement />
        <Work />
        <Services />
        <About />
        <Experience />
        <Stack />
        <Lab />
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
