/**
 * MANO personal-brand content.
 * Add each UNIQUE video once (not once per platform) and list the platforms it was posted on.
 * Thumbnails go in /public/images/content/. Items with no links are not shown.
 * Never add follower counts, views or engagement unless they are real and current.
 */

export type ContentItem = {
  title: string;
  kind: "Short-form video" | "LinkedIn post";
  theme: string;
  description: string;
  thumbnail?: string; // e.g. "/images/content/reel-01.jpg"
  links: { platform: string; href: string }[];
};

export const contentSummary = {
  platforms: ["LinkedIn", "Instagram", "Facebook", "TikTok", "YouTube"],
  output: [
    { value: "6", label: "unique short-form videos", note: "Each cross-posted across platforms" },
    { value: "6", label: "designed LinkedIn posts", note: "With written captions" },
  ],
  themes: [
    "Technology & Business",
    "AI applications",
    "Entrepreneurship",
    "Opportunities",
    "Career development",
    "Product thinking",
    "Learning & growth",
  ],
};

/** Fill this list with real posts to switch on the content gallery. */
export const contentItems: ContentItem[] = [];
