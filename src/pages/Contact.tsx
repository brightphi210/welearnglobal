import { useState } from "react";
import { FaEnvelope, FaMapMarkerAlt, FaPhoneAlt } from "react-icons/fa";
import { FiSend } from "react-icons/fi";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const contactInfo = [
    { icon: <FaEnvelope size={18} className="text-green-700" />, label: "Email us", value: "support@welearnglobal.com" },
    { icon: <FaPhoneAlt size={18} className="text-green-700" />, label: "Call us", value: "+1 (555) 123-4567" },
    { icon: <FaMapMarkerAlt size={18} className="text-green-700" />, label: "Visit us", value: "123 Learning Ave, San Francisco, CA" },
];

const Contact = () => {
    const [form, setForm] = useState({ name: "", email: "", message: "" });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = () => {
        console.log(form);
        // hook up to your backend/email service here
    };

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
                <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-12">
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

                    {/* Form column */}
                    <div className="lg:col-span-3">
                        <div className="bg-gray-50 border border-gray-100 rounded-3xl p-6 sm:p-8">
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-semibold text-gray-700 block mb-1.5">Full name</label>
                                    <input
                                        name="name"
                                        value={form.name}
                                        onChange={handleChange}
                                        placeholder="Jane Doe"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-green-600 bg-white"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-gray-700 block mb-1.5">Email address</label>
                                    <input
                                        name="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        placeholder="jane@example.com"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-green-600 bg-white"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-gray-700 block mb-1.5">Message</label>
                                    <textarea
                                        name="message"
                                        value={form.message}
                                        onChange={handleChange}
                                        rows={5}
                                        placeholder="How can we help?"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-green-600 bg-white resize-none"
                                    />
                                </div>
                                <button
                                    onClick={handleSubmit}
                                    className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-green-700 hover:bg-green-800 text-white font-semibold text-sm transition-colors border-none cursor-pointer"
                                >
                                    Send message <FiSend size={15} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Contact;