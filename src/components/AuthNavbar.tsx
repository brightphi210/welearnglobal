import { FaGraduationCap } from "react-icons/fa";

const AuthNavbar = () => {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-green-950">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
                <a href="/" className="inline-flex items-center gap-2 no-underline">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                        <FaGraduationCap size={16} color="white" />
                    </div>
                    <span className="font-bold text-[15px] text-white tracking-tight">WeLearnGlobal</span>
                </a>
            </div>
        </header>
    );
};

export default AuthNavbar;