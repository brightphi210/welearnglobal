import { useState } from "react";
import {
    FiArrowDownLeft,
    FiArrowRight,
    FiArrowUpRight,
    FiCheckCircle,
    FiClock,
    FiCreditCard,
    FiDownload,
    FiPlus,
} from "react-icons/fi";

const TutorWallet = () => {
    const [activeTab, setActiveTab] = useState<"all" | "earnings" | "payouts">("all");

    const stats = [
        { id: 1, label: "Available Balance", value: "$2,340.00", icon: FiCreditCard },
        { id: 2, label: "Pending Clearance", value: "$480.00", icon: FiClock },
        { id: 3, label: "Total Earned (Lifetime)", value: "$18,920.00", icon: FiArrowUpRight },
    ];

    const payoutMethods = [
        { id: 1, label: "Chase Bank •••• 4821", sub: "Default payout method", isDefault: true },
        { id: 2, label: "PayPal • dr.aris@email.com", sub: "Backup method", isDefault: false },
    ];

    const transactions = [
        { id: 1, type: "earning", title: "Session with Sarah Jenkins", subtitle: "Advanced Calculus • Jun 27", amount: 90, status: "Cleared" },
        { id: 2, type: "earning", title: "Session with Marcus Chen", subtitle: "Organic Chemistry • Jun 26", amount: 75, status: "Cleared" },
        { id: 3, type: "payout", title: "Payout to Chase Bank •••• 4821", subtitle: "Jun 24", amount: -1200, status: "Completed" },
        { id: 4, type: "earning", title: "Session with Elena Rodriguez", subtitle: "Spanish Literature • Jun 23", amount: 60, status: "Pending" },
        { id: 5, type: "payout", title: "Payout to PayPal", subtitle: "Jun 18", amount: -800, status: "Completed" },
    ];

    const filteredTransactions = transactions.filter((t) => {
        if (activeTab === "all") return true;
        if (activeTab === "earnings") return t.type === "earning";
        return t.type === "payout";
    });

    const StatCard = ({ stat }: any) => {
        const Icon = stat.icon;
        return (
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
                <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center mb-4">
                    <Icon size={18} className="text-green-700" />
                </div>
                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                <p className="text-2xl font-extrabold text-gray-900">{stat.value}</p>
            </div>
        );
    };

    const statusStyles: Record<string, string> = {
        Cleared: "bg-green-50 text-green-700",
        Completed: "bg-green-50 text-green-700",
        Pending: "bg-amber-50 text-amber-700",
    };

    return (
        <div className="md:pl-56 pb-20 md:pb-8 lg:pt-20">
            <div className="min-h-screen pt-8 bg-gray-50 px-4 sm:px-6 lg:px-8 max-w-7xl m-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 mb-1">Wallet</h1>
                        <p className="text-gray-600 text-sm">
                            Track your earnings, payouts, and manage where your money goes.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-full text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 transition-all">
                            <FiDownload size={16} />
                            Export Statement
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2.5 bg-green-700 text-white rounded-full text-sm font-semibold hover:bg-green-800 transition-all">
                            <FiArrowUpRight size={16} />
                            Withdraw Funds
                        </button>
                    </div>
                </div>

                {/* Stat Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    {stats.map((stat) => (
                        <StatCard key={stat.id} stat={stat} />
                    ))}
                </div>

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column — Transactions */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                                <h3 className="text-lg font-bold text-gray-900">Transaction History</h3>
                                <div className="flex items-center gap-2 bg-gray-100 rounded-full p-1">
                                    {(["all", "earnings", "payouts"] as const).map((tab) => (
                                        <button
                                            key={tab}
                                            onClick={() => setActiveTab(tab)}
                                            className={`px-4 py-1.5 rounded-full text-xs font-semibold capitalize transition-all ${activeTab === tab
                                                ? "bg-green-700 text-white"
                                                : "text-gray-600 hover:text-gray-900"
                                                }`}
                                        >
                                            {tab}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="divide-y divide-gray-100">
                                {filteredTransactions.map((tx) => (
                                    <div key={tx.id} className="flex items-center justify-between gap-4 py-4">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div
                                                className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${tx.type === "earning" ? "bg-green-50" : "bg-orange-50"
                                                    }`}
                                            >
                                                {tx.type === "earning" ? (
                                                    <FiArrowDownLeft size={16} className="text-green-700" />
                                                ) : (
                                                    <FiArrowUpRight size={16} className="text-orange-700" />
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-semibold text-gray-900 text-sm truncate">
                                                    {tx.title}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-0.5">{tx.subtitle}</p>
                                            </div>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <p className="font-bold text-sm text-gray-900">
                                                {tx.amount > 0 ? "+" : "-"}$
                                                {Math.abs(tx.amount).toFixed(2)}
                                            </p>
                                            <span
                                                className={`inline-block mt-1 px-2 py-0.5 rounded text-[11px] font-semibold ${statusStyles[tx.status]}`}
                                            >
                                                {tx.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button className="w-full text-center text-sm font-semibold text-gray-500 hover:text-gray-700 pt-4 mt-2 border-t border-gray-100">
                                Load more transactions
                            </button>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="flex flex-col gap-6">
                        {/* Payout Methods */}
                        <div className="bg-white rounded-2xl border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold text-gray-900">Payout Methods</h3>
                                <button className="text-green-700 font-semibold text-xs flex items-center gap-1 hover:text-green-800">
                                    <FiPlus size={14} />
                                    Add
                                </button>
                            </div>

                            <div className="flex flex-col gap-3">
                                {payoutMethods.map((method) => (
                                    <div
                                        key={method.id}
                                        className="flex items-center justify-between gap-3 p-3 rounded-xl border border-gray-100"
                                    >
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                                                <FiCreditCard size={16} className="text-gray-700" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-semibold text-gray-900 truncate">
                                                    {method.label}
                                                </p>
                                                <p className="text-xs text-gray-500">{method.sub}</p>
                                            </div>
                                        </div>
                                        {method.isDefault && (
                                            <FiCheckCircle size={16} className="text-green-700 shrink-0" />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Next Payout */}
                        <div className="bg-green-900 rounded-2xl p-6 text-white">
                            <p className="text-green-100 text-xs font-semibold mb-2">Next Scheduled Payout</p>
                            <h3 className="text-2xl font-bold mb-1">$2,340.00</h3>
                            <p className="text-green-100 text-sm mb-4">Arrives Jul 1 to Chase Bank •••• 4821</p>
                            <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-green-700 rounded-full font-semibold text-sm hover:bg-green-50 transition-all">
                                Manage Schedule
                                <FiArrowRight size={14} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TutorWallet;