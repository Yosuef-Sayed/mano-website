/**
 * The MANO Value Loop: five ways of approaching a problem, connected around real-world value.
 * Every evidence item points to a real entry on the site.
 */

export type DimensionId = "technology" | "business" | "people" | "execution" | "communication";

export type Evidence = { label: string; detail: string; href: string };

export type Dimension = {
  id: DimensionId;
  label: string;
  question: string;
  summary: string;
  areas: string[];
  evidence: Evidence[];
};

export const dimensions: Dimension[] = [
  {
    id: "technology",
    label: "Technology",
    question: "What can we build?",
    summary:
      "Computer Science foundations and hands-on project work in AI applications, agents, RAG workflows and software.",
    areas: ["AI applications", "Agents & tool calling", "RAG workflows", "Machine learning", "Software development"],
    evidence: [
      { label: "ATHATHI AI assistants", detail: "Customer & Business Assistants in a six-tool LangChain/LangGraph agent", href: "/projects/athathi#contributions" },
      { label: "RAG recommendation workflow", detail: "Vector-database retrieval + Tavily Search, terminal prototype", href: "/projects/athathi#architecture" },
      { label: "NextGen Institute", detail: "Machine Learning Intern, Sep 2026 – Present", href: "/experience#nextgen" },
      { label: "MANOFY · MANOPIX · MANO GAMEBOARD", detail: "C++ academic applications", href: "/projects#cpp" },
    ],
  },
  {
    id: "business",
    label: "Business",
    question: "Is it worth building?",
    summary:
      "Customer discovery, market research and business-model work that decides what a product should be before it is built.",
    areas: ["Market research", "Business models", "STP & value propositions", "Financial analysis", "Business development"],
    evidence: [
      { label: "30+ customer interviews", detail: "ATHATHI customer discovery", href: "/projects/athathi#discovery" },
      { label: "7+ furniture business interviews", detail: "Vendor and business-owner research", href: "/projects/athathi#discovery" },
      { label: "Business model & segmentation", detail: "Economy, mid-range and premium segments", href: "/projects/athathi#model" },
      { label: "REDS sales experience", detail: "Retail sales, Dec 2024 – Jun 2025", href: "/experience#reds" },
    ],
  },
  {
    id: "people",
    label: "People",
    question: "Who is it for?",
    summary:
      "Direct customer contact and people leadership: understanding needs, buying behavior and how teams actually work.",
    areas: ["Customer understanding", "Sales", "Customer experience", "Communication", "Stakeholders"],
    evidence: [
      { label: "150+ customers per week", detail: "Average served at REDS", href: "/experience#reds" },
      { label: "Customer discovery", detail: "Interview-led research for ATHATHI", href: "/projects/athathi#discovery" },
      { label: "Star Union, 200+ members", detail: "President, leading through VPs and heads", href: "/experience#star-union" },
    ],
  },
  {
    id: "execution",
    label: "Execution",
    question: "How does it get done?",
    summary:
      "Turning plans into progress: coordinating cross-functional teams and contributing directly to product work.",
    areas: ["Product development", "Leadership", "Team coordination", "Collaboration", "Project delivery"],
    evidence: [
      { label: "ATHATHI core team", detail: "Six-person core team (including me) + ~25 contributors as needed", href: "/experience#athathi" },
      { label: "AI assistant development", detail: "System prompts, FastAPI integration, prototype", href: "/projects/athathi#contributions" },
      { label: "Star Union Presidency", detail: "Five divisions, season planning, recruitment", href: "/experience#star-union" },
      { label: "MASROOFY", detail: "Requirements, design, schema, controllers (team of 4)", href: "/projects#masroofy" },
    ],
  },
  {
    id: "communication",
    label: "Communication",
    question: "How do people hear about it?",
    summary:
      "Marketing, content and personal branding: explaining ideas clearly to the people who need them.",
    areas: ["Marketing", "Content creation", "Copywriting", "Brand positioning", "Knowledge sharing"],
    evidence: [
      { label: "MANO: Business × Technology", detail: "Personal brand across five platforms", href: "/about#content" },
      { label: "6 short-form videos", detail: "Unique Reels, cross-posted", href: "/about#content" },
      { label: "6 LinkedIn visual posts", detail: "Designed posts with captions", href: "/about#content" },
      { label: "Plan Bee", detail: "Marketing Intern, Jun – Sep 2025", href: "/experience#plan-bee" },
    ],
  },
];

/** Selected proof points. Each number keeps its own context; they are never summed. */
export const proofPoints = [
  { value: "30+", label: "customer interviews", context: "ATHATHI customer discovery" },
  { value: "7+", label: "furniture business interviews", context: "ATHATHI vendor research" },
  { value: "150+", label: "customers per week, on average", context: "REDS · Dec 2024 – Jun 2025" },
  { value: "200+", label: "members organization-wide", context: "Star Union · President since Sep 2026" },
  { value: "~25", label: "contributors engaged as needed", context: "ATHATHI, alongside a six-person core team" },
  { value: "6 + 6", label: "Reels and LinkedIn visual posts", context: "MANO personal brand content" },
];

/** The connected workflow: Understand → Explore → Design → Build → Communicate → Improve. */
export const approach = [
  { step: "Understand", text: "Start with the people involved.", example: "30+ customer and 7+ business interviews for ATHATHI; daily customer conversations at REDS." },
  { step: "Explore", text: "Map the market and the options.", example: "Competitor analysis, segmentation and value propositions for customers and vendors." },
  { step: "Design", text: "Shape the experience before the code.", example: "Figma UI/UX for the ATHATHI assistant pages; planning the assistant workflows." },
  { step: "Build", text: "Contribute to working software.", example: "Customer and Business Assistants, RAG workflow and FastAPI integration in a prototype." },
  { step: "Communicate", text: "Explain it to the people who need it.", example: "MANO content, Plan Bee copywriting, representing Star Union externally." },
  { step: "Improve", text: "Test, debug and iterate honestly.", example: "Working through incomplete RAG and frontend integration in the ATHATHI prototype." },
];
