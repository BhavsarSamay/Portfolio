// Client-facing content. Everything here is grounded in real work on this site:
// no testimonials, client logos, prices or invented metrics.

export const services = [
  {
    id: "ai",
    n: "01",
    title: ["AI agents", "& chatbots"],
    line: "Put an assistant inside your product or your operations, grounded in your own data.",
    gets: ["RAG chatbots trained on your docs", "Agent workflows with tool calling", "Integrated into your app or site", "Guardrails against wrong answers"],
    proof: [
      { id: "siteassist", label: "SiteAssist" },
      { id: "agentic-ai", label: "Agentic AI" },
    ],
  },
  {
    id: "mvp",
    n: "02",
    title: ["MVPs", "& web apps"],
    line: "From idea to a product people can sign up for, pay for and actually use.",
    gets: ["React and Node.js, end to end", "Auth, Stripe payments, real-time", "Admin dashboards for your team", "Deployed and ready for users"],
    proof: [
      { id: "cosmicquest", label: "CosmicQuest" },
      { id: "echoing-ideas", label: "Echoing Ideas" },
    ],
  },
  {
    id: "product",
    n: "03",
    title: ["Product", "& systems design"],
    line: "The spec and the architecture before a line of code, so the build doesn't fall apart at scale.",
    gets: ["PRDs and user journeys", "System architecture and data model", "API contracts and multi-role flows", "A build plan your team can follow"],
    proof: [{ href: "#work-veracity", label: "Veracity platforms" }],
  },
  {
    id: "web",
    n: "04",
    title: ["Websites", "& landing pages"],
    line: "A site that makes a small team look established, with motion that earns attention.",
    gets: ["Design and build in one pass", "Motion, 3D and interaction", "Fast, responsive, accessible", "Contact flows that reach your inbox"],
    proof: [{ href: "#lab", label: "This site & the lab" }],
  },
];

export const reasons = [
  {
    k: "Product + engineering",
    v: "One person owns the why and the how, so nothing is lost in a handoff between a PM and a developer.",
  },
  {
    k: "Built for production",
    v: "I architect live gig workforce, recruitment and payroll & compliance platforms at Veracity Supply Chain.",
  },
  {
    k: "AI that ships",
    v: "Agentic workflows and a RAG chatbot built for real users at SaturnCube, where I was Star Performer of the Month.",
  },
];

export const process = [
  { n: "01", title: "Intro call", body: "A 30-minute call about the idea, who it is for and what a win looks like. I ask the awkward questions early." },
  { n: "02", title: "Scope & plan", body: "A written scope: what we build first, what waits, the architecture, and a quote before any work starts." },
  { n: "03", title: "Build in sprints", body: "Every week you get a build you can click through, not a status report. Priorities can change as you learn." },
  { n: "04", title: "Launch & handover", body: "Deployed, documented and yours: the code, the accounts and a walkthrough so your team can carry it on." },
];

export const faq = [
  {
    q: "I'm not technical. Can we still work together?",
    a: "Yes. Most founders I talk to aren't. I turn the idea into a spec, build it, and explain every decision in plain language.",
  },
  {
    q: "What does a project cost?",
    a: "It depends on scope. After the intro call you get a written scope and a quote, so you know the cost before anything starts.",
  },
  {
    q: "Who owns the code?",
    a: "You do. The repository, hosting and third-party accounts are set up in your name, and everything is handed over at launch.",
  },
  {
    q: "Can you work on a product that already exists?",
    a: "Yes. I can join an existing codebase, add an AI feature to it, or untangle architecture that has grown messy.",
  },
  {
    q: "Where are you based?",
    a: "Ahmedabad, India. I work remotely with founders anywhere and we agree on call times that suit both time zones.",
  },
];

export const projectTypes = ["AI agent or chatbot", "MVP or web app", "Product & systems design", "Website or landing page", "Not sure yet"];
