import { useMemo, useState } from "react";
import {
    FiAlertCircle,
    FiArrowDownLeft,
    FiArrowUpRight,
    FiCheckCircle,
    FiClock,
    FiCreditCard,
    FiInbox,
    FiShield,
    FiX
} from "react-icons/fi";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import LoadingOverlay from "../../components/LoadingOverlay";
import { useMakeWithdrawal } from "../../hooks/mutations/allMutation";
import {
    useGetTransactionData,
    useGetWalletData,
    useGetWithdrawableSession,
} from "../../hooks/queries/allQueries";

export const TUTOR_TRANSACTIONS_ROUTE = "/tutor/dashboard/wallet/transactions";

/* ─── Types ───────────────────────────────────────────────────────────── */
interface RawTransaction {
    id: number;
    transaction_type: "earning" | "payout" | string;
    status: "pending" | "cleared" | "completed" | "failed" | string;
    amount: string;
    description: string;
    booking: number | null;
    booking_subject: string | null;
    created_at: string;
    status_label?: string;
    signed_amount?: string | number;
    title?: string;
    type?: "credit" | "debit";
}

interface Session {
    id: number;
    subject: string;
    student_name: string;
    amount: string;
    status: "completed" | "in_progress" | "scheduled" | string;
    date: string;
}

interface WithdrawFormDetails {
    amount: string;
    accountName: string;
    bankName: string;
    accountNumber: string;
    bic?: string;
    verified: boolean;
}

interface VerifyResult {
    valid: boolean;
    bankName: string;
    bic: string;
    country: string;
    message: string;
    isFormatOnly?: boolean;
    raw?: any;
}

/* ─── Helpers ─────────────────────────────────────────────────────────── */
export const formatTransactionDate = (dateStr: string) => {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
};

export const formatAmount = (amount: string | number) => {
    const num = Number(amount);
    if (isNaN(num)) return amount;
    return num.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
};

export const statusStyles: Record<string, string> = {
    pending: "bg-amber-50 text-amber-700",
    cleared: "bg-green-50 text-green-700",
    completed: "bg-green-50 text-green-700",
    failed: "bg-red-50 text-red-700",
    in_progress: "bg-amber-50 text-amber-700",
    scheduled: "bg-gray-100 text-gray-600",
};

const WITHDRAWABLE_STATUSES = ["completed", "cleared"];
const IBANFORGE_API_KEY = import.meta.env.VITE_IBANFORGE_KEY || "";

async function verifyBankAccount(ibanOrAccount: string): Promise<VerifyResult> {
    const cleaned = ibanOrAccount.replace(/\s+/g, "").toUpperCase();

    if (cleaned.length < 8) {
        return {
            valid: false,
            bankName: "",
            bic: "",
            country: "",
            message: "Account number / IBAN is too short",
        };
    }

    if (IBANFORGE_API_KEY) {
        try {
            const res = await fetch("https://api.ibanforge.com/v1/iban/validate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${IBANFORGE_API_KEY}`,
                },
                body: JSON.stringify({ iban: cleaned }),
            });

            if (res.ok) {
                const data = await res.json();
                console.log("IBANforge response:", data);

                const bankName =
                    data?.bic?.bank_name ||
                    data?.issuer?.name ||
                    data?.bank?.name ||
                    "";
                const bic = data?.bic?.code || data?.bic || "";
                const country =
                    data?.country?.name || data?.country?.code || cleaned.slice(0, 2);

                if (data.valid || data.is_valid) {
                    return {
                        valid: true,
                        bankName: bankName || "Verified Bank",
                        bic,
                        country,
                        message: bankName
                            ? `Valid IBAN • ${bankName}`
                            : "Valid IBAN format (bank details partially available)",
                        raw: data,
                    };
                }

                return {
                    valid: false,
                    bankName: "",
                    bic: "",
                    country,
                    message: data.message || "Invalid IBAN",
                    raw: data,
                };
            }
        } catch (err) {
            console.warn("IBANforge failed, falling back to OpenIBAN", err);
        }
    }

    // 2. Fallback to OpenIBAN (no key needed)
    try {
        const res = await fetch(
            `https://openiban.com/validate/${cleaned}?getBIC=true&validateBankCode=true`
        );

        if (!res.ok) {
            return {
                valid: false,
                bankName: "",
                bic: "",
                country: cleaned.slice(0, 2),
                message: "Unable to reach verification service. You can still continue.",
            };
        }

        const data = await res.json();
        console.log("OpenIBAN response:", data);

        const countryCode = cleaned.slice(0, 2);
        const bankName = data.bankData?.name?.trim() || "";
        const bic = data.bankData?.bic || "";

        if (data.valid) {
            // Valid format but no bank details in the free database
            if (!bankName && !bic) {
                return {
                    valid: true,
                    bankName: "",
                    bic: "",
                    country: countryCode,
                    message: `Valid IBAN format for ${countryCode}. Detailed bank name is not available in the free database for this country/bank. You can still continue.`,
                    isFormatOnly: true,
                    raw: data,
                };
            }

            return {
                valid: true,
                bankName: bankName || "Verified Bank",
                bic,
                country: countryCode,
                message: `Valid IBAN • ${bankName || countryCode}`,
                raw: data,
            };
        }

        const reason =
            data.messages?.join(" • ") ||
            data.messages?.[0] ||
            "Invalid IBAN / account number";

        return {
            valid: false,
            bankName: "",
            bic: "",
            country: countryCode,
            message: reason,
            raw: data,
        };
    } catch (err) {
        return {
            valid: false,
            bankName: "",
            bic: "",
            country: cleaned.slice(0, 2),
            message: "Verification service temporarily unavailable. You can still continue.",
        };
    }
}

/* ─── Withdraw Review Modal (pick ONE session via radio) ─────────────── */
const WithdrawReviewModal = ({
    onClose,
    onContinue,
    sessions,
}: {
    onClose: () => void;
    onContinue: (session: Session) => void;
    sessions: Session[];
}) => {
    const completedSessions = sessions.filter((s) =>
        WITHDRAWABLE_STATUSES.includes(s.status)
    );
    const pendingSessions = sessions.filter(
        (s) => !WITHDRAWABLE_STATUSES.includes(s.status)
    );

    const [selectedId, setSelectedId] = useState<number | null>(
        completedSessions[0]?.id ?? null
    );

    const totalAvailable = completedSessions.reduce(
        (sum, s) => sum + Number(s.amount),
        0
    );

    const SelectableSessionRow = ({ session }: { session: Session }) => {
        const isSelected = selectedId === session.id;
        return (
            <label
                className={`flex items-center justify-between px-3 py-2.5 cursor-pointer transition-colors ${isSelected ? "bg-green-50/70" : "hover:bg-gray-50"
                    }`}
            >
                <div className="flex items-center gap-3 min-w-0">
                    <input
                        type="radio"
                        name="withdraw-session"
                        checked={isSelected}
                        onChange={() => setSelectedId(session.id)}
                        className="w-4 h-4 accent-green-700 shrink-0"
                    />
                    <div className="min-w-0">
                        <p className="text-xs font-semibold text-gray-900 truncate">
                            {session.subject}
                        </p>
                        <p className="text-[10px] text-gray-500 truncate">
                            {session.student_name}
                        </p>
                    </div>
                </div>
                <div className="text-right shrink-0 ml-3">
                    <p className="text-xs font-bold text-gray-900">
                        ₦{formatAmount(session.amount)}
                    </p>
                    <span
                        className={`inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-semibold capitalize ${statusStyles[session.status] ?? "bg-gray-100 text-gray-700"
                            }`}
                    >
                        {session.status.replace("_", " ")}
                    </span>
                </div>
            </label>
        );
    };

    const SessionRow = ({ session }: { session: Session }) => (
        <div className="flex items-center justify-between px-3 py-2.5">
            <div className="min-w-0">
                <p className="text-xs font-semibold text-gray-900 truncate">
                    {session.subject}
                </p>
                <p className="text-[10px] text-gray-500 truncate">
                    {session.student_name}
                </p>
            </div>
            <div className="text-right shrink-0 ml-3">
                <p className="text-xs font-bold text-gray-900">
                    ₦{formatAmount(session.amount)}
                </p>
                <span
                    className={`inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-semibold capitalize ${statusStyles[session.status] ?? "bg-gray-100 text-gray-700"
                        }`}
                >
                    {session.status.replace("_", " ")}
                </span>
            </div>
        </div>
    );

    const selectedSession =
        completedSessions.find((s) => s.id === selectedId) ?? null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={onClose}
            />
            <div className="relative bg-white rounded-2xl border border-gray-200 shadow-xl max-w-md w-full p-6 sm:p-7 max-h-[90vh] overflow-y-auto">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-600 rounded-lg transition-all"
                >
                    <FiX size={16} />
                </button>

                <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center mb-4">
                    <FiArrowUpRight size={20} className="text-green-700" />
                </div>

                <h3 className="text-lg font-extrabold text-gray-900 mb-1.5">
                    Withdraw Funds
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-5">
                    Pick one completed session to withdraw. You can withdraw the
                    others separately afterwards.
                </p>

                <div className="bg-green-50 rounded-xl p-4 mb-5">
                    <p className="text-xs text-green-800 mb-1">Total withdrawable</p>
                    <p className="text-2xl font-extrabold text-green-800">
                        ₦{formatAmount(totalAvailable)}
                    </p>
                    <p className="text-xs text-green-700 mt-1">
                        From {completedSessions.length} completed session
                        {completedSessions.length === 1 ? "" : "s"}
                    </p>
                </div>

                <div className="space-y-5 mb-6">
                    <div>
                        <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                            <FiCheckCircle className="text-green-700" size={12} />
                            Select a session to withdraw ({completedSessions.length})
                        </h4>
                        {completedSessions.length > 0 ? (
                            <div className="divide-y divide-gray-100 border border-gray-100 rounded-xl overflow-hidden">
                                {completedSessions.map((s) => (
                                    <SelectableSessionRow key={s.id} session={s} />
                                ))}
                            </div>
                        ) : (
                            <p className="text-xs text-gray-400 italic">
                                No completed sessions yet.
                            </p>
                        )}
                    </div>

                    <div>
                        <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                            <FiClock className="text-amber-600" size={12} />
                            Paid, not yet completed ({pendingSessions.length})
                        </h4>
                        {pendingSessions.length > 0 ? (
                            <div className="divide-y divide-gray-100 border border-gray-100 rounded-xl overflow-hidden">
                                {pendingSessions.map((s) => (
                                    <SessionRow key={s.id} session={s} />
                                ))}
                            </div>
                        ) : (
                            <p className="text-xs text-gray-400 italic">Nothing pending.</p>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3.5 border border-gray-200 rounded-full text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => selectedSession && onContinue(selectedSession)}
                        disabled={!selectedSession}
                        className="flex-1 py-3.5 bg-green-700 text-white rounded-full text-sm font-semibold hover:bg-green-800 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        Continue
                    </button>
                </div>
            </div>
        </div>
    );
};

/* ─── Bank Details Modal (withdraws exactly ONE session) ─────────────── */
const BankDetailsModal = ({
    onClose,
    onBack,
    onSubmit,
    isSubmitting,
    submitError,
    session,
}: {
    onClose: () => void;
    onBack: () => void;
    onSubmit: (details: WithdrawFormDetails) => void;
    isSubmitting: boolean;
    submitError: string | null;
    session: Session;
}) => {
    const sessionAmount = Number(session.amount);

    const [amount, setAmount] = useState(session.amount);
    const [accountName, setAccountName] = useState("");
    const [bankName, setBankName] = useState("");
    const [accountNumber, setAccountNumber] = useState("");
    const [bic, setBic] = useState("");
    const [error, setError] = useState("");
    const [isVerifying, setIsVerifying] = useState(false);
    const [verificationStatus, setVerificationStatus] = useState<
        "idle" | "success" | "failed"
    >("idle");
    const [verificationMessage, setVerificationMessage] = useState("");

    const handleVerify = async () => {
        if (!accountNumber.trim()) {
            setError("Please enter an IBAN or account number first");
            return;
        }

        setIsVerifying(true);
        setError("");
        setVerificationStatus("idle");
        setVerificationMessage("");
        setBankName("");
        setBic("");

        const result = await verifyBankAccount(accountNumber);

        setIsVerifying(false);

        if (result.valid) {
            setVerificationStatus("success");
            setVerificationMessage(result.message);
            if (result.bankName) setBankName(result.bankName);
            if (result.bic) setBic(result.bic);
        } else {
            setVerificationStatus("failed");
            setVerificationMessage(result.message);
        }
    };

    const handleSubmit = () => {
        const numericAmount = Number(amount);

        if (!accountName.trim() || !bankName.trim() || !accountNumber.trim()) {
            setError("Please fill in all bank details");
            return;
        }
        if (!numericAmount || numericAmount <= 0) {
            setError("Enter a valid amount");
            return;
        }
        if (numericAmount > sessionAmount) {
            setError("Amount exceeds this session's earnings");
            return;
        }

        setError("");
        onSubmit({
            amount,
            accountName: accountName.trim(),
            bankName: bankName.trim(),
            accountNumber: accountNumber.trim().replace(/\s+/g, "").toUpperCase(),
            bic: bic || undefined,
            verified: verificationStatus === "success",
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={isSubmitting ? undefined : onClose}
            />

            <div className="relative bg-white rounded-2xl border border-gray-200 shadow-xl max-w-md w-full p-6 sm:p-7 max-h-[90vh] overflow-y-auto">
                <button
                    onClick={onClose}
                    disabled={isSubmitting}
                    className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-600 rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                    <FiX size={16} />
                </button>

                <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center mb-4">
                    <FiCreditCard size={20} className="text-green-700" />
                </div>

                <h3 className="text-lg font-extrabold text-gray-900 mb-1.5">
                    Bank Details
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-1">
                    Withdrawing from:
                </p>
                <div className="flex items-center justify-between bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 mb-5">
                    <div className="min-w-0">
                        <p className="text-xs font-semibold text-gray-900 truncate">
                            {session.subject}
                        </p>
                        <p className="text-[10px] text-gray-500 truncate">
                            {session.student_name}
                        </p>
                    </div>
                    <p className="text-xs font-bold text-gray-900 shrink-0 ml-3">
                        ₦{formatAmount(session.amount)}
                    </p>
                </div>

                <div className="flex flex-col gap-4 mb-6">
                    {/* Amount */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-800 mb-2">
                            Amount to withdraw (₦)
                        </label>
                        <input
                            type="number"
                            min={1}
                            max={sessionAmount}
                            step="0.01"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400"
                        />
                        <p className="text-[10px] text-gray-400 mt-1">
                            Max ₦{formatAmount(sessionAmount)} for this session
                        </p>
                    </div>

                    {/* Account Holder Name */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-800 mb-2">
                            Account holder name
                        </label>
                        <input
                            type="text"
                            value={accountName}
                            onChange={(e) => setAccountName(e.target.value)}
                            placeholder="As it appears on the account"
                            className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400"
                        />
                    </div>

                    {/* IBAN / Account Number + Verify */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-800 mb-2">
                            IBAN or Account Number
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={accountNumber}
                                onChange={(e) => {
                                    setAccountNumber(e.target.value);
                                    setVerificationStatus("idle");
                                    setVerificationMessage("");
                                    setBankName("");
                                    setBic("");
                                }}
                                placeholder="e.g. DE89370400440532013000 or IE64IRCE92050112345678"
                                className="flex-1 px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400"
                            />
                            <button
                                type="button"
                                onClick={handleVerify}
                                disabled={isVerifying || !accountNumber.trim()}
                                className="px-4 py-2.5 bg-gray-900 text-white text-xs font-semibold rounded-lg hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
                            >
                                {isVerifying ? (
                                    "Checking..."
                                ) : (
                                    <>
                                        <FiShield size={14} />
                                        Verify
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Success feedback */}
                        {verificationStatus === "success" && (
                            <div className="mt-2 flex items-start gap-2 text-xs bg-green-50 text-green-800 px-3 py-2.5 rounded-lg border border-green-100">
                                <FiCheckCircle
                                    size={15}
                                    className="mt-0.5 shrink-0 text-green-600"
                                />
                                <div className="space-y-0.5">
                                    <p className="font-semibold">{verificationMessage}</p>
                                    {bankName && (
                                        <p>
                                            <span className="text-green-700/80">Bank:</span>{" "}
                                            {bankName}
                                        </p>
                                    )}
                                    {bic && (
                                        <p>
                                            <span className="text-green-700/80">BIC/SWIFT:</span>{" "}
                                            {bic}
                                        </p>
                                    )}
                                    {!bankName && !bic && (
                                        <p className="text-green-700/70">
                                            Format is correct. Bank name not found in the free
                                            database — you can still proceed.
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Failed / warning feedback */}
                        {verificationStatus === "failed" && (
                            <div className="mt-2 flex items-start gap-2 text-xs bg-amber-50 text-amber-800 px-3 py-2.5 rounded-lg border border-amber-100">
                                <FiAlertCircle
                                    size={15}
                                    className="mt-0.5 shrink-0 text-amber-600"
                                />
                                <div>
                                    <p className="font-semibold">Verification note</p>
                                    <p className="mt-0.5">{verificationMessage}</p>
                                    <p className="mt-1 text-amber-700/80">
                                        You can still continue (useful for non-IBAN countries or
                                        when the free database has no entry).
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Bank Name */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-800 mb-2">
                            Bank name
                        </label>
                        <input
                            type="text"
                            value={bankName}
                            onChange={(e) => setBankName(e.target.value)}
                            placeholder="Will be auto-filled when available"
                            className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400"
                        />
                    </div>

                    {error && (
                        <p className="text-xs text-red-500 font-medium">{error}</p>
                    )}
                    {submitError && (
                        <p className="text-xs text-red-500 font-medium">{submitError}</p>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={onBack}
                        disabled={isSubmitting}
                        className="flex-1 py-3.5 border border-gray-200 rounded-full text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        Back
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting || isVerifying}
                        className="flex-1 py-3.5 bg-green-700 text-white rounded-full text-sm font-semibold hover:bg-green-800 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? "Processing..." : "Withdraw"}
                    </button>
                </div>
            </div>
        </div>
    );
};

/* ─── Withdraw Success Modal ──────────────────────────────────────────── */
const WithdrawSuccessModal = ({
    onClose,
    onWithdrawAnother,
    hasMoreSessions,
    details,
}: {
    onClose: () => void;
    onWithdrawAnother: () => void;
    hasMoreSessions: boolean;
    details: WithdrawFormDetails | null;
}) => (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
        <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
        />
        <div className="relative bg-white rounded-2xl border border-gray-200 shadow-xl max-w-md w-full p-6 sm:p-7 text-center">
            <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiCheckCircle className="text-green-700" size={28} />
            </div>
            <h3 className="text-lg font-extrabold text-gray-900 mb-2">
                Withdrawal Requested
            </h3>
            <p className="text-sm text-gray-600 mb-6">
                ₦{details ? formatAmount(details.amount) : ""} is on its way to{" "}
                {details?.bankName}
                {details?.verified ? " (verified account)" : ""} — you'll get a
                notification once Stripe confirms the payout.
            </p>
            <div className="flex flex-col gap-2">
                {hasMoreSessions && (
                    <button
                        onClick={onWithdrawAnother}
                        className="w-full py-3.5 border border-green-700 text-green-700 rounded-full text-sm font-semibold hover:bg-green-50 transition-all"
                    >
                        Withdraw Another Session
                    </button>
                )}
                <button
                    onClick={onClose}
                    className="w-full py-3.5 bg-green-700 text-white rounded-full text-sm font-semibold hover:bg-green-800 transition-all"
                >
                    Done
                </button>
            </div>
        </div>
    </div>
);

/* ─── Main Page ───────────────────────────────────────────────────────── */
const TutorWallet = () => {
    const { getWalletData, isLoading } = useGetWalletData();
    const { getTransactionData, isLoading: transactionLoading } =
        useGetTransactionData();
    const { getWithdrawableSession, isLoading: withdrawableLoading } =
        useGetWithdrawableSession();
    const { mutate: makeWithdrawal, isPending: isWithdrawing } =
        useMakeWithdrawal();

    const walletData = getWalletData?.data;
    const transactions: RawTransaction[] = Array.isArray(
        getTransactionData?.data
    )
        ? getTransactionData.data
        : [];
    console.log('Wallet data', transactions)

    const rawWithdrawable = getWithdrawableSession?.data?.results ?? [];
    console.log('Withdrawable Sessions', rawWithdrawable)

    const allSessions: Session[] = Array.isArray(rawWithdrawable)
        ? rawWithdrawable.map((item: any) => ({
            id: item.id,
            subject: item.subject || item.title || "Session",
            student_name:
                item.student_name ||
                (item.student ? `Student #${item.student}` : "Student"),
            amount: String(item.total_amount ?? item.amount ?? "0"),
            status: item.status ?? "completed",
            date: item.scheduled_date || item.created_at || "",
        }))
        : [];

    const [withdrawnSessionIds, setWithdrawnSessionIds] = useState<Set<number>>(
        new Set()
    );

    const sessions: Session[] = useMemo(
        () => allSessions.filter((s) => !withdrawnSessionIds.has(s.id)),
        [allSessions, withdrawnSessionIds]
    );

    const availableBalance = sessions
        .filter((s) => WITHDRAWABLE_STATUSES.includes(s.status))
        .reduce((sum, s) => sum + Number(s.amount), 0);

    const remainingCompletedCount = sessions.filter((s) =>
        WITHDRAWABLE_STATUSES.includes(s.status)
    ).length;

    const [activeTab, setActiveTab] = useState<"all" | "earning" | "payout">(
        "all"
    );

    const [showReviewModal, setShowReviewModal] = useState(false);
    const [showBankDetailsModal, setShowBankDetailsModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [selectedSession, setSelectedSession] = useState<Session | null>(
        null
    );
    const [withdrawError, setWithdrawError] = useState<string | null>(null);
    const [withdrawDetails, setWithdrawDetails] =
        useState<WithdrawFormDetails | null>(null);

    const stats = [
        {
            id: 1,
            label: "Available Balance",
            value: walletData?.available_balance ?? availableBalance,
            icon: FiCreditCard,
        },
        {
            id: 2,
            label: "Available Withdrawal",
            value: walletData?.withdrawable_balance,
            icon: FiClock,
        },
    ];

    const filteredTransactions = transactions
        .filter(
            (t) => activeTab === "all" || t.transaction_type === activeTab
        )
        .slice(0, 4);

    const StatCard = ({ stat }: any) => {
        const Icon = stat.icon;
        return (
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
                <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center mb-4">
                    <Icon size={18} className="text-green-700" />
                </div>
                <p className="text-xs text-gray-600 mb-1">{stat.label}</p>
                <p className="text-base font-extrabold text-gray-900">
                    {stat.value !== undefined && stat.value !== null
                        ? `₦${formatAmount(stat.value)}`
                        : "—"}
                </p>
            </div>
        );
    };

    const extractErrorMessage = (err: any): string => {
        return (
            err?.response?.data?.detail ||
            err?.response?.data?.message ||
            err?.response?.data?.error ||
            (Array.isArray(err?.response?.data?.non_field_errors)
                ? err.response.data.non_field_errors[0]
                : null) ||
            // field-level errors e.g. { amount: ["..."] }
            (err?.response?.data &&
                typeof err.response.data === "object" &&
                Object.values(err.response.data)
                    .flat()
                    .find((v: any) => typeof v === "string")) ||
            err?.message ||
            "Withdrawal failed. Please try again."
        );
    };

    /**
     * Withdraws exactly the ONE session the tutor selected via radio button
     * in the review modal. Any other completed sessions are left untouched
     * and can be withdrawn individually afterwards.
     */
    const handleBankDetailsSubmit = (details: WithdrawFormDetails) => {
        if (!selectedSession) {
            setWithdrawError("No session selected.");
            return;
        }

        setWithdrawError(null);

        makeWithdrawal(
            {
                booking_id: selectedSession.id,
                amount: details.amount,
                account_name: details.accountName,
                account_number: details.accountNumber,
                bank_name: details.bankName,
            },
            {
                onSuccess: (res: any) => {
                    console.log(
                        `Withdrawal success for session ${selectedSession.id}:`,
                        res
                    );
                    setWithdrawnSessionIds((prev) => {
                        const next = new Set(prev);
                        next.add(selectedSession.id);
                        return next;
                    });
                    toast("Withdrawal Placed Successfully", { type: "success" });
                    setWithdrawDetails(details);
                    setShowBankDetailsModal(false);
                    setShowSuccessModal(true);
                },
                onError: (err: any) => {
                    console.error(
                        `Withdrawal error for session ${selectedSession.id}:`,
                        err
                    );
                    const message = extractErrorMessage(err);
                    setWithdrawError(message);
                    toast(message, { type: "error" });
                },
            }
        );
    };

    const closeAllWithdrawModals = () => {
        setShowReviewModal(false);
        setShowBankDetailsModal(false);
        setShowSuccessModal(false);
        setSelectedSession(null);
        setWithdrawError(null);
        setWithdrawDetails(null);
    };

    const handleWithdrawAnother = () => {
        setShowSuccessModal(false);
        setSelectedSession(null);
        setWithdrawError(null);
        setWithdrawDetails(null);
        setShowReviewModal(true);
    };

    return (
        <div className="md:pl-56 pb-20 md:pb-8 lg:pt-20">
            <LoadingOverlay
                visible={isLoading || transactionLoading || withdrawableLoading}
            />
            <ToastContainer />

            <div className="min-h-screen lg:pt-8 pt-3 bg-gray-50 px-4 sm:px-6 lg:px-8 max-w-7xl m-auto">
                {/* Header */}
                <div className="flex flex-col lg:flex-row xl:flex-row lg:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-extrabold text-gray-900 mb-1">
                            Wallet
                        </h1>
                        <p className="text-gray-600 text-sm">
                            Track your earnings, payouts, and manage where your
                            money goes.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setShowReviewModal(true)}
                            className="flex items-center gap-2 px-4 py-3 bg-green-700 text-white rounded-full text-sm font-semibold hover:bg-green-800 transition-all"
                        >
                            <FiArrowUpRight size={16} />
                            Withdraw Funds
                        </button>
                    </div>
                </div>

                {/* Stat Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:gap-4 gap-2 mb-8">
                    {stats.map((stat) => (
                        <StatCard key={stat.id} stat={stat} />
                    ))}
                </div>

                {/* Transaction History */}
                <div className="gap-6">
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl border border-gray-200 p-2">
                            <div className="flex items-center justify-between mb-4 flex-wrap gap-3 p-4 py-2 pb-0">
                                <h3 className="text-lg font-bold text-gray-900">
                                    Transaction History
                                </h3>
                                <div className="flex items-center gap-2 bg-gray-100 rounded-full p-1">
                                    {(["all", "earning", "payout"] as const).map(
                                        (tab) => (
                                            <button
                                                key={tab}
                                                onClick={() => setActiveTab(tab)}
                                                className={`px-4 py-1.5 rounded-full text-xs font-semibold capitalize transition-all ${activeTab === tab
                                                    ? "bg-green-700 text-white"
                                                    : "text-gray-600 hover:text-gray-900"
                                                    }`}
                                            >
                                                {tab === "earning"
                                                    ? "Earnings"
                                                    : tab === "payout"
                                                        ? "Payouts"
                                                        : "All"}
                                            </button>
                                        )
                                    )}
                                </div>
                            </div>

                            {filteredTransactions.length > 0 ? (
                                <div className="divide-y divide-gray-100 space-y-3">
                                    {filteredTransactions.map((tx) => {
                                        const isCredit =
                                            tx.transaction_type === "earning" ||
                                            tx.type === "credit";

                                        return (
                                            <div
                                                key={tx.id}
                                                className="flex bg-gray-100 lg:p-6 p-4 rounded-lg lg:flex-row flex-col lg:items-center lg:justify-between gap-4 py-4"
                                            >
                                                <div className="flex items-center gap-3 min-w-0">
                                                    <div
                                                        className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${isCredit
                                                            ? "bg-green-50"
                                                            : "bg-orange-50"
                                                            }`}
                                                    >
                                                        {isCredit ? (
                                                            <FiArrowDownLeft
                                                                size={16}
                                                                className="text-green-700"
                                                            />
                                                        ) : (
                                                            <FiArrowUpRight
                                                                size={16}
                                                                className="text-orange-700"
                                                            />
                                                        )}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="font-semibold text-gray-900 text-sm truncate">
                                                            {tx.title ||
                                                                tx.description ||
                                                                (tx.transaction_type ===
                                                                    "earning"
                                                                    ? "Earning"
                                                                    : "Payout")}
                                                        </p>
                                                        <p className="text-xs text-gray-500 mt-0.5 truncate">
                                                            {tx.booking_subject
                                                                ? `${tx.booking_subject} • `
                                                                : ""}
                                                            {formatTransactionDate(
                                                                tx.created_at
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="lg:text-right flex lg:gap-0 gap-3 lg:items-end items-center flex-row lg:flex-col shrink-0">
                                                    <p className="font-bold text-sm text-gray-900">
                                                        ₦
                                                        {formatAmount(
                                                            tx.signed_amount ??
                                                            tx.amount
                                                        )}
                                                    </p>
                                                    <span
                                                        className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[11px] font-semibold capitalize ${statusStyles[
                                                            tx.status
                                                        ] ??
                                                            "bg-gray-200 text-gray-900"
                                                            }`}
                                                    >
                                                        {tx.status_label ||
                                                            tx.status}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="py-12 text-center">
                                    <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                                        <FiInbox
                                            size={22}
                                            className="text-gray-400"
                                        />
                                    </div>
                                    <h4 className="font-bold text-gray-900 mb-1">
                                        No transactions yet
                                    </h4>
                                    <p className="text-sm text-gray-500">
                                        Your earnings and payouts will show up
                                        here once available.
                                    </p>
                                </div>
                            )}

                            <Link
                                to={TUTOR_TRANSACTIONS_ROUTE}
                                className="block w-full text-center text-xs font-semibold text-gray-500 hover:text-gray-700 pt-4 mt-2 border-t border-gray-100"
                            >
                                View all transactions
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {showReviewModal && (
                <WithdrawReviewModal
                    onClose={closeAllWithdrawModals}
                    onContinue={(session) => {
                        setSelectedSession(session);
                        setShowReviewModal(false);
                        setShowBankDetailsModal(true);
                    }}
                    sessions={sessions}
                />
            )}

            {showBankDetailsModal && selectedSession && (
                <BankDetailsModal
                    onClose={closeAllWithdrawModals}
                    onBack={() => {
                        setShowBankDetailsModal(false);
                        setShowReviewModal(true);
                    }}
                    onSubmit={handleBankDetailsSubmit}
                    isSubmitting={isWithdrawing}
                    submitError={withdrawError}
                    session={selectedSession}
                />
            )}

            {showSuccessModal && (
                <WithdrawSuccessModal
                    onClose={closeAllWithdrawModals}
                    onWithdrawAnother={handleWithdrawAnother}
                    hasMoreSessions={remainingCompletedCount > 0}
                    details={withdrawDetails}
                />
            )}
        </div>
    );
};

export default TutorWallet;