import { useState } from "react";
import { FiBell, FiMenu, FiMessageSquare, FiX } from "react-icons/fi";
import { Link } from "react-router";

const DashNavbar = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <nav className="bg-white border-b border-gray-100 shadow-sm fixed top-0 z-40 w-full">
            <div className="px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo and Brand */}
                    <Link to='/'>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center flex-shrink-0">
                                <span className="text-white font-bold text-sm">W</span>
                            </div>
                            <h1 className="text-lg font-bold text-gray-900 hidden sm:block">WeLearnGlobal</h1>
                        </div>
                    </Link>

                    {/* Search Bar - Hidden on mobile */}
                    <div className="hidden md:flex flex-1 max-w-md mx-8">
                        <div className="w-full relative">
                            <input
                                type="text"
                                placeholder="Search tutors by subject or skill..."
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all"
                            />
                        </div>
                    </div>

                    {/* Right Icons */}
                    <div className="flex items-center gap-4">
                        {/* Messages Icon */}
                        <button className="relative p-2 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all hidden sm:flex items-center justify-center">
                            <FiMessageSquare size={20} />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-500 rounded-full"></span>
                        </button>

                        {/* Notifications Icon */}
                        <button className="relative p-2 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all hidden sm:flex items-center justify-center">
                            <FiBell size={20} />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>

                        {/* User Avatar */}
                        <button className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-semibold text-sm hover:shadow-lg transition-all">
                            A
                        </button>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                        >
                            {mobileMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Search Bar */}
                {mobileMenuOpen && (
                    <div className="md:hidden mt-4">
                        <input
                            type="text"
                            placeholder="Search tutors..."
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all"
                        />
                    </div>
                )}
            </div>
        </nav>
    );
};

export default DashNavbar;