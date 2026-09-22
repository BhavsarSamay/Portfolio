/**
 * Veracity Supply Chain Limited — Enterprise Products
 * Product Architecture, User Flow & Systems Design by Samay Bhavsar (Product Manager & Full-Stack Engineer)
 * Note: High-level architectural overviews presented in compliance with non-disclosure agreements (NDA).
 */

export const bharatGigData = {
  id: 'bharatgig',
  title: 'BharatGIG',
  tagline: 'Geographic Gig Workforce Deployment & Field Operations Platform',
  category: 'PRODUCT ARCHITECTURE // TWO-SIDED PLATFORM',
  status: 'In Active Operations',
  role: 'Product Manager (Product Flow, Architecture & Engineering)',
  company: 'Veracity Supply Chain Limited',
  summary:
    'BharatGIG is a gig workforce deployment platform designed to connect enterprise clients needing field verification and ground operations with distributed field executives and vendor teams. Architected around location-aware workflows where field requests and fulfillment adapt to physical coordinates.',
  panels: [
    {
      name: 'Admin Panel',
      target: 'Operations & Policy Team',
      desc: 'Central command interface for onboarding enterprise clients, configuring process workflows, reviewing completed field submissions, and monitoring operational SLA compliance.',
    },
    {
      name: 'Client Panel',
      target: 'Enterprise Clients',
      desc: 'Enables enterprise organizations to initiate batch field requests, track fulfillment status in real time, and download verified digital dossiers.',
    },
    {
      name: 'Branch Manager Portal',
      target: 'Branch-Level Administrators',
      desc: 'Scoped role designed for client organizations managed on a localized branch-by-branch model, providing local request visibility.',
    },
    {
      name: 'GIG Worker App',
      target: 'Field Workforce & Vendor Executives',
      desc: 'Mobile application allowing field personnel to view nearby tasks, verify attendance before kickoff, capture on-site data/photos, and track completion earnings.',
    },
  ],
  pricingArchitecture: [
    {
      title: 'Branch-Distance Logic',
      desc: 'Workflow routing and task pricing dynamically calculated based on proximity to client branch locations.',
    },
    {
      title: 'Zonal Territorial Logic',
      desc: 'Geographical categorization based on urban core and peripheral outer-city territory boundaries.',
    },
    {
      title: 'Dual-Tier Financial Resolution',
      desc: 'System design decoupling enterprise billing resolution from field payout resolution for flexible operational margins.',
    },
  ],
  coreSystems: [
    {
      title: 'SLA & Turnaround Engine',
      desc: 'Configurable turnaround timers by territorial tier, automated escalation paths, and worker reassignment rules.',
    },
    {
      title: 'Worker Wallet Ledger',
      desc: 'Digital balance accounting for task earnings, adjustment deductions, and scheduled withdrawal governance.',
    },
    {
      title: 'Dynamic Form Schema Builder',
      desc: 'Modular form architecture separating reference fields (worker instructions), input capture (on-site proofs), and supervisor review fields.',
    },
    {
      title: 'Automated Report Synthesis',
      desc: 'System pipeline compiling submitted field data and imagery into branded digital PDF reports upon approval.',
    },
    {
      title: 'Multi-Tier Rate Management',
      desc: 'Effective-dated rate structures supporting client contracts, individual worker payouts, and vendor partner agreements.',
    },
    {
      title: 'Configurable RBAC Matrix',
      desc: 'Granular module-by-role security matrix governing operational permissions across all administrative and field interfaces.',
    },
  ],
  stats: [
    { value: '4 Panels', label: 'Ecosystem Interfaces' },
    { value: 'Location-Aware', label: 'Workflow Engine' },
    { value: 'Dual-Tier', label: 'Billing & Payout Model' },
  ],
};

export const ricRootData = {
  id: 'ricroot',
  title: 'RicRoot',
  tagline: 'Blue & Grey-Collar Workforce Recruitment Platform',
  category: 'MOBILE APP & EMPLOYER PORTAL ARCHITECTURE',
  status: 'Production Platform',
  role: 'Product Manager (Product Flow, Architecture & Engineering)',
  company: 'Veracity Supply Chain Limited',
  link: 'https://ricroot.in',
  summary:
    'RicRoot is a specialized recruitment ecosystem built to connect India’s non-desk, technical, and operational workforce (ITI graduates, technicians, operators, drivers) with hiring employers, spanning a candidate mobile app and an enterprise web portal.',
  corePieces: [
    {
      title: 'Candidate Mobile Journey',
      desc: 'Streamlined mobile UX designed for non-desk job seekers featuring simplified profile creation, relevant job discovery, and application status tracking.',
    },
    {
      title: 'Structured Role Taxonomy',
      desc: 'Extensive master taxonomy categorizing hundreds of job profiles, role designations, and educational credentials tailored to India’s industrial workforce.',
    },
    {
      title: 'Employer Management Portal',
      desc: 'Web portal empowering recruiters with bulk job creation, candidate filtering, automated offer letter generation, and interview coordination.',
    },
    {
      title: 'Growth & Acquisition Funnel',
      desc: 'Designed user onboarding flows, landing page interactions, and smart QR-based routing mechanisms to streamline app installation.',
    },
    {
      title: 'App Store & Privacy Governance',
      desc: 'Guided iOS App Store compliance lifecycle, integrating Apple AppTrackingTransparency (ATT) guidelines, Meta SDK requirements, and DPDP Act 2023 alignment.',
    },
  ],
  stats: [
    { value: 'Structured', label: 'Role Taxonomy Master' },
    { value: 'Two-Sided', label: 'Mobile & Web Ecosystem' },
    { value: 'Compliant', label: 'Apple ATT & DPDP Act' },
  ],
};

export const payEazeData = {
  id: 'payeaze',
  title: 'PayEaze',
  tagline: 'Multi-Tenant Payroll & Statutory Compliance HRMS',
  category: 'ENTERPRISE HRMS ARCHITECTURE',
  status: 'Product Redesign & Roadmap Phase',
  role: 'Product Manager (System & Flow Design)',
  company: 'Veracity Supply Chain Limited',
  summary:
    'PayEaze is an enterprise HRMS and payroll engine designed to streamline statutory labor compliance and salary administration across diverse Indian states, engineered with multi-tenant subdomain separation.',
  corePieces: [
    {
      title: 'State-Wise Statutory Rules',
      desc: 'System model accounting for state-specific Provident Fund (PF), Employee State Insurance (ESI), and Professional Tax (PT) calculations.',
    },
    {
      title: 'Multi-Tenant Architecture',
      desc: 'Subdomain-partitioned client tenancy model ensuring complete organizational data isolation, security, and dedicated access portals.',
    },
    {
      title: 'Three-Tier User Roles',
      desc: 'Tailored workflows for System Superadmins (platform policy), Client SPOCs (HR managers), and Employees (self-service documentation).',
    },
    {
      title: 'GTM & Launch Strategy',
      desc: 'Conducted role workflow audits, competitive analysis, and formulated the functional redesign specifications and 90-day rollout roadmap.',
    },
  ],
  stats: [
    { value: 'Multi-Tenant', label: 'Subdomain Partitioning' },
    { value: 'Statutory', label: 'Multi-State Framework' },
    { value: '3 Portals', label: 'Admin, SPOC & Employee' },
  ],
};

export const veracityProducts = [bharatGigData, ricRootData, payEazeData];

export const productModules = [
  { title: 'Location-Aware Task Dispatch', tag: 'BHARATGIG' },
  { title: '4-Panel Multi-Role Architecture', tag: 'BHARATGIG' },
  { title: 'Dynamic Form Schema Builder', tag: 'BHARATGIG' },
  { title: 'Turnaround SLA Tracking', tag: 'BHARATGIG' },
  { title: 'Digital Ledger Accounting', tag: 'BHARATGIG' },
  { title: 'Workforce Taxonomy Master', tag: 'RICROOT' },
  { title: 'Candidate Mobile Journey', tag: 'RICROOT' },
  { title: 'Apple ATT & Meta SDK Compliance', tag: 'RICROOT' },
  { title: 'Multi-Tenant Subdomain SaaS', tag: 'PAYEAZE' },
  { title: 'State Statutory Rule Engine', tag: 'PAYEAZE' },
];

export const lifecycleStages = [
  { stage: 'DISCOVER', detail: 'User interviews & operational bottleneck discovery' },
  { stage: 'DEFINE', detail: 'PRDs, user stories & functional system specifications' },
  { stage: 'DESIGN', detail: 'Wireframes, multi-role UX flows & form schemas' },
  { stage: 'BUILD', detail: 'Engineering collaboration, API contracts & sprints' },
  { stage: 'COMPLY', detail: 'App Store guidelines, Apple ATT & DPDP Act alignment' },
  { stage: 'DEPLOY', detail: 'Release planning, UAT validation & staged rollout' },
  { stage: 'ANALYZE', detail: 'User adoption metrics, flow refinement & iteration' },
];

export const engineeringFlow = [
  'Operational bottleneck',
  'PRD & user journeys',
  'Multi-role wireframes',
  'API & data contracts',
  'Engineering sprint',
  'App Store & compliance',
  'Production rollout',
];
