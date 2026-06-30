import { useState } from "react";
import { FaStar } from "react-icons/fa";
import { FiArrowRight, FiBookmark, FiBookOpen, FiCode, FiGlobe, FiGrid, FiMusic, FiZap } from "react-icons/fi";
import { Link } from "react-router-dom";
import TutorsBanner from "../../components/TutorsBanner";

const StudentOverview = () => {
    const [sessionTime] = useState("15");

    const categories = [
        { id: 1, name: "Mathematics", icon: FiBookOpen, color: "bg-blue-500" },
        { id: 2, name: "Programming", icon: FiCode, color: "bg-green-500" },
        { id: 3, name: "Languages", icon: FiGlobe, color: "bg-orange-500" },
        { id: 4, name: "Science", icon: FiZap, color: "bg-purple-500" },
        { id: 5, name: "Music", icon: FiMusic, color: "bg-pink-500" },
        { id: 6, name: "All", icon: FiGrid, color: "bg-green-700" },
    ];

    const recommendedTutors = [
        {
            id: 1,
            name: "Prof. Michael Chen",
            title: "PhD in Data Science & Python. Ex-Google Engineer.",
            rating: 4.9,
            reviews: 128,
            price: 45,
            bio: "Ex-Google Engineer with 10+ years of teaching experience",
            image: "MC",
            tags: ["Python", "Data Science"],
            sessionType: ["online"],
        },
        {
            id: 2,
            name: "Emma Rodriguez",
            title: "Native Spanish Speaker & Literature Expert.",
            rating: 4.8,
            reviews: 84,
            price: 32,
            bio: "Native speaker focusing on conversational fluency",
            image: "ER",
            tags: ["IELTS", "Conversational"],
            sessionType: ["online", "on-site"],
        },
        {
            id: 3,
            name: "Dr. James Wilson",
            title: "PhD Physics. Specialist in AP & University Courses.",
            rating: 5.0,
            reviews: 42,
            price: 55,
            bio: "Specialized in AP Physics and university-level courses",
            image: "JW",
            tags: ["AP Physics", "Calculus"],
            sessionType: ["online"],
        },
    ];

    const StarRating = ({ rating, reviews }: any) => (
        <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                    <FaStar
                        key={i}
                        size={10}
                        className={i < Math.round(rating) ? "text-yellow-400" : "text-gray-300"}
                    />
                ))}
            </div>
            <span className="font-bold text-sm text-gray-900">{rating}</span>
            <span className="text-xs text-gray-600">({reviews} reviews)</span>
        </div>
    );

    const TutorCard = ({ tutor }: any) => (
        <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden transition-all">
            {/* Banner */}
            <TutorsBanner seed={tutor.id} className="h-26 w-full" />

            <div className="p-6 pt-0 flex flex-col h-full">
                <div className="flex items-start justify-between gap-4 mb-2 relative -mt-8">
                    <div className="w-16 h-16 rounded-lg bg-green-950 ring-4 ring-gray-100 flex items-center justify-center text-white font-bold text-lg shrink-0">
                        {tutor.image}
                    </div>
                    <button className="p-3 text-green-800 bg-white rounded-full mt-2 shadow-sm">
                        <FiBookmark size={25} />
                    </button>
                </div>

                {/* Name and Title */}
                <div className="mb-4">
                    <h4 className="text-lg font-bold text-gray-900">{tutor.name}</h4>
                    <p className="text-xs text-gray-600 line-clamp-2 leading-tight">{tutor.title}</p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-2">
                    {tutor.tags.map((tag: string, idx: number) => (
                        <span key={idx} className="px-2 py-1 bg-gray-200 text-gray-700 font-semibold rounded-full text-[10px]">
                            {tag}
                        </span>
                    ))}
                </div>

                {/* Rating */}
                <div className="mb-2">
                    <StarRating rating={tutor.rating} reviews={tutor.reviews} />
                </div>

                {/* Session Type and Price */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-300 mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                        {tutor.sessionType.includes("online") && (
                            <span className="px-2 py-1 bg-green-50 text-green-700 rounded text-xs font-semibold">
                                Online
                            </span>
                        )}
                        {tutor.sessionType.includes("on-site") && (
                            <span className="px-2 py-1 bg-orange-50 text-orange-700 rounded text-xs font-semibold">
                                Onsite
                            </span>
                        )}
                    </div>
                    <div className="text-right">
                        <span className="text-lg font-bold text-gray-900">${tutor.price}</span>
                        <span className="text-xs text-gray-600">/hr</span>
                    </div>
                </div>

                {/* Action Button — white with border format */}
                <Link to={`/student/dashboard/tutor/${tutor.id}`}>
                    <button className="w-full px-4 py-3 border-2 border-green-700 text-green-700 bg-white rounded-full font-semibold transition-all text-sm hover:bg-green-50">
                        View Profile
                    </button>
                </Link>
            </div>
        </div>
    );

    return (
        <div className="md:pl-56 pb-20 md:pb-8">
            <div className="min-h-screen pt-8 bg-gray-50">
                <div className="px-4 sm:px-6 lg:px-8 max-w-7xl m-auto py-8">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-1">
                                Welcome back, Alex! 👋
                            </h1>
                            <p className="text-gray-600 text-sm">Ready for your next learning breakthrough today?</p>
                        </div>
                    </div>

                    {/* Upcoming Session Card */}
                    <div className="bg-green-900 rounded-2xl p-6 sm:p-8 text-white mb-8 shadow-lg shadow-green-200/60">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                            <div className="flex-1">
                                <p className="text-green-100 text-xs font-semibold mb-2">Starting in {sessionTime} mins</p>
                                <h2 className="text-2xl font-bold mb-2">Advanced Organic Chemistry</h2>
                                <p className="text-green-100 text-sm">
                                    with Dr. Sarah Jenkins • 4:00 PM - 5:30 PM
                                </p>
                            </div>
                            <div className="flex gap-3 w-full sm:w-auto">
                                <button className="flex-1 text-sm sm:flex-none px-5 py-2.5 bg-white text-green-700 rounded-full font-semibold transition-all hover:bg-green-50">
                                    Join Session
                                </button>
                                <button className="flex-1 text-sm sm:flex-none px-5 py-2.5 border border-white text-white rounded-full font-semibold transition-all hover:bg-white/10">
                                    View Materials
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Categories Section */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8">
                        <h3 className="text-lg font-bold text-gray-900 mb-6">Explore Categories</h3>
                        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                            {categories.map(({ id, name, icon: Icon }) => (
                                <button
                                    key={id}
                                    className="flex flex-col items-center gap-3 p-4 sm:p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:border-green-200 hover:shadow-md transition-all group"
                                >
                                    <div className="bg-white w-12 h-12 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform border border-gray-100">
                                        <Icon size={16} className="text-green-700" />
                                    </div>
                                    <p className="text-[11px] sm:text-xs font-semibold text-gray-900 text-center">{name}</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Recommended Tutors Section */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-gray-900">Recommended for You</h3>
                            <Link
                                to="/student/dashboard/tutors"
                                className="text-green-700 font-semibold text-sm flex items-center gap-1.5 hover:text-green-800"
                            >
                                All tutors
                                <FiArrowRight size={14} />
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                            {recommendedTutors.map((tutor) => (
                                <TutorCard key={tutor.id} tutor={tutor} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentOverview;