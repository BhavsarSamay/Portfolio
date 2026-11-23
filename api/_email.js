// HTML email for contact-form messages, matching the portfolio (ink, cream, champagne gold).
// Table layout and inline styles only, so it renders the same in Gmail, Outlook and mobile clients.
// The leading underscore keeps Vercel from exposing this file as an API route.

const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

const SANS = "-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif";
const SERIF = "Georgia,'Times New Roman',serif";
const MONO = "'SFMono-Regular',Consolas,'Liberation Mono',Menlo,monospace";

export function contactEmail({ name, email, message, receivedAt = new Date() }) {
  const when = new Intl.DateTimeFormat("en-GB", {
    weekday: "short", day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", timeZone: "Asia/Kolkata",
  }).format(receivedAt);
  const words = message.trim().split(/\s+/).length;
  const first = name.split(" ")[0];
  const replyHref = `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent("Re: your message")}`;
  const preview = message.replace(/\s+/g, " ").slice(0, 110);

  const subject = `New message from ${name}`;

  const text = [
    `New message from your portfolio`,
    ``,
    `From:     ${name} <${email}>`,
    `Received: ${when} IST`,
    ``,
    message,
    ``,
    `--`,
    `Reply to this email to answer ${first} directly.`,
  ].join("\n");

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light only">
<title>${esc(subject)}</title>
</head>
<body style="margin:0;padding:0;background:#efeae0;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${esc(preview)}&#8199;&#65279;&#847;&#8199;&#65279;&#847;</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#efeae0" style="background:#efeae0;">
  <tr><td align="center" style="padding:32px 14px;">
    <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;">

      <!-- Header -->
      <tr><td bgcolor="#0b0b0d" style="background:#0b0b0d;border-radius:18px 18px 0 0;padding:28px 32px 26px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
          <td style="font-family:${SANS};font-size:16px;color:#ece7dc;letter-spacing:-0.2px;">
            Samay <span style="font-family:${SERIF};font-style:italic;color:#e2c58c;font-size:18px;">Bhavsar</span>
          </td>
          <td align="right" style="font-family:${MONO};font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#8b877f;">Portfolio &middot; Contact</td>
        </tr></table>
        <div style="height:1px;line-height:1px;background:#2a2722;margin:22px 0 22px;">&nbsp;</div>
        <div style="font-family:${MONO};font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#e2c58c;">New message</div>
        <div style="font-family:${SANS};font-size:30px;line-height:1.15;color:#ece7dc;letter-spacing:-0.8px;margin-top:10px;">
          ${esc(first)} <span style="font-family:${SERIF};font-style:italic;color:#e2c58c;">wrote to you.</span>
        </div>
      </td></tr>
      <tr><td bgcolor="#e2c58c" style="background:#e2c58c;height:3px;line-height:3px;font-size:0;">&nbsp;</td></tr>

      <!-- Body -->
      <tr><td bgcolor="#fbf8f2" style="background:#fbf8f2;padding:30px 32px 8px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td style="padding:0 0 14px;font-family:${MONO};font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:#8a857b;width:90px;vertical-align:top;">From</td>
            <td style="padding:0 0 14px;font-family:${SANS};font-size:16px;color:#141210;vertical-align:top;"><strong style="font-weight:600;">${esc(name)}</strong></td>
          </tr>
          <tr>
            <td style="padding:0 0 14px;font-family:${MONO};font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:#8a857b;vertical-align:top;">Email</td>
            <td style="padding:0 0 14px;font-family:${SANS};font-size:16px;vertical-align:top;"><a href="mailto:${esc(email)}" style="color:#8c6a2e;text-decoration:none;">${esc(email)}</a></td>
          </tr>
          <tr>
            <td style="padding:0 0 6px;font-family:${MONO};font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:#8a857b;vertical-align:top;">Received</td>
            <td style="padding:0 0 6px;font-family:${SANS};font-size:15px;color:#5f5c55;vertical-align:top;">${esc(when)} IST</td>
          </tr>
        </table>
      </td></tr>
      <tr><td bgcolor="#fbf8f2" style="background:#fbf8f2;padding:18px 32px 6px;">
        <div style="font-family:${MONO};font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:#8a857b;margin-bottom:10px;">Message &middot; ${words} word${words === 1 ? "" : "s"}</div>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
          <td style="border-left:3px solid #e2c58c;background:#f3eee3;border-radius:0 10px 10px 0;padding:18px 20px;font-family:${SANS};font-size:16px;line-height:1.65;color:#1c1a17;white-space:pre-wrap;word-break:break-word;">${esc(message)}</td>
        </tr></table>
      </td></tr>

      <!-- Reply -->
      <tr><td bgcolor="#fbf8f2" style="background:#fbf8f2;padding:26px 32px 32px;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
          <td bgcolor="#0b0b0d" style="background:#0b0b0d;border-radius:999px;">
            <a href="${replyHref}" style="display:inline-block;padding:14px 26px;font-family:${SANS};font-size:15px;font-weight:600;color:#e2c58c;text-decoration:none;letter-spacing:-0.1px;">Reply to ${esc(first)} &nbsp;&#8599;</a>
          </td>
        </tr></table>
        <div style="font-family:${SANS};font-size:13px;line-height:1.5;color:#8a857b;margin-top:14px;">Or just hit reply: this email's reply-to is set to ${esc(email)}.</div>
      </td></tr>

      <!-- Footer -->
      <tr><td bgcolor="#0b0b0d" style="background:#0b0b0d;border-radius:0 0 18px 18px;padding:18px 32px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
          <td style="font-family:${MONO};font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:#6f6a61;">Sent from the contact form on your portfolio</td>
          <td align="right" style="font-family:${SERIF};font-style:italic;font-size:18px;color:#e2c58c;">SB</td>
        </tr></table>
      </td></tr>

    </table>
  </td></tr>
</table>
</body>
</html>`;

  return { subject, text, html };
}
