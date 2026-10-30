import { useEffect, useRef, useState } from "react";
import { gsap, ease, ScrollTrigger, prefersReducedMotion } from "../lib/motion";
import { samayProfile } from "../data/samayProfile";
import { useTheme } from "../lib/theme";
import Split from "./Split";
import Magnetic from "./Magnetic";
import RingText from "./RingText";

const channels = [
  { label: "Email", value: samayProfile.email, href: `mailto:${samayProfile.email}` },
  { label: "Phone", value: samayProfile.phone, href: `tel:${samayProfile.phone.replace(/\s+/g, "")}` },
  { label: "LinkedIn", value: "samay-bhavsar", href: samayProfile.linkedin, external: true },
  { label: "GitHub", value: "BhavsarSamay", href: samayProfile.github, external: true },
];

const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

export default function Contact() {
  const root = useRef(null);
  const [theme] = useTheme();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | opened
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      // The whole closing scene turns lime as it arrives.
      gsap.fromTo(root.current, { "--sec-bg": getComputedStyle(document.documentElement).getPropertyValue("--bg").trim(), "--sec-fg": getComputedStyle(document.documentElement).getPropertyValue("--fg").trim() }, {
        "--sec-bg": "#C7FF3D", "--sec-fg": "#080808", ease: "none",
        scrollTrigger: { trigger: root.current, start: "top 85%", end: "top 25%", scrub: true },
      });
      gsap.fromTo(".contact__title .c", { yPercent: 115 }, {
        yPercent: 0, duration: 1.2, stagger: 0.02, ease: ease.out,
        scrollTrigger: { trigger: ".contact__title", start: "top 80%" },
      });
      gsap.fromTo(".contact__fade", { opacity: 0, y: 30 }, {
        opacity: 1, y: 0, duration: 0.9, stagger: 0.08, ease: ease.out,
        scrollTrigger: { trigger: ".contact__row", start: "top 85%" },
      });
    }, root);
    return () => ctx.revert();
  }, [theme]);

  const set = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    setErrors((er) => ({ ...er, [k]: undefined }));
    setStatus("idle");
  };

  // There is no backend, so the form opens the visitor's email app with the message prefilled.
  const submit = (e) => {
    e.preventDefault();
    const er = {};
    if (!form.name.trim()) er.name = "Please add your name.";
    if (!emailOk(form.email)) er.email = "Please enter a valid email address.";
    if (form.message.trim().length < 5) er.message = "Please write a short message.";
    setErrors(er);
    if (Object.keys(er).length) return;
    const subject = encodeURIComponent(`Portfolio enquiry from ${form.name.trim()}`);
    const body = encodeURIComponent(`${form.message.trim()}\n\n${form.name.trim()}\n${form.email.trim()}`);
    window.location.href = `mailto:${samayProfile.email}?subject=${subject}&body=${body}`;
    setStatus("opened");
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(samayProfile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable; the mailto link still works */
    }
  };

  return (
    <section id="contact" ref={root} className="contact" aria-labelledby="contact-h">
      <div className="sec__head">
        <p className="mono-label">[ 06 ] Contact</p>
        <p className="mono-label">Ahmedabad, IN</p>
      </div>

      <h2 id="contact-h" className="contact__title">
        <Split text="Have something" />
        <Split text="interesting" />
        <Split text="in mind?" className="hollow" />
      </h2>

      <div className="contact__cta contact__fade">
        <Magnetic as="a" href={`mailto:${samayProfile.email}`} className="orb" data-cursor="Write" strength={0.4}>
          <RingText text="Let's talk · Say hello · Get in touch · " className="orb__ring" />
          <span>Say hello</span>
          <i aria-hidden="true">↗</i>
        </Magnetic>
      </div>

      <div className="contact__row">
        <ul className="channels contact__fade">
          {channels.map((c) => (
            <li key={c.label}>
              <span className="mono-label">{c.label}</span>
              <a href={c.href} {...(c.external ? { target: "_blank", rel: "noreferrer" } : {})}>
                {c.value}{c.external ? " ↗" : ""}
              </a>
            </li>
          ))}
          <li>
            <span className="mono-label">Copy</span>
            <button type="button" className="linkbtn" onClick={copy}>
              {copied ? "Copied to clipboard" : "Copy email address"}
            </button>
          </li>
        </ul>

        <form className="form contact__fade" onSubmit={submit} noValidate>
          <p className="mono-label">Or write from here</p>
          <label>
            <span>Name</span>
            <input value={form.name} onChange={set("name")} autoComplete="name" aria-invalid={!!errors.name} aria-describedby={errors.name ? "e-name" : undefined} />
            {errors.name && <em id="e-name" role="alert">{errors.name}</em>}
          </label>
          <label>
            <span>Email</span>
            <input type="email" value={form.email} onChange={set("email")} autoComplete="email" aria-invalid={!!errors.email} aria-describedby={errors.email ? "e-email" : undefined} />
            {errors.email && <em id="e-email" role="alert">{errors.email}</em>}
          </label>
          <label>
            <span>Message</span>
            <textarea rows="4" value={form.message} onChange={set("message")} aria-invalid={!!errors.message} aria-describedby={errors.message ? "e-msg" : undefined} />
            {errors.message && <em id="e-msg" role="alert">{errors.message}</em>}
          </label>
          <button type="submit" className="btn btn--dark">Open in my email app <span aria-hidden="true">↗</span></button>
          <p className="form__note" role="status">
            {status === "opened"
              ? "Your email app should have opened with the message ready to send. If it didn’t, use the address above."
              : "This opens your email app with the message prefilled. Nothing is sent until you press send there."}
          </p>
        </form>
      </div>
    </section>
  );
}
