import { useEffect, useState } from "react";
import { FiCheckCircle, FiLoader } from "react-icons/fi";
import { Link } from "react-router-dom";

interface ConfirmingPaymentProps {
    amount?: string;
    tutorName?: string;
    subject?: string;
    onDone?: () => void;
}

const ConfirmingPayment = ({
    amount = "49.00",
    tutorName = "Sarah Johnson",
    subject = "Advanced Calculus",
    onDone,
}: ConfirmingPaymentProps) => {
    const [status, setStatus] = useState<"confirming" | "success">("confirming");

    useEffect(() => {
        const timer = setTimeout(() => {
            setStatus("success");
            onDone?.();
        }, 3000);
        return () => clearTimeout(timer);
    }, [onDone]);

    return (
        <div className="min-h-screen bg-[#041901] flex items-center justify-center px-4 py-10">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                    {/* Header band */}
                    <div className="bg-neutral-100 px-6 py-8 text-center text-green-900">
                        <div className="w-14 h-14 mx-auto rounded-full bg-green-950 flex items-center justify-center mb-4">
                            {status === "confirming" ? (
                                <FiLoader size={24} className="animate-spin text-green-50" />
                            ) : (
                                <FiCheckCircle size={26} className="text-green-50" />
                            )}
                        </div>
                        <h1 className="text-xl font-extrabold mb-1">
                            {status === "confirming" ? "Confirming payment" : "Payment confirmed"}
                        </h1>
                        <p className="text-green-800 text-xs">
                            {status === "confirming"
                                ? "Hang tight, we're securing your session with the bank."
                                : "Your session is booked and ready to go."}
                        </p>
                    </div>

                    {/* Body */}
                    <div className="p-6">
                        <div className="flex items-center gap-2 mb-6">
                            {["Payment", "Verification", "Confirmation"].map((label, idx) => {
                                const stepDone = status === "success" || idx === 0;
                                return (
                                    <div key={label} className="flex-1">
                                        <div
                                            className={`h-1.5 rounded-full mb-1.5 transition-all ${stepDone ? "bg-green-700" : "bg-gray-200"
                                                }`}
                                        />
                                        <p className="text-[10px] font-semibold text-gray-500 text-center">
                                            {label}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Action */}
                        {status === "confirming" ? (
                            <button
                                disabled
                                className="w-full px-4 py-3 bg-gray-100 text-gray-400 rounded-full font-semibold text-xs cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                <FiLoader size={14} className="animate-spin" />
                                Please don't close this window
                            </button>
                        ) : (
                            <Link to={'/student/dashboard/bookings'}>
                                <button className="w-full cursor-pointer px-4 py-3 bg-green-900 text-white rounded-full font-semibold text-xs hover:bg-green-950 transition-all">
                                    Go to my sessions
                                </button>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmingPayment;