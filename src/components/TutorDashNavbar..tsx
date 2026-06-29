import { useState } from "react";
import { FiBell, FiMessageSquare } from "react-icons/fi";
import { IoNotificationsOutline } from "react-icons/io5";

const TutorDashNavbar = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

                        <button className="w-9 h-9 rounded-full bg-emerald-900 flex items-center justify-center text-white font-semibold text-sm hover:shadow-md transition-all">
                            A
                        </button>


                        <button
                            className="text-2xl bg-gray-200 rounded-full p-2 justify-center items-center lg:hidden flex"
                        >
                            <IoNotificationsOutline />
                        </button>
                    </div>
                </div>

                {/* Mobile Search */}
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

export default TutorDashNavbar;