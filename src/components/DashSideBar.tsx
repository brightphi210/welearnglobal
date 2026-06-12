import { useState } from "react";
import {
    FiCalendar,
    FiCompass,
    FiDollarSign,
    FiHelpCircle,
    FiHome,
    FiLogOut,
    FiMessageSquare,
    FiSettings,
    FiStar,
    FiUser,
} from "react-icons/fi";
import { Link } from "react-router-dom";

const DashSideBar = () => {
    const [activeTab, setActiveTab] = useState("home");

    const navItems = [
        { id: "home", label: "Home", icon: FiHome, link: "/student/dashboard/overview" },
        { id: "tutors", label: "Discover Tutors", icon: FiCompass, link: "/student/dashboard/tutors" },
        { id: "bookings", label: "My Bookings", icon: FiCalendar, link: "/student/dashboard/bookings" },
        { id: "messages", label: "Messages", icon: FiMessageSquare, link: "/student/dashboard/messages" },
        { id: "wallet", label: "Wallet", icon: FiDollarSign, link: "/student/dashboard/wallet" },
        { id: "reviews", label: "Reviews", icon: FiStar, link: "/student/dashboard/reviews" },
        { id: "profile", label: "Profile", icon: FiUser, link: "/student/dashboard/profile" },
        { id: "settings", label: "Settings", icon: FiSettings, link: "/student/dashboard/settings" },
        { id: "help", label: "Help", icon: FiHelpCircle, link: "/student/dashboard/help" },
    ];

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex flex-col fixed left-0 top-16 w-56 h-[calc(100vh-64px)] bg-gradient-to-b from-emerald-50 to-white border-r border-gray-100">
                <div className="flex-1 overflow-y-auto py-6 px-4">
                    <nav className="space-y-2">
                        {navItems.map(({ id, label, icon: Icon, link }) => (
                            <Link
                                key={id}
                                to={link}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium text-sm ${activeTab === id
                                    ? "bg-emerald-100 text-emerald-700"
                                    : "text-gray-600 hover:bg-emerald-50 hover:text-emerald-600"
                                    }`}
                            >
                                <Icon size={18} />
                                <span>{label}</span>
                            </Link>
                        ))}
                    </nav>
                </div>

                {/* Logout Button */}
                <div className="px-4 py-6 border-t border-gray-100">
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all font-medium text-sm">
                        <FiLogOut size={18} />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Mobile Bottom Navigation */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-40">
                <div className="flex justify-around items-center h-20 px-2">
                    {navItems.slice(0, 5).map(({ id, label, icon: Icon }) => (
                        <button
                            key={id}
                            onClick={() => setActiveTab(id)}
                            className={`flex flex-col items-center justify-center w-16 h-16 rounded-lg transition-all ${activeTab === id
                                ? "bg-emerald-100 text-emerald-600"
                                : "text-gray-600 hover:bg-emerald-50"
                                }`}
                            title={label}
                        >
                            <Icon size={24} />
                            <span className="text-xs mt-1 font-medium">{label.split(" ")[0]}</span>
                        </button>
                    ))}

                    {/* More Menu */}
                    <div className="relative group">
                        <button className="flex flex-col items-center justify-center w-16 h-16 rounded-lg text-gray-600 hover:bg-emerald-50 transition-all">
                            <FiSettings size={24} />
                            <span className="text-xs mt-1 font-medium">More</span>
                        </button>

                        {/* Dropdown Menu */}
                        <div className="absolute bottom-20 right-0 bg-white rounded-xl border border-gray-100 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all w-48">
                            {navItems.slice(5).map(({ id, label, icon: Icon }) => (
                                <button
                                    key={id}
                                    onClick={() => setActiveTab(id)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all ${id === navItems[navItems.length - 1].id
                                        ? "border-t border-gray-100 text-red-600 hover:bg-red-50"
                                        : activeTab === id
                                            ? "bg-emerald-100 text-emerald-700"
                                            : "text-gray-600 hover:bg-emerald-50 hover:text-emerald-600"
                                        }`}
                                >
                                    <Icon size={16} />
                                    <span>{label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Spacer for mobile to prevent content overlap */}
            <div className="md:hidden h-20" />
        </>
    );
};

export default DashSideBar;