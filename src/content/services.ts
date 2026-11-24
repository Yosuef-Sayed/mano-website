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
    title: "Project & Startup Clarity Session",
    status: "published",
    forWho: ["Graduation project teams", "Fresh graduates", "Early founders", "People exploring an idea"],
    problem: "You have an idea or project, but the problem, the users or the first step are still blurry.",
    includes: [
      "Problem definition and intended users",
      "Scope for a realistic first version",
      "Customer discovery and early validation",
      "Technical and business considerations",
      "Practical next steps",
    ],
    outcome: "A clearer problem statement, target user and next-step list you can act on.",
    notIncluded: ["Expert consultancy or advanced AI mentorship", "Building the product", "Guarantees of business or technical success"],
    basedOn: "An experience-led discussion drawing on ATHATHI's customer discovery and my software projects",
  },
  {
    id: "ai-exploration",
    title: "AI & Technology Product Exploration",
    status: "hidden",
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
    status: "hidden",
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
    status: "hidden",
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
    status: "hidden",
    forWho: ["Early-stage software projects", "AI application prototypes", "Technology-enabled business ideas"],
    problem: "You need someone who can work across the technical and business sides of an early project.",
    includes: ["Technical-business coordination", "Prototype contributions", "Cross-functional collaboration"],
    outcome: "Scope and suitability are reviewed together before any work is accepted.",
    notIncluded: ["Commitment before scope review"],
    basedOn: "ATHATHI and team software projects",
  },
];

export type SpeakingTopic = {
  id: string;
  title: string;
  audience: string[];
  content: string[];
  formats: string[];
  subtopic?: { title: string; audience: string; text: string };
};

/** Proposed topics MANO is open to presenting. None has been delivered yet — do not present them as past events. */
export const speakingTopics: SpeakingTopic[] = [
  {
    id: "practical-ai",
    title: "Practical AI for Business & Everyday Work",
    audience: ["Business owners", "Small businesses", "Founders", "Non-technical teams"],
    content: ["Practical AI use cases", "Research and planning", "Content and communication workflows", "Everyday productivity", "Evaluating AI-generated outputs"],
    formats: ["Introductory talk", "Beginner-friendly workshop"],
  },
  {
    id: "ai-copilot",
    title: "AI as a Co-Pilot, Not a Competitor",
    audience: ["Students", "Fresh graduates", "Early-career professionals", "Non-technical teams"],
    content: ["AI for learning and research", "Productivity", "Writing and communication", "Creative support", "Verification and critical thinking"],
    formats: ["Talk", "Beginner-friendly interactive session"],
  },
  {
    id: "problem-to-product",
    title: "From Problem to Product: Tech Entrepreneurship",
    audience: ["Early founders", "Graduation project teams", "Students", "Aspiring entrepreneurs"],
    content: ["Problem definition", "Customer discovery", "Validation", "MVP thinking", "Business model fundamentals", "User value and technical decisions"],
    formats: ["Talk", "Interactive workshop"],
    subtopic: {
      title: "Customer Discovery for Technical Projects",
      audience: "Computer Science, Engineering and graduation project teams",
      text: "Identifying users, interviewing them, understanding real needs and validating assumptions before coding.",
    },
  },
  {
    id: "professional-presence",
    title: "Building Your Professional Presence Through Projects & Content",
    audience: ["Students", "Fresh graduates", "Early-career professionals"],
    content: ["Professional identity", "Documenting projects", "Presenting work", "Creating useful professional content", "Choosing suitable platforms and content themes"],
    formats: ["Talk", "Practical session"],
  },
];

export const speakingFormats = ["Talk", "Workshop", "Interactive session", "Panel", "Online session", "Podcast / interview"];

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
    title: "Project & Startup Clarity Session",
    duration: "About 45–60 minutes",
    status: "published",
    description: "An experience-led discussion for graduation teams, fresh graduates and early founders, focused on one project or idea.",
    scope: ["Problem definition and intended users", "Scope, customer discovery and early validation", "Technical and business considerations", "Practical next steps"],
  },
  {
    id: "business-product",
    title: "Business / Product Discussion",
    duration: "About 45 minutes",
    status: "hidden",
    description: "Customer discovery, product direction or a business opportunity.",
    scope: ["Customer and market questions", "Validation approach", "Business model thinking"],
  },
  {
    id: "ai-exploration",
    title: "Technical / AI Exploration",
    duration: "About 45 minutes",
    status: "hidden",
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
