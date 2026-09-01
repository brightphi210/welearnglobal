import { useState } from "react";
import { FiCheckCircle, FiEye, FiEyeOff, FiLock } from "react-icons/fi";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import AuthNavbar from "../components/AuthNavbar";
import LoadingOverlay from "../components/LoadingOverlay";
import { useResetPassword } from "../hooks/mutations/auth";

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token") || "";
    const navigate = useNavigate();

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [success, setSuccess] = useState(false);

    const { mutate, isPending } = useResetPassword();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg("");

        if (!token) {
            setErrorMsg("Reset link is invalid or missing a token. Please request a new one.");
            return;
        }

        if (newPassword.length < 8) {
            setErrorMsg("Password must be at least 8 characters long.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setErrorMsg("Passwords do not match.");
            return;
        }

        mutate(
            { token, new_password: newPassword },
            {
                onSuccess: () => {
                    toast.success("Password reset successful!");
                    setSuccess(true);
                    setTimeout(() => {
                        navigate("/login");
                    }, 2000);
                },
                onError: (e: any) => {
                    setErrorMsg(
                        e.response?.data?.message ||
                        e.response?.data?.detail ||
                        "Failed to reset password. The link may have expired."
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
                            Reset Password
                        </h1>
                        <p className="text-sm text-gray-500 leading-relaxed">
                            {success
                                ? "Your password has been updated. Redirecting you to sign in..."
                                : "Enter a new password for your account."}
                        </p>
                    </div>

                    {!success && (
                        <div className="px-8 py-8 pt-2 space-y-5">
                            {!token && (
                                <p className="text-red-500 text-xs bg-red-50 border border-red-100 rounded-lg px-4 py-3">
                                    No reset token found in the URL. Please use the link from your email, or request a new one.
                                </p>
                            )}

                            {/* New Password */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-800 mb-2">
                                    New Password
                                </label>
                                <div className="flex items-center gap-3 border border-gray-200 rounded-lg px-4 py-3 focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-100 transition-all">
                                    <FiLock size={16} className="text-gray-400 shrink-0" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        disabled={isPending}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="Enter new password"
                                        className="flex-1 border-none outline-none text-xs text-gray-800 placeholder-gray-400 bg-transparent disabled:opacity-60"
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

                            {/* Confirm Password */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-800 mb-2">
                                    Confirm Password
                                </label>
                                <div className="flex items-center gap-3 border border-gray-200 rounded-lg px-4 py-3 focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-100 transition-all">
                                    <FiLock size={16} className="text-gray-400 shrink-0" />
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        required
                                        disabled={isPending}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Re-enter new password"
                                        className="flex-1 border-none outline-none text-xs text-gray-800 placeholder-gray-400 bg-transparent disabled:opacity-60"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="text-gray-400 hover:text-gray-600 transition-colors bg-transparent border-none cursor-pointer p-0"
                                    >
                                        {showConfirmPassword ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                                    </button>
                                </div>
                            </div>

                            {errorMsg && (
                                <p className="text-red-500 text-sm -mt-2">{errorMsg}</p>
                            )}

                            <button
                                type="submit"
                                disabled={isPending || !token}
                                className="w-full py-3.5 rounded-full bg-green-950 text-white font-bold text-xs hover:opacity-90 hover:-translate-y-px transition-all border-none cursor-pointer shadow-md shadow-emerald-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0"
                            >
                                {isPending ? "Resetting..." : "Reset Password"}
                            </button>
                        </div>
                    )}

                    {success && (
                        <div className="px-8 py-10 flex flex-col items-center justify-center">
                            <FiCheckCircle size={40} className="text-emerald-500 mb-3" />
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

export default ResetPassword;