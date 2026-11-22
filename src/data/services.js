// "What I build" content. Everything here is grounded in real work on this site:
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
