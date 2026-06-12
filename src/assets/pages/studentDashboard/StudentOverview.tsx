import { useState } from "react";
import { FiArrowRight, FiBookOpen, FiCode, FiGlobe, FiGrid, FiMusic, FiZap } from "react-icons/fi";

const StudentOverview = () => {
    const [sessionTime] = useState("15");

    const categories = [
        { id: 1, name: "Mathematics", icon: FiBookOpen, color: "bg-blue-500" },
        { id: 2, name: "Programming", icon: FiCode, color: "bg-emerald-500" },
        { id: 3, name: "Languages", icon: FiGlobe, color: "bg-orange-500" },
        { id: 4, name: "Science", icon: FiZap, color: "bg-purple-500" },
        { id: 5, name: "Music", icon: FiMusic, color: "bg-pink-500" },
        { id: 6, name: "All Subjects", icon: FiGrid, color: "bg-gray-500" },
    ];

    const recommendedTutors = [
        {
            id: 1,
            name: "Prof. Michael Chen",
            subject: "Data Science & Python",
            rating: 4.9,
            reviews: 128,
            price: 45,
            bio: "Ex-Google Engineer with 10+ years of teaching experience",
            image: "MC",
        },
        {
            id: 2,
            name: "Emma Rodriguez",
            subject: "Spanish Literature",
            rating: 4.8,
            reviews: 84,
            price: 32,
            bio: "Native speaker focusing on conversational fluency",
            image: "ER",
        },
        {
            id: 3,
            name: "Dr. James Wilson",
            subject: "Physics & Calculus",
            rating: 5.0,
            reviews: 42,
            price: 55,
            bio: "Specialized in AP Physics and university-level courses",
            image: "JW",
        },
    ];

    const learningStats = [
        { label: "Total Hours", value: "24.5h" },
        { label: "Sessions Done", value: "12" },
        { label: "Top Subject", value: "Science" },
    ];

    return (
        <div className="md:pl-56 pb-20 md:pb-8 pt-20 mx-w-5xl">
            <div className="min-h-screen  bg-linear-to-br from-emerald-50 via-white to-teal-50">
                {/* Main Content */}
                <div className="px-4 sm:px-6 max-w-6xl m-auto lg:px-8 py-8">
                    {/* Welcome Section */}
                    <div className="mb-8">
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2">
                            Welcome back, Alex! 👋
                        </h1>
                        <p className="text-gray-600">Ready for your next learning breakthrough today?</p>
                    </div>

                    {/* Upcoming Session Card */}
                    <div className="bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-2xl p-6 sm:p-8 text-white mb-8 shadow-lg shadow-emerald-200/60">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                            <div className="flex-1">
                                <p className="text-emerald-100 text-sm font-semibold mb-2">Starting in {sessionTime} mins</p>
                                <h2 className="text-2xl sm:text-3xl font-bold mb-2">Advanced Organic Chemistry</h2>
                                <p className="text-emerald-100">
                                    with Dr. Sarah Jenkins • 4:00 PM - 5:30 PM
                                </p>
                            </div>
                            <div className="flex gap-3 w-full sm:w-auto">
                                <button className="flex-1 sm:flex-none px-6 py-2.5 bg-white text-emerald-600 rounded-lg font-semibold hover:bg-emerald-50 transition-all">
                                    Join Session
                                </button>
                                <button className="flex-1 sm:flex-none px-6 py-2.5 border border-white text-white rounded-lg font-semibold hover:bg-emerald-500 transition-all">
                                    View Materials
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Categories Section */}
                    <div className="mb-12">
                        <h3 className="text-2xl font-bold text-gray-900 mb-6">Explore Categories</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                            {categories.map(({ id, name, icon: Icon, color }) => (
                                <button
                                    key={id}
                                    className="flex flex-col items-center gap-3 p-6 bg-white rounded-2xl border border-gray-100 hover:border-emerald-200 hover:shadow-lg transition-all group"
                                >
                                    <div className={`${color} w-12 h-12 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                        <Icon size={24} className="text-white" />
                                    </div>
                                    <p className="text-sm font-semibold text-gray-900 text-center">{name}</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Recommended Tutors Section */}
                    <div className="mb-12">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-2xl font-bold text-gray-900">Recommended for You</h3>
                            <a href="/tutors" className="text-emerald-600 font-semibold flex items-center gap-2 hover:text-emerald-700">
                                View all tutors
                                <FiArrowRight size={16} />
                            </a>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {recommendedTutors.map((tutor) => (
                                <div key={tutor.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all">
                                    <div className="p-6 flex flex-col h-full">
                                        {/* Avatar */}
                                        <div className="mb-4">
                                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold text-lg mb-4">
                                                {tutor.image}
                                            </div>
                                            <h4 className="text-lg font-bold text-gray-900">{tutor.name}</h4>
                                            <p className="text-sm text-emerald-600 font-semibold">{tutor.subject}</p>
                                        </div>

                                        {/* Rating */}
                                        <div className="flex items-center gap-1 mb-3">
                                            <div className="flex items-center">
                                                {[...Array(5)].map((_, i) => (
                                                    <span key={i} className="text-yellow-400">★</span>
                                                ))}
                                            </div>
                                            <span className="text-sm font-semibold text-gray-900">{tutor.rating}</span>
                                            <span className="text-xs text-gray-500">({tutor.reviews} reviews)</span>
                                        </div>

                                        {/* Bio */}
                                        <p className="text-sm text-gray-600 mb-4 flex-1">{tutor.bio}</p>

                                        {/* Price and Action */}
                                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                            <span className="text-lg font-bold text-gray-900">${tutor.price}<span className="text-sm text-gray-500 font-normal">/hr</span></span>
                                            <button className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg font-semibold hover:bg-emerald-200 transition-all text-sm">
                                                View Profile
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Bottom Section - Challenge and Stats */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Challenge Card */}
                        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6 sm:p-8">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 flex-shrink-0">
                                    ⭐
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-lg font-bold text-gray-900 mb-2">Complete 5 more sessions</h4>
                                    <p className="text-sm text-gray-600 mb-4">To unlock the "Dedicated Scholar" badge and get 10% off!</p>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div className="bg-emerald-500 h-2 rounded-full" style={{ width: "60%" }}></div>
                                    </div>
                                    <p className="text-xs text-emerald-600 font-semibold mt-2">60% Complete</p>
                                </div>
                            </div>
                        </div>

                        {/* Learning Stats Card */}
                        <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8">
                            <h4 className="text-lg font-bold text-gray-900 mb-6">Learning Stats</h4>
                            <div className="space-y-4">
                                {learningStats.map((stat, idx) => (
                                    <div key={idx}>
                                        <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                                        <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentOverview;