import { useState } from "react";
import { FaApple, FaGraduationCap } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { FiEye, FiEyeOff, FiLock, FiMail } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [remember, setRemember] = useState(false);

    const navigate = useNavigate();
    const handleSignIn = () => {
        navigate("/student/dashboard/overview");
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center px-4 py-12 font-sans">
            <div className="w-full max-w-md">
                {/* Card */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-xl shadow-gray-100/60 overflow-hidden">
                    {/* Header */}
                    <div className="px-8 pt-10 pb-8 text-center border-b border-gray-50">
                        <a href="/" className="inline-flex items-center gap-2 no-underline mb-6">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                                <FaGraduationCap size={16} color="white" />
                            </div>
                            <span className="font-bold text-[15px] text-gray-900 tracking-tight">WeLearnGlobal</span>
                        </a>
                        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight mb-2">Welcome Back</h1>
                        <p className="text-sm text-gray-500 leading-relaxed">
                            Please enter your details to access your learning dashboard.
                        </p>
                    </div>

                    {/* Form body */}
                    <div className="px-8 py-8 space-y-5">
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

                        {/* Password */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="text-sm font-semibold text-gray-800">Password</label>
                                <a href="#" className="text-sm font-medium text-emerald-500 hover:text-emerald-600 no-underline transition-colors">
                                    Forgot password?
                                </a>
                            </div>
                            <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-3 focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-100 transition-all">
                                <FiLock size={16} className="text-gray-400 shrink-0" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    defaultValue="••••••••"
                                    className="flex-1 border-none outline-none text-sm text-gray-800 bg-transparent"
                                />
                                <button
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="text-gray-400 hover:text-gray-600 transition-colors bg-transparent border-none cursor-pointer p-0"
                                >
                                    {showPassword ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                                </button>
                            </div>
                        </div>

                        {/* Remember me */}
                        <label className="flex items-center gap-2.5 cursor-pointer group">
                            <div
                                onClick={() => setRemember(!remember)}
                                className={`w-4 h-4 rounded border-[1.5px] flex items-center justify-center transition-all cursor-pointer ${remember ? "bg-emerald-500 border-emerald-500" : "border-gray-300 bg-white"
                                    }`}
                            >
                                {remember && (
                                    <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                                        <path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                )}
                            </div>
                            <span className="text-sm text-gray-600 group-hover:text-gray-800 transition-colors">
                                Remember me for 30 days
                            </span>
                        </label>

                        {/* Sign in button */}
                        <button onClick={handleSignIn} className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-400 to-emerald-600 text-white font-bold text-sm hover:opacity-90 hover:-translate-y-px transition-all border-none cursor-pointer shadow-md shadow-emerald-200">
                            Sign In
                        </button>

                        {/* Divider */}
                        <div className="flex items-center gap-3">
                            <div className="flex-1 h-px bg-gray-100" />
                            <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Or continue with</span>
                            <div className="flex-1 h-px bg-gray-100" />
                        </div>

                        {/* Social buttons */}
                        <div className="grid grid-cols-2 gap-3">
                            <button className="flex items-center justify-center gap-2.5 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer bg-white">
                                <FcGoogle size={18} />
                                Google
                            </button>
                            <button className="flex items-center justify-center gap-2.5 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer bg-white">
                                <FaApple size={18} className="text-gray-800" />
                                Apple
                            </button>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="px-8 py-5 bg-gray-50 border-t border-gray-100 text-center">
                        <p className="text-sm text-gray-500">
                            Don't have an account?{" "}
                            <a href="/signup" className="text-emerald-500 font-semibold hover:text-emerald-600 no-underline transition-colors inline-flex items-center gap-1">
                                Create an account →
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;