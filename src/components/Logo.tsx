export function Logo({ size = "sm" }: { size?: "sm" | "lg" }) {
  const big = size === "lg";
  return (
    <span className="inline-flex flex-col leading-none">
      <span className={`brush-underline self-start font-brush text-paper ${big ? "text-5xl" : "text-2xl"}`} style={{ letterSpacing: "0.02em" }}>
        MANO
      </span>
      <span className={`mt-2.5 font-semibold tracking-[0.32em] text-teal uppercase ${big ? "text-xs" : "text-[9px]"}`}>
        Business × Technology
      </span>
    </span>
  );
}
