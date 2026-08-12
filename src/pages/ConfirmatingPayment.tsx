import { useEffect, useState } from "react";
import { FiCheckCircle, FiLoader, FiLock, FiShield } from "react-icons/fi";

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
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                    {/* Header band */}
                    <div className="bg-green-900 px-6 py-8 text-center text-white">
                        <div className="w-14 h-14 mx-auto rounded-full bg-white/10 flex items-center justify-center mb-4">
                            {status === "confirming" ? (
                                <FiLoader size={24} className="animate-spin text-white" />
                            ) : (
                                <FiCheckCircle size={26} className="text-white" />
                            )}
                        </div>
                        <h1 className="text-xl font-extrabold mb-1">
                            {status === "confirming" ? "Confirming payment" : "Payment confirmed"}
                        </h1>
                        <p className="text-green-100 text-xs">
                            {status === "confirming"
                                ? "Hang tight, we're securing your session with the bank."
                                : "Your session is booked and ready to go."}
                        </p>
                    </div>

                    {/* Body */}
                    <div className="p-6">
                        {/* Session summary */}
                        <div className="bg-gray-50 rounded-xl border border-gray-100 p-4 mb-5">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
                                    Session
                                </span>
                                <span
                                    className={`px-2 py-1 rounded-full text-[10px] font-semibold ${status === "confirming"
                                        ? "bg-orange-50 text-orange-700"
                                        : "bg-green-50 text-green-700"
                                        }`}
                                >
                                    {status === "confirming" ? "Processing" : "Confirmed"}
                                </span>
                            </div>
                            <h4 className="text-sm font-bold text-gray-900 mb-1">{subject}</h4>
                            <p className="text-xs text-gray-600">with {tutorName}</p>

                            <div className="flex items-center justify-between pt-3 mt-3 border-t border-gray-200">
                                <span className="text-xs text-gray-600">Amount charged</span>
                                <span className="text-sm font-bold text-gray-900">${amount}</span>
                            </div>
                        </div>

                        {/* Progress steps */}
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

                        {/* Security note */}
                        <div className="flex items-center justify-center gap-1.5 text-gray-400 mb-6">
                            <FiLock size={12} />
                            <p className="text-[11px]">Secured with 256-bit encryption</p>
                        </div>

                        {/* Action */}
                        {status === "confirming" ? (
                            <button
                                disabled
                                className="w-full px-4 py-3 bg-gray-100 text-gray-400 rounded-full font-semibold text-sm cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                <FiLoader size={14} className="animate-spin" />
                                Please don't close this window
                            </button>
                        ) : (
                            <button className="w-full px-4 py-3 bg-green-900 text-white rounded-full font-semibold text-sm hover:bg-green-800 transition-all">
                                Go to my sessions
                            </button>
                        )}
                    </div>
                </div>

                {/* Trust footer */}
                <div className="flex items-center justify-center gap-1.5 mt-4 text-gray-400">
                    <FiShield size={12} />
                    <p className="text-[11px]">Payments protected by our buyer guarantee</p>
                </div>
            </div>
        </div>
    );
};

export default ConfirmingPayment;