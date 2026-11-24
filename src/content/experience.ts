import type { DimensionId } from "./valueLoop";

/** Source of truth: Master CV (Nov 2026). Update here; pages render from this list. */

export type ExperienceCategory = "startup" | "leadership" | "ml" | "marketing-sales" | "student";
export type EngagementType = "Startup" | "Internship" | "Employment" | "Leadership role" | "Student activity" | "Training" | "Personal project";

export const experienceCategories: { id: ExperienceCategory; label: string }[] = [
  { id: "startup", label: "Startup & Product" },
  { id: "leadership", label: "Leadership" },
  { id: "ml", label: "Machine Learning" },
  { id: "marketing-sales", label: "Marketing & Sales" },
  { id: "student", label: "Student Activities" },
];

export type Experience = {
  id: string;
  role: string;
  org: string;
  orgNote?: string;
  start: string;
  end: string;
  category: ExperienceCategory;
  type: EngagementType;
  current?: boolean;
  summary: string;
  did: string[];
  exposure?: string[];
  skills: string[];
  dimensions: DimensionId[];
  status?: string;
  links?: { label: string; href: string }[];
  earlierRoles?: { role: string; dates: string }[];
};

export const experience: Experience[] = [
  {
    id: "athathi",
    role: "Founder & CEO",
    org: "ATHATHI",
    orgNote: "Early-stage furniture-tech startup · Cairo",
    start: "May 2025",
    end: "Present",
    current: true,
    category: "startup",
    type: "Startup",
    summary:
      "A furniture and interior solutions platform connecting customers with vendors, with AI-supported discovery. I lead the business side and contribute directly to the product and AI work.",
    did: [
      "Lead a six-person core team (including me) across AI, frontend, backend and business development, and coordinate around 25 contributors engaged as needed across marketing, design, content, finance, legal, data and engineering.",
      "Conducted 30+ customer interviews and 7+ interviews with furniture business owners across the journey from budget and design to production and delivery.",
      "Defined market segmentation (economy, mid-range, premium), STP, competitor analysis and value propositions for customer and vendor segments.",
      "Lead business planning, financial and market analysis, and partnership exploration with vendors and factories; direct brand identity, logo and social media positioning.",
      "Contributed to software structure, backend design and the SQL database schema; designed UI/UX in Figma for the AI assistant pages.",
      "Developed the Customer Assistant and Business Assistant within a six-tool LangChain/LangGraph agent, including system prompts and FastAPI integration.",
      "Integrated Tavily Search and built a RAG-based recommendation workflow on a vector database.",
    ],
    skills: ["Customer discovery", "Business models", "LangChain", "LangGraph", "RAG", "FastAPI", "Figma", "Team leadership"],
    dimensions: ["technology", "business", "people", "execution", "communication"],
    status: "AI work: functional terminal prototype; frontend integration in progress.",
    links: [{ label: "Read the ATHATHI case study", href: "/projects/athathi" }],
  },
  {
    id: "star-union",
    role: "President",
    org: "Star Union",
    orgNote: "Student organization · FCAI, Cairo University",
    start: "Sep 2026",
    end: "Present",
    current: true,
    category: "leadership",
    type: "Leadership role",
    summary:
      "Star Union has 200+ members organization-wide across five divisions. I lead through Vice Presidents and division heads (President → VPs → Heads → Members); the 200+ are not direct reports.",
    did: [
      "Coordinate five divisions: HR & Operations, Media Direction, Technical, Entrepreneurship and Business.",
      "Set season plans, allocate responsibilities and follow up on execution with VPs and heads.",
      "Oversaw the launch of Head-position recruitment: 30+ applications in the first four days and about six candidates selected so far (Nov 2026). Member and instructor recruitment follow.",
      "Represent Star Union externally, including early collaboration talks with Career 180 around the Egypt Career Summit.",
    ],
    skills: ["Strategic planning", "Delegation", "Recruitment", "Cross-functional coordination", "External relations"],
    dimensions: ["people", "execution", "communication"],
    status: "Season in progress. Workshops are planned for this season.",
    earlierRoles: [
      { role: "AI Committee Member", dates: "Nov 2025 – Sep 2026" },
      { role: "HR Member & PR Member", dates: "Nov 2024 – May 2025" },
    ],
  },
  {
    id: "nextgen",
    role: "Machine Learning Intern",
    org: "NextGen Institute",
    orgNote: "Online",
    start: "Sep 2026",
    end: "Present",
    current: true,
    category: "ml",
    type: "Internship",
    summary:
      "A structured ML internship combining theory and hands-on sessions, ending with an applied project on business-domain datasets.",
    did: [
      "Applying data preprocessing, linear and logistic regression with Python, NumPy, Pandas and Scikit-learn.",
      "Building an applied machine learning project on real-world business-domain datasets.",
    ],
    exposure: ["Introduction to deep learning", "Model evaluation"],
    skills: ["Python", "NumPy", "Pandas", "Scikit-learn", "Regression"],
    dimensions: ["technology"],
    status: "In progress. Final project and completion due end of November 2026.",
  },
  {
    id: "plan-bee",
    role: "Marketing Intern",
    org: "Plan Bee",
    orgNote: "New Cairo",
    start: "Jun 2025",
    end: "Sep 2025",
    category: "marketing-sales",
    type: "Internship",
    summary: "Exposure to a real social media content pipeline, from idea to published post.",
    did: [
      "Worked across the content workflow: ideation, planning, copywriting, visuals and publishing.",
      "Wrote on-brand copy for awareness and engagement content and took part in campaign planning.",
    ],
    skills: ["Copywriting", "Content planning", "Social media"],
    dimensions: ["communication"],
  },
  {
    id: "reds",
    role: "Sales Representative",
    org: "REDS",
    orgNote: "Alf Maskan, Cairo",
    start: "Dec 2024",
    end: "Jun 2025",
    category: "marketing-sales",
    type: "Employment",
    summary: "Direct, daily customer interaction in retail, where most of my customer understanding started.",
    did: [
      "Served an average of 150+ customers per week, guiding them from first inquiry to purchase decision.",
      "Identified customer needs to recommend suitable products and handle inquiries.",
    ],
    skills: ["Sales", "Customer experience", "Needs discovery"],
    dimensions: ["people", "business"],
  },
  {
    id: "sbs",
    role: "AI Delegate, Startup Simulation",
    org: "Step By Step (SBS)",
    start: "Feb 2026",
    end: "Aug 2026",
    category: "student",
    type: "Student activity",
    summary: "A startup simulation program, working in the AI department.",
    did: [
      "Worked on the Customer and Business Assistants of a six-tool LangChain/LangGraph agent through a three-day on-site build and final pitch (Jul – Aug 2026); recognized at the closing ceremony.",
    ],
    skills: ["LangChain", "LangGraph", "Pitching", "Teamwork"],
    dimensions: ["technology", "execution"],
  },
  {
    id: "stp",
    role: "Video Editing Trainee",
    org: "Steps Towards Progress (STP)",
    orgNote: "Ain Shams University",
    start: "Jan 2026",
    end: "Mar 2026",
    category: "student",
    type: "Training",
    summary: "Practical training in video production for content creation.",
    did: ["Trained in shooting, video editing, montage, color correction and color grading."],
    skills: ["Video editing", "Color grading"],
    dimensions: ["communication"],
  },
  {
    id: "mano-content",
    role: "Content Creator",
    org: "MANO: Business × Technology",
    orgNote: "Personal brand",
    start: "Ongoing",
    end: "",
    category: "marketing-sales",
    type: "Personal project",
    summary: "Content on technology, AI, business and career growth as “Abdelrahman MANO”.",
    did: [
      "Published 6 original short-form videos (cross-posted on LinkedIn, Instagram, Facebook, TikTok and YouTube) and 6 designed LinkedIn posts with captions.",
      "Handle ideation, planning, copywriting and publishing.",
    ],
    skills: ["Content strategy", "Copywriting", "Personal branding", "Video"],
    dimensions: ["communication"],
    links: [{ label: "See the content", href: "/about#content" }],
  },
];

export const education = {
  school: "Cairo University, Faculty of Computers and Artificial Intelligence",
  degree: "Bachelor of Computer Science",
  expected: "Expected 2028",
  coursework: [
    "Object-Oriented Programming",
    "Data Structures & Algorithms",
    "Software Engineering",
    "Database Systems",
    "Artificial Intelligence",
    "Machine Learning",
    "Statistics",
  ],
};

export type TrainingItem = { name: string; issuer: string; kind: string; date: string };

/** Each item states what it actually is: completion, participation, attendance, or completed without certificate. */
export const training: TrainingItem[] = [
  { name: "The Java Learning Guide", issuer: "Udemy", kind: "Certificate of completion · 9 hours", date: "Mar 2026" },
  { name: "Shell Intilaaqah Bootcamp", issuer: "Delivered by Flat6Labs", kind: "Participation", date: "Apr 2026" },
  { name: "Star Hackathon", issuer: "Star Union Technical Section", kind: "Certificate of appreciation for ATHATHI", date: "May 2026" },
  { name: "Cairo AI Hackathon 2025", issuer: "Athar Accelerator with Plan International", kind: "Participation", date: "Dec 2025" },
  { name: "AI Developer Camp 2.0", issuer: "DotPy", kind: "Attendance", date: "Dec 2025" },
  { name: "TIEC Entrepreneurship Program", issuer: "Creativa Innovation Hub, through FCAI-CU", kind: "Completed", date: "Nov – Dec 2025" },
  { name: "AI Developer Camp 1.0", issuer: "DotPy", kind: "Workshop: AI fundamentals, ML and LLMs", date: "Sep 2025" },
  { name: "Marketing Training Program", issuer: "Flashat CU", kind: "Certificate of completion · 8 hours", date: "Dec 2024" },
];
