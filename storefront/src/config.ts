// Where the main Ghost site lives — used for cross-linking the header/
// footer back to Watch/Listen/Read/Learn so navigation feels continuous
// between the two properties. Override via env if you preview this on a
// different domain than production.
export const MAIN_SITE_URL =
    (import.meta.env.VITE_MAIN_SITE_URL as string | undefined) || "https://krinomedia.com";
