import { useEffect, useMemo, useState } from "react";
import {
    FiCalendar,
    FiCheckCircle,
    FiClock,
    FiMessageCircle,
    FiStar,
    FiUsers
} from "react-icons/fi";
import { Link } from "react-router-dom";
import LoadingOverlay from "../../components/LoadingOverlay";
import ProfileCompletionModal, {
    getMissingProfileFields,
    getProfileCompletion,
    TUTOR_PROFILE_ROUTE,
} from "../../components/ProfileCompleModal";
import SessionActionModal from "../../components/SessionActionModal";
import { useGetMyBookingsAsTutor, useGetTutorProfile, useGetTutorStats } from "../../hooks/queries/allQueries";
import {
    formatDisplayDate,
    formatDisplayTime,
    formatSessionType,
    getInitials,
    normalizeStatus,
} from "../../utils/bookingHelpers";

const MAX_UPCOMING_SESSIONS = 6;

const TutorOverview = () => {
    const { isLoading, tutorStats } = useGetTutorStats()
    const tutorStatsData = tutorStats?.data

    // ── Profile completion / status ─────────────────────────────────
    const { tutorProfile } = useGetTutorProfile();
    const tutor = tutorProfile?.data;

    const missingFields = getMissingProfileFields(tutor);
    const { percent: profileCompletionPercent, checklist: profileChecklist } = getProfileCompletion(tutor);

    const [showCompletionModal, setShowCompletionModal] = useState(false);

    useEffect(() => {
        if (!tutor) return;
        if (missingFields.length === 0) return;

        const timer = setTimeout(() => {
            setShowCompletionModal(true);
        }, 2000);

        return () => clearTimeout(timer);
    }, [tutor]);

    const handleCloseCompletionModal = () => {
        setShowCompletionModal(false);
    };

    // ── Upcoming sessions (real bookings, same formatting as Bookings page) ──
    const { myBookingsAsTutor, isLoading: bookingsLoading } = useGetMyBookingsAsTutor();
    const myBookings = Array.isArray(myBookingsAsTutor?.data) ? myBookingsAsTutor.data : [];

    const upcomingSessions = useMemo(() => {
        return myBookings
            .filter((booking: any) => normalizeStatus(booking.status) === "upcoming")
            .sort((a: any, b: any) => {
                const dateA = new Date(`${a.scheduled_date}T${a.start_time || "00:00"}`).getTime();
                const dateB = new Date(`${b.scheduled_date}T${b.start_time || "00:00"}`).getTime();
                return dateA - dateB;
            })
            .slice(0, MAX_UPCOMING_SESSIONS)
            .map((booking: any) => ({
                id: booking.id,
                name: booking.student?.full_name || booking.student?.first_name || "Student",
                subject: booking.subject || "No subject provided",
                date: formatDisplayDate(booking.scheduled_date),
                time: `${formatDisplayTime(booking.start_time)}${booking.end_time ? ` - ${formatDisplayTime(booking.end_time)}` : ""}`,
                type: formatSessionType(booking.session_type),
                image: booking.student?.profile_image,
                sessionLink: booking.session_link || "",
            }));
    }, [myBookings]);

    // ── Session action modal (Join Meeting / View Session Page) ──────
    const [activeSession, setActiveSession] = useState<{ id: string | number; sessionLink?: string } | null>(null);

    const openSessionModal = (session: { id: string | number; sessionLink?: string }) => {
        setActiveSession(session);
    };

    const closeSessionModal = () => {
        setActiveSession(null);
    };

    const stats = [
        {
            id: 1,
            label: "Upcoming Sessions",
            value: tutorStatsData?.upcoming_sessions,
            trendColor: "text-green-600",
            icon: FiCalendar,
        },
        {
            id: 2,
            label: "Pending Requests",
            value: tutorStatsData?.pending_requests,
            trendColor: "text-red-500",
            icon: FiUsers,
        },
        {
            id: 3,
            label: "Completed Sessions",
            value: tutorStatsData?.completed_sessions,
            trendColor: "text-green-600",
            icon: FiCheckCircle,
        },
        {
            id: 4,
            label: "Average Rating",
            value: tutorStatsData?.average_rating,
            trendColor: "text-green-600",
            icon: FiStar,
        },
    ];

    const StatCard = ({ stat }: any) => {
        const Icon = stat.icon;
        return (
            <div className="bg-white rounded-2xl border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                        <Icon size={18} className="text-green-700" />
                    </div>
                    <span className={`text-xs font-semibold ${stat.trendColor}`}>{stat.trend}</span>
                </div>
                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                <p className="text-2xl font-extrabold text-gray-900">{stat.value}</p>
            </div>
        );
    };

    return (
        <div className="md:pl-56 pb-20 lg:pb-8 lg:pt-14 pt-0">
            <LoadingOverlay visible={isLoading || bookingsLoading} />
            <div className="min-h-screen pt-8 bg-gray-50 px-4 sm:px-6 lg:px-8 max-w-7xl m-auto">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 mb-1">Dashboard</h1>
                        <p className="text-gray-600 text-sm">
                            Welcome back, Dr. Aris! Here's what's happening with your students today.
                        </p>
                    </div>
                </div>

                {/* Stat Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 lg:gap-4 gap-2 mb-8">
                    {stats.map((stat) => (
                        <StatCard key={stat.id} stat={stat} />
                    ))}
                </div>

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column */}
                    <div className="lg:col-span-2 flex flex-col gap-6">
                        {/* Upcoming Sessions */}
                        <div className="bg-white rounded-2xl border border-gray-200">
                            <div className="flex items-center justify-between  pb-4 p-4 ">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">Upcoming Sessions</h3>
                                    <p className="text-sm text-gray-600">
                                        {upcomingSessions.length > 0
                                            ? `Your next ${upcomingSessions.length} scheduled lesson${upcomingSessions.length === 1 ? "" : "s"}`
                                            : "No sessions scheduled yet"}
                                    </p>
                                </div>
                            </div>

                            {upcomingSessions.length > 0 ? (
                                <div className="divide-y divide-gray-100 ">
                                    {upcomingSessions.map((session) => (
                                        <div key={session.id} className="flex bg-neutral-50 mb-4 items-center justify-between gap-4 py-4 px-4 pt-4 flex-wrap">
                                            <div className="flex items-start gap-3 min-w-0">
                                                {session.image ? (
                                                    <img
                                                        src={session.image}
                                                        alt={session.name}
                                                        className="w-11 h-11 rounded-full object-cover shrink-0"
                                                    />
                                                ) : (
                                                    <div className="w-11 h-11 rounded-full bg-gray-600 text-white flex items-center justify-center font-bold shrink-0">
                                                        {getInitials(session.name)}
                                                    </div>
                                                )}
                                                <div className="min-w-0">
                                                    <p className="font-semibold text-gray-900 text-sm">{session.name}</p>
                                                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                                                        <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-[11px] font-medium">
                                                            {session.subject}
                                                        </span>
                                                        <span className="flex items-center gap-1 text-xs text-gray-500">
                                                            <FiClock size={12} />
                                                            {session.time} • {session.date}
                                                        </span>
                                                        <span className="px-2 py-0.5 bg-green-50 text-green-700 rounded text-[11px] font-medium">
                                                            {session.type}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 lg:w-fit w-full">
                                                <button className="flex lg:w-fit w-full items-center justify-center gap-1.5 px-4 py-2.5 border border-gray-300 rounded-full text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all">
                                                    <FiMessageCircle size={14} />
                                                    Message
                                                </button>
                                                <button
                                                    onClick={() => openSessionModal({ id: session.id, sessionLink: session.sessionLink })}
                                                    className="px-4 lg:w-fit w-full py-2.5 bg-green-700 text-white rounded-full text-sm font-semibold hover:bg-green-800 transition-all"
                                                >
                                                    View Session
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-10">
                                    <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                                        <FiCalendar size={22} className="text-gray-400" />
                                    </div>
                                    <p className="text-sm font-semibold text-gray-900 mb-1">No upcoming sessions</p>
                                    <p className="text-sm text-gray-500">Accepted bookings will show up here.</p>
                                </div>
                            )}

                            {upcomingSessions.length > 0 && (
                                <Link
                                    to="/tutor/dashboard/schedule"
                                    className="block w-full pb-6 text-center text-sm font-semibold text-gray-500 hover:text-gray-700 pt-4 mt-2 border-t border-gray-100"
                                >
                                    View Bookings
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="flex flex-col gap-6 lg:mb-0 mb-5">
                        {/* Profile Status */}
                        <div className="bg-white rounded-2xl border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="font-bold text-gray-900">Profile Status</h3>
                                <span className="text-xs font-semibold text-gray-500">{profileCompletionPercent}% Complete</span>
                            </div>

                            <div className="w-full h-2 bg-gray-100 rounded-full mb-4 overflow-hidden">
                                <div
                                    className="h-full bg-green-600 rounded-full transition-all"
                                    style={{ width: `${profileCompletionPercent}%` }}
                                />
                            </div>

                            <p className="text-sm text-gray-600 mb-4">
                                {profileCompletionPercent >= 100 ? (
                                    <>Your profile is <span className="font-bold text-gray-900">fully complete</span>. Nice work!</>
                                ) : (
                                    <>You're almost a <span className="font-bold text-gray-900">Verified Pro</span>! Complete
                                        the remaining steps to boost your visibility.</>
                                )}
                            </p>

                            <div className="flex flex-col gap-3 mb-5 max-h-56 overflow-y-auto pr-1">
                                {profileChecklist.map((step) => (
                                    <div key={step.key} className="flex items-center gap-2">
                                        {step.done ? (
                                            <FiCheckCircle size={16} className="text-green-700 shrink-0" />
                                        ) : (
                                            <span className="w-4 h-4 rounded-full border-2 border-dashed border-gray-300 shrink-0" />
                                        )}
                                        <span className={`text-sm ${step.done ? "text-gray-700" : "text-gray-500"}`}>
                                            {step.label}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {profileCompletionPercent < 100 && (
                                <Link
                                    to={missingFields[0]?.route || TUTOR_PROFILE_ROUTE}
                                    className="w-full flex items-center justify-center py-3 bg-gray-900 text-white rounded-full font-semibold text-sm hover:bg-gray-800 transition-all"
                                >
                                    Complete Profile
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Profile completion modal */}
            {showCompletionModal && (
                <ProfileCompletionModal
                    missingFields={missingFields}
                    onClose={handleCloseCompletionModal}
                />
            )}

            {/* Session action modal: Join Meeting / View Session Page */}
            <SessionActionModal
                open={!!activeSession}
                onClose={closeSessionModal}
                sessionId={activeSession?.id || ""}
                sessionLink={activeSession?.sessionLink}
            />
        </div>
    );
};

export default TutorOverview;