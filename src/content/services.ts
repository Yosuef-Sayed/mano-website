/**
 * Services, speaking topics and session types.
 * Status controls visibility:
 *  - "published"   shown, request button active
 *  - "inquiry"     shown, labelled "Inquiry only"
 *  - "pilot"       shown, labelled "Pilot" (limited availability)
 *  - "unavailable" shown, request disabled
 *  - "hidden"      not rendered anywhere (draft)
 * No prices, packages, timelines or guarantees are published. Add them only when they are real.
 */

export type OfferStatus = "published" | "inquiry" | "pilot" | "unavailable" | "hidden";

export const statusLabel: Record<OfferStatus, string> = {
  published: "Open for requests",
  inquiry: "Inquiry only",
  pilot: "Pilot",
  unavailable: "Temporarily unavailable",
  hidden: "Hidden",
};

export type Service = {
  id: string;
  title: string;
  status: OfferStatus;
  forWho: string[];
  problem: string;
  includes: string[];
  outcome: string;
  notIncluded: string[];
  basedOn: string;
};

export const services: Service[] = [
  {
    id: "idea-clarity",
    title: "Project & Idea Clarity Session",
    status: "pilot",
    forWho: ["CS students", "Graduation project teams", "Early-stage founders", "Freelancers"],
    problem: "You have an idea or project, but the problem, the users or the first step are still blurry.",
    includes: [
      "Clarifying the problem and who actually has it",
      "Exploring possible solutions, and whether technology or AI is relevant",
      "Defining a reasonable first scope",
      "Agreeing practical next steps",
    ],
    outcome: "A clearer problem statement, target user and next-step list you can act on.",
    notIncluded: ["Building the product", "Guarantees of business or technical success"],
    basedOn: "ATHATHI discovery work and academic software projects",
  },
  {
    id: "ai-exploration",
    title: "AI & Technology Product Exploration",
    status: "inquiry",
    forWho: ["Students and teams considering AI", "Early-stage founders", "Non-technical business owners"],
    problem: "You are unsure whether AI fits your problem, or what an assistant, agent or RAG workflow would involve.",
    includes: [
      "Talking through whether AI is appropriate for the problem",
      "Explaining agent, tool-calling and RAG concepts in plain terms",
      "Discussing a realistic prototype scope",
      "Connecting business requirements with technical direction",
    ],
    outcome: "A shared understanding of options and a sensible prototype scope, not a finished system.",
    notIncluded: ["Production-grade AI systems", "Enterprise automation", "Advanced ML engineering"],
    basedOn: "Hands-on prototype work on ATHATHI's AI assistants",
  },
  {
    id: "customer-discovery",
    title: "Customer Discovery & Business Validation",
    status: "pilot",
    forWho: ["Early-stage founders", "Student startup teams", "Graduation projects with a business angle"],
    problem: "You are about to build something without having talked to enough of the people it is for.",
    includes: [
      "Planning customer interviews and questions",
      "Segmentation and competitor research approach",
      "Value proposition and business model exploration",
      "Early validation direction",
    ],
    outcome: "An interview plan and a clearer view of who to validate with, and how.",
    notIncluded: ["Conducting full market studies", "Professional market research reports"],
    basedOn: "30+ customer and 7+ business interviews for ATHATHI",
  },
  {
    id: "brand-content",
    title: "Personal Brand & Content Direction",
    status: "inquiry",
    forWho: ["Students and early-career professionals", "Founders building a public presence"],
    problem: "You want to share your work publicly but don't know what to say, or how to say it consistently.",
    includes: ["Personal positioning", "Content themes and ideation", "Copywriting feedback", "Content planning"],
    outcome: "A positioning statement, content themes and a simple plan to start.",
    notIncluded: ["Full-service agency work", "Paid ads management", "Follower or reach guarantees"],
    basedOn: "MANO personal brand and Plan Bee marketing experience",
  },
  {
    id: "project-collaboration",
    title: "Project & Product Collaboration",
    status: "inquiry",
    forWho: ["Early-stage software projects", "AI application prototypes", "Technology-enabled business ideas"],
    problem: "You need someone who can work across the technical and business sides of an early project.",
    includes: ["Technical-business coordination", "Prototype contributions", "Cross-functional collaboration"],
    outcome: "Scope and suitability are reviewed together before any work is accepted.",
    notIncluded: ["Commitment before scope review"],
    basedOn: "ATHATHI and team software projects",
  },
];

export const speakingTopics = [
  { title: "Technology × Business", text: "Why technical people should understand customers, and business people should understand technology." },
  { title: "Practical AI Applications", text: "What AI assistants, agents and RAG actually look like inside an early-stage product." },
  { title: "From Problem to Product", text: "Starting with interviews before code: lessons from building ATHATHI." },
  { title: "Customer Discovery for Technical Projects", text: "How CS students can validate graduation projects and startup ideas." },
  { title: "Student Projects & Product Thinking", text: "Turning academic projects into something people would actually use." },
  { title: "Building a Professional Identity", text: "Learning, opportunities and presenting yourself across technology and business." },
];

export const speakingFormats = ["Talk", "Workshop", "Panel", "Online session", "Podcast / interview"];

export type SessionType = {
  id: string;
  title: string;
  duration: string;
  status: OfferStatus;
  description: string;
  scope: string[];
};

/** Booking session types. Price is intentionally not shown until configured. */
export const sessionTypes: SessionType[] = [
  {
    id: "intro",
    title: "Introductory Call",
    duration: "About 20 minutes",
    status: "published",
    description: "A first conversation to understand your goal and whether there is a suitable way to work together.",
    scope: ["Your objective and context", "Your project or problem", "Whether and how we could work together", "Possible next steps"],
  },
  {
    id: "project-session",
    title: "1:1 Project / Idea Session",
    duration: "About 45–60 minutes",
    status: "pilot",
    description: "A structured session focused on one specific project or idea.",
    scope: ["Problem and user clarity", "Scope for a first version", "Concrete next steps"],
  },
  {
    id: "business-product",
    title: "Business / Product Discussion",
    duration: "About 45 minutes",
    status: "pilot",
    description: "Customer discovery, product direction or a business opportunity.",
    scope: ["Customer and market questions", "Validation approach", "Business model thinking"],
  },
  {
    id: "ai-exploration",
    title: "Technical / AI Exploration",
    duration: "About 45 minutes",
    status: "inquiry",
    description: "Talk through an AI application idea, its scope and its feasibility.",
    scope: ["Whether AI fits", "Assistant / agent / RAG options", "Prototype scope"],
  },
];

export const bookingSettings = {
  /** Meetings are online by default. */
  defaultMode: "Online (video call)",
  /** Requests become confirmed only after manual review. */
  confirmationMode: "manual" as const,
  /** Earliest bookable day, counted from today. */
  minNoticeDays: 2,
  /** Furthest day ahead a visitor can request. */
  maxDaysAhead: 60,
  timeWindows: [
    { id: "morning", label: "Morning (9:00–12:00)" },
    { id: "afternoon", label: "Afternoon (12:00–17:00)" },
    { id: "evening", label: "Evening (17:00–21:00)" },
  ],
};

export const collaborationTypes = [
  { id: "career", label: "Career opportunity", hint: "Internships, junior, part-time or full-time roles" },
  { id: "freelance", label: "Freelance or client work", hint: "Project-based support or consultation" },
  { id: "technical", label: "Technical collaboration", hint: "AI, software, prototypes, early-stage startups" },
  { id: "business", label: "Business & entrepreneurship", hint: "Market research, product exploration, partnerships" },
  { id: "content", label: "Marketing & content", hint: "Content, social media, brand or campaign work" },
  { id: "partnership", label: "Partnerships & organizations", hint: "Student organizations, communities, programs, companies" },
  { id: "media", label: "Media & public relations", hint: "Podcasts, interviews, articles, guest appearances" },
] as const;

export type CollaborationTypeId = (typeof collaborationTypes)[number]["id"];

export const careerAreas = [
  "AI / Machine Learning", "Software Development", "Data", "AI Applications",
  "Business Development", "Sales", "Marketing", "Product / Project Coordination",
];
