import { FaEnvelope, FaPhoneAlt } from "react-icons/fa";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const contactInfo = [
    { icon: <FaEnvelope size={18} className="text-green-700" />, label: "Email us", value: "welearn562@gmail.com" },
    { icon: <FaPhoneAlt size={18} className="text-green-700" />, label: "Call us", value: "+234 813 113 3113" },
];

const Contact = () => {

    return (
        <div className="font-sans text-gray-900 bg-white">
            <Navbar />
            <div className="h-16" />

            {/* ── HERO ── */}
            <section className="px-4 sm:px-6 lg:px-8 py-16 sm:py-20 bg-green-950">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-3xl sm:text-5xl font-extrabold leading-[1.1] tracking-tight text-white mb-5">
                        Get in touch
                    </h1>
                    <p className="text-sm sm:text-base text-green-50/90 leading-relaxed max-w-xl mx-auto">
                        Have a question about tutors, sessions, or becoming a tutor yourself? We'd love to hear from you.
                    </p>
                </div>
            </section>

            {/* ── CONTACT CONTENT ── */}
            <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white">
                <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-1">
                    {/* Info column */}
                    <div className="lg:col-span-2 space-y-6">
                        <div>
                            <h2 className="text-2xl font-extrabold tracking-tight mb-3">Let's talk</h2>
                            <p className="text-sm text-gray-500 leading-relaxed">
                                Our support team typically responds within one business day.
                            </p>
                        </div>
                        {contactInfo.map((c) => (
                            <div key={c.label} className="flex items-start gap-4 bg-gray-50 border border-gray-100 rounded-2xl p-5">
                                <div className="w-11 h-11 rounded-full bg-green-50 flex items-center justify-center shrink-0">
                                    {c.icon}
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 mb-0.5">{c.label}</p>
                                    <p className="text-sm font-semibold text-gray-900">{c.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Contact;