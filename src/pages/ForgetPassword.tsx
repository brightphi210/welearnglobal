import { useState } from "react";
import { FiExternalLink, FiMail } from "react-icons/fi";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import AuthNavbar from "../components/AuthNavbar";
import LoadingOverlay from "../components/LoadingOverlay";
import { useForgetPassword2 } from "../hooks/mutations/auth";

// Maps common email domains to their webmail inbox URL.
// Falls back to a generic mailto: link if the domain isn't recognized.
const getMailProviderUrl = (email: string) => {
    const domain = email.split("@")[1]?.toLowerCase() || "";

    const providers: Record<string, string> = {
        "gmail.com": "https://mail.google.com/mail/u/0/#inbox",
        "googlemail.com": "https://mail.google.com/mail/u/0/#inbox",
        "outlook.com": "https://outlook.live.com/mail/0/inbox",
        "hotmail.com": "https://outlook.live.com/mail/0/inbox",
        "live.com": "https://outlook.live.com/mail/0/inbox",
        "yahoo.com": "https://mail.yahoo.com/",
        "icloud.com": "https://www.icloud.com/mail",
        "me.com": "https://www.icloud.com/mail",
        "aol.com": "https://mail.aol.com/",
        "zoho.com": "https://mail.zoho.com/",
        "protonmail.com": "https://mail.proton.me/",
        "proton.me": "https://mail.proton.me/",
    };

    return providers[domain] || `mailto:${email}`;
};

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const { mutate, isPending } = useForgetPassword2();
    // const navigate = useNavigate()

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg("");
        mutate(
            { email },
            {
                onSuccess: (res: any) => {
                    toast.success("Reset instructions sent to your email!");
                    setSubmitted(true);
                    console.log('This is response', res?.data || res)
                },
                onError: (e: any) => {
                    setErrorMsg(
                        e.response?.data?.message ||
                        e.response?.data?.detail ||
                        "Something went wrong. Please try again."
                    );
                },
            }
        );
    };

    return (
        <div className="min-h-screen bg-[#011d02] flex items-center justify-center px-3 py-12 font-sans">
            <AuthNavbar />
            <LoadingOverlay visible={isPending} />
            <ToastContainer />

            <div className="w-full max-w-lg">
                <form
                    onSubmit={handleSubmit}
                    className="bg-white lg:rounded-2xl rounded-md border border-gray-100 lg:shadow-xl shadow-gray-100/60 overflow-hidden"
                >
                    {/* Header */}
                    <div className="px-8 pt-10 pb-2 text-center border-b border-gray-50">
                        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight mb-2">
                            Forgot Password
                        </h1>
                        <p className="text-sm text-gray-500 leading-relaxed">
                            {submitted
                                ? "Check your inbox for a link to reset your password."
                                : "Enter your email and we'll send you instructions to reset your password."}
                        </p>
                    </div>

                    {/* Form body */}
                    {!submitted && (
                        <div className="px-8 py-8 pt-2 space-y-5">
                            <div>
                                <label className="block text-xs font-semibold text-gray-800 mb-2">
                                    Email Address
                                </label>
                                <div className="flex items-center gap-3 border border-gray-200 rounded-lg px-4 py-3 focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-100 transition-all">
                                    <FiMail size={16} className="text-gray-400 shrink-0" />
                                    <input
                                        type="email"
                                        required
                                        disabled={isPending}
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="name@example.com"
                                        className="flex-1 border-none outline-none text-xs text-gray-800 placeholder-gray-400 bg-transparent disabled:opacity-60"
                                    />
                                </div>
                            </div>

                            {errorMsg && (
                                <p className="text-red-500 text-sm -mt-2">{errorMsg}</p>
                            )}

                            <button
                                type="submit"
                                disabled={isPending}
                                className="w-full py-3.5 rounded-full bg-green-950 text-white font-bold text-xs hover:opacity-90 hover:-translate-y-px transition-all border-none cursor-pointer shadow-md shadow-emerald-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0"
                            >
                                {isPending ? "Sending..." : "Send Reset Link"}
                            </button>
                        </div>
                    )}

                    {submitted && (
                        <div className="px-8 py-8 flex flex-col items-center gap-4">
                            <a
                                href={getMailProviderUrl(email)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full bg-green-950 text-white font-bold text-xs hover:opacity-90 hover:-translate-y-px transition-all no-underline shadow-md shadow-emerald-200"
                            >
                                <FiMail size={15} />
                                Open Mail
                                <FiExternalLink size={13} />
                            </a>
                            <button
                                type="button"
                                onClick={() => setSubmitted(false)}
                                className="text-xs text-gray-400 hover:text-gray-600 transition-colors bg-transparent border-none cursor-pointer"
                            >
                                Didn't get it? Try a different email
                            </button>
                        </div>
                    )}

                    {/* Footer */}
                    <div className="px-8 py-5 bg-gray-50 border-t border-gray-100 text-center">
                        <p className="text-xs text-gray-500">
                            Remembered your password?{" "}
                            <Link
                                to="/login"
                                className="text-emerald-500 font-semibold hover:text-emerald-600 no-underline transition-colors"
                            >
                                Back to Sign In
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;