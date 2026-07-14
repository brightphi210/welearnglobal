import { useEffect, useRef, useState } from "react";
import { FiBell, FiLogOut, FiMessageSquare } from "react-icons/fi";
import { IoNotificationsOutline } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { useGetUserProfile } from "../hooks/queries/allQueries";

const DashNavbar = () => {
    // const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);
    const profileMenuRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    const { userProfile, isLoading } = useGetUserProfile();
    const user = userProfile?.data;

    // ── Close dropdown when clicking outside ────────────────────────────────
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
                setProfileMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const getInitials = () => {
        return user?.first_name?.charAt(0)?.toUpperCase() || "";
    };

    const handleLogout = () => {
        localStorage.removeItem("welearnToken");
        localStorage.removeItem("welearnRole");
        navigate("/login");
    };

    return (
        <nav className="bg-white fixed top-0 z-40 w-full border-b border-gray-100">
            <div className="px-4 sm:px-6 lg:px-8 py-2">
                <div className="flex items-center justify-between">

                    {/* Mobile Logo — hidden on md+ (sidebar takes over) */}
                    <span className="md:hidden text-2xl font-bold tracking-tight text-emerald-700">
                        Welearn
                    </span>

                    {/* Right Icons */}
                    <div className="flex items-center gap-3 ml-auto">
                        <button className="relative p-2 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all hidden sm:flex items-center justify-center">
                            <FiMessageSquare size={20} />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full"></span>
                        </button>

                        <button className="relative p-2 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all hidden sm:flex items-center justify-center">
                            <FiBell size={20} />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>

                        {/* ── Profile trigger + dropdown ── */}
                        <div className="relative" ref={profileMenuRef}>
                            {isLoading ? (
                                <div className="w-9 h-9 rounded-full bg-gray-200 animate-pulse"></div>
                            ) : (
                                <>
                                    {user?.profile_image ? (
                                        <button
                                            onClick={() => setProfileMenuOpen((prev) => !prev)}
                                            className="w-10 h-10 rounded-full overflow-hidden border border-gray-200 hover:ring-2 hover:ring-emerald-200 transition-all"
                                        >
                                            <img
                                                src={user.profile_image}
                                                alt="Profile"
                                                className="w-full h-full object-cover"
                                            />
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => setProfileMenuOpen((prev) => !prev)}
                                            className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-emerald-950 font-bold text-base hover:shadow-md hover:ring-2 hover:ring-emerald-200 transition-all"
                                        >
                                            {getInitials()}
                                        </button>
                                    )}
                                </>
                            )}

                            {/* ── Dropdown Dialog ── */}
                            {profileMenuOpen && !isLoading && (
                                <div className="absolute right-0 mt-3 w-72 bg-white rounded-xl border border-gray-200 shadow-xl overflow-hidden z-50">
                                    {/* User Info */}
                                    <div className="p-5 flex flex-col items-center text-center border-b border-gray-100">
                                        <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center text-emerald-950 font-bold text-xl mb-3 ring-4 ring-emerald-50">
                                            {user?.profile_image ? (
                                                <img
                                                    src={user.profile_image}
                                                    alt="Profile"
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                getInitials()
                                            )}
                                        </div>
                                        <p className="font-semibold text-gray-900 text-sm">
                                            {user?.full_name || `${user?.first_name || ""} ${user?.last_name || ""}`}
                                        </p>
                                        <p className="text-gray-500 text-xs mt-1">{user?.email}</p>
                                    </div>

                                    {/* Actions */}
                                    <div className="p-3 flex flex-col gap-2">
                                        <Link
                                            to="/student/dashboard/profile"
                                            onClick={() => setProfileMenuOpen(false)}
                                            className="block w-full text-center px-4 py-2.5 bg-emerald-900 text-white rounded-full font-semibold text-sm hover:bg-green-900 transition-all"
                                        >
                                            View Profile
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center bg-gray-100 justify-center gap-2 w-full text-center px-4 py-2.5 border border-gray-200 text-gray-700 rounded-full font-semibold text-sm hover:bg-gray-50 hover:text-red-600 hover:border-red-200 transition-all"
                                        >
                                            <FiLogOut size={16} />
                                            Log Out
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        <button
                            className="text-2xl bg-gray-200 rounded-full p-2 justify-center items-center lg:hidden flex"
                        >
                            <IoNotificationsOutline />
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default DashNavbar;