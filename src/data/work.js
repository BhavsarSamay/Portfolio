import { earlierProjects } from "./projects";
import { veracityPlatforms } from "./products";

// Presentation layer over the existing project data.
// Unverified fields from projects.js (metrics, stats, stock images) are intentionally not used.
const meta = {
  siteassist: { group: "AI & Agents", motif: "chat", index: "01" },
  "agentic-ai": { group: "AI & Agents", motif: "graph", index: "02" },
  cosmicquest: { group: "Systems", motif: "orbit", index: "03" },
  "echoing-ideas": { group: "Full-Stack", motif: "type", index: "04" },
  bizcart: { group: "Full-Stack", motif: "stock", index: "05" },
  microservices: { group: "Systems", motif: "mesh", index: "06" },
};

export const workFilters = ["All", "AI & Agents", "Full-Stack", "Systems"];

export const work = earlierProjects.map((p) => {
  const [name, ...rest] = p.title.split(":");
  return {
    id: p.id,
    name: name.trim(),
    subtitle: rest.join(":").trim(),
    tagline: p.tagline,
    description: p.description,
    tech: p.tech,
    href: p.githubUrl,
    problem: p.problemStatement,
    architecture: p.architecture,
    pipeline: p.pipelineStages,
    challenges: p.challenges,
    stack: p.techStack,
    highlights: p.highlights,
    code: p.codeSnippet,
    ...meta[p.id],
  };
});

export const enterprise = veracityPlatforms.map((p, i) => ({
  id: p.id,
  index: `0${i + 1}`,
  label: p.label,
  role: p.role,
  overview: p.overview,
  tags: p.tags,
}));
