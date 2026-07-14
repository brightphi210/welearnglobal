import { useState } from "react";
import { FaApple } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { FiEye, FiEyeOff, FiLock, FiMail } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import AuthNavbar from "../components/AuthNavbar";
import LoadingOverlay from "../components/LoadingOverlay";
import { useLogin } from "../hooks/mutations/auth";
// import { useLogin } from "../hooks/mutation/allMutattion";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    // const [isPending, setIsPending] = useState(false);

    const { mutate: login, isPending } = useLogin();
    const navigate = useNavigate();

    const handleSignIn = (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg("");
        login(
            { email, password },
            {
                onSuccess: (res) => {
                    const role = res.data.user.role;
                    const token = res.data.access;
                    console.log('This is response', token, role)
                    toast.success("Login successful!");
                    localStorage.setItem("welearnToken", token);
                    localStorage.setItem("welearnRole", role);
                    setTimeout(() => {
                        if (role === "tutor") {
                            navigate("/tutor/dashboard/overview");
                        } else if (role === "student") {
                            navigate("/student/dashboard/overview");
                        }
                    }, 1000);
                },
                onError: (e: any) => {
                    setErrorMsg(
                        e.response?.data?.message || e.response.data.detail || "Login failed. Please check your credentials."
                    );
                    console.log('This is error', e.response.data.detail);
                },
            }
        );
    };

    return (
        <div className="min-h-screen bg-green-950 flex items-center justify-center px-3 py-12 font-sans">
            <AuthNavbar />
            <LoadingOverlay visible={isPending} />
            <ToastContainer />

            <div className="w-full max-w-lg">
                {/* Card */}
                <form
                    onSubmit={handleSignIn}
                    className="bg-white lg:rounded-2xl rounded-md border border-gray-100 lg:shadow-xl shadow-gray-100/60 overflow-hidden"
                >
                    {/* Header */}
                    <div className="px-8 pt-10 pb-2 text-center border-b border-gray-50">
                        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight mb-2">Welcome Back</h1>
                        <p className="text-sm text-gray-500 leading-relaxed">
                            Please enter your details to access your learning dashboard.
                        </p>
                    </div>

                    {/* Form body */}
                    <div className="px-8 py-8 pt-2 space-y-5">
                        {/* Email */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-800 mb-2">Email Address</label>
                            <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-3 focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-100 transition-all">
                                <FiMail size={16} className="text-gray-400 shrink-0" />
                                <input
                                    type="email"
                                    required
                                    disabled={isPending}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="name@example.com"
                                    className="flex-1 border-none outline-none text-sm text-gray-800 placeholder-gray-400 bg-transparent disabled:opacity-60"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="text-sm font-semibold text-gray-800">Password</label>
                            </div>
                            <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-3 focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-100 transition-all">
                                <FiLock size={16} className="text-gray-400 shrink-0" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    disabled={isPending}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    className="flex-1 border-none outline-none text-sm text-gray-800 bg-transparent disabled:opacity-60"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="text-gray-400 hover:text-gray-600 transition-colors bg-transparent border-none cursor-pointer p-0"
                                >
                                    {showPassword ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                                </button>
                            </div>
                        </div>

                        {/* Error Message */}
                        {errorMsg && (
                            <p className="text-red-500 text-sm -mt-2">{errorMsg}</p>
                        )}

                        <button
                            type="submit"
                            disabled={isPending}
                            className="w-full py-3.5 rounded-xl bg-green-900 text-white font-bold text-sm hover:opacity-90 hover:-translate-y-px transition-all border-none cursor-pointer shadow-md shadow-emerald-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0"
                        >
                            {isPending ? "Signing in..." : "Sign In"}
                        </button>


                        <label className="flex items-center gap-2.5 cursor-pointer group">
                            <span className="text-sm text-green-600 underline group-hover:text-gray-800 transition-colors">
                                Forgot Password
                            </span>
                        </label>

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
                            Don't have an account?{" "}
                            <Link to="/signup" className="text-emerald-500 font-semibold hover:text-emerald-600 no-underline transition-colors inline-flex items-center gap-1">
                                Create an account →
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;