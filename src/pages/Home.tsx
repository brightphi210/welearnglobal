import { useState } from "react";
import {
    FaCalendarCheck,
    FaChartLine,
    FaShieldAlt,
    FaStar,
    FaUserCheck,
} from "react-icons/fa";
import {
    FiCheck,
    FiGlobe,
    FiSearch,
    FiUser
} from "react-icons/fi";
import heroImage from '../assets/welearnheroimage2.jpg';
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const testimonials = [
    { quote: "The level of expertise Sarah brought to my Calculus sessions was incredible. I went from failing to an A- in just three months.", name: "Mark Thompson", role: "High School Student", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80" },
    { quote: "I wanted to learn Spanish for my upcoming trip to Mexico. My tutor James didn't just teach me grammar, but actual conversation skills.", name: "Linda Garcia", role: "Marketing Manager", img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80" },
    { quote: "As a developer, I needed to learn React quickly. Michael's hands-on approach and real-world projects were exactly what I needed.", name: "David Kim", role: "Junior Developer", img: "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=100&q=80" },
];

const steps = [
    { icon: <FaUserCheck size={22} className="text-green-700" />, label: "Find Your Tutor", desc: "Browse thousands of expert tutors across hundreds of subjects using intelligent search filters." },
    { icon: <FaCalendarCheck size={22} className="text-green-700" />, label: "Book a Session", desc: "Schedule a trial or recurring session at a time that works for you, managed right from your dashboard." },
    { icon: <FaChartLine size={22} className="text-green-700" />, label: "Start Learning", desc: "Connect through our video classroom or meet in person, and track your progress toward your goals." },
];

const secFeatures = [
    "Identity and background verification for every tutor",
    "Academic credential and certification validation",
    "Mandatory safety training for in-person sessions",
    "Secure escrow-style payment system",
];

const trustCards = [
    { icon: <FaShieldAlt size={20} className="text-green-700" />, title: "Verified Experts", desc: "Every tutor undergoes a multi-step background and certification check.", highlight: false },
    { icon: <FiSearch size={20} className="text-green-700" />, title: "Smart Matching", desc: "Our matching system finds tutors based on your learning style and goals.", highlight: false },
    { icon: <FiUser size={20} className="text-green-700" />, title: "Quality Support", desc: "Our consultants are available around the clock to help you find the right fit.", highlight: false },
    { icon: <FaStar size={20} className="text-white" />, title: "100% Satisfaction", desc: "Not happy with your first session? We'll match you with a new tutor for free.", highlight: true },
];

const stats = [
    { value: "50K+", label: "Active students" },
    { value: "8,200+", label: "Verified tutors" },
    { value: "300+", label: "Subjects covered" },
    { value: "4.9/5", label: "Avg. tutor rating" },
];

const categories = [
    "Mathematics", "Programming", "Languages", "Music", "Science", "Test Prep", "Business", "Design",
];

const avatars = [
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&q=80",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&q=80",
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=60&q=80",
];

const Home = () => {
    const [sessionMode, setSessionMode] = useState<"online" | "in-person">("online");

    return (
        <div className="font-sans text-gray-900 bg-white">
            <Navbar />
            <div className="h-16" />
            <section className="relative">
                <div className="relative h-130 sm:h-140 lg:h-150 w-full overflow-hidden">
                    <img
                        src={heroImage}
                        alt="Student learning with a tutor"
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/40 to-black/80" />

                    <div className="relative h-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
                        <div className="inline-flex items-center gap-1.5 bg-white/10 border border-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded-full mb-5 w-fit backdrop-blur-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
                            Trusted by 50,000+ students globally
                        </div>
                        <h1 className="text-3xl sm:text-5xl xl:text-6xl font-extrabold leading-[1.1] tracking-tight mb-5 text-white max-w-xl">
                            Find the right tutor for any subject, any goal
                        </h1>
                        <p className="text-sm sm:text-base text-green-50/90 leading-relaxed max-w-md mb-8">
                            Post what you want to learn, browse verified tutor profiles, and book a session in minutes. No subscriptions, pay only for the time you book.
                        </p>

                        {/* Mode toggle */}
                        <div className="flex gap-2">
                            <button
                                onClick={() => setSessionMode("online")}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${sessionMode === "online" ? "bg-white text-green-900 border-white" : "bg-white/10 text-white border-white/30 hover:bg-white/20"
                                    }`}
                            >
                                <FiGlobe size={12} /> Online
                            </button>
                            <button
                                onClick={() => setSessionMode("in-person")}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${sessionMode === "in-person" ? "bg-white text-green-900 border-white" : "bg-white/10 text-white border-white/30 hover:bg-white/20"
                                    }`}
                            >
                                <FiUser size={12} /> In-Person
                            </button>
                        </div>
                    </div>
                </div>

                {/* Floating proof pill, overlapping hero/content boundary like Upwork's stat strip */}
                <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 -mt-25 lg:-mt-10 px-5 sm:px-8 py-5 flex flex-col sm:flex-row items-center gap-4 sm:gap-8 relative z-10">
                        <div className="flex -space-x-1 shrink-0">
                            {avatars.map((src, i) => (
                                <img key={i} src={src} alt="" className="w-9 h-9 rounded-full border-2 border-white object-cover" />
                            ))}
                        </div>
                        <p className="text-sm text-gray-600 text-center sm:text-left">
                            Booked a session this week
                        </p>
                        <div className="hidden sm:block w-px h-8 bg-gray-200" />
                    </div>
                </div>
            </section>

            {/* ── CATEGORY STRIP ── */}
            <section className="px-4 sm:px-6 lg:px-8 lg:pt-10 pt-5 pb-6 bg-white">
                <div className="max-w-6xl mx-auto">
                    <div className="flex lg:justify-center gap-2 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                className="shrink-0 px-4 py-2 rounded-full border border-gray-200 text-xs font-semibold text-gray-700 hover:border-green-300 hover:bg-green-50 hover:text-green-700 transition-all whitespace-nowrap"
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── STATS BAND ── */}
            <section className="px-4 sm:px-6 lg:px-8 py-10 bg-neutral-800">
                <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-4 text-center">
                    {stats.map((s) => (
                        <div key={s.label}>
                            <p className="text-xl sm:text-2xl font-extrabold text-white mb-1">{s.value}</p>
                            <p className="text-xs sm:text-xs text-neutral-200">{s.label}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── HOW IT WORKS ── */}
            <section className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8 bg-white">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight mb-3">How it works</h2>
                    <p className="text-sm sm:text-[15px] text-gray-500 leading-relaxed max-w-md mx-auto mb-12 sm:mb-14">
                        Start your learning journey in three simple steps. We make finding and booking your ideal tutor seamless.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6">
                        {steps.map((s, i) => (
                            <div key={s.label} className="relative flex flex-col items-center bg-gray-50 border border-gray-100 rounded-2xl p-6 sm:p-7">
                                <div className="relative mb-5">
                                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-green-50 flex items-center justify-center">
                                        {s.icon}
                                    </div>
                                </div>
                                <h3 className="text-base font-bold text-gray-900 mb-2">{s.label}</h3>
                                <p className="text-sm text-gray-500 leading-relaxed text-center">{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8 bg-white">
                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
                    <div className="grid grid-cols-2 gap-3 sm:gap-4 order-2 lg:order-1">
                        {trustCards.map((c) => (
                            <div
                                key={c.title}
                                className={`rounded-2xl p-5 sm:p-6 ${c.highlight
                                    ? "bg-green-900"
                                    : "bg-gray-50 border border-gray-100"
                                    }`}
                            >
                                <div className="mb-3">{c.icon}</div>
                                <h4 className={`text-[15px] font-bold mb-2 ${c.highlight ? "text-white" : "text-gray-900"}`}>{c.title}</h4>
                                <p className={`text-[13px] leading-relaxed ${c.highlight ? "text-green-50" : "text-gray-500"}`}>{c.desc}</p>
                            </div>
                        ))}
                    </div>
                    {/* Text */}
                    <div className="order-1 lg:order-2">
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight mb-5">
                            Your security is our{" "}
                            <span className="text-green-700">top priority</span>
                        </h2>
                        <p className="text-sm sm:text-[15px] text-gray-500 leading-relaxed mb-7">
                            A safe learning environment is the foundation for success. That's why we've built one of the industry's most rigorous verification processes.
                        </p>
                        <ul className="list-none p-0 m-0 space-y-3 mb-8">
                            {secFeatures.map((f) => (
                                <li key={f} className="flex items-center gap-3">
                                    <span className="w-5 h-5 rounded-full bg-green-50 flex items-center justify-center text-green-700 shrink-0">
                                        <FiCheck size={12} strokeWidth={3} />
                                    </span>
                                    <span className="text-sm text-gray-700">{f}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            {/* ── TESTIMONIALS ── */}
            <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-12 sm:mb-14">
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight mb-3">Real stories from real learners</h2>
                        <p className="text-sm sm:text-[15px] text-gray-500">See how WeLearnGlobal is transforming educational experiences around the world.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
                        {testimonials.map((t) => (
                            <div key={t.name} className="bg-white rounded-2xl p-6 sm:p-7 border border-gray-100 shadow-sm">
                                <div className="flex gap-0.5 mb-4">
                                    {Array(5).fill(null).map((_, i) => <FaStar key={i} size={13} className="text-amber-400" />)}
                                </div>
                                <p className="text-sm text-gray-600 leading-relaxed italic mb-5">"{t.quote}"</p>
                                <div className="flex items-center gap-2.5">
                                    <img src={t.img} alt={t.name} className="w-9 h-9 rounded-full object-cover" />
                                    <div>
                                        <p className="text-[13px] font-bold text-gray-900 leading-none mb-0.5">{t.name}</p>
                                        <p className="text-[11px] text-gray-400">{t.role}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA ── */}
            <section className="py-14 sm:py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto bg-green-950 rounded-3xl px-6 sm:px-10 lg:px-16 py-12 sm:py-16 text-center relative overflow-hidden">
                    <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-green-600/20 blur-3xl" />
                    <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-green-500/15 blur-3xl" />
                    <h2 className="relative text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight mb-4">
                        Ready to start your next learning adventure?
                    </h2>
                    <p className="relative text-sm sm:text-[15px] text-green-100/80 leading-relaxed max-w-sm mx-auto">
                        Join thousands of students and tutors today. Registration is free and takes less than 2 minutes.
                    </p>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Home;