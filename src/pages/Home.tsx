import { useState } from "react";
import {
    FaCalendarCheck,
    FaChartLine,
    FaShieldAlt,
    FaStar,
    FaUserCheck,
} from "react-icons/fa";
import {
    FiArrowRight,
    FiBookmark,
    FiCheck,
    FiChevronRight,
    FiGlobe,
    FiMapPin,
    FiSearch,
    FiUser,
} from "react-icons/fi";
// import heroImage from "../../assets/welearnheroimage.jpg";
import heroImage from '../assets/welearnheroimage2.jpg';
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import TutorsBanner from "../components/TutorsBanner";


const tutors = [
    {
        id: 1,
        name: "Dr. Sarah Jenkins",
        title: "PhD in Physics & Calculus with 10+ years of teaching experience",
        sessions: 128,
        rating: 4.9,
        price: 55,
        image: "SJ",
        subjects: ["Physics", "Calculus"],
        tags: ["AP Physics"],
        sessionType: ["online"],
        verified: true,
        img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80",
    },
    {
        id: 2,
        name: "James Rodriguez",
        title: "Native Spanish speaker bringing language and culture to life",
        sessions: 245,
        rating: 5,
        price: 35,
        image: "JR",
        subjects: ["Spanish", "Culture"],
        tags: ["Conversational"],
        sessionType: ["online", "on-site"],
        verified: true,
        img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80"
    },
    {
        id: 3,
        name: "Elena Fischer",
        title: "Classical pianist with conservatory training and a passion for theory",
        sessions: 89,
        rating: 4.8,
        price: 45,
        image: "EF",
        subjects: ["Piano", "Music Theory"],
        tags: ["Classical"],
        sessionType: ["online"],
        verified: true,
        img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80"

    },
    {
        id: 4,
        name: "Michael Chen",
        title: "Full-stack engineer teaching practical, project-based web development",
        sessions: 156,
        rating: 4.9,
        price: 65,
        image: "MC",
        subjects: ["Web Dev", "React"],
        tags: ["Full-Stack"],
        sessionType: ["online"],
        verified: true,
        img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80",

    },
];

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

const StarRating = ({ rating }: { rating: number }) => (
    <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
                <FaStar
                    key={i}
                    size={10}
                    className={i < Math.round(rating) ? "text-yellow-400" : "text-gray-300"}
                />
            ))}
        </div>
        <span className="font-bold text-sm text-gray-900">{rating}</span>
    </div>
);

const TutorCard = ({ tutor }: { tutor: typeof tutors[0] }) => (
    <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden transition-all hover:shadow-lg hover:shadow-green-100/60">
        {/* Banner */}
        <TutorsBanner seed={tutor.id} className="h-26 w-full" />

        <div className="p-6 pt-0 flex flex-col h-full">
            <div className="flex items-start justify-between gap-4 mb-2 relative -mt-8">
                <div className="w-16 h-16 rounded-lg bg-green-950 ring-4 ring-gray-100 flex items-center overflow-hidden justify-center text-white font-bold text-lg shrink-0">
                    <img src={tutor.img} className="w-full h-full object-cover" alt="" />
                </div>
                <button className="p-3 text-green-800 bg-white rounded-full mt-2 shadow-sm">
                    <FiBookmark size={20} />
                </button>
            </div>

            {/* Name and Title */}
            <div className="mb-4">
                <div className="flex items-center gap-1.5">
                    <h4 className="text-lg font-bold text-gray-900">{tutor.name}</h4>
                    {tutor.verified && (
                        <span title="Verified" className="text-green-700">
                            <FiCheck size={14} strokeWidth={3} />
                        </span>
                    )}
                </div>
                <p className="text-xs text-gray-600 line-clamp-2 leading-tight">{tutor.title}</p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-2">
                {tutor.tags.map((tag, idx) => (
                    <span key={idx} className="px-2 py-1 bg-gray-200 text-gray-700 font-semibold rounded-full text-[10px]">
                        {tag}
                    </span>
                ))}
            </div>

            {/* Rating */}
            <div className="mb-2 flex items-center justify-between">
                <StarRating rating={tutor.rating} />
                <span className="text-xs text-gray-400">{tutor.sessions} sessions</span>
            </div>

            {/* Session Type and Price */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-200 mb-2">
                <div className="flex items-center gap-2 flex-wrap">
                    {tutor.sessionType.includes("online") && (
                        <span className="px-2 py-1 bg-green-50 text-green-700 rounded text-xs font-semibold">
                            Online
                        </span>
                    )}
                    {tutor.sessionType.includes("on-site") && (
                        <span className="px-2 py-1 bg-orange-50 text-orange-700 rounded text-xs font-semibold">
                            Onsite
                        </span>
                    )}
                </div>
                <div className="text-right">
                    <span className="text-lg font-bold text-gray-900">${tutor.price}</span>
                    <span className="text-xs text-gray-600">/hr</span>
                </div>
            </div>

            {/* Action Button */}
            <button className="w-full px-4 py-3 border-2 border-green-700 text-green-700 bg-white rounded-full font-semibold transition-all text-sm hover:bg-green-50">
                View Profile
            </button>
        </div>
    </div>
);

const Home = () => {
    const [sessionMode, setSessionMode] = useState<"online" | "in-person">("online");

    return (
        <div className="font-sans text-gray-900 bg-white">
            <Navbar />
            <div className="h-16" />

            {/* ── HERO — Upwork-style full-bleed image with dark overlay & overlapping search card ── */}
            <section className="relative">
                <div className="relative h-[520px] sm:h-[560px] lg:h-[600px] w-full overflow-hidden">
                    <img
                        src={heroImage}
                        alt="Student learning with a tutor"
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-green-950/90 via-green-950/70 to-green-950/30" />

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

                        {/* Search */}
                        <div className="flex flex-col sm:flex-row bg-white rounded-2xl shadow-2xl overflow-hidden max-w-2xl">
                            <div className="flex items-center gap-2 px-4 py-3.5 flex-1 min-w-0 border-b sm:border-b-0 sm:border-r border-gray-100">
                                <FiSearch size={16} className="text-gray-400 shrink-0" />
                                <input placeholder="What do you want to learn?" className="border-none outline-none text-sm text-gray-700 bg-transparent w-full placeholder-gray-400" />
                            </div>
                            <div className="flex items-center gap-2 px-4 py-3.5 flex-1 min-w-0 border-b sm:border-b-0 sm:border-r border-gray-100">
                                <FiMapPin size={16} className="text-gray-400 shrink-0" />
                                <input placeholder="Location" className="border-none outline-none text-sm text-gray-700 bg-transparent w-full placeholder-gray-400" />
                            </div>
                            <button className="flex items-center justify-center gap-2 px-6 py-3.5 bg-green-700 text-white text-sm font-semibold whitespace-nowrap hover:bg-green-800 transition-colors">
                                <FiSearch size={15} /> Find Tutors
                            </button>
                        </div>

                        {/* Mode toggle */}
                        <div className="flex gap-2 mt-4">
                            <button
                                onClick={() => setSessionMode("online")}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${sessionMode === "online" ? "bg-white text-green-800 border-white" : "bg-white/10 text-white border-white/30 hover:bg-white/20"
                                    }`}
                            >
                                <FiGlobe size={12} /> Online
                            </button>
                            <button
                                onClick={() => setSessionMode("in-person")}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${sessionMode === "in-person" ? "bg-white text-green-800 border-white" : "bg-white/10 text-white border-white/30 hover:bg-white/20"
                                    }`}
                            >
                                <FiUser size={12} /> In-Person
                            </button>
                        </div>
                    </div>
                </div>

                {/* Floating proof pill, overlapping hero/content boundary like Upwork's stat strip */}
                <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 -mt-8 sm:-mt-10 px-5 sm:px-8 py-5 flex flex-col sm:flex-row items-center gap-4 sm:gap-8 relative z-10">
                        <div className="flex -space-x-2 shrink-0">
                            {avatars.map((src, i) => (
                                <img key={i} src={src} alt="" className="w-9 h-9 rounded-full border-2 border-white object-cover" />
                            ))}
                        </div>
                        <p className="text-sm text-gray-600 text-center sm:text-left">
                            <span className="font-bold text-gray-900">10,000+ students</span> booked a session this week
                        </p>
                        <div className="hidden sm:block w-px h-8 bg-gray-200" />
                        <div className="flex items-center gap-1.5 text-sm text-gray-600">
                            <FaStar size={13} className="text-amber-400" />
                            <span className="font-bold text-gray-900">4.9</span> average tutor rating
                        </div>
                    </div>
                </div>
            </section>

            {/* ── CATEGORY STRIP ── */}
            <section className="px-4 sm:px-6 lg:px-8 pt-10 pb-6 bg-white">
                <div className="max-w-6xl mx-auto">
                    <div className="flex gap-2 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                className="shrink-0 px-4 py-2 rounded-full border border-gray-200 text-sm font-semibold text-gray-700 hover:border-green-300 hover:bg-green-50 hover:text-green-700 transition-all whitespace-nowrap"
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── STATS BAND ── */}
            <section className="px-4 sm:px-6 lg:px-8 py-10 bg-green-950">
                <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-4 text-center">
                    {stats.map((s) => (
                        <div key={s.label}>
                            <p className="text-2xl sm:text-3xl font-extrabold text-white mb-1">{s.value}</p>
                            <p className="text-xs sm:text-sm text-green-200">{s.label}</p>
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
                                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-green-50 border-2 border-green-100 flex items-center justify-center">
                                        {s.icon}
                                    </div>
                                    <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-green-700 text-white text-[10px] font-bold flex items-center justify-center">
                                        0{i + 1}
                                    </span>
                                </div>
                                <h3 className="text-base font-bold text-gray-900 mb-2">{s.label}</h3>
                                <p className="text-sm text-gray-500 leading-relaxed text-center">{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── FEATURED EXPERTS ── */}
            <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-wrap items-end justify-between gap-4 mb-8 sm:mb-9">
                        <div>
                            <span className="text-xs font-bold text-green-700 uppercase tracking-widest block mb-1.5">Top rated</span>
                            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">Featured experts</h2>
                            <p className="text-sm text-gray-500">Learn from the best. These tutors are currently trending.</p>
                        </div>
                        <button className="flex items-center gap-1.5 px-4 py-2.5 border border-gray-200 rounded-full bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors shrink-0">
                            Explore all tutors <FiChevronRight size={14} />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                        {tutors.map((t) => (
                            <TutorCard key={t.id} tutor={t} />
                        ))}
                    </div>
                </div>
            </section>

            {/* ── SECURITY ── */}
            <section className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8 bg-white">
                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
                    {/* Cards */}
                    <div className="grid grid-cols-2 gap-3 sm:gap-4 order-2 lg:order-1">
                        {trustCards.map((c) => (
                            <div
                                key={c.title}
                                className={`rounded-2xl p-5 sm:p-6 ${c.highlight
                                    ? "bg-green-800"
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
                        <button className="px-6 py-3 rounded-full bg-green-700 text-white text-sm font-semibold hover:bg-green-800 transition-colors border-none cursor-pointer">
                            Join the community
                        </button>
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
                    <p className="relative text-sm sm:text-[15px] text-green-100/80 leading-relaxed max-w-sm mx-auto mb-8 sm:mb-9">
                        Join thousands of students and tutors today. Registration is free and takes less than 2 minutes.
                    </p>
                    <div className="relative flex flex-wrap gap-3 justify-center">
                        <button className="flex items-center gap-2 px-6 sm:px-7 py-3.5 rounded-full bg-green-700 hover:bg-green-600 text-white font-bold text-sm transition-colors border-none cursor-pointer">
                            Get started for free <FiArrowRight size={15} />
                        </button>
                        <button className="px-6 sm:px-7 py-3.5 rounded-full border border-white/25 bg-white/10 text-white font-semibold text-sm hover:bg-white/20 transition-colors cursor-pointer">
                            Become a tutor
                        </button>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Home;