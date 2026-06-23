// 6 default gradient banner designs with a subtle noise overlay
// All variations mix orange, green, and yellow tones in different ratios/directions
const BANNER_GRADIENTS = [
    "bg-gradient-to-br from-green-600 via-lime-500 to-yellow-400",
    "bg-gradient-to-tr from-yellow-400 via-lime-500 to-green-600",
];

const NOISE_DATA_URI =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E";

export const getBannerClass = (seed: number | string) => {
    const n = typeof seed === "number" ? seed : seed.toString().length;
    const index = Math.abs(n) % BANNER_GRADIENTS.length;
    return BANNER_GRADIENTS[index];
};

export const TutorsBanner = ({
    seed,
    className = "",
}: {
    seed: number | string;
    className?: string;
}) => (
    <div className={`relative overflow-hidden ${getBannerClass(seed)} ${className}`}>
        <div
            className="absolute inset-0 opacity-[0.18] mix-blend-overlay"
            style={{ backgroundImage: `url("${NOISE_DATA_URI}")` }}
        />
        <div className="absolute inset-0 bg-black/5" />
    </div>
);

export default TutorsBanner;