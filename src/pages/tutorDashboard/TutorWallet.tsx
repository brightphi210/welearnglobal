import { useState } from "react";
import {
    FiArrowDownLeft,
    FiArrowUpRight,
    FiCheckCircle,
    FiClock,
    FiCreditCard,
    FiDownload,
    FiInbox,
    FiX,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import LoadingOverlay from "../../components/LoadingOverlay";
import { useGetTransactionData, useGetWalletData } from "../../hooks/queries/allQueries";

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
    return num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
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

// TODO: replace with real data from a sessions/bookings hook once available.
// Wired up here as dummy data so the withdraw flow can be built and tested.
const DUMMY_SESSIONS: Session[] = [
    { id: 1, subject: "Web Development", student_name: "Amaka Obi", amount: "15000", status: "completed", date: "2026-08-01" },
    { id: 2, subject: "Data Science", student_name: "Chidi Eze", amount: "20000", status: "completed", date: "2026-08-05" },
    { id: 3, subject: "Marketing", student_name: "Segun Bello", amount: "18000", status: "completed", date: "2026-08-12" },
    { id: 4, subject: "Business Studies", student_name: "Tari Wilcox", amount: "12000", status: "in_progress", date: "2026-08-10" },
    { id: 5, subject: "French", student_name: "Ifeoma Nnamdi", amount: "8000", status: "scheduled", date: "2026-08-14" },
];

/* ─── Withdraw Review Modal — sessions breakdown + available balance ───── */
const WithdrawReviewModal = ({
    onClose,
    onContinue,
    sessions,
    availableBalance,
}: {
    onClose: () => void;
    onContinue: () => void;
    sessions: Session[];
    availableBalance: number;
}) => {
    const completedSessions = sessions.filter((s) => WITHDRAWABLE_STATUSES.includes(s.status));
    const pendingSessions = sessions.filter((s) => !WITHDRAWABLE_STATUSES.includes(s.status));

    const SessionRow = ({ session }: { session: Session }) => (
        <div className="flex items-center justify-between px-3 py-2.5">
            <div className="min-w-0">
                <p className="text-xs font-semibold text-gray-900 truncate">{session.subject}</p>
                <p className="text-[10px] text-gray-500 truncate">{session.student_name}</p>
            </div>
            <div className="text-right shrink-0 ml-3">
                <p className="text-xs font-bold text-gray-900">₦{formatAmount(session.amount)}</p>
                <span
                    className={`inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-semibold capitalize ${statusStyles[session.status] ?? "bg-gray-100 text-gray-700"
                        }`}
                >
                    {session.status.replace("_", " ")}
                </span>
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

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

                <h3 className="text-lg font-extrabold text-gray-900 mb-1.5">Withdraw Funds</h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-5">
                    Here's a breakdown of your sessions. Only completed sessions count toward your withdrawable balance.
                </p>

                <div className="bg-green-50 rounded-xl p-4 mb-5">
                    <p className="text-xs text-green-800 mb-1">Available to withdraw</p>
                    <p className="text-2xl font-extrabold text-green-800">₦{formatAmount(availableBalance)}</p>
                    <p className="text-xs text-green-700 mt-1">
                        From {completedSessions.length} completed session{completedSessions.length === 1 ? "" : "s"}
                    </p>
                </div>

                <div className="space-y-5 mb-6">
                    <div>
                        <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                            <FiCheckCircle className="text-green-700" size={12} />
                            Completed — withdrawable ({completedSessions.length})
                        </h4>
                        {completedSessions.length > 0 ? (
                            <div className="divide-y divide-gray-100 border border-gray-100 rounded-xl overflow-hidden">
                                {completedSessions.map((s) => (
                                    <SessionRow key={s.id} session={s} />
                                ))}
                            </div>
                        ) : (
                            <p className="text-xs text-gray-400 italic">No completed sessions yet.</p>
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
                        onClick={onContinue}
                        disabled={availableBalance <= 0}
                        className="flex-1 py-3.5 bg-green-700 text-white rounded-full text-sm font-semibold hover:bg-green-800 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        Continue
                    </button>
                </div>
            </div>
        </div>
    );
};

/* ─── Bank Details Modal — Stripe payout details ────────────────────────── */
const BankDetailsModal = ({
    onClose,
    onBack,
    onSubmit,
    isSubmitting,
    submitError,
    availableBalance,
}: {
    onClose: () => void;
    onBack: () => void;
    onSubmit: (details: WithdrawFormDetails) => void;
    isSubmitting: boolean;
    submitError: string | null;
    availableBalance: number;
}) => {
    const [amount, setAmount] = useState(availableBalance.toString());
    const [accountName, setAccountName] = useState("");
    const [bankName, setBankName] = useState("");
    const [accountNumber, setAccountNumber] = useState("");
    const [error, setError] = useState("");

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
        if (numericAmount > availableBalance) {
            setError("Amount exceeds your available balance");
            return;
        }
        setError("");
        onSubmit({ amount, accountName: accountName.trim(), bankName: bankName.trim(), accountNumber: accountNumber.trim() });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={isSubmitting ? undefined : onClose} />

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

                <h3 className="text-lg font-extrabold text-gray-900 mb-1.5">Bank Details</h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-5">
                    Payouts are processed securely via Stripe. Double-check your details before continuing.
                </p>

                <div className="flex flex-col gap-4 mb-6">
                    <div>
                        <label className="block text-xs font-semibold text-gray-800 mb-2">Amount to withdraw (₦)</label>
                        <input
                            type="number"
                            min={1}
                            max={availableBalance}
                            step="0.01"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400"
                        />
                        <p className="text-[10px] text-gray-400 mt-1">Max ₦{formatAmount(availableBalance)}</p>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-800 mb-2">Account holder name</label>
                        <input
                            type="text"
                            value={accountName}
                            onChange={(e) => setAccountName(e.target.value)}
                            placeholder="As it appears on the account"
                            className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-800 mb-2">Bank name</label>
                        <input
                            type="text"
                            value={bankName}
                            onChange={(e) => setBankName(e.target.value)}
                            placeholder="e.g. GTBank"
                            className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-800 mb-2">Account number</label>
                        <input
                            type="text"
                            inputMode="numeric"
                            value={accountNumber}
                            onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ""))}
                            placeholder="0123456789"
                            className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400"
                        />
                    </div>

                    {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
                    {submitError && <p className="text-xs text-red-500 font-medium">{submitError}</p>}
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
                        disabled={isSubmitting}
                        className="flex-1 py-3.5 bg-green-700 text-white rounded-full text-sm font-semibold hover:bg-green-800 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? "Processing..." : "Withdraw via Stripe"}
                    </button>
                </div>
            </div>
        </div>
    );
};

/* ─── Withdraw Success Modal ─────────────────────────────────────────────── */
const WithdrawSuccessModal = ({
    onClose,
    details,
}: {
    onClose: () => void;
    details: WithdrawFormDetails | null;
}) => (
    <div className="fixed inset-0 z-60 flex items-center justify-center px-4">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
        <div className="relative bg-white rounded-2xl border border-gray-200 shadow-xl max-w-md w-full p-6 sm:p-7 text-center">
            <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiCheckCircle className="text-green-700" size={28} />
            </div>
            <h3 className="text-lg font-extrabold text-gray-900 mb-2">Withdrawal Requested</h3>
            <p className="text-sm text-gray-600 mb-6">
                ₦{details ? formatAmount(details.amount) : ""} is on its way to {details?.bankName} — you'll get a
                notification once Stripe confirms the payout.
            </p>
            <button
                onClick={onClose}
                className="w-full py-3.5 bg-green-700 text-white rounded-full text-sm font-semibold hover:bg-green-800 transition-all"
            >
                Done
            </button>
        </div>
    </div>
);

/* ─── Main Page ──────────────────────────────────────────────────────────── */
const TutorWallet = () => {
    const { getWalletData, isLoading } = useGetWalletData();
    const { getTransactionData, isLoading: transactionLoading } = useGetTransactionData();

    const walletData = getWalletData?.data;
    const transactions: RawTransaction[] = Array.isArray(getTransactionData?.data?.results)
        ? getTransactionData.data.results
        : [];

    const [activeTab, setActiveTab] = useState<"all" | "earning" | "payout">("all");

    // Withdraw flow state — mirrors the step pattern used on StudentTutorProfile
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [showBankDetailsModal, setShowBankDetailsModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [isWithdrawing, setIsWithdrawing] = useState(false);
    const [withdrawError, setWithdrawError] = useState<string | null>(null);
    const [withdrawDetails, setWithdrawDetails] = useState<WithdrawFormDetails | null>(null);

    // Dummy data for now — swap for real balance/session hooks when ready.
    const sessions = DUMMY_SESSIONS;
    const availableBalance = sessions
        .filter((s) => WITHDRAWABLE_STATUSES.includes(s.status))
        .reduce((sum, s) => sum + Number(s.amount), 0);

    const stats = [
        { id: 1, label: "Available Balance", value: walletData?.available_balance ?? availableBalance, icon: FiCreditCard },
        { id: 2, label: "Pending Clearance", value: walletData?.pending_clearance, icon: FiClock },
        { id: 3, label: "Total Earned (Lifetime)", value: walletData?.total_earned_lifetime, icon: FiArrowUpRight },
    ];

    const filteredTransactions = transactions
        .filter((t) => activeTab === "all" || t.transaction_type === activeTab)
        .slice(0, 4);

    const StatCard = ({ stat }: any) => {
        const Icon = stat.icon;
        return (
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
                <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center mb-4">
                    <Icon size={18} className="text-green-700" />
                </div>
                <p className="text-xs text-gray-600 mb-1">{stat.label}</p>
                <p className="text-xl font-extrabold text-gray-900">
                    {stat.value !== undefined && stat.value !== null ? `₦${formatAmount(stat.value)}` : "—"}
                </p>
            </div>
        );
    };

    const handleBankDetailsSubmit = (details: WithdrawFormDetails) => {
        setWithdrawError(null);
        setIsWithdrawing(true);

        // TODO: replace with your real mutation hook, e.g. useWithdrawFunds().
        // Backend should create/attach a Stripe Connect external account and
        // issue the payout server-side — never call Stripe's secret-key API
        // from the client.
        setTimeout(() => {
            setIsWithdrawing(false);
            setWithdrawDetails(details);
            setShowBankDetailsModal(false);
            setShowSuccessModal(true);
        }, 1200);
    };

    const closeAllWithdrawModals = () => {
        setShowReviewModal(false);
        setShowBankDetailsModal(false);
        setShowSuccessModal(false);
        setWithdrawError(null);
        setWithdrawDetails(null);
    };

    return (
        <div className="md:pl-56 pb-20 md:pb-8 lg:pt-20">
            <LoadingOverlay visible={isLoading || transactionLoading} />
            <div className="min-h-screen lg:pt-8 pt-3 bg-gray-50 px-4 sm:px-6 lg:px-8 max-w-7xl m-auto">
                {/* Header */}
                <div className="flex flex-col lg:flex-row xl:flex-row lg:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Wallet</h1>
                        <p className="text-gray-600 text-sm">
                            Track your earnings, payouts, and manage where your money goes.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-full text-xs font-semibold text-gray-700 bg-white hover:bg-gray-50 transition-all">
                            <FiDownload size={16} />
                            Export Statement
                        </button>
                        <button
                            onClick={() => setShowReviewModal(true)}
                            className="flex items-center gap-2 px-4 py-2.5 bg-green-700 text-white rounded-full text-xs font-semibold hover:bg-green-800 transition-all"
                        >
                            <FiArrowUpRight size={16} />
                            Withdraw Funds
                        </button>
                    </div>
                </div>

                {/* Stat Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:gap-4 gap-2 mb-8">
                    {stats.map((stat) => (
                        <StatCard key={stat.id} stat={stat} />
                    ))}
                </div>

                {/* Main Grid */}
                <div className="gap-6">
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                                <h3 className="text-lg font-bold text-gray-900">Transaction History</h3>
                                <div className="flex items-center gap-2 bg-gray-100 rounded-full p-1">
                                    {(["all", "earning", "payout"] as const).map((tab) => (
                                        <button
                                            key={tab}
                                            onClick={() => setActiveTab(tab)}
                                            className={`px-4 py-1.5 rounded-full text-xs font-semibold capitalize transition-all ${activeTab === tab
                                                ? "bg-green-700 text-white"
                                                : "text-gray-600 hover:text-gray-900"
                                                }`}
                                        >
                                            {tab === "earning" ? "Earnings" : tab === "payout" ? "Payouts" : "All"}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {filteredTransactions.length > 0 ? (
                                <div className="divide-y divide-gray-100">
                                    {filteredTransactions.map((tx) => (
                                        <div key={tx.id} className="flex lg:flex-row flex-col lg:items-center lg:justify-between gap-4 py-4">
                                            <div className="flex  items-center gap-3 min-w-0">
                                                <div
                                                    className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${tx.transaction_type === "earning" ? "bg-green-50" : "bg-orange-50"
                                                        }`}
                                                >
                                                    {tx.transaction_type === "earning" ? (
                                                        <FiArrowDownLeft size={16} className="text-green-700" />
                                                    ) : (
                                                        <FiArrowUpRight size={16} className="text-orange-700" />
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-semibold text-gray-900 text-sm truncate">
                                                        {tx.booking_subject || tx.description}
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-0.5 truncate">
                                                        {tx.booking_subject ? tx.description : ""}
                                                        {tx.booking_subject ? " • " : ""}
                                                        {formatTransactionDate(tx.created_at)}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="lg:text-right shrink-0">
                                                <p className="font-bold text-sm text-gray-900">
                                                    {tx.transaction_type === "earning" ? "+" : "-"}₦
                                                    {formatAmount(tx.amount)}
                                                </p>
                                                <span
                                                    className={`inline-block mt-1 px-2 py-0.5 rounded text-[11px] font-semibold capitalize ${statusStyles[tx.status] ?? "bg-gray-100 text-gray-700"
                                                        }`}
                                                >
                                                    {tx.status}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-12 text-center">
                                    <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                                        <FiInbox size={22} className="text-gray-400" />
                                    </div>
                                    <h4 className="font-bold text-gray-900 mb-1">No transactions yet</h4>
                                    <p className="text-sm text-gray-500">
                                        Your earnings and payouts will show up here once available.
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
                    onContinue={() => {
                        setShowReviewModal(false);
                        setShowBankDetailsModal(true);
                    }}
                    sessions={sessions}
                    availableBalance={availableBalance}
                />
            )}

            {showBankDetailsModal && (
                <BankDetailsModal
                    onClose={closeAllWithdrawModals}
                    onBack={() => {
                        setShowBankDetailsModal(false);
                        setShowReviewModal(true);
                    }}
                    onSubmit={handleBankDetailsSubmit}
                    isSubmitting={isWithdrawing}
                    submitError={withdrawError}
                    availableBalance={availableBalance}
                />
            )}

            {showSuccessModal && (
                <WithdrawSuccessModal onClose={closeAllWithdrawModals} details={withdrawDetails} />
            )}
        </div>
    );
};

export default TutorWallet;