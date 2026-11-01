// Vercel serverless function: POST /api/contact
// Sends the contact form to your inbox through Resend (https://resend.com).
//
// Secrets are read from environment variables and never reach the browser:
//   RESEND_API_KEY      required  your Resend API key
//   CONTACT_TO_EMAIL    required  the inbox that receives messages
//   CONTACT_FROM_EMAIL  optional  sender shown in your inbox
//                                 (default "Portfolio Contact <onboarding@resend.dev>")

const WINDOW_MS = 60 * 60 * 1000; // rate-limit window: 1 hour
const MAX_PER_WINDOW = 5; // messages per visitor per window
const hits = new Map(); // best effort: memory is per serverless instance

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const escapeHtml = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const oneLine = (s) => String(s).replace(/[\r\n]+/g, " ").trim();

function send(res, status, body) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(body));
}

async function readJson(req) {
  if (req.body !== undefined && req.body !== null) {
    return typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body;
  }
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > 20_000) throw new Error("Payload too large");
    chunks.push(chunk);
  }
  return JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}");
}

function limited(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  return false;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return send(res, 405, { ok: false, error: "Method not allowed." });
  }

  let data;
  try {
    data = await readJson(req);
  } catch {
    return send(res, 400, { ok: false, error: "Invalid request." });
  }

  // Honeypot: real visitors never fill this hidden field, so pretend success and drop the message.
  if (typeof data.website === "string" && data.website.trim() !== "") return send(res, 200, { ok: true });

  const name = oneLine(data.name ?? "");
  const email = oneLine(data.email ?? "");
  const message = String(data.message ?? "").trim();

  if (!name || name.length > 100) return send(res, 400, { ok: false, error: "Please enter your name." });
  if (!EMAIL_RE.test(email) || email.length > 200) return send(res, 400, { ok: false, error: "Please enter a valid email address." });
  if (message.length < 5 || message.length > 4000) return send(res, 400, { ok: false, error: "Please write a message between 5 and 4000 characters." });

  const ip = String(req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "unknown").split(",")[0].trim();
  if (limited(ip)) return send(res, 429, { ok: false, error: "Too many messages. Please try again later." });

  const key = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL || "Portfolio Contact <onboarding@resend.dev>";
  if (!key || !to) {
    console.error("contact: RESEND_API_KEY or CONTACT_TO_EMAIL is not set");
    return send(res, 500, { ok: false, error: "The contact service is not configured yet." });
  }

  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: email,
        subject: `Portfolio message from ${name}`,
        text: `${message}\n\n-- \n${name} <${email}>`,
        html: `<div style="font-family:system-ui,sans-serif;font-size:15px;line-height:1.6;color:#111">
          <p style="white-space:pre-wrap;margin:0 0 16px">${escapeHtml(message)}</p>
          <hr style="border:none;border-top:1px solid #ddd;margin:16px 0" />
          <p style="margin:0;color:#555">From <strong>${escapeHtml(name)}</strong> (<a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a>)<br/>Sent from your portfolio contact form. Reply to answer them directly.</p>
        </div>`,
      }),
    });
    if (!r.ok) {
      // Log only the status, never the key or the visitor's message.
      console.error("contact: Resend responded with status", r.status);
      return send(res, 502, { ok: false, error: "Could not send your message right now." });
    }
    return send(res, 200, { ok: true });
  } catch (err) {
    console.error("contact: request to Resend failed:", err?.message);
    return send(res, 502, { ok: false, error: "Could not send your message right now." });
  }
}
