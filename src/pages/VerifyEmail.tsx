import { useEffect, useRef, useState } from "react";
import { FiAlertCircle, FiCheckCircle, FiLoader } from "react-icons/fi";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import AuthNavbar from "../components/AuthNavbar";

type VerificationStatus = "verifying" | "success" | "error" | "missing-token";

const verifyEmailRequest = async (token: string) => {
    const response = await fetch(
        `https://api.welearnglobal.online/verify-email/`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token }),
        }
    );

    if (!response.ok) {
        let message = "This verification link is invalid or has expired.";
        try {
            const data = await response.json();
            message = data?.message || data?.detail || message;
        } catch {
        }
        throw new Error(message);
    }

    return response.json().catch(() => ({}));
};

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get("token");

    const [status, setStatus] = useState<VerificationStatus>(
        token ? "verifying" : "missing-token"
    );
    const [errorMsg, setErrorMsg] = useState("");
    const hasRun = useRef(false);

    useEffect(() => {
        if (!token || hasRun.current) return;
        hasRun.current = true;

        verifyEmailRequest(token)
            .then(() => {
                setStatus("success");
                toast.success("Email verified! Redirecting to sign in…");
                setTimeout(() => {
                    navigate("/login");
                }, 2000);
            })
            .catch((err: Error) => {
                setStatus("error");
                setErrorMsg(err.message || "Something went wrong verifying your email.");
            });
    }, [token, navigate]);

    return (
        <div className="min-h-screen bg-[#011d02] flex items-center justify-center px-3 py-12 font-sans">
            <AuthNavbar />
            <ToastContainer />

            <div className="w-full max-w-lg">
                <div className="bg-white lg:rounded-2xl rounded-md border border-gray-100 lg:shadow-xl shadow-gray-100/60 overflow-hidden">
                    <div className="px-8 py-12 flex flex-col items-center text-center">
                        {status === "verifying" && (
                            <>
                                <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center mb-5">
                                    <FiLoader size={24} className="text-emerald-500 animate-spin" />
                                </div>
                                <h1 className="text-xl font-extrabold text-gray-900 tracking-tight mb-2">
                                    Verifying your email
                                </h1>
                                <p className="text-sm text-gray-500 leading-relaxed max-w-sm">
                                    Hang tight, this only takes a second.
                                </p>
                            </>
                        )}

                        {status === "success" && (
                            <>
                                <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center mb-5">
                                    <FiCheckCircle size={26} className="text-emerald-500" />
                                </div>
                                <h1 className="text-xl font-extrabold text-gray-900 tracking-tight mb-2">
                                    Email verified
                                </h1>
                                <p className="text-sm text-gray-500 leading-relaxed max-w-sm mb-1">
                                    Your account is confirmed. Taking you to sign in…
                                </p>
                            </>
                        )}

                        {status === "error" && (
                            <>
                                <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mb-5">
                                    <FiAlertCircle size={26} className="text-red-500" />
                                </div>
                                <h1 className="text-xl font-extrabold text-gray-900 tracking-tight mb-2">
                                    Verification failed
                                </h1>
                                <p className="text-sm text-gray-500 leading-relaxed max-w-sm mb-6">
                                    {errorMsg}
                                </p>
                                <Link
                                    to="/login"
                                    className="px-6 py-3 rounded-full bg-green-950 text-white font-bold text-xs hover:opacity-90 transition-all no-underline"
                                >
                                    Back to Sign In
                                </Link>
                            </>
                        )}

                        {status === "missing-token" && (
                            <>
                                <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mb-5">
                                    <FiAlertCircle size={26} className="text-red-500" />
                                </div>
                                <h1 className="text-xl font-extrabold text-gray-900 tracking-tight mb-2">
                                    Missing verification link
                                </h1>
                                <p className="text-sm text-gray-500 leading-relaxed max-w-sm mb-6">
                                    We couldn't find a verification token in this link. Please use the link from your email, or request a new one.
                                </p>
                                <Link
                                    to="/login"
                                    className="px-6 py-3 rounded-full bg-green-950 text-white font-bold text-xs hover:opacity-90 transition-all no-underline"
                                >
                                    Back to Sign In
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VerifyEmail;