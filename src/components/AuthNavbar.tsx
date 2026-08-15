import { Link } from "react-router-dom";

const AuthNavbar = () => {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-[#011d02]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
                <Link to="/" className="inline-flex items-center gap-2 no-underline">
                    <span className="font-bold text-[15px] text-white tracking-tight">WELEARN</span>
                </Link>
            </div>
        </header>
    );
};

export default AuthNavbar;