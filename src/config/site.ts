/**
 * Language-neutral site configuration: identity, links, CV and domain.
 * All visible wording (in English and Arabic) lives in src/content/en.ts and src/content/ar.ts.
 * Anything left empty ("") is hidden on the site; nothing is shown as a dead link.
 */

export const site = {
  /** Set NEXT_PUBLIC_SITE_URL once a custom domain is live. Falls back to Vercel's production domain. */
  url: (
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "") ||
    "http://localhost:3000"
  ).replace(/\/$/, ""),

  brand: "MANO",
  tagline: "Business × Technology",
  /** Formal name: About, CV, structured data. */
  name: "Abdelrahman Ayman Samir Elsayed",
  /** Public name: hero, titles, footer. */
  publicName: "Abdelrahman MANO",
  nameArabic: "عبدالرحمن مانو",
  location: "Cairo, Egypt",
  timezone: "Africa/Cairo",

  /** Stable CV URL. Replace the file in /public/files to update it; this path never changes. */
  cv: {
    path: "/files/Abdelrahman-Ayman-Samir-Elsayed-CV.pdf",
    shortLink: "/cv",
  },

  email: "abdelrahman.man0.work@gmail.com",

  /** Verified social links (Nov 2026). The single source for every social link on the site. "" hides a platform. */
  social: {
    linkedin: "https://www.linkedin.com/in/abdelrahman-man0/",
    instagram: "https://www.instagram.com/abdelrahman.man0/?hl=en",
    facebook: "https://www.facebook.com/abdelrahman.man0.page/",
    tiktok: "https://www.tiktok.com/@abdelrahman..man0",
    youtube: "https://www.youtube.com/@abdelrahman.man0.channel",
    github: "",
    linktree: "",
  },
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
