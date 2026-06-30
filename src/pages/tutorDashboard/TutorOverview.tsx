import { useState } from "react";
import {
    FiArrowRight,
    FiCalendar,
    FiCheckCircle,
    FiClock,
    FiDollarSign,
    FiMessageCircle,
    FiPlus,
    FiShield,
    FiStar,
    FiUsers
} from "react-icons/fi";
import { Link } from "react-router-dom";

const TutorOverview = () => {
    const [range] = useState("Last 7 Days");

    const stats = [
        {
            id: 1,
            label: "Upcoming Sessions",
            value: "12",
            trend: "↑ 15%",
            trendColor: "text-green-600",
            icon: FiCalendar,
        },
        {
            id: 2,
            label: "Pending Requests",
            value: "04",
            trend: "↓ 2 fewer",
            trendColor: "text-red-500",
            icon: FiUsers,
        },
        {
            id: 3,
            label: "Weekly Earnings",
            value: "$1,480.00",
            trend: "↑ 8.2%",
            trendColor: "text-green-600",
            icon: FiDollarSign,
        },
        {
            id: 4,
            label: "Average Rating",
            value: "4.92",
            trend: "↑ Top 1%",
            trendColor: "text-green-600",
            icon: FiStar,
        },
    ];

    const weeklyData = [
        { day: "Mon", value: 110 },
        { day: "Tue", value: 210 },
        { day: "Wed", value: 185 },
        { day: "Thu", value: 350 },
        { day: "Fri", value: 290 },
        { day: "Sat", value: 130 },
        { day: "Sun", value: 80 },
    ];
    const maxValue = 360;

    const profileSteps = [
        { id: 1, label: "Identity Verified", done: true },
        { id: 2, label: "Bank Account Connected", done: true },
        { id: 3, label: "Upload Certifications (Pending)", done: false },
    ];

    const upcomingSessions = [
        {
            id: 1,
            name: "Sarah Jenkins",
            subject: "Advanced Calculus",
            time: "10:00 AM",
            day: "Today",
            image: "https://i.pravatar.cc/100?img=47",
        },
        {
            id: 2,
            name: "Marcus Chen",
            subject: "Organic Chemistry",
            time: "2:30 PM",
            day: "Today",
            image: "https://i.pravatar.cc/100?img=12",
        },
        {
            id: 3,
            name: "Elena Rodriguez",
            subject: "Spanish Literature",
            time: "09:00 AM",
            day: "Tomorrow",
            image: "https://i.pravatar.cc/100?img=32",
        },
    ];

    const quickManagement = [
        {
            id: 1,
            title: "Set Availability",
            description: "Update your teaching hours to let students know when you're free for new bookings.",
            cta: "Open Schedule",
            icon: FiClock,
            to: "/tutor/dashboard/schedule",
        },
        {
            id: 2,
            title: "Earnings & Payouts",
            description: "Review your monthly revenue and withdraw funds to your bank account.",
            cta: "View Wallet",
            icon: FiDollarSign,
            to: "/tutor/dashboard/wallet",
        },
        {
            id: 3,
            title: "Verification Center",
            description: "Upload degree certificates and ID to maintain your verified tutor status.",
            cta: "Upload Documents",
            icon: FiShield,
            to: "/tutor/dashboard/verification",
        },
    ];

    const StatCard = ({ stat }: any) => {
        const Icon = stat.icon;
        return (
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
                <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                        <Icon size={18} className="text-green-700" />
                    </div>
                    <span className={`text-xs font-semibold ${stat.trendColor}`}>{stat.trend}</span>
                </div>
                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                <p className="text-2xl font-extrabold text-gray-900">{stat.value}</p>
            </div>
        );
    };

    return (
        <div className="md:pl-56 pb-20 md:pb-8 pt-20">
            <div className="min-h-screen pt-8 bg-gray-50 px-4 sm:px-6 lg:px-8 max-w-7xl m-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 mb-1">Dashboard</h1>
                        <p className="text-gray-600 text-sm">
                            Welcome back, Dr. Aris! Here's what's happening with your students today.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-full text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 transition-all">
                            <FiCalendar size={16} />
                            View Schedule
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2.5 bg-green-700 text-white rounded-full text-sm font-semibold hover:bg-green-800 transition-all">
                            <FiPlus size={16} />
                            Create Instant Session
                        </button>
                    </div>
                </div>

                {/* Stat Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {stats.map((stat) => (
                        <StatCard key={stat.id} stat={stat} />
                    ))}
                </div>

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column */}
                    <div className="lg:col-span-2 flex flex-col gap-6">
                        {/* Weekly Performance */}
                        <div className="bg-white rounded-2xl border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">Weekly Performance</h3>
                                    <p className="text-sm text-gray-600">Revenue overview for the last 7 days</p>
                                </div>
                                <span className="px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-xs font-semibold">
                                    {range}
                                </span>
                            </div>

                            <div className="flex items-end gap-4 h-72 border-t border-gray-100 pt-6">
                                {weeklyData.map((d) => (
                                    <div key={d.day} className="flex-1 flex flex-col items-center gap-3 h-full justify-end">
                                        <div
                                            className="w-full max-w-12 bg-green-500 rounded-t-md transition-all"
                                            style={{ height: `${(d.value / maxValue) * 100}%` }}
                                        />
                                        <span className="text-xs font-medium text-gray-500">{d.day}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Upcoming Sessions */}
                        <div className="bg-white rounded-2xl border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold text-gray-900">Upcoming Sessions</h3>
                                <Link to="/tutor/dashboard/schedule" className="text-green-700 font-semibold text-sm flex items-center gap-1 hover:text-green-800">
                                    View Full Schedule
                                    <FiArrowRight size={14} />
                                </Link>
                            </div>

                            <div className="divide-y divide-gray-100">
                                {upcomingSessions.map((session) => (
                                    <div key={session.id} className="flex items-center justify-between gap-4 py-4 flex-wrap">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <img
                                                src={session.image}
                                                alt={session.name}
                                                className="w-11 h-11 rounded-full object-cover shrink-0"
                                            />
                                            <div className="min-w-0">
                                                <p className="font-semibold text-gray-900 text-sm">{session.name}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-[11px] font-medium">
                                                        {session.subject}
                                                    </span>
                                                    <span className="flex items-center gap-1 text-xs text-gray-500">
                                                        <FiClock size={12} />
                                                        {session.time} • {session.day}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button className="flex items-center gap-1.5 px-4 py-2 border border-gray-300 rounded-full text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all">
                                                <FiMessageCircle size={14} />
                                                Message
                                            </button>
                                            <button className="px-4 py-2 bg-green-700 text-white rounded-full text-sm font-semibold hover:bg-green-800 transition-all">
                                                Launch Session
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button className="w-full text-center text-sm font-semibold text-gray-500 hover:text-gray-700 pt-4 mt-2 border-t border-gray-100">
                                Load more sessions
                            </button>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="flex flex-col gap-6">
                        {/* Profile Status */}
                        <div className="bg-white rounded-2xl border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="font-bold text-gray-900">Profile Status</h3>
                                <span className="text-xs font-semibold text-gray-500">85% Complete</span>
                            </div>

                            <div className="w-full h-2 bg-gray-100 rounded-full mb-4 overflow-hidden">
                                <div className="h-full bg-green-600 rounded-full" style={{ width: "85%" }} />
                            </div>

                            <p className="text-sm text-gray-600 mb-4">
                                You're almost a <span className="font-bold text-gray-900">Verified Pro</span>! Complete
                                the remaining steps to boost your visibility.
                            </p>

                            <div className="flex flex-col gap-3 mb-5">
                                {profileSteps.map((step) => (
                                    <div key={step.id} className="flex items-center gap-2">
                                        {step.done ? (
                                            <FiCheckCircle size={16} className="text-green-700 shrink-0" />
                                        ) : (
                                            <span className="w-4 h-4 rounded-full border-2 border-dashed border-gray-300 shrink-0" />
                                        )}
                                        <span className={`text-sm ${step.done ? "text-gray-700" : "text-gray-500"}`}>
                                            {step.label}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <button className="w-full py-3 bg-gray-900 text-white rounded-full font-semibold text-sm hover:bg-gray-800 transition-all">
                                Complete Profile
                            </button>
                        </div>

                        {/* Quick Management */}
                        <div>
                            <h3 className="font-bold text-gray-900 mb-4">Quick Management</h3>
                            <div className="flex flex-col gap-4">
                                {quickManagement.map((item) => {
                                    const Icon = item.icon;
                                    return (
                                        <div key={item.id} className="bg-green-50 rounded-2xl p-5">
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center shrink-0">
                                                    <Icon size={16} className="text-green-700" />
                                                </div>
                                                <h4 className="font-bold text-gray-900 text-sm">{item.title}</h4>
                                            </div>
                                            <p className="text-xs text-gray-600 mb-3 leading-relaxed">
                                                {item.description}
                                            </p>
                                            <Link
                                                to={item.to}
                                                className="text-green-700 font-semibold text-sm flex items-center gap-1 hover:text-green-800"
                                            >
                                                {item.cta}
                                                <FiArrowRight size={14} />
                                            </Link>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TutorOverview;