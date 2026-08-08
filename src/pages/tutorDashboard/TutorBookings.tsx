import { useState } from "react";
import {
    FiArrowRight,
    FiCalendar,
    FiClock,
    FiExternalLink,
    FiMapPin,
    FiMessageCircle,
    FiSearch,
    FiUser,
    FiVideo,
    FiX,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import LoadingOverlay from "../../components/LoadingOverlay";
import { TUTOR_SESSION_ROUTE } from "../../components/SessionActionModal";
import { useAcceptOrDeclineBooking } from "../../hooks/mutations/allMutation";
import { useGetMyBookingsAsTutor } from "../../hooks/queries/allQueries";
import {
    formatDisplayDate,
    formatDisplayTime,
    formatSessionType,
    getInitials,
    normalizeStatus,
} from "../../utils/bookingHelpers";

const TutorBookings = () => {
    const [activeTab, setActiveTab] = useState<"upcoming" | "pending" | "completed" | "cancelled">("upcoming");
    const [responseModalOpen, setResponseModalOpen] = useState(false);
    const [responseAction, setResponseAction] = useState<"accept" | "decline" | null>(null);
    const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
    const [responseNote, setResponseNote] = useState("");
    const [responseError, setResponseError] = useState("");
    const [sessionDetailsOpen, setSessionDetailsOpen] = useState(false);
    const [selectedSession, setSelectedSession] = useState<any | null>(null);

    const { myBookingsAsTutor, isLoading } = useGetMyBookingsAsTutor();
    const myBookings = Array.isArray(myBookingsAsTutor?.data) ? myBookingsAsTutor.data : [];
    const { mutate: respondToBooking, isPending } = useAcceptOrDeclineBooking(selectedBookingId || "");

    const bookings = myBookings.map((booking: any) => ({
        id: booking.id,
        status: normalizeStatus(booking.status),
        student: booking.student?.full_name || booking.student?.first_name,
        studentNameForAvatar: booking.student?.full_name || booking.student?.first_name || "Student",
        studentEmail: booking.student?.email,
        studentId: booking.student?.id,
        subject: booking.subject || "No subject provided",
        date: formatDisplayDate(booking.scheduled_date),
        time: `${formatDisplayTime(booking.start_time)}${booking.end_time ? ` - ${formatDisplayTime(booking.end_time)}` : ""}`,
        type: formatSessionType(booking.session_type),
        notes: booking.notes || booking.tutor_response_note || "No notes provided yet.",
        sessionLink: booking.session_link || "",
        locationAddress: booking.location_address || "",
        startTime: formatDisplayTime(booking.start_time),
        endTime: booking.end_time ? formatDisplayTime(booking.end_time) : "",
        price: booking.total_amount ?? booking.price ?? 0,
        image: booking.student?.profile_image,
        raw: booking,
    }));

    const tabCounts = {
        upcoming: bookings.filter((booking: any) => booking.status === "upcoming").length,
        pending: bookings.filter((booking: any) => booking.status === "pending").length,
        completed: bookings.filter((booking: any) => booking.status === "completed").length,
        cancelled: bookings.filter((booking: any) => booking.status === "cancelled").length,
    };

    const tabs = [
        { id: "upcoming", label: "Upcoming", count: tabCounts.upcoming },
        { id: "pending", label: "Pending", count: tabCounts.pending },
        { id: "completed", label: "Completed", count: tabCounts.completed },
        { id: "cancelled", label: "Cancelled", count: tabCounts.cancelled },
    ] as const;

    const filteredBookings = bookings.filter((booking: any) => booking.status === activeTab);

    const statusBadge: Record<string, string> = {
        upcoming: "bg-green-50 text-green-700",
        pending: "bg-amber-50 text-amber-700",
        completed: "bg-gray-100 text-gray-700",
        cancelled: "bg-red-50 text-red-700",
    };

    const openResponseModal = (bookingId: string | number, action: "accept" | "decline") => {
        setSelectedBookingId(String(bookingId));
        setResponseAction(action);
        setResponseNote("");
        setResponseError("");
        setResponseModalOpen(true);
    };

    const openSessionDetails = (booking: any) => {
        setSelectedSession(booking);
        setSessionDetailsOpen(true);
    };

    const handleRespondToBooking = () => {
        if (!selectedBookingId || !responseAction) return;

        const trimmedNote = responseNote.trim();
        if (!trimmedNote) {
            setResponseError("Please add a short response note.");
            return;
        }

        respondToBooking(
            {
                status: responseAction === "accept" ? "accepted" : "declined",
                tutor_response_note: trimmedNote,
            },
            {
                onSuccess: () => {
                    setResponseModalOpen(false);
                    setSelectedBookingId(null);
                    setResponseAction(null);
                    setResponseNote("");
                    setResponseError("");
                    toast("Action Successfully!", { type: "success" });
                },
            }
        );
    };

    const handleBeginSession = () => {
        if (!selectedSession?.sessionLink) {
            toast("No session link is available yet.", { type: "info" });
            return;
        }

        window.open(selectedSession.sessionLink, "_blank", "noopener,noreferrer");
    };

    const BookingCard = ({ booking }: { booking: any }) => (
        <div className="bg-white rounded-2xl border border-gray-200 p-3 sm:p-5 overflow-hidden">
            <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                    {booking.image ? (
                        <img
                            src={booking.image}
                            alt={booking.student}
                            className="w-11 h-11 sm:w-12 sm:h-12 rounded-full object-cover shrink-0"
                        />
                    ) : (
                        <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gray-600 text-white flex items-center justify-center font-bold shrink-0">
                            {getInitials(booking.studentNameForAvatar || booking.student)}
                        </div>
                    )}
                    <div className="min-w-0 flex-1">
                        <p className="font-bold text-gray-900 text-sm truncate">{booking.student}</p>
                        <p className="text-xs text-gray-600 wrap-break-word">{booking.subject}</p>
                    </div>
                </div>

                <span className={`shrink-0 px-3 py-1 rounded-full text-xs font-semibold capitalize ${statusBadge[booking.status]}`}>
                    {booking.status}
                </span>
            </div>

            <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-gray-100 text-xs text-gray-600">
                <div className="flex flex-wrap items-center gap-2">
                    <span className="flex items-center gap-1.5 min-w-0">
                        <FiCalendar size={13} />
                        <span className="truncate">{booking.date}</span>
                    </span>
                    <span className="flex items-center gap-1.5 min-w-0">
                        <FiClock size={13} />
                        <span className="truncate">{booking.time}</span>
                    </span>
                </div>
                <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="px-2 py-1 bg-gray-100 rounded text-[11px] font-semibold text-gray-700">
                        {booking.type}
                    </span>
                    <span className="font-bold text-gray-900 text-sm">{booking.price ? `$${booking.price}` : "Price TBD"}</span>
                </div>
            </div>

            {booking.notes && (
                <div className="mt-3 rounded-xl bg-gray-50 p-3 text-xs text-gray-600 wrap-break-word">
                    <p className="font-semibold text-gray-700 mb-1">Notes</p>
                    <p>{booking.notes}</p>
                </div>
            )}

            <div className="flex flex-col gap-2 mt-4">
                {booking.status === "pending" && (
                    <>
                        <button
                            onClick={() => openResponseModal(booking.id, "accept")}
                            className="w-full flex items-center justify-center gap-1.5 px-4 py-3.5 bg-green-700 text-white rounded-full text-xs font-semibold hover:bg-green-800 transition-all"
                        >
                            Accept
                        </button>
                        <button
                            onClick={() => openResponseModal(booking.id, "decline")}
                            className="w-full flex items-center justify-center gap-1.5 px-4 py-3.5 border border-gray-300 text-gray-700 rounded-full text-xs font-semibold hover:bg-gray-50 transition-all"
                        >
                            Decline
                        </button>
                    </>
                )}

                {booking.status === "upcoming" && (
                    <div className="flex flex-col sm:flex-row gap-2">
                        <button className="flex-1 flex items-center justify-center gap-1.5 px-4 py-3.5 border border-gray-300 text-gray-700 rounded-full text-xs font-semibold hover:bg-gray-50 transition-all">
                            <FiMessageCircle size={14} />
                            Message
                        </button>
                        <button
                            onClick={() => openSessionDetails(booking)}
                            className="flex-1 px-4 py-3.5 bg-green-700 text-white rounded-full text-xs font-semibold hover:bg-green-800 transition-all"
                        >
                            View Session
                        </button>
                    </div>
                )}

                {booking.status === "completed" && (
                    <Link
                        to={TUTOR_SESSION_ROUTE(booking.id)}
                        className="w-full text-center px-4 py-3.5 border-2 border-green-700 text-green-700 rounded-full text-xs font-semibold hover:bg-green-50 transition-all"
                    >
                        View Summary
                    </Link>
                )}

                {booking.status === "cancelled" && (
                    <Link
                        to={TUTOR_SESSION_ROUTE(booking.id)}
                        className="w-full text-center px-4 py-3.5 border border-gray-300 text-gray-500 rounded-full text-xs font-semibold hover:bg-gray-50 transition-all"
                    >
                        View Details
                    </Link>
                )}
            </div>
        </div>
    );

    return (
        <div className="md:pl-56 pb-20 md:pb-8 lg:pt-20">
            <LoadingOverlay visible={isLoading || isPending} />
            <ToastContainer />
            <div className="min-h-screen pt-8 bg-gray-50 px-4 sm:px-6 lg:px-8 max-w-7xl m-auto">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-1">Bookings</h1>
                        <p className="text-gray-600 text-sm">
                            Manage your session requests and upcoming lessons in one place.
                        </p>
                    </div>
                    <div className="relative w-full sm:w-64 shrink-0">
                        <FiSearch size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by student or subject"
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-full text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-200"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-2 mb-6 overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${activeTab === tab.id
                                ? "bg-green-700 text-white"
                                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                                }`}
                        >
                            {tab.label}
                            <span
                                className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${activeTab === tab.id ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600"
                                    }`}
                            >
                                {tab.count}
                            </span>
                        </button>
                    ))}
                </div>

                {isLoading ? (
                    <div className="bg-white rounded-2xl border border-gray-200 p-8 sm:p-12 text-center text-sm text-gray-500">
                        Loading bookings...
                    </div>
                ) : filteredBookings.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 gap-4">
                        {filteredBookings.map((booking: any) => (
                            <BookingCard key={booking.id} booking={booking} />
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl border border-gray-200 p-8 sm:p-12 text-center">
                        <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                            <FiCalendar size={22} className="text-gray-400" />
                        </div>
                        <h3 className="font-bold text-gray-900 mb-1">No {activeTab} bookings</h3>
                        <p className="text-sm text-gray-500">
                            Bookings in this category will show up here once available.
                        </p>
                    </div>
                )}

                {filteredBookings.length > 0 && (
                    <div className="flex items-center justify-center mt-8">
                        <button className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-700">
                            Load more
                            <FiArrowRight size={14} />
                        </button>
                    </div>
                )}
            </div>

            {sessionDetailsOpen && selectedSession && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSessionDetailsOpen(false)} />
                    <div className="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto overflow-x-hidden mx-2 sm:mx-0">
                        <button
                            onClick={() => setSessionDetailsOpen(false)}
                            className="absolute top-4 right-4 z-10 p-2 text-gray-400 hover:text-gray-600 rounded-full bg-white/80 backdrop-blur"
                        >
                            <FiX size={16} />
                        </button>

                        <div className="bg-green-950 px-4 py-4 text-white">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-4 rounded-full bg-white/20">
                                    <FiVideo size={20} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-extrabold">Session details</h3>
                                    <p className="text-sm text-green-50">Ready to begin your tutoring session</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-2 sm:p-6 space-y-3">
                            <div className="flex items-start justify-between gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4">
                                <div>
                                    <p className="text-sm font-bold text-gray-900">{selectedSession.student}</p>
                                    {selectedSession.studentEmail && <p className="text-xs text-gray-500">{selectedSession.studentEmail}</p>}
                                </div>
                                <p className="rounded-full w-fit bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                                    {selectedSession.type}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="rounded-xl border border-gray-200 p-3">
                                    <div className="flex items-center gap-2 text-gray-600 mb-1">
                                        <FiCalendar size={14} />
                                        <span className="text-xs font-semibold">Date</span>
                                    </div>
                                    <p className="text-sm font-semibold text-gray-900">{selectedSession.date}</p>
                                </div>
                                <div className="rounded-xl border border-gray-200 p-3">
                                    <div className="flex items-center gap-2 text-gray-600 mb-1">
                                        <FiClock size={14} />
                                        <span className="text-xs font-semibold">Time</span>
                                    </div>
                                    <p className="text-sm font-semibold text-gray-900">{selectedSession.time}</p>
                                </div>
                            </div>

                            <div className="rounded-xl border border-gray-200 p-4">
                                <div className="flex items-center gap-2 text-gray-700 mb-2">
                                    <FiUser size={14} />
                                    <p className="text-sm font-semibold">Subject</p>
                                </div>
                                <p className="text-sm text-gray-600 wrap-break-word">{selectedSession.subject}</p>
                            </div>

                            {selectedSession.notes && (
                                <div className="rounded-xl border border-gray-200 p-4">
                                    <div className="flex items-center gap-2 text-gray-700 mb-2">
                                        <FiMessageCircle size={14} />
                                        <p className="text-sm font-semibold">Notes</p>
                                    </div>
                                    <p className="text-sm text-gray-600 wrap-break-word">{selectedSession.notes}</p>
                                </div>
                            )}

                            <div className="rounded-xl border border-gray-200 p-4">
                                <div className="flex items-center gap-2 text-gray-700 mb-2">
                                    <FiMapPin size={14} />
                                    <p className="text-sm font-semibold">Location</p>
                                </div>
                                <p className="text-sm text-gray-600 wrap-break-word">
                                    {selectedSession.locationAddress || "No physical location provided yet."}
                                </p>
                            </div>

                            <div className="rounded-xl border border-gray-200 p-4">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 flex-wrap">
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900">Session link</p>
                                        <p className="text-sm text-gray-500 break-all">
                                            {selectedSession.sessionLink || "No link provided yet."}
                                        </p>
                                    </div>
                                    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                                        <Link
                                            to={TUTOR_SESSION_ROUTE(selectedSession.id)}
                                            onClick={() => setSessionDetailsOpen(false)}
                                            className="inline-flex lg:w-fit w-full text-center justify-center items-center gap-2 rounded-full border border-gray-300 text-gray-700 px-4 py-3.5 text-sm font-semibold hover:bg-gray-50 transition-all"
                                        >
                                            <FiExternalLink size={14} />
                                            View Session Page
                                        </Link>
                                        <button
                                            onClick={handleBeginSession}
                                            className="inline-flex lg:w-fit w-full text-center justify-center items-center gap-2 rounded-full bg-green-700 px-4 py-3.5 text-sm font-semibold text-white hover:bg-green-800 transition-all"
                                        >
                                            <FiVideo size={14} />
                                            Begin Session
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {selectedSession.sessionLink && (
                                <button
                                    onClick={handleBeginSession}
                                    className="flex w-full items-center justify-center gap-2 rounded-full border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700 hover:bg-green-100 transition-all"
                                >
                                    <FiExternalLink size={14} />
                                    Open session link
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {responseModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => !isPending && setResponseModalOpen(false)} />
                    <div className="relative bg-white rounded-2xl border border-gray-200 shadow-xl max-w-md w-full p-6">
                        <button
                            onClick={() => !isPending && setResponseModalOpen(false)}
                            className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-600 rounded-lg transition-all disabled:opacity-40"
                            disabled={isPending}
                        >
                            <FiX size={16} />
                        </button>

                        <h3 className="text-lg font-extrabold text-gray-900 mb-2">
                            {responseAction === "accept" ? "Accept booking" : "Decline booking"}
                        </h3>
                        <p className="text-sm text-gray-500 mb-4">
                            Add a short note for the student before you continue.
                        </p>

                        <textarea
                            value={responseNote}
                            onChange={(e) => {
                                setResponseNote(e.target.value);
                                if (responseError) setResponseError("");
                            }}
                            placeholder="Type a short response note..."
                            rows={4}
                            className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400 resize-none"
                        />

                        {responseError && <p className="mt-2 text-xs text-red-500 font-medium">{responseError}</p>}

                        <div className="flex items-center gap-2 mt-5">
                            <button
                                onClick={() => setResponseModalOpen(false)}
                                disabled={isPending}
                                className="flex-1 py-2.5 border border-gray-200 rounded-full text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all disabled:opacity-40"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleRespondToBooking}
                                disabled={isPending}
                                className="flex-1 py-2.5 bg-green-700 text-white rounded-full text-sm font-semibold hover:bg-green-800 transition-all disabled:opacity-60"
                            >
                                {isPending ? "Submitting..." : responseAction === "accept" ? "Accept" : "Decline"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TutorBookings;