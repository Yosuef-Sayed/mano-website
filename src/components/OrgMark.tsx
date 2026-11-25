/* eslint-disable @next/next/no-img-element -- small static marks; next/image adds nothing here */

/**
 * Organization mark. Uses an official logo when one exists in /public/images/logos/<key>.(svg|png|jpg|webp);
 * otherwise a neutral monogram. Monograms are plain initials — never presented as official logos.
 */
const monograms: Record<string, string> = {
  reds: "R",
  athathi: "A",
  "plan-bee": "PB",
  tiec: "T",
  "star-union": "SU",
  stp: "STP",
  sbs: "SBS",
  nextgen: "NG",
};

export function OrgMark({ logoKey, name, src, size = 44 }: { logoKey: string; name: string; src?: string; size?: number }) {
  if (src) {
    return (
      <span className="inline-flex shrink-0 items-center justify-center overflow-hidden rounded-xl border border-line bg-paper p-1.5" style={{ width: size, height: size }}>
        <img src={src} alt={`${name} logo`} className="max-h-full max-w-full object-contain" loading="lazy" />
      </span>
    );
  }
  const text = monograms[logoKey] ?? name.replace(/[^A-Za-z ]/g, "").split(" ").filter(Boolean).map((w) => w[0]).join("").slice(0, 3).toUpperCase();
  return (
    <span
      aria-hidden
      title={name}
      className="latin inline-flex shrink-0 items-center justify-center rounded-xl border border-teal/30 bg-gradient-to-br from-surface-2 to-navy font-display font-extrabold tracking-tight text-teal"
      style={{ width: size, height: size, fontSize: text.length > 2 ? size * 0.27 : size * 0.36 }}
    >
      {text}
    </span>
  );
}
