/**
 * Central site configuration.
 * Edit this file to change identity, links, the CV file and the deployed domain.
 * Anything left empty ("") is hidden on the site; nothing is shown as a dead link.
 */

export const site = {
  /** Set NEXT_PUBLIC_SITE_URL in the environment once the real domain is live. */
  url: (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, ""),

  brand: "MANO",
  tagline: "Business × Technology",
  name: "Abdelrahman Ayman Samir Elsayed",
  shortName: "Abdelrahman Ayman",
  nameArabic: "عبدالرحمن مانو",
  role: "Computer Science Student · AI & Software · Technology & Business",
  location: "Cairo, Egypt",
  timezone: "Africa/Cairo",

  description:
    "MANO (Abdelrahman Ayman) is a Computer Science student at Cairo University connecting AI and software with customers, business and execution. Founder of ATHATHI, President of Star Union.",

  /** The CV lives at a stable URL. Replace the file in /public/files to update it. */
  cv: {
    path: "/files/Abdelrahman-Ayman-Samir-Elsayed-CV.pdf",
    shortLink: "/cv",
    updated: "November 2026",
  },

  email: "abdelrahman2652006@gmail.com",

  /**
   * Social links. Only LinkedIn is verified so far.
   * Paste the real profile URL to make a platform appear; leave "" to hide it.
   */
  social: {
    linkedin: "https://linkedin.com/in/abdelrahman-man0",
    instagram: "",
    facebook: "",
    tiktok: "",
    youtube: "",
    github: "",
    linktree: "",
  },

  /** Public social page name used across platforms. */
  socialHandleName: "Abdelrahman MANO",
} as const;

export type SocialKey = keyof typeof site.social;

export const socialLabels: Record<SocialKey, string> = {
  linkedin: "LinkedIn",
  instagram: "Instagram",
  facebook: "Facebook",
  tiktok: "TikTok",
  youtube: "YouTube",
  github: "GitHub",
  linktree: "Linktree",
};

export function activeSocials() {
  return (Object.keys(site.social) as SocialKey[])
    .filter((k) => site.social[k])
    .map((k) => ({ key: k, label: socialLabels[k], href: site.social[k] }));
}

export const nav = [
  { label: "About", href: "/about" },
  {
    label: "Work",
    href: "/projects",
    children: [
      { label: "Experience", href: "/experience", note: "Roles, leadership & timeline" },
      { label: "Projects", href: "/projects", note: "AI, software & academic work" },
      { label: "ATHATHI Case Study", href: "/projects/athathi", note: "Business × AI product story" },
    ],
  },
  { label: "Services", href: "/services" },
  { label: "Speaking", href: "/speaking" },
  {
    label: "Contact",
    href: "/contact",
    children: [
      { label: "Contact", href: "/contact", note: "General messages" },
      { label: "Collaborate", href: "/collaborate", note: "Jobs, projects & partnerships" },
      { label: "Book a Session", href: "/book", note: "Request an online meeting" },
    ],
  },
] as const;
