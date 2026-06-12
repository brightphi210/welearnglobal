import {
    FaCalendarCheck, FaChartLine,
    FaShieldAlt, FaStar,
    FaUserCheck,
} from "react-icons/fa";
import {
    FiArrowRight,
    FiCheck, FiChevronRight,
    FiGlobe,
    FiMapPin,
    FiSearch,
    FiUser
} from "react-icons/fi";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";

const tutors = [
    { name: "Dr. Sarah Jenkins", subject: "Advanced Physics & Calculus", sessions: 128, rating: 4.9, price: 55, img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80" },
    { name: "James Rodriguez", subject: "Spanish Language & Culture", sessions: 245, rating: 5, price: 35, img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80" },
    { name: "Elena Fischer", subject: "Classical Piano & Theory", sessions: 89, rating: 4.8, price: 45, img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80" },
    { name: "Michael Chen", subject: "Full-Stack Web Development", sessions: 156, rating: 4.9, price: 65, img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80" },
];

const testimonials = [
    { quote: "The level of expertise Sarah brought to my Calculus sessions was incredible. I went from failing to an A- in just three months.", name: "Mark Thompson", role: "High School Student", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80" },
    { quote: "I wanted to learn Spanish for my upcoming trip to Mexico. My tutor James didn't just teach me grammar, but actual conversation skills.", name: "Linda Garcia", role: "Marketing Manager", img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80" },
    { quote: "As a developer, I needed to learn React quickly. Michael's hands-on approach and real-world projects were exactly what I needed.", name: "David Kim", role: "Junior Developer", img: "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=100&q=80" },
];

const steps = [
    { icon: <FaUserCheck size={24} className="text-emerald-500" />, label: "Find Your Tutor", desc: "Browse thousands of expert tutors across hundreds of subjects using our intelligent search filters." },
    { icon: <FaCalendarCheck size={24} className="text-emerald-500" />, label: "Book a Session", desc: "Schedule a trial or regular session at a time that works for you. All bookings are managed in your dashboard." },
    { icon: <FaChartLine size={24} className="text-emerald-500" />, label: "Start Learning", desc: "Connect via our high-quality video classroom or meet in-person. Track your progress and achieve your goals." },
];

const secFeatures = [
    "Identity and background verification for all tutors",
    "Academic credential and certification validation",
    "Mandatory safety training for in-person sessions",
    "Secure escrow-style payment system",
];

const trustCards = [
    { icon: <FaShieldAlt size={22} className="text-emerald-500" />, title: "Verified Experts", desc: "Every tutor undergoes a multi-step background and certification check.", highlight: false },
    { icon: <FiSearch size={22} className="text-emerald-500" />, title: "Smart Matching", desc: "Our AI-powered system finds tutors based on your learning style and goals.", highlight: false },
    { icon: <FiUser size={22} className="text-emerald-500" />, title: "Quality Support", desc: "Our consultants are available 24/7 to help you find the right fit.", highlight: false },
    { icon: <FaStar size={22} className="text-white" />, title: "100% Satisfaction", desc: "Not happy with your first session? We'll match you with a new tutor for free.", highlight: true },
];

const avatars = [
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&q=80",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&q=80",
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=60&q=80",
];

const Home = () => {
    return (
        <div className="font-sans text-gray-900 bg-white">
            <Navbar />
            <div className="h-16" />

            {/* ── HERO ── */}
            <section className="bg-gradient-to-br from-emerald-50/60 via-white to-white py-20 px-6">
                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
                    {/* Left */}
                    <div>
                        <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                            Trusted by 50,000+ Students Globally
                        </div>
                        <h1 className="text-4xl sm:text-5xl xl:text-6xl font-extrabold leading-[1.08] tracking-tight mb-5 text-gray-900">
                            Master Any Subject with{" "}
                            <span className="text-emerald-500 italic">Expert Tutors</span>
                        </h1>
                        <p className="text-base text-gray-500 leading-relaxed max-w-md mb-9">
                            Connect with verified professionals for 1-on-1 personalized learning. Whether it's Calculus, Guitar, or Mandarin—we've got you covered.
                        </p>

                        {/* Search */}
                        <div className="flex flex-wrap bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                            <div className="flex items-center gap-2 px-4 py-3 flex-1 min-w-[120px] border-r border-gray-100">
                                <FiSearch size={14} className="text-gray-400 shrink-0" />
                                <input placeholder="Subject" className="border-none outline-none text-sm text-gray-700 bg-transparent w-full placeholder-gray-400" />
                            </div>
                            <div className="flex items-center gap-2 px-4 py-3 flex-1 min-w-[120px] border-r border-gray-100">
                                <FiMapPin size={14} className="text-gray-400 shrink-0" />
                                <input placeholder="Location" className="border-none outline-none text-sm text-gray-700 bg-transparent w-full placeholder-gray-400" />
                            </div>
                            <div className="flex gap-1.5 px-3 py-2 items-center">
                                <button className="flex items-center gap-1 px-2.5 py-1.5 rounded-md border border-emerald-400 bg-emerald-50 text-emerald-600 text-xs font-semibold">
                                    <FiGlobe size={11} /> Online
                                </button>
                                <button className="flex items-center gap-1 px-2.5 py-1.5 rounded-md border border-gray-200 text-gray-500 text-xs font-semibold">
                                    <FiUser size={11} /> In-Person
                                </button>
                            </div>
                            <button className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-emerald-400 to-emerald-600 text-white text-sm font-semibold whitespace-nowrap hover:opacity-90 transition-opacity">
                                <FiSearch size={14} /> Find Tutors
                            </button>
                        </div>
                    </div>

                    {/* Right */}
                    <div className="relative order-first lg:order-last">
                        <div className="rounded-2xl overflow-hidden shadow-2xl shadow-emerald-100 aspect-[4/3]">
                            <img
                                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80"
                                alt="Students learning"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        {/* Floating pill */}
                        <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 bg-white rounded-xl px-4 py-3 flex items-center gap-3 shadow-xl whitespace-nowrap">
                            <div className="flex">
                                {avatars.map((src, i) => (
                                    <img key={i} src={src} alt="" className="w-7 h-7 rounded-full border-2 border-white object-cover -ml-2 first:ml-0" />
                                ))}
                            </div>
                            <span className="text-sm font-medium text-gray-700">Join 10k+ active students this week</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── HOW IT WORKS ── */}
            <section className="py-24 px-6 bg-white">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">How it Works</h2>
                    <p className="text-[15px] text-gray-500 leading-relaxed max-w-md mx-auto mb-14">
                        Start your learning journey in three simple steps. We make finding and booking your ideal tutor seamless.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        {steps.map((s, i) => (
                            <div key={s.label} className="relative flex flex-col items-center bg-gray-50 border border-gray-100 rounded-2xl p-7">
                                <div className="relative mb-5">
                                    <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-100 flex items-center justify-center">
                                        {s.icon}
                                    </div>
                                    <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 text-white text-[10px] font-bold flex items-center justify-center">
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
            <section className="py-20 px-6 bg-gray-50">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-wrap items-end justify-between gap-4 mb-9">
                        <div>
                            <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest block mb-1.5">Top Rated</span>
                            <h2 className="text-3xl font-extrabold tracking-tight mb-2">Featured Experts</h2>
                            <p className="text-sm text-gray-500">Learn from the best. These tutors are currently trending.</p>
                        </div>
                        <button className="flex items-center gap-1.5 px-4 py-2.5 border border-gray-200 rounded-lg bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors shrink-0">
                            Explore All Tutors <FiChevronRight size={14} />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {tutors.map((t) => (
                            <div
                                key={t.name}
                                className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:-translate-y-1 hover:shadow-lg hover:shadow-emerald-100/60 transition-all duration-200"
                            >
                                <div className="relative">
                                    <img src={t.img} alt={t.name} className="w-full aspect-[4/3] object-cover" />
                                    <div className="absolute top-2.5 left-2.5 bg-white/90 backdrop-blur-sm rounded-md px-2 py-1 flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                                        <FiCheck size={10} strokeWidth={3} /> VERIFIED
                                    </div>
                                </div>
                                <div className="p-4">
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className="text-[15px] font-bold text-gray-900 leading-snug">{t.name}</h3>
                                        <div className="flex items-center gap-1 shrink-0">
                                            <FaStar size={11} className="text-amber-400" />
                                            <span className="text-xs font-bold text-gray-800">{t.rating}</span>
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-500 mb-1.5">{t.subject}</p>
                                    <p className="text-xs text-gray-400 mb-4">{t.sessions} successful sessions</p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-lg font-extrabold text-gray-900">
                                            ${t.price}<span className="text-xs font-normal text-gray-400">/hr</span>
                                        </span>
                                        <button className="flex items-center gap-1 text-sm font-semibold text-emerald-500 bg-transparent border-none cursor-pointer p-0 hover:text-emerald-600 transition-colors">
                                            View Profile <FiChevronRight size={13} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── SECURITY ── */}
            <section className="py-24 px-6 bg-white">
                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* Cards */}
                    <div className="grid grid-cols-2 gap-4">
                        {trustCards.map((c) => (
                            <div
                                key={c.title}
                                className={`rounded-2xl p-6 ${c.highlight
                                        ? "bg-gradient-to-br from-emerald-400 to-emerald-600"
                                        : "bg-gray-50 border border-gray-100"
                                    }`}
                            >
                                <div className="mb-3">{c.icon}</div>
                                <h4 className={`text-[15px] font-bold mb-2 ${c.highlight ? "text-white" : "text-gray-900"}`}>{c.title}</h4>
                                <p className={`text-[13px] leading-relaxed ${c.highlight ? "text-emerald-50" : "text-gray-500"}`}>{c.desc}</p>
                            </div>
                        ))}
                    </div>
                    {/* Text */}
                    <div>
                        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight mb-5">
                            Your Security is Our{" "}
                            <span className="text-emerald-500">Top Priority</span>
                        </h2>
                        <p className="text-[15px] text-gray-500 leading-relaxed mb-7">
                            We believe that a safe learning environment is the foundation for success. That's why we've built the industry's most rigorous verification process.
                        </p>
                        <ul className="list-none p-0 m-0 space-y-3 mb-8">
                            {secFeatures.map((f) => (
                                <li key={f} className="flex items-center gap-3">
                                    <span className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-500 shrink-0">
                                        <FiCheck size={12} strokeWidth={3} />
                                    </span>
                                    <span className="text-sm text-gray-700">{f}</span>
                                </li>
                            ))}
                        </ul>
                        <button className="px-6 py-3 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition-colors border-none cursor-pointer">
                            Join the Community
                        </button>
                    </div>
                </div>
            </section>

            {/* ── TESTIMONIALS ── */}
            <section className="py-20 px-6 bg-gray-50">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-14">
                        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">Real Stories from Real Learners</h2>
                        <p className="text-[15px] text-gray-500">See how WeLearnGlobal is transforming educational experiences around the world.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {testimonials.map((t) => (
                            <div key={t.name} className="bg-white rounded-2xl p-7 border border-gray-100 shadow-sm">
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
            <section className="py-16 px-6">
                <div className="max-w-3xl mx-auto bg-gradient-to-br from-emerald-800 to-emerald-950 rounded-3xl px-8 sm:px-16 py-16 text-center relative overflow-hidden">
                    <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-emerald-500/20 blur-3xl" />
                    <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-emerald-400/15 blur-3xl" />
                    <h2 className="relative text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
                        Ready to start your next learning adventure?
                    </h2>
                    <p className="relative text-[15px] text-emerald-100/80 leading-relaxed max-w-sm mx-auto mb-9">
                        Join thousands of students and tutors today. Registration is free and takes less than 2 minutes.
                    </p>
                    <div className="relative flex flex-wrap gap-3 justify-center">
                        <button className="flex items-center gap-2 px-7 py-3.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-white font-bold text-sm transition-colors border-none cursor-pointer">
                            Get Started for Free <FiArrowRight size={15} />
                        </button>
                        <button className="px-7 py-3.5 rounded-xl border border-white/25 bg-white/10 text-white font-semibold text-sm hover:bg-white/20 transition-colors cursor-pointer">
                            Become a Tutor
                        </button>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Home;