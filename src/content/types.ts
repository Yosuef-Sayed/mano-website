/** Turns literal string types into `string`, so the Arabic file must match the English *shape*, not its exact text. */
export type DeepWiden<T> = T extends string
  ? string
  : T extends number
    ? number
    : T extends boolean
      ? boolean
      : T extends readonly (infer U)[]
        ? DeepWiden<U>[]
        : T extends object
          ? { -readonly [K in keyof T]: DeepWiden<T[K]> }
          : T;

export type DimensionId = "technology" | "business" | "people" | "execution" | "communication";
export type TimelineLane = "work" | "leadership" | "learning";
export type OfferStatus = "published" | "inquiry" | "pilot" | "unavailable" | "hidden";
