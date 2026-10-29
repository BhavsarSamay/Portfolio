import { useEffect, useState } from "react";

// Tiny hash router: "#/work/<id>" opens a case study, everything else is the single page.
export const origin = { rect: null, el: null };

const read = () => {
  const m = location.hash.match(/^#\/work\/([\w-]+)/);
  return m ? m[1] : null;
};

export function useCaseRoute() {
  const [id, setId] = useState(read);
  useEffect(() => {
    const on = () => setId(read());
    window.addEventListener("hashchange", on);
    window.addEventListener("popstate", on);
    return () => {
      window.removeEventListener("hashchange", on);
      window.removeEventListener("popstate", on);
    };
  }, []);
  return id;
}

export function openCase(e, id) {
  origin.rect = e.currentTarget.getBoundingClientRect();
  origin.el = e.currentTarget;
  origin.scrollY = window.scrollY;
}

export function closeCase() {
  // Came from inside the app: step back. Deep link: land on the work section.
  if (history.state?.fromApp || origin.el) history.back();
  else location.replace(location.pathname + "#work");
}
