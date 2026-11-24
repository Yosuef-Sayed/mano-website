import type { DimensionId } from "./valueLoop";

export type ProjectCategory = "ai-ml" | "software" | "product" | "academic";

export const projectCategories: { id: ProjectCategory; label: string }[] = [
  { id: "ai-ml", label: "AI Applications" },
  { id: "software", label: "Software Development" },
  { id: "product", label: "Entrepreneurship & Product" },
  { id: "academic", label: "Academic Projects" },
];

export type Project = {
  id: string;
  name: string;
  subtitle: string;
  categories: ProjectCategory[];
  purpose: string;
  features: string[];
  featuresLabel?: string;
  role: string[];
  team?: string;
  tech: string[];
  status: string;
  context: "Startup" | "Academic";
  dimensions: DimensionId[];
  /** Only add a link once the repository or demo is verified and presentable. */
  repo?: string;
  caseStudy?: string;
  featured?: boolean;
};

export const projects: Project[] = [
  {
    id: "athathi",
    name: "ATHATHI",
    subtitle: "AI-supported furniture & interior solutions platform",
    categories: ["ai-ml", "product", "software"],
    purpose:
      "Help customers move from budget to delivery with less confusion, and give furniture vendors insight into what customers want.",
    features: [
      "Customer Assistant for product discovery and recommendations",
      "Business Assistant for customer-behavior, trend and best-seller insights",
      "RAG-based recommendation workflow on a vector database",
      "Tavily Search for current web data such as wood prices and trends",
    ],
    role: ["Founder & CEO", "Customer & Business Assistants", "RAG workflow", "FastAPI integration", "Schema & Figma UI/UX"],
    team: "Six-person core team + ~25 contributors",
    tech: ["LangChain", "LangGraph", "FastAPI", "RAG", "Vector DB", "Tavily", "React", "Django", "Flutter", "SQL", "Docker"],
    status: "Functional prototype — further integration & refinement required",
    context: "Startup",
    dimensions: ["technology", "business", "people", "execution", "communication"],
    caseStudy: "/projects/athathi",
    featured: true,
  },
  {
    id: "masroofy",
    name: "MASROOFY",
    subtitle: "Personal finance management system",
    categories: ["software", "academic"],
    purpose: "Help users control monthly spending by tracking income and expenses and warning them before money runs out.",
    features: [
      "Income tracking by source (salary, freelance, other)",
      "Expense categorization (transport, food, household, entertainment, outings and more)",
      "Spending limits",
      "Alerts when spending reaches a set share of available funds",
      "MVC architecture",
    ],
    role: ["Requirements analysis", "System design", "Database schema", "Controller logic", "Documentation"],
    team: "Team of 4",
    tech: ["Java", "MVC"],
    status: "Completed academic project",
    context: "Academic",
    dimensions: ["technology", "execution"],
  },
  {
    id: "manopix",
    name: "MANOPIX",
    subtitle: "C++ image editor",
    categories: ["software", "academic"],
    purpose: "Apply core C++ and image-processing logic in a working editor.",
    featuresLabel: "13 image-processing operations",
    features: [
      "Grayscale", "Black & white", "Invert", "Merge images", "Flip", "Rotate", "Darken & lighten",
      "Crop", "Frame", "Edge detection", "Resize", "Blur", "Purple Wano effect",
    ],
    role: ["C++ implementation"],
    tech: ["C++"],
    status: "Completed academic project",
    context: "Academic",
    dimensions: ["technology"],
  },
  {
    id: "manofy",
    name: "MANOFY",
    subtitle: "C++ audio player",
    categories: ["software", "academic"],
    purpose: "Build an audio application with richer playback control than a basic player.",
    features: [
      "Playlist management",
      "Two tracks playing simultaneously",
      "Merging tracks",
      "Mute, volume and playback-speed control",
      "Waveform and frequency display in the GUI",
      "Loop a playlist, a track, or a selected segment",
      "Keyframes",
    ],
    role: ["C++ implementation", "GUI"],
    tech: ["C++", "GUI"],
    status: "Completed academic project",
    context: "Academic",
    dimensions: ["technology"],
  },
  {
    id: "gameboard",
    name: "MANO GAMEBOARD",
    subtitle: "Multi-game board platform",
    categories: ["software", "academic"],
    purpose: "Implement many rule variations of board games on one shared platform with a graphical interface.",
    featuresLabel: "14 game variations",
    features: [
      "Normal XO", "SUS", "4 in a Row", "5×5 Tic-Tac-Toe", "Word Tic-Tac-Toe", "Misère Tic-Tac-Toe", "Diamond Tic-Tac-Toe",
      "4×4 Tic-Tac-Toe", "Pyramid Tic-Tac-Toe", "Numerical Tic-Tac-Toe", "Obstacles", "Infinity Tic-Tac-Toe",
      "Ultimate Tic-Tac-Toe", "Memory Tic-Tac-Toe",
    ],
    role: ["C++ implementation", "Game logic", "GUI"],
    tech: ["C++", "GUI"],
    status: "Completed academic project",
    context: "Academic",
    dimensions: ["technology"],
  },

];
