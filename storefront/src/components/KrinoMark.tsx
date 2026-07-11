// Static port of the same KrinoMark SVG used in the Ghost theme
// (krino-media-theme/partials/krino-mark.hbs) — kept in sync by hand for
// now, same as tokens.css.
export function KrinoMark({ size = 32, accent = "var(--gold)", mark = "var(--ink)", ring = true }: {
    size?: number;
    accent?: string;
    mark?: string;
    ring?: boolean;
}) {
    return (
        <svg
            viewBox="0 0 200 200"
            width={size}
            height={size}
            style={{ display: "block", overflow: "visible" }}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="Krino monogram"
        >
            {ring && <circle cx="100" cy="100" r="94" stroke={accent} strokeWidth="3" fill="none" />}
            <path d="M81.1 43.3 A58 58 0 0 1 126.4 108.1" stroke={accent} strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.9" />
            <path d="M84.4 27.6 A74 74 0 0 1 142.3 110.3" stroke={accent} strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.55" />
            <path d="M87.7 12.0 A90 90 0 0 1 158.1 112.5" stroke={accent} strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.28" />
            <rect x="58" y="52" width="11" height="96" rx="1" fill={mark} />
            <path d="M69 100 L142 58" stroke={mark} strokeWidth="11" strokeLinecap="round" />
            <path d="M69 100 L142 142" stroke={mark} strokeWidth="11" strokeLinecap="round" />
            <path d="M52 116 L69 100 L86 116 Z" fill={mark} opacity="0.92" />
            <circle cx="69" cy="100" r="6.5" fill={accent} />
        </svg>
    );
}
