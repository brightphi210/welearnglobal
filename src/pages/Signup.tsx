import { useState } from "react";
import { FaApple, FaBriefcase, FaGraduationCap } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { FiCheckCircle, FiEye, FiEyeOff, FiLock, FiMail, FiUser } from "react-icons/fi";
import AuthNavbar from "../components/AuthNavbar";

type Role = "student" | "tutor";

const Signup = () => {
    const [role, setRole] = useState<Role>("student");
    const [showPass, setShowPass] = useState(false);
    const [showVerify, setShowVerify] = useState(false);
    const [agreed, setAgreed] = useState(false);

    return (
        <div className="min-h-screen bg-green-950 flex items-center justify-center px-4 py-12 font-sans">
            <AuthNavbar />

            <div className="w-full max-w-lg mt-5 ">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-xl shadow-gray-100/60 overflow-hidden">
                    <div className="px-8 pt-10 pb-2 text-center border-b border-gray-50">
                        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight mb-2">Create your account</h1>
                        <p className="text-sm text-gray-500 leading-relaxed">
                            Join our community of learners today.
                        </p>
                    </div>

                    {/* Form body */}
                    <div className="px-8 py-8 pt-0 space-y-5">
                        <div className="flex rounded-xl bg-gray-100 p-1">
                            <button
                                onClick={() => setRole("student")}
                                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer border-none ${role === "student"
                                    ? "bg-green-900 text-white shadow-md shadow-emerald-200"
                                    : "bg-transparent text-gray-500 hover:text-gray-700"
                                    }`}
                            >
                                <FaGraduationCap size={15} />
                                Student
                            </button>
                            <button
                                onClick={() => setRole("tutor")}
                                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer border-none ${role === "tutor"
                                    ? "bg-green-900 text-white shadow-md shadow-emerald-200"
                                    : "bg-transparent text-gray-500 hover:text-gray-700"
                                    }`}
                            >
                                <FaBriefcase size={14} />
                                Tutor
                            </button>
                        </div>

                        {/* Full Name */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-800 mb-2">Full Name</label>
                            <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-3 focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-100 transition-all">
                                <FiUser size={16} className="text-gray-400 shrink-0" />
                                <input
                                    type="text"
                                    placeholder="John Doe"
                                    className="flex-1 border-none outline-none text-sm text-gray-800 placeholder-gray-400 bg-transparent"
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-800 mb-2">Email Address</label>
                            <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-3 focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-100 transition-all">
                                <FiMail size={16} className="text-gray-400 shrink-0" />
                                <input
                                    type="email"
                                    placeholder="name@example.com"
                                    className="flex-1 border-none outline-none text-sm text-gray-800 placeholder-gray-400 bg-transparent"
                                />
                            </div>
                        </div>

                        {/* Password row */}
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm font-semibold text-gray-800 mb-2">Password</label>
                                <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-3 focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-100 transition-all">
                                    <FiLock size={15} className="text-gray-400 shrink-0" />
                                    <input
                                        type={showPass ? "text" : "password"}
                                        placeholder="••••••••"
                                        className="flex-1 border-none outline-none text-sm text-gray-800 bg-transparent w-0"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPass(!showPass)}
                                        className="text-gray-400 hover:text-gray-600 bg-transparent border-none cursor-pointer p-0 shrink-0"
                                    >
                                        {showPass ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-800 mb-2">Verify Password</label>
                                <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-3 focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-100 transition-all">
                                    <FiCheckCircle size={15} className="text-gray-400 shrink-0" />
                                    <input
                                        type={showVerify ? "text" : "password"}
                                        placeholder="••••••••"
                                        className="flex-1 border-none outline-none text-sm text-gray-800 bg-transparent w-0"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowVerify(!showVerify)}
                                        className="text-gray-400 hover:text-gray-600 bg-transparent border-none cursor-pointer p-0 shrink-0"
                                    >
                                        {showVerify ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Terms */}
                        <label className="flex items-start gap-2.5 cursor-pointer group">
                            <div
                                onClick={() => setAgreed(!agreed)}
                                className={`w-4 h-4 rounded border-[1.5px] flex items-center justify-center transition-all cursor-pointer shrink-0 mt-0.5 ${agreed ? "bg-green-900 border-green-900" : "border-gray-300 bg-white"
                                    }`}
                            >
                                {agreed && (
                                    <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                                        <path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                )}
                            </div>
                            <span className="text-sm text-gray-600 leading-relaxed">
                                By creating an account, you agree to our{" "}
                                <a href="#" className="text-emerald-500 font-semibold hover:text-emerald-600 no-underline">Terms of Service</a>{" "}
                                and{" "}
                                <a href="#" className="text-emerald-500 font-semibold hover:text-emerald-600 no-underline">Privacy Policy</a>.
                            </span>
                        </label>

                        {/* Submit */}
                        <button className="w-full py-3.5 rounded-xl bg-green-900 text-white font-bold text-sm hover:opacity-90 hover:-translate-y-px transition-all border-none cursor-pointer shadow-md shadow-emerald-200">
                            Register as {role === "student" ? "Student" : "Tutor"}
                        </button>

                        {/* Divider */}
                        <div className="flex items-center gap-3">
                            <div className="flex-1 h-px bg-gray-100" />
                            <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Or continue with</span>
                            <div className="flex-1 h-px bg-gray-100" />
                        </div>

                        {/* Social buttons */}
                        <div className="grid grid-cols-2 gap-3">
                            <button type="button" className="flex items-center justify-center gap-2.5 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer bg-white">
                                <FcGoogle size={18} />
                                Google
                            </button>
                            <button type="button" className="flex items-center justify-center gap-2.5 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer bg-white">
                                <FaApple size={18} className="text-gray-800" />
                                Apple
                            </button>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="px-8 py-5 bg-gray-50 border-t border-gray-100 text-center">
                        <p className="text-sm text-gray-500">
                            Already have an account?{" "}
                            <a href="/login" className="text-emerald-500 font-semibold hover:text-emerald-600 no-underline transition-colors inline-flex items-center gap-1">
                                Log in →
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;