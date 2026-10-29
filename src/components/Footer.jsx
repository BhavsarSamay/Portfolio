import { useEffect, useState } from "react";
import { samayProfile } from "../data/samayProfile";
import { goTo } from "./Nav";

const time = () =>
  new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Kolkata" }).format(new Date());

export default function Footer() {
  const [now, setNow] = useState(time);
  useEffect(() => {
    const id = setInterval(() => setNow(time()), 30000);
    return () => clearInterval(id);
  }, []);

  return (
    <footer className="foot">
      <p className="foot__big" aria-hidden="true">SB</p>
      <div className="foot__row">
        <p className="mono-label">&copy; {new Date().getFullYear()} {samayProfile.name}</p>
        <p className="mono-label">Ahmedabad · {now} IST</p>
        <p className="mono-label">
          <a href={samayProfile.github} target="_blank" rel="noreferrer">GitHub</a>
          {" / "}
          <a href={samayProfile.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
        </p>
        <button type="button" className="foot__top" onClick={() => goTo("home")}>
          Back to top <span aria-hidden="true">↑</span>
        </button>
      </div>
    </footer>
  );
}
