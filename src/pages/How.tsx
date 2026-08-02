import {
    FaCalendarCheck,
    FaChartLine,
    FaComments,
    FaCreditCard,
    FaSearch,
    FaUserCheck,
} from "react-icons/fa";
import { FiArrowRight, FiCheck, FiHelpCircle } from "react-icons/fi";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const steps = [
    {
        icon: <FaSearch size={22} className="text-green-700" />,
        num: "01",
        title: "Search & Discover",
        desc: "Tell us what you want to learn. Browse thousands of verified tutor profiles, filter by subject, price, availability, and session type — online or in person.",
    },
    {
        icon: <FaComments size={22} className="text-green-700" />,
        num: "02",
        title: "Message & Compare",
        desc: "Reach out to a few tutors that catch your eye. Ask about their teaching style, check reviews from past students, and find the right fit before you commit.",
    },
    {
        icon: <FaCalendarCheck size={22} className="text-green-700" />,
        num: "03",
        title: "Book a Session",
        desc: "Pick a time that works for you and book directly from your dashboard. Start with a trial session or set up a recurring schedule — it's entirely up to you.",
    },
    {
        icon: <FaCreditCard size={22} className="text-green-700" />,
        num: "04",
        title: "Pay Securely",
        desc: "Your payment is held securely until the session is complete, so you only pay for the time you actually receive. No subscriptions, no hidden fees.",
    },
    {
        icon: <FaUserCheck size={22} className="text-green-700" />,
        num: "05",
        title: "Learn Together",
        desc: "Connect through our built-in video classroom or meet in person. Share files, take notes, and message your tutor anytime between sessions.",
    },
    {
        icon: <FaChartLine size={22} className="text-green-700" />,
        num: "06",
        title: "Track Your Progress",
        desc: "Review session history, leave feedback, and watch your progress add up over time. Not the right fit? We'll help you find a new tutor for free.",
    },
];

const faqs = [
    {
        q: "How much does tutoring cost?",
        a: "Tutors set their own hourly rates, typically ranging from $25 to $100+ depending on subject and experience. You'll always see the price upfront before booking.",
    },
    {
        q: "Is my first session protected?",
        a: "Yes. If you're not satisfied with your first session, we'll match you with a new tutor at no extra cost.",
    },
    {
        q: "Can I switch between online and in-person sessions?",
        a: "Absolutely. Many tutors offer both options, and you can switch between them at any time based on what works best for you.",
    },
    {
        q: "How are tutors verified?",
        a: "Every tutor goes through identity verification, credential checks, and — for in-person sessions — mandatory safety training before they can join the platform.",
    },
];

const How = () => {
    return (
        <div className="font-sans text-gray-900 bg-white">
            <Navbar />
            <div className="h-16" />

            {/* ── HERO ── */}
            <section className="px-4 sm:px-6 lg:px-8 py-16 sm:py-20 bg-green-950">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center gap-1.5 bg-white/10 border border-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded-full mb-5 backdrop-blur-sm">
                        <FiHelpCircle size={12} /> Simple, transparent, effective
                    </div>
                    <h1 className="text-3xl sm:text-5xl font-extrabold leading-[1.1] tracking-tight text-white mb-5">
                        How WeLearnGlobal works
                    </h1>
                    <p className="text-sm sm:text-base text-green-50/90 leading-relaxed max-w-xl mx-auto">
                        From finding the right tutor to tracking your progress — here's exactly what to expect at every step.
                    </p>
                </div>
            </section>

            {/* ── STEPS ── */}
            <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white">
                <div className="max-w-5xl mx-auto">
                    <div className="space-y-5 sm:space-y-6">
                        {steps.map((s, i) => (
                            <div
                                key={s.title}
                                className={`flex flex-col sm:flex-row items-start gap-5 sm:gap-8 rounded-3xl border border-gray-100 p-6 sm:p-8 ${i % 2 === 0 ? "bg-gray-50" : "bg-white"
                                    }`}
                            >
                                <div className="flex items-center gap-4 sm:flex-col sm:items-center shrink-0">
                                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-green-50 border-2 border-green-100 flex items-center justify-center">
                                        {s.icon}
                                    </div>
                                    <span className="text-xs font-bold text-green-700 sm:mt-2">{s.num}</span>
                                </div>
                                <div>
                                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">{s.title}</h3>
                                    <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── WHY IT WORKS ── */}
            <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-green-950">
                <div className="max-w-5xl mx-auto text-center">
                    <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-10">
                        Why students choose us
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                        {[
                            "No subscriptions — pay only for the sessions you book",
                            "Every tutor is background and credential verified",
                            "Free rematch if your first session isn't the right fit",
                        ].map((item) => (
                            <div key={item} className="flex items-start gap-3 bg-white/10 border border-white/10 rounded-2xl p-5 text-left">
                                <span className="w-5 h-5 rounded-full bg-green-600 flex items-center justify-center text-white shrink-0 mt-0.5">
                                    <FiCheck size={12} strokeWidth={3} />
                                </span>
                                <span className="text-sm text-green-50">{item}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── FAQ ── */}
            <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white">
                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-3">Frequently asked questions</h2>
                        <p className="text-sm text-gray-500">Still have questions? Our support team is happy to help.</p>
                    </div>
                    <div className="space-y-4">
                        {faqs.map((f) => (
                            <div key={f.q} className="bg-gray-50 border border-gray-100 rounded-2xl p-5 sm:p-6">
                                <h4 className="text-sm font-bold text-gray-900 mb-2">{f.q}</h4>
                                <p className="text-sm text-gray-500 leading-relaxed">{f.a}</p>
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
                        Ready to get started?
                    </h2>
                    <p className="relative text-sm text-green-100/80 leading-relaxed max-w-sm mx-auto mb-8">
                        Find your tutor and book your first session in just a few minutes.
                    </p>
                    <button className="relative flex items-center gap-2 px-7 py-3.5 rounded-full bg-green-700 hover:bg-green-600 text-white font-bold text-sm transition-colors border-none cursor-pointer mx-auto">
                        Find a tutor <FiArrowRight size={15} />
                    </button>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default How;