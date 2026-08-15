import { useState } from "react";
import {
    FiArrowDownLeft,
    FiArrowUpRight,
    FiClock,
    FiCreditCard,
    FiDownload,
    FiInbox
} from "react-icons/fi";
import { Link } from "react-router-dom";
import LoadingOverlay from "../../components/LoadingOverlay";
import { useGetTransactionData, useGetWalletData } from "../../hooks/queries/allQueries";

export const TUTOR_TRANSACTIONS_ROUTE = "/tutor/dashboard/wallet/transactions";

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
};

const TutorWallet = () => {
    const { getWalletData, isLoading } = useGetWalletData();
    const { getTransactionData, isLoading: transactionLoading } = useGetTransactionData();

    const walletData = getWalletData?.data;
    const transactions: RawTransaction[] = Array.isArray(getTransactionData?.data?.results)
        ? getTransactionData.data.results
        : [];

    console.log("This is the walletData", walletData);
    console.log("This is the transactionData", transactions);

    const [activeTab, setActiveTab] = useState<"all" | "earning" | "payout">("all");

    const stats = [
        { id: 1, label: "Available Balance", value: walletData?.available_balance, icon: FiCreditCard },
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
                        <button className="flex items-center gap-2 px-4 py-2.5 bg-green-700 text-white rounded-full text-xs font-semibold hover:bg-green-800 transition-all">
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
        </div>
    );
};

export default TutorWallet;