import { useMemo } from "react";
import { FaStar } from "react-icons/fa";
import {
    FiArrowRight, FiBookmark, FiBookOpen, FiCalendar, FiCheckCircle, FiCode,
    FiGlobe, FiGrid, FiMusic, FiSearch, FiZap
} from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import LoadingOverlay from "../../components/LoadingOverlay";
import TutorsBanner from "../../components/TutorsBanner";
import { useGetMyBookingsAsUser, useGetTutors, useGetUserProfile } from "../../hooks/queries/allQueries";
import {
    type Booking,
    extractBookingList,
    mapBookingResponse,
} from "../../utils/bookingUtils";

interface UpcomingSession {
    title: string;
    instructor: string;
    startTime: string;
    endTime: string;
    minutesUntil: string;
}

/* ─── Shape returned by the tutors API ───────────────────────────────── */
interface TutorData {
    id: number;
    full_name: string;
    email?: string;
    bio?: string;
    subjects?: string[] | null;
    skills?: string[] | null;
    session_status?: "online" | "onsite" | "both" | string;
    hourly_rate?: string | number;
    average_rating?: string | number;
    total_sessions?: number;
    is_verified?: boolean;
    verification_status?: string;
    location?: string;
    profile_image?: string | null;
    banner?: string | null;
    language?: string;
    professional_title?: string;
}

const StudentOverview = () => {
    const navigate = useNavigate();
    const categories = [
        { id: 1, name: "Mathematics", icon: FiBookOpen, color: "bg-blue-500" },
        { id: 2, name: "Programming", icon: FiCode, color: "bg-green-500" },
        { id: 3, name: "Languages", icon: FiGlobe, color: "bg-orange-500" },
        { id: 4, name: "Science", icon: FiZap, color: "bg-purple-500" },
        { id: 5, name: "Music", icon: FiMusic, color: "bg-pink-500" },
        { id: 6, name: "All", icon: FiGrid, color: "bg-green-700" },
    ];

    const handleCategoryClick = (category: string) => {
        const subject = category === "All" ? "" : category;
        const query = subject ? `?subject=${encodeURIComponent(subject)}` : "";
        navigate(`/student/dashboard/tutors${query}`);
    };

    const StarRating = ({ rating, sessions }: { rating: number; sessions: number }) => (
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
            <span className="font-bold text-sm text-gray-900">{rating.toFixed(1)}</span>
            <span className="text-xs text-gray-600">
                ({sessions} session{sessions === 1 ? "" : "s"})
            </span>
        </div>
    );

    const TutorCard = ({ tutor }: { tutor: TutorData }) => {
        const initials =
            tutor.full_name
                ?.split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)
                .toUpperCase() || "?";

        const rating = Number(tutor.average_rating) || 0;
        // Prefer subjects for tags; fall back to skills if no subjects set
        const tags = tutor.subjects?.length ? tutor.subjects : tutor.skills || [];
        const rate = Number(tutor.hourly_rate) || 0;

        return (
            <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden transition-all">
                {/* Banner — use the tutor's real uploaded banner if present */}
                {tutor.banner ? (
                    <img
                        src={tutor.banner}
                        alt={`${tutor.full_name} banner`}
                        className="h-26 w-full object-cover"
                    />
                ) : (
                    <TutorsBanner seed={tutor.id} className="h-26 w-full" />
                )}

                <div className="p-6 pt-0 flex flex-col h-full">
                    <div className="flex items-start justify-between gap-4 mb-2 relative -mt-8">
                        <div className="w-16 h-16 rounded-lg bg-green-950 ring-4 ring-gray-100 flex items-center justify-center text-white font-bold text-lg shrink-0 overflow-hidden">
                            {tutor.profile_image ? (
                                <img
                                    src={tutor.profile_image}
                                    alt={tutor.full_name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                initials
                            )}
                        </div>
                        <button className="p-3 text-green-800 bg-white rounded-full mt-2 shadow-sm">
                            <FiBookmark size={25} />
                        </button>
                    </div>

                    {/* Name and Title */}
                    <div className="mb-4">
                        <div className="flex items-center gap-1.5">
                            <h4 className="text-lg font-bold text-gray-900 truncate">{tutor.full_name}</h4>
                            {tutor.is_verified && (
                                <FiCheckCircle size={14} className="text-green-600 shrink-0" />
                            )}
                        </div>
                        <p className="text-xs text-gray-600 line-clamp-2 leading-tight">
                            {tutor.professional_title || "Mentor"}
                        </p>
                    </div>

                    {/* Tags (subjects, or skills as fallback) */}
                    {tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-2">
                            {tags.slice(0, 3).map((tag, idx) => (
                                <span
                                    key={idx}
                                    className="px-2 py-1 bg-gray-200 text-gray-700 font-semibold rounded-full text-[10px]"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Rating */}
                    <div className="mb-2">
                        <StarRating rating={rating} sessions={tutor.total_sessions ?? 0} />
                    </div>

                    {/* Session Type and Price */}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-300 mb-2">
                        <div className="flex items-center gap-2 flex-wrap">
                            {(tutor.session_status === "online" || tutor.session_status === "both") && (
                                <span className="px-2 py-1 bg-green-50 text-green-700 rounded text-xs font-semibold">
                                    Online
                                </span>
                            )}
                            {(tutor.session_status === "onsite" || tutor.session_status === "both") && (
                                <span className="px-2 py-1 bg-orange-50 text-orange-700 rounded text-xs font-semibold">
                                    Onsite
                                </span>
                            )}
                        </div>
                        <div className="text-right">
                            <span className="text-lg font-bold text-gray-900">${rate.toFixed(0)}</span>
                            <span className="text-xs text-gray-600">/hr</span>
                        </div>
                    </div>

                    {/* Action Button */}
                    <Link to={`/student/dashboard/tutor/${tutor.id}`}>
                        <button className="w-full px-4 py-3 border-2 border-green-700 text-green-700 bg-white rounded-full font-semibold transition-all text-sm hover:bg-green-50">
                            View Profile
                        </button>
                    </Link>
                </div>
            </div>
        );
    };

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
    const { myBookingsAsUser, isLoading: isBookingsLoading } = useGetMyBookingsAsUser();
    const user = userProfile?.data;
    const myTutors: TutorData[] = tutors?.data?.results || [];

    // Normalize the bookings response through the same shared logic the
    // bookings page uses, so "status" and date parsing stay consistent
    // across both pages.
    const bookings: Booking[] = useMemo(
        () => extractBookingList(myBookingsAsUser).map(mapBookingResponse),
        [myBookingsAsUser]
    );

    const upcomingSession = useMemo<UpcomingSession | null>(() => {
        const now = Date.now();

        const candidates = bookings
            .filter((booking) => booking.status !== "Cancelled" && booking.rawDate)
            .map((booking) => {
                const sessionDate = new Date(
                    `${booking.rawDate}${booking.rawStartTime ? `T${booking.rawStartTime}` : ""}`
                );
                return { booking, sessionDate };
            })
            .filter(({ sessionDate }) => !Number.isNaN(sessionDate.getTime()) && sessionDate.getTime() >= now)
            .sort((a, b) => a.sessionDate.getTime() - b.sessionDate.getTime());

        const next = candidates[0];
        if (!next) return null;

        const { booking, sessionDate } = next;
        const endDate = booking.rawEndTime
            ? new Date(`${booking.rawDate}T${booking.rawEndTime}`)
            : null;

        return {
            title: booking.subject,
            instructor: booking.tutorName,
            startTime: booking.rawStartTime
                ? sessionDate.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
                : "TBD",
            endTime: endDate && !Number.isNaN(endDate.getTime())
                ? endDate.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
                : "TBD",
            minutesUntil: String(Math.max(1, Math.round((sessionDate.getTime() - now) / (1000 * 60)))),
        };
    }, [bookings]);

    return (
        <div className="md:pl-56 pb-20 md:pb-8">
            <LoadingOverlay visible={isLoading || isTutorLoading || isBookingsLoading} />
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
                                        onClick={() => handleCategoryClick(name)}
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
                                {myTutors.map((tutor) => (
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