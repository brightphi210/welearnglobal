import { useState } from "react";
import { FaStar } from "react-icons/fa";
import {
    FiArrowRight, FiBookmark, FiBookOpen, FiCalendar, FiCode,
    FiGlobe, FiGrid, FiMusic, FiSearch, FiZap
} from "react-icons/fi";
import { Link } from "react-router-dom";
import LoadingOverlay from "../../components/LoadingOverlay";
import TutorsBanner from "../../components/TutorsBanner";
import { useGetTutors, useGetUserProfile } from "../../hooks/queries/allQueries";

interface UpcomingSession {
    title: string;
    instructor: string;
    startTime: string;
    endTime: string;
    minutesUntil: string;
}

const StudentOverview = () => {
    const [upcomingSession] = useState<UpcomingSession | null>({
        title: "Advanced Organic Chemistry",
        instructor: "Dr. Sarah Jenkins",
        startTime: "4:00 PM",
        endTime: "5:30 PM",
        minutesUntil: "15",
    });

    // const [upcomingSession] = useState(null)

    const categories = [
        { id: 1, name: "Mathematics", icon: FiBookOpen, color: "bg-blue-500" },
        { id: 2, name: "Programming", icon: FiCode, color: "bg-green-500" },
        { id: 3, name: "Languages", icon: FiGlobe, color: "bg-orange-500" },
        { id: 4, name: "Science", icon: FiZap, color: "bg-purple-500" },
        { id: 5, name: "Music", icon: FiMusic, color: "bg-pink-500" },
        { id: 6, name: "All", icon: FiGrid, color: "bg-green-700" },
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
                    <div className="w-16 h-16 rounded-lg bg-green-950 ring-4 ring-gray-100 flex items-center justify-center text-white font-bold text-lg shrink-0 overflow-hidden">
                        {tutor.image_url || tutor.profile_image ? (
                            <img
                                src={tutor.image_url || tutor.profile_image}
                                alt={tutor.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            tutor.image || tutor.name?.split(" ").map((n: string) => n[0]).join("").slice(0, 2)
                        )}
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
                    {tutor.tags?.map((tag: string, idx: number) => (
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
                        {tutor.sessionType?.includes("online") && (
                            <span className="px-2 py-1 bg-green-50 text-green-700 rounded text-xs font-semibold">
                                Online
                            </span>
                        )}
                        {tutor.sessionType?.includes("on-site") && (
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

    // ── Empty state for when no tutors are available ────────────────────────
    const EmptyTutorsState = () => (
        <div className="flex flex-col items-center justify-center text-center py-16 px-6 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            <div className="w-16 h-16 rounded-full bg-white border border-gray-200 flex items-center justify-center mb-4">
                <FiSearch size={24} className="text-gray-400" />
            </div>
            <h4 className="text-base font-bold text-gray-900 mb-1">No tutors found yet</h4>
            <p className="text-sm text-gray-500 max-w-sm mb-6">
                We couldn't find any recommended tutors for you right now. Try browsing all tutors instead.
            </p>
            <Link
                to="/student/dashboard/tutors"
                className="px-5 py-2.5 bg-green-900 text-white rounded-full font-semibold text-sm hover:bg-green-800 transition-all"
            >
                Browse All Tutors
            </Link>
        </div>
    );

    const { userProfile, isLoading } = useGetUserProfile();
    const { tutors, isLoading: isTutorLoading } = useGetTutors();
    const user = userProfile?.data;
    const myTutors = tutors?.data?.results;

    console.log("My Tutors:", myTutors);

    return (
        <div className="md:pl-56 pb-20 md:pb-8">
            <LoadingOverlay visible={isLoading || isTutorLoading} />
            <div className="min-h-screen pt-8 bg-gray-50">
                <div className="px-4 sm:px-6 lg:px-8 max-w-7xl m-auto py-8">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-1">
                                Welcome back, {user?.first_name}! 👋
                            </h1>
                            <p className="text-gray-600 text-sm">Ready for your next learning breakthrough today?</p>
                        </div>
                    </div>

                    {/* Upcoming Session Card */}
                    {upcomingSession ? (
                        <div className="bg-green-900 rounded-2xl p-6 sm:p-8 text-white mb-8 shadow-lg shadow-green-200/60">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                                <div className="flex-1">
                                    <p className="text-green-100 text-xs font-semibold mb-2">
                                        Starting in {upcomingSession.minutesUntil} mins
                                    </p>
                                    <h2 className="text-2xl font-bold mb-2">{upcomingSession.title}</h2>
                                    <p className="text-green-100 text-sm">
                                        with {upcomingSession.instructor} • {upcomingSession.startTime} - {upcomingSession.endTime}
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
                    ) : (
                        /* ── No upcoming class empty state ── */
                        <div className="bg-white rounded-2xl p-6 sm:p-8 mb-8 border border-dashed border-gray-200">
                            <div className="flex flex-col sm:flex-row items-center sm:items-center justify-between gap-6 text-center sm:text-left">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center shrink-0">
                                        <FiCalendar size={22} className="text-green-700" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-gray-900 mb-1">No upcoming classes</h2>
                                        <p className="text-gray-500 text-sm">
                                            You don't have any sessions scheduled right now. Book a tutor to get started.
                                        </p>
                                    </div>
                                </div>
                                <Link
                                    to="/student/dashboard/tutors"
                                    className="px-5 py-2.5 bg-green-900 text-white rounded-full font-semibold text-sm hover:bg-green-800 transition-all whitespace-nowrap"
                                >
                                    Find a Tutor
                                </Link>
                            </div>
                        </div>
                    )}

                    {/* Categories Section — horizontally scrollable on mobile, grid from sm breakpoint up */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-4 lg:p-6 mb-8 overflow-hidden">
                        <h3 className="text-lg font-bold text-gray-900 mb-6">Explore Categories</h3>
                        <div className="grid gap-3 overflow-x-auto sm:overflow-visible grid-cols-3 lg:grid-cols-6 w-full min-w-0 pb-2 categories-scroll">
                            {categories.map(({ id, name, icon: Icon }) => (
                                <div key={id} className="shrink-0 sm:contents">
                                    <button
                                        className="flex flex-col items-center gap-3 p-4 sm:p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:border-green-200 hover:shadow-md transition-all group
                                                   shrink-0 w-24 sm:w-auto"
                                    >
                                        <div className="bg-white w-12 h-12 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform border border-gray-100 shrink-0">
                                            <Icon size={16} className="text-green-700" />
                                        </div>
                                        <p className="text-[11px] sm:text-xs font-semibold text-gray-900 text-center">{name}</p>
                                    </button>
                                </div>
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

                        {/* ── Empty state vs grid ── */}
                        {!isTutorLoading && myTutors.length === 0 ? (
                            <EmptyTutorsState />
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                                {myTutors.map((tutor: any) => (
                                    <TutorCard key={tutor.id} tutor={tutor} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style>{`
                .categories-scroll::-webkit-scrollbar {
                  height: 6px;
                }
                .categories-scroll::-webkit-scrollbar-track {
                  background: transparent;
                }
                .categories-scroll::-webkit-scrollbar-thumb {
                  background: rgba(21, 128, 61, 0.25);
                  border-radius: 999px;
                }
                .categories-scroll {
                  scrollbar-width: thin;
                  scrollbar-color: rgba(21, 128, 61, 0.25) transparent;
                }
            `}</style>
        </div>
    );
};

export default StudentOverview;