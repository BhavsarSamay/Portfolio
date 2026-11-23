import { useEffect, useRef, useState } from "react";
import { gsap, ease, ScrollTrigger, prefersReducedMotion } from "../lib/motion";
import { samayProfile } from "../data/samayProfile";
import { useTheme } from "../lib/theme";
import Split from "./Split";
import Magnetic from "./Magnetic";
import RingText from "./RingText";
import Chapter from "./Chapter";

const channels = [
  { label: "Email", value: samayProfile.email, href: `mailto:${samayProfile.email}` },
  { label: "Phone", value: samayProfile.phone, href: `tel:${samayProfile.phone.replace(/\s+/g, "")}` },
  { label: "LinkedIn", value: "samay-bhavsar", href: samayProfile.linkedin, external: true },
  { label: "GitHub", value: "BhavsarSamay", href: samayProfile.github, external: true },
];

const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const MAX = 4000; // same limit as the server
const DRAFT_KEY = "sb-contact-draft";
const EMPTY = { name: "", email: "", message: "", website: "" };

function loadDraft() {
  try {
    const d = JSON.parse(sessionStorage.getItem(DRAFT_KEY) || "null");
    return d ? { ...EMPTY, ...d, website: "" } : EMPTY;
  } catch {
    return EMPTY;
  }
}

function validate(f) {
  const er = {};
  if (!f.name.trim()) er.name = "Please add your name.";
  else if (f.name.trim().length > 100) er.name = "That name is a little long.";
  if (!f.email.trim()) er.email = "Please add your email so I can reply.";
  else if (!emailOk(f.email.trim())) er.email = "That email doesn't look right.";
  if (f.message.trim().length < 10) er.message = "A sentence or two, please (at least 10 characters).";
  else if (f.message.length > MAX) er.message = `Please keep it under ${MAX} characters.`;
  return er;
}

export default function Contact() {
  const root = useRef(null);
  const [theme] = useTheme();
  const [form, setForm] = useState(loadDraft);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [serverError, setServerError] = useState("");
  const [copied, setCopied] = useState(false);
  const formRef = useRef(null);
  const msgRef = useRef(null);

  // Keep a draft in this browser, so a refresh or an accidental close never loses a long message.
  useEffect(() => {
    try {
      if (form.name || form.email || form.message) sessionStorage.setItem(DRAFT_KEY, JSON.stringify(form));
      else sessionStorage.removeItem(DRAFT_KEY);
    } catch {
      /* storage unavailable: the form still works, just without a draft */
    }
  }, [form]);

  // The message box grows with its content.
  useEffect(() => {
    const el = msgRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 420)}px`;
  }, [form.message, status]);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      // A warm light rises over the closing scene as it arrives.
      gsap.fromTo(root.current, { "--glow": 0 }, {
        "--glow": 1,
        ease: "none",
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
    const v = e.target.value;
    setForm((f) => ({ ...f, [k]: v }));
    if (touched[k]) setErrors((er) => ({ ...er, [k]: validate({ ...form, [k]: v })[k] }));
    if (status === "error") setStatus("idle");
  };
  const blur = (k) => () => {
    if (!form[k]) return; // don't scold an empty field the visitor just tabbed past
    setTouched((t) => ({ ...t, [k]: true }));
    setErrors((er) => ({ ...er, [k]: validate(form)[k] }));
  };

  // Posts to the /api/contact serverless function, which emails the message to the site owner.
  const submit = async (e) => {
    e?.preventDefault();
    if (status === "sending") return;
    const er = validate(form);
    setErrors(er);
    setTouched({ name: true, email: true, message: true });
    if (Object.keys(er).length) {
      const f = formRef.current;
      f?.querySelector(`[name="${Object.keys(er)[0]}"]`)?.focus();
      f?.classList.remove("is-shake");
      void f?.offsetWidth; // restart the shake animation
      f?.classList.add("is-shake");
      return;
    }

    setStatus("sending");
    setServerError("");
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 15000);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name.trim(), email: form.email.trim(), message: form.message.trim(), website: form.website }),
        signal: ctrl.signal,
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        setStatus("sent");
        setForm(EMPTY);
        setTouched({});
        setErrors({});
        try { sessionStorage.removeItem(DRAFT_KEY); } catch { /* ignore */ }
      } else {
        setServerError(data.error || "The message could not be sent.");
        setStatus("error");
      }
    } catch (err) {
      setServerError(err?.name === "AbortError" ? "The server took too long to respond." : "Could not reach the server.");
      setStatus("error");
    } finally {
      clearTimeout(timer);
    }
  };

  // Fallback when delivery fails: the visitor's own email app, with their message already written.
  const mailto = `mailto:${samayProfile.email}?subject=${encodeURIComponent(`Hello from ${form.name.trim() || "your portfolio"}`)}&body=${encodeURIComponent(form.message.trim())}`;

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
      <Chapter n="07" />
      <div className="sec__head">
        <p className="mono-label">[ 07 ] Contact</p>
        <p className="mono-label">Remote · Ahmedabad, IN</p>
      </div>

      <h2 id="contact-h" className="contact__title">
        <Split text="Have something" />
        <Split text="interesting" className="it" />
        <Split text="in mind?" />
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

        <div className="form contact__fade" data-status={status}>
          {status === "sent" ? (
            <div className="form__done" role="status">
              <svg className="form__check" viewBox="0 0 52 52" aria-hidden="true">
                <circle cx="26" cy="26" r="24" pathLength="1" />
                <path d="M15 27l7 7 15-16" pathLength="1" />
              </svg>
              <h3>Message sent.</h3>
              <p>Thank you. It&rsquo;s in my inbox, and I&rsquo;ll reply to the email you gave.</p>
              <button type="button" className="linkbtn form__again" onClick={() => setStatus("idle")}>Send another message</button>
            </div>
          ) : (
            <form
              ref={formRef}
              onSubmit={submit}
              onAnimationEnd={(e) => e.currentTarget.classList.remove("is-shake")}
              onKeyDown={(e) => { if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) submit(e); }}
              noValidate
            >
              <p className="form__lead">Or write from here.</p>
              <div className="form__pair">
                <Field id="c-name" name="name" label="Your name" value={form.name} error={errors.name} onChange={set("name")} onBlur={blur("name")} autoComplete="name" maxLength={100} />
                <Field id="c-email" name="email" type="email" label="Email" value={form.email} error={errors.email} onChange={set("email")} onBlur={blur("email")} autoComplete="email" inputMode="email" maxLength={200} />
              </div>
              <Field
                id="c-msg" name="message" label="Message" value={form.message} error={errors.message} onChange={set("message")} onBlur={blur("message")} textarea inputRef={msgRef}
                hint={<span className={`form__count${form.message.length > MAX ? " is-over" : ""}`}>{form.message.length} / {MAX}</span>}
              />
              {/* Honeypot: hidden from people, tempting to bots. */}
              <div className="form__hp" aria-hidden="true">
                <label>
                  Leave this field empty
                  <input tabIndex={-1} autoComplete="off" value={form.website} onChange={set("website")} />
                </label>
              </div>
              <div className="form__send">
                <button type="submit" className="btn btn--solid form__btn" disabled={status === "sending"} aria-busy={status === "sending"}>
                  <span>{status === "sending" ? "Sending" : "Send message"}</span>
                  <span aria-hidden="true" className="btn__ic">{status === "sending" ? <i className="form__spin" /> : "↗"}</span>
                </button>
                <p className="form__note mono-label" aria-hidden="true">Ctrl + Enter to send</p>
              </div>
              <div className="form__status" role="status" aria-live="polite">
                {status === "error" && (
                  <div className="form__fail">
                    <p><strong>{serverError}</strong> Your message is still here, so nothing is lost. You can send it from your email app instead:</p>
                    <div className="form__fail-actions">
                      <a className="btn btn--ghost" href={mailto}>Open in email app <span aria-hidden="true" className="btn__ic">↗</span></a>
                      <button type="button" className="linkbtn" onClick={submit}>Try again</button>
                    </div>
                  </div>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

// Floating-label field: the label rests inside the box and rises when the field is focused or filled.
function Field({ id, label, error, textarea, inputRef, hint, ...rest }) {
  const Tag = textarea ? "textarea" : "input";
  return (
    <div className={`field${error ? " has-error" : ""}${rest.value ? " is-filled" : ""}`}>
      <Tag id={id} ref={inputRef} placeholder=" " rows={textarea ? 3 : undefined} aria-invalid={!!error} aria-describedby={error ? `${id}-err` : undefined} {...rest} />
      <label htmlFor={id}>{label}</label>
      <span className="field__line" aria-hidden="true" />
      <div className="field__meta">
        {error ? <em id={`${id}-err`}>{error}</em> : <span />}
        {hint}
      </div>
    </div>
  );
}
