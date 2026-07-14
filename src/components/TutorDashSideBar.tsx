import {
    FiCalendar, FiCompass,
    FiHome, FiLogOut, FiMessageSquare,
    FiUser
} from "react-icons/fi";
import { Link, useLocation, useNavigate } from "react-router-dom";

const TutorDashSideBar = () => {
    const location = useLocation();

    const navItems = [
        { id: "home", label: "Home", icon: FiHome, link: "/tutor/dashboard/overview" },
        { id: "tutors", label: "Wallet", icon: FiCompass, link: "/tutor/dashboard/wallet" },
        { id: "bookings", label: "Bookings", icon: FiCalendar, link: "/tutor/dashboard/bookings" },
        { id: "messages", label: "Messages", icon: FiMessageSquare, link: "/tutor/dashboard/messages" },
        { id: "profile", label: "Profile", icon: FiUser, link: "/tutor/dashboard/profile" },
        // { id: "settings", label: "Settings", icon: FiSettings, link: "/tutor/dashboard/settings" },
    ];

    const isActive = (link: string) => location.pathname === link;

    const navigate = useNavigate()
    const handleLogout = () => {
        localStorage.removeItem('welearnToken')
        localStorage.removeItem('welearnRole')
        navigate('/login')
    }

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex flex-col fixed left-0 top-0 bottom-0 w-56 h-full z-50 bg-[#011b12] text-white">

                {/* Logo */}
                <div className="px-6 pt-8 pb-5 border-b border-white/10">
                    <span className="text-lg font-semibold tracking-tight text-green-300">
                        We<span className="text-green-400">learn</span>
                    </span>
                </div>

                <div className="flex-1 overflow-y-auto py-4 px-3">
                    <nav className="space-y-6">
                        {navItems.map(({ label, icon: Icon, link }) => (
                            <Link
                                key={link}
                                to={link}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium text-sm ${isActive(link)
                                    ? "bg-green-100 text-green-800"
                                    : "text-green-50 hover:bg-green-50/10 hover:text-green-300"
                                    }`}
                            >
                                <Icon size={18} />
                                <span>{label}</span>
                            </Link>
                        ))}
                    </nav>
                </div>

                {/* Logout */}
                <div className="px-3 py-5 border-t border-white/10">
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-neutral-400 hover:bg-red-500/10 hover:text-red-400 transition-all font-medium text-sm">
                        <FiLogOut size={18} />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Mobile Bottom Navigation */}
            <nav className="md:hidden fixed bottom-2 left-3 right-3 rounded-full bg-green-950 border-t-4 border-neutral-100 z-40">
                <div className="flex justify-around items-center h-18 px-2">
                    {navItems.slice(0, 5).map(({ label, icon: Icon, link }) => (
                        <Link
                            key={link}
                            to={link}
                            className={`flex flex-col items-center justify-center w-14 h-12 rounded-2xl transition-all ${isActive(link)
                                ? "bg-green-100 text-green-600"
                                : "text-white "
                                }`}
                            title={label}
                        >
                            <Icon size={24} />
                            <span className="text-[8px] mt-0.5 font-medium">{label.split(" ")[0]}</span>
                        </Link>
                    ))}

                    {/* More Menu */}
                    <div className="relative group">
                        {/* Dropdown */}
                        <div className="absolute bottom-20 right-0 bg-white rounded-xl border border-neutral-100 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all w-48">
                            {navItems.slice(5).map(({ label, icon: Icon, link }) => (
                                <Link
                                    key={link}
                                    to={link}
                                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all ${isActive(link)
                                        ? "bg-green-100 text-green-700"
                                        : "text-neutral-600 hover:bg-green-50 hover:text-green-600"
                                        }`}
                                >
                                    <Icon size={16} />
                                    <span>{label}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile spacer */}
            <div className="md:hidden h-20" />
        </>
    );
};

export default TutorDashSideBar;