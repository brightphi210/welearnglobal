import { useMemo, useState } from "react";
import {
    FiArrowDownLeft,
    FiArrowLeft,
    FiArrowUpRight,
    FiInbox,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import LoadingOverlay from "../../components/LoadingOverlay";
import { useGetTransactionData } from "../../hooks/queries/allQueries";
import { formatAmount, formatTransactionDate, statusStyles } from "./TutorWallet";

const TUTOR_WALLET_ROUTE = "/tutor/dashboard/wallet";

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

const TutorTransactions = () => {
    const { getTransactionData, isLoading } = useGetTransactionData();

    // Same endpoint can come back either as a bare array (like on the Wallet
    // page) or as a paginated { results: [...] } payload — support both so
    // this list never silently renders empty because of a shape mismatch.
    const transactions: RawTransaction[] = useMemo(() => {
        const data = getTransactionData?.data;
        if (Array.isArray(data)) return data;
        if (Array.isArray(data?.results)) return data.results;
        return [];
    }, [getTransactionData]);

    const [activeTab, setActiveTab] = useState<"all" | "earning" | "payout">("all");

    const filteredTransactions = transactions.filter(
        (t) => activeTab === "all" || t.transaction_type === activeTab
    );

    return (
        <div className="md:pl-56 pb-20 md:pb-8 lg:pt-20">
            <LoadingOverlay visible={isLoading} />
            <div className="min-h-screen pt-8 bg-gray-50 px-4 sm:px-6 lg:px-8 max-w-7xl m-auto">
                <Link
                    to={TUTOR_WALLET_ROUTE}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-gray-900 mb-6"
                >
                    <FiArrowLeft size={16} />
                    Back to Wallet
                </Link>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-1">
                            All Transactions
                        </h1>
                        <p className="text-gray-600 text-sm">
                            A full record of your earnings and payouts.
                        </p>
                    </div>
                    <div className="flex items-center gap-2 bg-gray-100 rounded-full p-1 w-fit">
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

                <div className="bg-white rounded-2xl border border-gray-200 p-2 sm:p-4">
                    {isLoading ? (
                        <div className="py-12 text-center text-sm text-gray-500">Loading transactions...</div>
                    ) : filteredTransactions.length > 0 ? (
                        <div className="divide-y divide-gray-100 space-y-3 p-2">
                            {filteredTransactions.map((tx) => {
                                const isCredit =
                                    tx.transaction_type === "earning" || tx.type === "credit";

                                return (
                                    <div
                                        key={tx.id}
                                        className="flex bg-gray-100 lg:p-6 p-4 rounded-lg lg:flex-row flex-col lg:items-center lg:justify-between gap-4 py-4"
                                    >
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div
                                                className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${isCredit ? "bg-green-50" : "bg-orange-50"
                                                    }`}
                                            >
                                                {isCredit ? (
                                                    <FiArrowDownLeft size={16} className="text-green-700" />
                                                ) : (
                                                    <FiArrowUpRight size={16} className="text-orange-700" />
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-semibold text-gray-900 text-sm truncate">
                                                    {tx.title ||
                                                        tx.description ||
                                                        (tx.transaction_type === "earning" ? "Earning" : "Payout")}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-0.5 truncate">
                                                    {tx.booking_subject ? `${tx.booking_subject} • ` : ""}
                                                    {formatTransactionDate(tx.created_at)}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="lg:text-right flex lg:gap-0 gap-3 lg:items-end items-center flex-row lg:flex-col shrink-0">
                                            <p className="font-bold text-sm text-gray-900">
                                                ₦{formatAmount(tx.signed_amount ?? tx.amount)}
                                            </p>
                                            <span
                                                className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[11px] font-semibold capitalize ${statusStyles[tx.status] ?? "bg-gray-200 text-gray-900"
                                                    }`}
                                            >
                                                {tx.status_label || tx.status}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="py-16 text-center">
                            <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                                <FiInbox size={22} className="text-gray-400" />
                            </div>
                            <h3 className="font-bold text-gray-900 mb-1">No {activeTab !== "all" ? activeTab : ""} transactions yet</h3>
                            <p className="text-sm text-gray-500">
                                Your earnings and payouts will show up here once available.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TutorTransactions;