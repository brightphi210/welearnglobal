import {
    FaGlobeAmericas,
    FaGraduationCap,
    FaHandsHelping
} from "react-icons/fa";
import { FiArrowRight } from "react-icons/fi";
import { Link } from "react-router-dom";
import developer from '../assets/bio.png';
import ceo from '../assets/ceo.jpeg';
import coceo from '../assets/coceo.jpeg';
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const values = [
    {
        icon: <FaGraduationCap size={22} className="text-green-700" />,
        title: "Quality First",
        desc: "Every tutor on our platform is vetted for expertise, not just enthusiasm.",
    },
    {
        icon: <FaGlobeAmericas size={22} className="text-green-700" />,
        title: "Learning Without Borders",
        desc: "Connect with the right teacher no matter where you or they are in the world.",
    },
    {
        icon: <FaHandsHelping size={22} className="text-green-700" />,
        title: "Human Connection",
        desc: "Great learning happens through real relationships, not just content.",
    },
];

const stats = [
    { value: "50K+", label: "Active students" },
    { value: "8,200+", label: "Verified tutors" },
    { value: "300+", label: "Subjects covered" },
    { value: "2019", label: "Founded" },
];

const team = [
    { name: "Amaechi Nkwa", role: "CEO & Manager", img: ceo },
    { name: "Daniel Wu", role: "Co-CEO", img: coceo },
    { name: "Bright Philip", role: "Software Engineer", img: developer },
];

const About = () => {
    return (
        <div className="font-sans text-gray-900 bg-white">
            <Navbar />
            <div className="h-16" />

            {/* ── HERO ── */}
            <section className="px-4 sm:px-6 lg:px-8 pt-16 pb-14 sm:pt-20 sm:pb-16 bg-green-950">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center gap-1.5 bg-white/10 border border-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded-full mb-5 backdrop-blur-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
                        About WeLearnGlobal
                    </div>
                    <h1 className="text-3xl sm:text-5xl font-extrabold leading-[1.1] tracking-tight text-white mb-5">
                        Making great teachers accessible to everyone
                    </h1>
                    <p className="text-sm sm:text-base text-green-50/90 leading-relaxed max-w-xl mx-auto">
                        We started WeLearnGlobal because finding a truly great tutor shouldn't depend on luck, location, or who you happen to know.
                    </p>
                </div>
            </section>

            {/* ── STATS BAND ── */}
            <section className="px-4 sm:px-6 lg:px-8 py-10 bg-white border-b border-gray-100">
                <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-4 text-center">
                    {stats.map((s) => (
                        <div key={s.label}>
                            <p className="text-2xl sm:text-3xl font-extrabold text-green-800 mb-1">{s.value}</p>
                            <p className="text-xs sm:text-sm text-gray-500">{s.label}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── OUR STORY ── */}
            <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white">
                <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-10 items-center">
                    <div>
                        <span className="text-xs font-bold text-green-700 uppercase tracking-widest block mb-2">Our story</span>
                        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-4">
                            Built from a simple frustration
                        </h2>
                        <p className="text-sm sm:text-[15px] text-gray-500 leading-relaxed mb-4">
                            After months of trial and error trying to find a reliable calculus tutor for a sibling, our founders realized the problem wasn't a lack of great teachers — it was a lack of a trustworthy way to find them.
                        </p>
                        <p className="text-sm sm:text-[15px] text-gray-500 leading-relaxed">
                            Today, WeLearnGlobal connects tens of thousands of students with verified, expert tutors across hundreds of subjects, online and in person.
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&q=80" className="rounded-2xl w-full h-40 object-cover" alt="" />
                        <img src="https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400&q=80" className="rounded-2xl w-full h-40 object-cover mt-6" alt="" />
                    </div>
                </div>
            </section>

            {/* ── VALUES ── */}
            <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
                <div className="max-w-5xl mx-auto text-center">
                    <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-3">What we stand for</h2>
                    <p className="text-sm sm:text-[15px] text-gray-500 leading-relaxed max-w-md mx-auto mb-12">
                        The principles that guide every decision we make.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6">
                        {values.map((v) => (
                            <div key={v.title} className="bg-white border border-gray-100 rounded-2xl p-6 sm:p-7 text-left">
                                <div className="w-14 h-14 rounded-full bg-green-50 border-2 border-green-100 flex items-center justify-center mb-5">
                                    {v.icon}
                                </div>
                                <h3 className="text-base font-bold text-gray-900 mb-2">{v.title}</h3>
                                <p className="text-sm text-gray-500 leading-relaxed">{v.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── TEAM ── */}
            <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-12">
                        <span className="text-xs font-bold text-green-700 uppercase tracking-widest block mb-1.5">Meet the team</span>
                        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">The people behind WeLearnGlobal</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        {team.map((m) => (
                            <div key={m.name} className="text-center ">
                                <img src={m.img} alt={m.name} className="w-24 h-24 bg-gray-200 rounded-full object-cover mx-auto mb-4" />
                                <p className="font-bold text-gray-900 text-sm mb-0.5">{m.name}</p>
                                <p className="text-xs text-gray-400">{m.role}</p>
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
                    <h2 className="relative text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-4">
                        Want to be part of the story?
                    </h2>
                    <p className="relative text-sm sm:text-[15px] text-green-100/80 leading-relaxed max-w-sm mx-auto mb-8">
                        Join as a student to learn, or as a tutor to teach. Either way, it takes less than 2 minutes.
                    </p>
                    <div className="relative flex flex-wrap gap-3 justify-center">
                        <Link to={'/signup'}>
                            <button className="flex items-center gap-2 px-6 sm:px-7 py-3.5 rounded-full bg-green-700 hover:bg-green-600 text-white font-bold text-sm transition-colors border-none cursor-pointer">
                                Get started <FiArrowRight size={15} />
                            </button>
                        </Link>

                        <Link to={'/signup'}>
                            <button className="px-6 sm:px-7 py-3.5 rounded-full border border-white/25 bg-white/10 text-white font-semibold text-sm hover:bg-white/20 transition-colors cursor-pointer">
                                Become a tutor
                            </button>
                        </Link>

                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default About;