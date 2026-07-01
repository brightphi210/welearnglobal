import { useState } from "react";
import {
    FiArrowRight,
    FiCalendar,
    FiClock,
    FiMessageCircle,
    FiSearch
} from "react-icons/fi";

const TutorBookings = () => {
    const [activeTab, setActiveTab] = useState<"upcoming" | "pending" | "completed" | "cancelled">("upcoming");

    const tabs = [
        { id: "upcoming", label: "Upcoming", count: 6 },
        { id: "pending", label: "Pending", count: 4 },
        { id: "completed", label: "Completed", count: 128 },
        { id: "cancelled", label: "Cancelled", count: 3 },
    ] as const;

    const bookings = [
        { id: 1, status: "upcoming", student: "Sarah Jenkins", subject: "Advanced Calculus", date: "Today", time: "10:00 AM - 11:00 AM", type: "Online", price: 90, image: "https://i.pravatar.cc/100?img=47" },
        { id: 2, status: "upcoming", student: "Marcus Chen", subject: "Organic Chemistry", date: "Today", time: "2:30 PM - 3:30 PM", type: "Online", price: 75, image: "https://i.pravatar.cc/100?img=12" },
        { id: 3, status: "upcoming", student: "Elena Rodriguez", subject: "Spanish Literature", date: "Tomorrow", time: "09:00 AM - 10:00 AM", type: "On-site", price: 60, image: "https://i.pravatar.cc/100?img=32" },
        { id: 4, status: "pending", student: "David Okafor", subject: "Linear Algebra", date: "Jul 2", time: "1:00 PM - 2:00 PM", type: "Online", price: 80, image: "https://i.pravatar.cc/100?img=15" },
        { id: 5, status: "pending", student: "Priya Nair", subject: "AP Physics", date: "Jul 3", time: "4:00 PM - 5:00 PM", type: "Online", price: 95, image: "https://i.pravatar.cc/100?img=24" },
        { id: 6, status: "completed", student: "Tom Bennett", subject: "Organic Chemistry", date: "Jun 25", time: "11:00 AM - 12:00 PM", type: "Online", price: 75, image: "https://i.pravatar.cc/100?img=8" },
        { id: 7, status: "cancelled", student: "Lily Zhang", subject: "Advanced Calculus", date: "Jun 20", time: "3:00 PM - 4:00 PM", type: "Online", price: 90, image: "https://i.pravatar.cc/100?img=44" },
    ];

    const filteredBookings = bookings.filter((b) => b.status === activeTab);

    const statusBadge: Record<string, string> = {
        upcoming: "bg-green-50 text-green-700",
        pending: "bg-amber-50 text-amber-700",
        completed: "bg-gray-100 text-gray-700",
        cancelled: "bg-red-50 text-red-700",
    };

    const BookingCard = ({ booking }: any) => (
        <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-5">
            <div className="flex items-start sm:items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-3 min-w-0">
                    <img
                        src={booking.image}
                        alt={booking.student}
                        className="w-11 h-11 sm:w-12 sm:h-12 rounded-full object-cover shrink-0"
                    />
                    <div className="min-w-0">
                        <p className="font-bold text-gray-900 text-sm truncate">{booking.student}</p>
                        <p className="text-xs text-gray-600 truncate">{booking.subject}</p>
                    </div>
                </div>

                <span className={`shrink-0 px-3 py-1 rounded-full text-xs font-semibold capitalize ${statusBadge[booking.status]}`}>
                    {booking.status}
                </span>
            </div>

            <div className="flex items-center gap-x-3 gap-y-2 flex-wrap mt-4 pt-4 border-t border-gray-100 text-xs text-gray-600">
                <span className="flex items-center gap-1.5">
                    <FiCalendar size={13} />
                    {booking.date}
                </span>
                <span className="flex items-center gap-1.5">
                    <FiClock size={13} />
                    {booking.time}
                </span>
                <span className="px-2 py-1 bg-gray-100 rounded text-[11px] font-semibold text-gray-700">
                    {booking.type}
                </span>
                <span className="sm:ml-auto font-bold text-gray-900 text-sm">${booking.price}/hr</span>
            </div>

            <div className="flex flex-col xs:flex-row sm:flex-row items-stretch gap-2 mt-4">
                {booking.status === "pending" && (
                    <>
                        <button className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2 bg-green-700 text-white rounded-full text-xs font-semibold hover:bg-green-800 transition-all">
                            Accept
                        </button>
                        <button className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2 border border-gray-300 text-gray-700 rounded-full text-xs font-semibold hover:bg-gray-50 transition-all">
                            Decline
                        </button>
                    </>
                )}

                {booking.status === "upcoming" && (
                    <>
                        <button className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2 border border-gray-300 text-gray-700 rounded-full text-xs font-semibold hover:bg-gray-50 transition-all">
                            <FiMessageCircle size={14} />
                            Message
                        </button>
                        <button className="flex-1 px-4 py-2 bg-green-700 text-white rounded-full text-xs font-semibold hover:bg-green-800 transition-all">
                            Launch Session
                        </button>
                    </>
                )}

                {booking.status === "completed" && (
                    <button className="w-full px-4 py-2 border-2 border-green-700 text-green-700 rounded-full text-xs font-semibold hover:bg-green-50 transition-all">
                        View Summary
                    </button>
                )}

                {booking.status === "cancelled" && (
                    <button className="w-full px-4 py-2 border border-gray-300 text-gray-500 rounded-full text-xs font-semibold hover:bg-gray-50 transition-all">
                        View Details
                    </button>
                )}
            </div>
        </div>
    );

    return (
        <div className="md:pl-56 pb-20 md:pb-8 lg:pt-20">
            <div className="min-h-screen pt-8 bg-gray-50 px-4 sm:px-6 lg:px-8 max-w-7xl m-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-1">Bookings</h1>
                        <p className="text-gray-600 text-sm">
                            Manage your session requests and upcoming lessons in one place.
                        </p>
                    </div>
                    <div className="relative w-full sm:w-64 shrink-0">
                        <FiSearch size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by student or subject"
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-full text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-200"
                        />
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-2 mb-6 overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${activeTab === tab.id
                                ? "bg-green-700 text-white"
                                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                                }`}
                        >
                            {tab.label}
                            <span
                                className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${activeTab === tab.id ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600"
                                    }`}
                            >
                                {tab.count}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Bookings List */}
                {filteredBookings.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {filteredBookings.map((booking) => (
                            <BookingCard key={booking.id} booking={booking} />
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl border border-gray-200 p-8 sm:p-12 text-center">
                        <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                            <FiCalendar size={22} className="text-gray-400" />
                        </div>
                        <h3 className="font-bold text-gray-900 mb-1">No {activeTab} bookings</h3>
                        <p className="text-sm text-gray-500">
                            Bookings in this category will show up here once available.
                        </p>
                    </div>
                )}

                {filteredBookings.length > 0 && (
                    <div className="flex items-center justify-center mt-8">
                        <button className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-700">
                            Load more
                            <FiArrowRight size={14} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TutorBookings;