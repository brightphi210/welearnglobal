import { FiCheckCircle, FiMail } from "react-icons/fi";
import { useLocation } from "react-router-dom";
import AuthNavbar from "../components/AuthNavbar";

const RegisterSuccessful = () => {
    const location = useLocation();
    const email = (location.state as { email?: string })?.email;

    // Get email provider URL
    const getEmailUrl = (email?: string) => {
        if (!email) return "https://mail.google.com";

        const domain = email.split("@")[1]?.toLowerCase();

        switch (domain) {
            case "gmail.com":
                return "https://mail.google.com";

            case "outlook.com":
            case "hotmail.com":
            case "live.com":
            case "msn.com":
                return "https://outlook.live.com/mail";

            case "yahoo.com":
                return "https://mail.yahoo.com";

            case "icloud.com":
            case "me.com":
            case "mac.com":
                return "https://www.icloud.com/mail";

            case "protonmail.com":
            case "proton.me":
                return "https://mail.proton.me";

            default:
                return `https://www.google.com/search?q=${encodeURIComponent(
                    domain ? `${domain} webmail` : "email login"
                )}`;
        }
    };

    const emailUrl = getEmailUrl(email);

    return (
        <div className="min-h-screen bg-[#011d02] flex items-center justify-center px-3 py-12 font-sans">
            <AuthNavbar />

            <div className="w-full max-w-lg">
                <div className="bg-white lg:rounded-2xl rounded-md border border-gray-100 lg:shadow-xl shadow-gray-100/60 overflow-hidden">

                    {/* Header */}
                    <div className="px-8 pt-12 pb-8 text-center">
                        <div className="mx-auto mb-6 w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center">
                            <FiCheckCircle
                                size={32}
                                className="text-green-950"
                            />
                        </div>

                        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight mb-3">
                            Registration Successful
                        </h1>

                        <p className="text-sm text-gray-500 leading-relaxed mb-6">
                            A verification email has been sent to{" "}
                            {email ? (
                                <span className="font-semibold text-gray-700">
                                    {email}
                                </span>
                            ) : (
                                "your email address"
                            )}
                            . Please log in to your email and click the
                            verification link to activate your account.
                        </p>

                        <div className="flex items-center justify-center gap-3 border border-gray-200 rounded-lg px-4 py-3 bg-gray-50 text-left">
                            <FiMail
                                size={18}
                                className="text-gray-400 shrink-0"
                            />

                            <p className="text-xs text-gray-500 leading-relaxed">
                                Didn't get the email? Check your spam folder,
                                or wait a few minutes and try again.
                            </p>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="px-8 py-5 bg-gray-50 border-t border-gray-100 text-center">
                        <a
                            href={emailUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block w-full py-3.5 rounded-full bg-green-950 text-white font-bold text-xs hover:opacity-90 hover:-translate-y-px transition-all no-underline"
                        >
                            Open My Email
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterSuccessful;