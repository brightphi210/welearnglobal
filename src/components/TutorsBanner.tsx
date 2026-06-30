// Profile banner — layered gradient with soft organic contour shapes and a fine diagonal hatch.
// Designed to feel calm and crafted behind a tutor's avatar badge, not decorative wallpaper.
// Palette stays in the green / lime / yellow family already used across the product.

const BANNER_THEMES = [
    {
        gradient: "bg-gradient-to-br from-green-700 via-green-800 to-lime-900",
        shapeFill: "#84cc16", // lime-500
        shapeFillSoft: "#a3e635", // lime-400
    },
    {
        gradient: "bg-gradient-to-tr from-lime-600 via-green-700 to-green-900",
        shapeFill: "#facc15", // yellow-400
        shapeFillSoft: "#fde047", // yellow-300
    },
    {
        gradient: "bg-gradient-to-r from-yellow-500 via-lime-600 to-green-800",
        shapeFill: "#15803d", // green-700
        shapeFillSoft: "#22c55e", // green-500
    },
];

const HATCH_DATA_URI =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14'%3E%3Cpath d='M0 14L14 0' stroke='white' stroke-width='0.6' opacity='0.5'/%3E%3C/svg%3E";

export const getBannerTheme = (seed: number | string) => {
    const n = typeof seed === "number" ? seed : seed.toString().length + seed.toString().charCodeAt(0);
    const index = Math.abs(n) % BANNER_THEMES.length;
    return BANNER_THEMES[index];
};

export const TutorsBanner = ({
    seed,
    className = "",
}: {
    seed: number | string;
    className?: string;
}) => {
    const theme = getBannerTheme(seed);
    const n = typeof seed === "number" ? seed : seed.toString().length;
    const flip = n % 2 === 0;

    return (
        <div className={`relative overflow-hidden ${theme.gradient} ${className}`}>
            {/* Soft layered contour shapes — give the gradient depth without reading as a literal icon */}
            <svg
                className="absolute inset-0 w-full h-full"
                viewBox="0 0 400 110"
                preserveAspectRatio="none"
                style={flip ? { transform: "scaleX(-1)" } : undefined}
            >
                <path
                    d="M -20 90 Q 90 40 200 75 T 420 60 V 130 H -20 Z"
                    fill={theme.shapeFill}
                    opacity="0.16"
                />
                <path
                    d="M -20 105 Q 130 65 260 95 T 420 85 V 130 H -20 Z"
                    fill={theme.shapeFillSoft}
                    opacity="0.14"
                />
                <circle cx="345" cy="18" r="46" fill={theme.shapeFillSoft} opacity="0.12" />
                <circle cx="370" cy="22" r="20" fill={theme.shapeFill} opacity="0.15" />
            </svg>

            {/* Fine diagonal hatch for tactile texture */}
            <div
                className="absolute inset-0 opacity-[0.07] mix-blend-overlay"
                style={{ backgroundImage: `url("${HATCH_DATA_URI}")` }}
            />

            {/* Gentle top-to-bottom darken so a badge/text overlapping the bottom edge stays legible */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/0 to-black/15" />
        </div>
    );
};

export default TutorsBanner;