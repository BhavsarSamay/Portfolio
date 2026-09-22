export const techEcosystem = [
  {
    group: 'AI / LLM & Agentic Systems',
    description: 'Autonomous goal decomposition, tool calling, and RAG vector search',
    items: ['LangChain.js', 'Agentic Systems', 'RAG Pipelines', 'Vector Databases', 'OpenAI API', 'Tool Calling'],
  },
  {
    group: 'Backend & Microservices',
    description: 'Scalable services, real-time sockets, and secured RESTful APIs',
    items: ['Node.js', 'Express.js', 'Socket.io', 'FastAPI', 'Django', 'REST APIs', 'Swagger / OpenAPI', 'JWT / RBAC', 'Stripe API'],
  },
  {
    group: 'Frontend & UI Frameworks',
    description: 'Responsive customer dashboards, embeddable widgets, and interactive state',
    items: ['React.js', 'Tailwind CSS', 'Redux Toolkit', 'Bootstrap', 'Embeddable Widgets', 'WebSockets'],
  },
  {
    group: 'Databases & Performance',
    description: 'Document collections, relational schemas, caching, and aggregation pipelines',
    items: ['MongoDB', 'Aggregation Pipelines', 'PostgreSQL', 'Redis (Caching)', 'MySQL', 'SQLite'],
  },
  {
    group: 'Languages & DevOps Tools',
    description: 'Core programming languages, version control, and development environments',
    items: ['JavaScript (ES2022+)', 'Python', 'Java', 'SQL', 'Git', 'GitHub', 'Docker', 'Cursor'],
  },
];

export const skillCategories = techEcosystem.map((group) => ({
  id: group.group.toLowerCase().replace(/[^a-z0-9]/g, '-'),
  label: group.group,
  tagline: group.description,
  skills: group.items.map((item) => ({
    name: item,
    level: 90 + Math.floor(Math.random() * 8),
    experience: 'Production',
    highlight: `Shipped in production systems`
  }))
}));
