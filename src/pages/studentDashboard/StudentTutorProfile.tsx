import { useState } from "react";
import { FaStar } from "react-icons/fa";
import {
    FiAward,
    FiBook,
    FiCalendar,
    FiCheckCircle,
    FiClock,
    FiFlag,
    FiMapPin,
    FiMessageSquare,
    FiSend,
    FiX,
} from "react-icons/fi";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import LoadingOverlay from "../../components/LoadingOverlay";
import TutorsBanner from "../../components/TutorsBanner";
import { useMakeBookings, useStartUserChat } from "../../hooks/mutations/allMutation";
import { useGetSingleTutor } from "../../hooks/queries/allQueries";



interface BookingDetails {
    subject: string;
    customSubject: string;
    notes: string;
}

interface AvailabilitySlot {
    id: number;
    day_of_week: string;
    start_time: string; // "HH:MM:SS"
    end_time: string;   // "HH:MM:SS"
    is_booked: boolean;
}

type SessionType = "online" | "onsite";

const SUBJECT_OPTIONS = ["English", "Maths", "Product Design", "Marketing", "Other"];

// Order days Mon -> Sun so the schedule reads naturally regardless of API order
const DAY_ORDER = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

/* ─── Helpers ─────────────────────────────────────────────────────────── */
const formatTime = (time: string) => {
    if (!time) return "";
    const [hStr, mStr] = time.split(":");
    let hours = parseInt(hStr, 10);
    const minutes = mStr ?? "00";
    const period = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    if (hours === 0) hours = 12;
    return `${hours}:${minutes} ${period}`;
};

const groupSlotsByDay = (slots: AvailabilitySlot[]) => {
    const grouped: Record<string, AvailabilitySlot[]> = {};
    slots.forEach((slot) => {
        if (!grouped[slot.day_of_week]) grouped[slot.day_of_week] = [];
        grouped[slot.day_of_week].push(slot);
    });

    // Sort each day's slots by start time
    Object.values(grouped).forEach((daySlots) =>
        daySlots.sort((a, b) => a.start_time.localeCompare(b.start_time))
    );

    // Return days in Mon -> Sun order, only including days the tutor actually has slots for
    return DAY_ORDER.filter((day) => grouped[day]).map((day) => ({
        day,
        slots: grouped[day],
    }));
};

/* ─── Start Chat Modal ───────────────────────────────────────────────── */
const StartChatModal = ({
    onClose,
    onSubmit,
    isSubmitting,
    submitError,
    tutorName,
}: {
    onClose: () => void;
    onSubmit: (message: string) => void;
    isSubmitting: boolean;
    submitError: string | null;
    tutorName: string;
}) => {
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = () => {
        if (!message.trim()) {
            setError("Please write a message before sending");
            return;
        }
        setError("");
        onSubmit(message.trim());
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={isSubmitting ? undefined : onClose} />

            <div className="relative bg-white rounded-2xl border border-gray-200 shadow-xl max-w-md w-full p-6 sm:p-7">
                <button
                    onClick={onClose}
                    disabled={isSubmitting}
                    className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-600 rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                    <FiX size={16} />
                </button>

                <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center mb-4">
                    <FiMessageSquare size={20} className="text-green-700" />
                </div>

                <h3 className="text-lg font-extrabold text-gray-900 mb-1.5">
                    Message {tutorName}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-5">
                    Send an opening message to start the conversation. You'll be able to keep chatting once it's sent.
                </p>

                <div className="mb-6">
                    <textarea
                        value={message}
                        onChange={(e) => {
                            setMessage(e.target.value);
                            if (error) setError("");
                        }}
                        placeholder={`Hi ${tutorName}, I'd like to ask about...`}
                        rows={4}
                        autoFocus
                        className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400 resize-none"
                    />
                    {error && <p className="text-xs text-red-500 font-medium mt-2">{error}</p>}
                    {submitError && <p className="text-xs text-red-500 font-medium mt-2">{submitError}</p>}
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="flex-1 py-3.5 border border-gray-200 rounded-full text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="flex-1 py-3.5 bg-green-700 text-white rounded-full text-sm font-semibold hover:bg-green-800 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? "Sending..." : (
                            <>
                                <FiSend size={14} />
                                Send Message
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

/* ─── Chat Started Success Modal ─────────────────────────────────────── */
const ChatSuccessModal = ({
    onClose,
    onViewMessage,
    tutorName,
}: {
    onClose: () => void;
    onViewMessage: () => void;
    tutorName: string;
}) => (
    <div className="fixed inset-0 z-60 flex items-center justify-center px-4">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
        <div className="relative bg-white rounded-2xl border border-gray-200 shadow-xl max-w-md w-full p-6 sm:p-7 text-center">
            <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiCheckCircle className="text-green-700" size={28} />
            </div>
            <h3 className="text-lg font-extrabold text-gray-900 mb-2">Message Sent</h3>
            <p className="text-sm text-gray-600 mb-6">
                Your message to {tutorName} has been sent. You'll be notified when they reply.
            </p>
            <div className="flex items-center gap-2">
                <button
                    onClick={onClose}
                    className="flex-1 py-3.5 border border-gray-200 rounded-full text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all"
                >
                    Close
                </button>
                <button
                    onClick={onViewMessage}
                    className="flex-1 py-3.5 bg-green-700 text-white rounded-full text-sm font-semibold hover:bg-green-800 transition-all"
                >
                    View Message
                </button>
            </div>
        </div>
    </div>
);

/* ─── Booking Details Modal ──────────────────────────────────────────── */
const BookingDetailsModal = ({
    onClose,
    onSubmit,
    isSubmitting,
    submitError,
}: {
    onClose: () => void;
    onSubmit: (details: BookingDetails) => void;
    isSubmitting: boolean;
    submitError: string | null;
}) => {
    const [subject, setSubject] = useState("");
    const [customSubject, setCustomSubject] = useState("");
    const [notes, setNotes] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = () => {
        if (!subject) {
            setError("Please select a subject");
            return;
        }
        if (subject === "Other" && !customSubject.trim()) {
            setError("Please tell us the subject");
            return;
        }
        setError("");
        onSubmit({ subject, customSubject, notes });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={isSubmitting ? undefined : onClose} />

            <div className="relative bg-white rounded-2xl border border-gray-200 shadow-xl max-w-md w-full p-6 sm:p-7 max-h-[90vh] overflow-y-auto">
                <button
                    onClick={onClose}
                    disabled={isSubmitting}
                    className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-600 rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                    <FiX size={16} />
                </button>

                <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center mb-4">
                    <FiCalendar size={22} className="text-green-700" />
                </div>

                <h3 className="text-lg font-extrabold text-gray-900 mb-1.5">
                    Session Details
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-5">
                    Tell your mentor a bit about what you'd like to cover so they can prepare.
                </p>

                <div className="flex flex-col gap-5 mb-6">
                    {/* Subject Tabs */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-800 mb-2">Subject</label>
                        <div className="flex flex-wrap gap-2">
                            {SUBJECT_OPTIONS.map((option) => (
                                <button
                                    key={option}
                                    type="button"
                                    onClick={() => {
                                        setSubject(option);
                                        setError("");
                                    }}
                                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${subject === option
                                        ? "bg-green-700 text-white border-green-700"
                                        : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-green-50 hover:border-green-200"
                                        }`}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>

                        {subject === "Other" && (
                            <input
                                type="text"
                                value={customSubject}
                                onChange={(e) => setCustomSubject(e.target.value)}
                                placeholder="Please specify the subject"
                                className="mt-3 w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400"
                            />
                        )}
                    </div>

                    {/* Notes */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-800 mb-2">Notes</label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Talk more about what you need"
                            rows={4}
                            className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400 resize-none"
                        />
                    </div>

                    {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
                    {submitError && <p className="text-xs text-red-500 font-medium">{submitError}</p>}
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="flex-1 py-3.5 border border-gray-200 rounded-full text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="flex-1 py-3.5 bg-green-700 text-white rounded-full text-sm font-semibold hover:bg-green-800 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? "Booking..." : "Continue"}
                    </button>
                </div>
            </div>
        </div>
    );
};

const BookingSuccessModal = ({
    onClose,
    tutorName,
    selectedSlot,
    bookingDetails,
}: {
    onClose: () => void;
    tutorName: string;
    selectedSlot: AvailabilitySlot | null;
    bookingDetails: BookingDetails | null;
}) => (
    <div className="fixed inset-0 z-60 flex items-center justify-center px-4">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
        <div className="relative bg-white rounded-2xl border border-gray-200 shadow-xl max-w-md w-full p-6 sm:p-7 text-center">
            <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiCheckCircle className="text-green-700" size={28} />
            </div>
            <h3 className="text-lg font-extrabold text-gray-900 mb-2">Booking Confirmed</h3>
            <p className="text-sm text-gray-600 mb-3">
                Your session with {tutorName} is confirmed for {selectedSlot?.day_of_week} {selectedSlot ? `${formatTime(selectedSlot.start_time)} – ${formatTime(selectedSlot.end_time)}` : "your selected slot"}.
            </p>
            {bookingDetails?.notes && (
                <p className="text-[11px] text-gray-500 mb-5">{bookingDetails.notes}</p>
            )}
            <Link to={'/student/dashboard/bookings'} className="block">
                <button
                    onClick={onClose}
                    className="w-full py-3.5 bg-green-700 text-white rounded-full font-bold text-xs hover:bg-green-800 transition-all"
                >
                    View My Bookings
                </button>
            </Link>
        </div>
    </div>
);

const StudentTutorProfile = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [selectedSlotId, setSelectedSlotId] = useState<number | null>(null);
    const [sessionType, setSessionType] = useState<SessionType | null>(null);
    const [bookingStep, setBookingStep] = useState(1);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);
    const [bookingError, setBookingError] = useState<string | null>(null);
    const [showMessageModal, setShowMessageModal] = useState(false);
    const [chatError, setChatError] = useState<string | null>(null);
    const [showChatSuccessModal, setShowChatSuccessModal] = useState(false);
    const [startedChatId, setStartedChatId] = useState<number | null>(null);
    const { tutorData, isLoading } = useGetSingleTutor(id!);
    const tutor = tutorData?.data || null;

    console.log("Tutor data:", tutor);

    const { mutate: makeBookings, isPending: isMakingBookings } = useMakeBookings();
    const { mutate: startChat, isPending: isStartingChat } = useStartUserChat();

    const StarRating = ({ rating, sessions }: { rating: number; sessions: number }) => (
        <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                    <FaStar key={i} size={10} className={i < Math.round(rating) ? "text-yellow-400" : "text-gray-300"} />
                ))}
            </div>
            <span className="font-bold text-sm text-gray-900">{rating.toFixed(1)}</span>
            <span className="text-xs text-gray-600">
                ({sessions} session{sessions === 1 ? "" : "s"})
            </span>
        </div>
    );

    if (isLoading) {
        return (
            <div className="md:pl-56 pb-20 md:pb-8 flex items-center justify-center min-h-screen">
                <LoadingOverlay visible={isLoading} />
            </div>
        );
    }

    if (!tutor) {
        return (
            <div className="md:pl-56 pb-20 md:pb-8">
                <div className="min-h-screen pt-8 bg-gray-50 flex items-center justify-center">
                    <div className="text-center max-w-sm px-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-2">Mentor not found</h2>
                        <p className="text-sm text-gray-500">
                            We couldn't find a mentor with this profile. They may have been removed or the link is incorrect.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    const initials =
        tutor.full_name
            ?.split(" ")
            .map((n: any) => n[0])
            .join("")
            .slice(0, 2)
            .toUpperCase() || "?";

    const rating = Number(tutor.average_rating) || 0;
    const rate = Number(tutor.hourly_rate) || 0;
    const totalSessions = tutor.total_sessions ?? 0;

    // Combine subjects + skills for "Areas of Expertise", de-duplicated
    const expertise = Array.from(new Set([...(tutor.skills || [])]));
    const subjects = Array.from(new Set([...(tutor.subjects || [])]));

    const experience = tutor.experience || [];
    const education = tutor.education || [];
    const languages = tutor.language ? [tutor.language] : [];

    const isOnline = tutor.session_status === "online" || tutor.session_status === "both";
    const isOnsite = tutor.session_status === "onsite" || tutor.session_status === "both";

    const firstName = tutor.full_name?.split(" ")[0] || "this mentor";

    // Real availability set by the tutor, grouped and sorted by day
    const availabilitySlots: AvailabilitySlot[] = tutor.availability_slots || [];
    const groupedAvailability = groupSlotsByDay(availabilitySlots);
    const selectedSlot = availabilitySlots.find((s) => s.id === selectedSlotId) || null;

    const handleDetailsSubmit = (details: BookingDetails) => {
        if (!selectedSlot || !sessionType) return;

        const payload = {
            tutor_profile: tutor.id,
            availability_slot: selectedSlot.id,
            subject: details.subject === "Other" ? details.customSubject.trim() : details.subject,
            session_type: sessionType,
            notes: details.notes.trim(),
        };

        setBookingError(null);

        makeBookings(payload, {
            onSuccess: (res: any) => {
                setBookingDetails(details);
                setShowDetailsModal(false);
                setShowSuccessModal(true);
                setBookingStep(2);
                toast(`Your session with ${firstName} has been booked successfully!`, { type: "success" });
                console.log("Booking successful:", res);
            },
            onError: (err: any) => {
                setBookingError(
                    err?.response?.data?.message ||
                    err?.message ||
                    "Something went wrong while booking this session. Please try again."
                );
            },
        });
    };

    // NOTE: /chat/start/ expects the tutor's USER id, not the tutor_profile id used
    // for bookings above. If `tutor.user` (or similar) isn't present on this payload,
    // swap `tutor.id` below for whatever field your useGetSingleTutor response exposes
    // for the underlying user account.
    const handleStartChat = (message: string) => {
        setChatError(null);

        startChat(
            { tutor_id: tutor.user ?? tutor.id, message },
            {
                onSuccess: (res: any) => {
                    setShowMessageModal(false);
                    setStartedChatId(res?.id ?? res?.data?.id ?? null);
                    setShowChatSuccessModal(true);
                },
                onError: (err: any) => {
                    setChatError(
                        err?.response?.data?.message ||
                        err?.message ||
                        "Something went wrong while starting this chat. Please try again."
                    );
                },
            }
        );
    };

    return (
        <div className="md:pl-56 pb-20 md:pb-8">
            <ToastContainer />
            <div className="min-h-screen pt-8 bg-gray-50">
                <div className="px-4 sm:px-6 lg:px-8 max-w-7xl m-auto py-8 text-sm">

                    {/* Breadcrumb */}
                    <div className="text-xs text-gray-600 mb-6">
                        <a href="/tutors" className="hover:text-green-700">Find Tutors</a>
                        {expertise[0] && (
                            <>
                                <span className="mx-2">/</span>
                                <a href="/tutors" className="hover:text-green-700">{expertise[0]}</a>
                            </>
                        )}
                        <span className="mx-2">/</span>
                        <span className="text-gray-900 font-semibold">{tutor.full_name}</span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

                        {/* ── Left Column ── */}
                        <div className="lg:col-span-3 space-y-4">

                            {/* Profile Header Card — matches TutorCard design */}
                            <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden">
                                {tutor.banner ? (
                                    <img
                                        src={tutor.banner}
                                        alt={`${tutor.full_name} banner`}
                                        className="h-26 w-full object-cover"
                                    />
                                ) : (
                                    <TutorsBanner seed={tutor.id} className="h-26 w-full" />
                                )}

                                <div className="p-6 pt-0">
                                    <div className="flex items-start justify-between gap-4 mb-2 relative -mt-8">
                                        {/* Avatar */}
                                        <div className="relative">
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
                                            {tutor.is_verified && (
                                                <div className="absolute -top-1.5 -right-1.5 bg-green-600 rounded-full p-1">
                                                    <FiCheckCircle className="text-white" size={12} />
                                                </div>
                                            )}
                                        </div>

                                        <button className="p-3 text-gray-500 bg-white rounded-full mt-2 shadow-sm hover:bg-red-50 hover:text-red-500 transition-all">
                                            <FiFlag size={18} />
                                        </button>
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <h1 className="text-lg font-bold text-gray-900">{tutor.full_name}</h1>
                                        <p className="text-xs text-gray-600 mb-2">{tutor.professional_title || "Mentor"}</p>

                                        <StarRating rating={rating} sessions={totalSessions} />

                                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 mb-4">
                                            {tutor.location && (
                                                <span className="flex items-center gap-1 text-xs text-gray-600">
                                                    <FiMapPin size={12} className="text-green-700" />
                                                    {tutor.location}
                                                </span>
                                            )}
                                            {languages.length > 0 && (
                                                <span className="flex items-center gap-1 text-xs text-gray-600">
                                                    <FiBook size={12} className="text-green-700" />
                                                    {languages.join(", ")}
                                                </span>
                                            )}
                                        </div>

                                        {/* Session type badges */}
                                        <div className="flex gap-2 mb-4">
                                            {isOnline && (
                                                <span className="px-2 py-1 bg-green-50 text-green-700 rounded text-xs font-semibold">Online</span>
                                            )}
                                            {isOnsite && (
                                                <span className="px-2 py-1 bg-orange-50 text-orange-700 rounded text-xs font-semibold">Onsite</span>
                                            )}
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => setShowMessageModal(true)}
                                                className="px-4 py-3 bg-green-700 text-white rounded-full font-semibold text-sm flex items-center justify-center gap-2 hover:bg-green-800 transition-all"
                                            >
                                                <FiMessageSquare size={14} />
                                                Message {firstName}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* About */}
                            {tutor.bio && (
                                <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6">
                                    <h2 className="font-bold text-gray-900 mb-3">About {firstName}</h2>
                                    <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-line">{tutor.bio}</p>
                                </div>
                            )}

                            {/* Expertise */}
                            {expertise.length > 0 && (
                                <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6">
                                    <h3 className="font-bold text-gray-900 mb-3">Areas of Expertise</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {expertise.map((skill, idx) => (
                                            <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 font-semibold rounded-full text-[10px]">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {subjects.length > 0 && (
                                <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6">
                                    <h3 className="font-bold text-gray-900 mb-3">Subjects</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {subjects.map((subject, idx) => (
                                            <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 font-semibold rounded-full text-[10px]">
                                                {subject}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Experience & Education */}
                            {(experience.length > 0 || education.length > 0) && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6">
                                        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                            <FiAward size={14} className="text-green-700" />
                                            Experience
                                        </h3>
                                        {experience.length > 0 ? (
                                            <div className="space-y-4">
                                                {experience.map((exp: any, idx: number) => (
                                                    <div key={idx}>
                                                        <h4 className="font-semibold text-xs text-gray-900">{exp.role}</h4>
                                                        <p className="text-[10px] text-green-700">{exp.org}{exp.period ? ` • ${exp.period}` : ""}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-xs text-gray-400 italic">No experience added yet</p>
                                        )}
                                    </div>

                                    <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6">
                                        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                            <FiBook size={14} className="text-green-700" />
                                            Education
                                        </h3>
                                        {education.length > 0 ? (
                                            <div className="space-y-4">
                                                {education.map((edu: any, idx: number) => (
                                                    <div key={idx}>
                                                        <h4 className="font-semibold text-xs text-gray-900">{edu.degree}</h4>
                                                        <p className="text-[10px] text-green-700">{edu.school}{edu.year ? ` • ${edu.year}` : ""}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-xs text-gray-400 italic">No education added yet</p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Weekly Availability — shows the schedule the tutor actually set */}
                            <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6">
                                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <FiClock size={14} className="text-green-700" />
                                    Weekly Availability
                                </h3>
                                {groupedAvailability.length > 0 ? (
                                    <div className="space-y-3">
                                        {groupedAvailability.map(({ day, slots }) => (
                                            <div key={day} className="flex items-start gap-3">
                                                <span className="w-20 shrink-0 text-xs font-semibold text-gray-900 pt-1">{day}</span>
                                                <div className="flex flex-wrap gap-2">
                                                    {slots.map((slot) => (
                                                        <span
                                                            key={slot.id}
                                                            className={`px-2.5 py-1 rounded-full text-[10px] font-semibold border ${slot.is_booked
                                                                ? "bg-gray-50 text-gray-400 border-gray-200 line-through"
                                                                : "bg-green-50 text-green-700 border-green-200"
                                                                }`}
                                                        >
                                                            {formatTime(slot.start_time)} – {formatTime(slot.end_time)}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-xs text-gray-400 italic">No availability has been set yet</p>
                                )}
                            </div>

                            {/* Reviews — no reviews endpoint yet, so show an honest empty state */}
                            <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-bold text-gray-900">Student Reviews</h3>
                                    <StarRating rating={rating} sessions={totalSessions} />
                                </div>
                                <p className="text-xs text-gray-500 text-center py-6">
                                    No reviews yet. Be the first to leave one after a session with {firstName}!
                                </p>
                            </div>
                        </div>

                        {/* ── Right Column — Booking ── */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 sticky top-8">
                                <h3 className="font-bold text-gray-900 mb-1">Book a Session</h3>
                                <p className="text-green-700 font-bold text-lg mb-4">
                                    ${rate.toFixed(2)}<span className="text-xs text-gray-600 font-normal">/hr</span>
                                </p>

                                {bookingStep === 1 && (
                                    <>
                                        {/* Session Type */}
                                        <div className="mb-4">
                                            <label className="block text-xs font-semibold text-gray-800 mb-2">Session Type</label>
                                            <div className="flex gap-2">
                                                {(["Online", "On-site"] as const).map((type) => {
                                                    const value: SessionType = type === "Online" ? "online" : "onsite";
                                                    const active = value === "online" ? isOnline : isOnsite;
                                                    const isSelected = sessionType === value;
                                                    return (
                                                        <button
                                                            key={type}
                                                            type="button"
                                                            disabled={!active}
                                                            onClick={() => active && setSessionType(value)}
                                                            className={`flex-1 px-3 py-2 rounded-lg font-semibold text-xs border transition-all ${!active
                                                                ? "bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed"
                                                                : isSelected
                                                                    ? "bg-green-700 text-white border-green-700"
                                                                    : "bg-green-50 text-green-700 border-green-300 hover:border-green-500"
                                                                }`}
                                                        >
                                                            {type}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        {/* Availability — pick from the slots the tutor actually set, radio-style */}
                                        <div className="mb-4">
                                            <label className="block text-xs font-semibold text-gray-800 mb-2">
                                                Select Availability
                                            </label>

                                            {groupedAvailability.length > 0 ? (
                                                <div
                                                    role="radiogroup"
                                                    aria-label="Select an availability slot"
                                                    className="space-y-3 max-h-72 overflow-y-auto pr-1"
                                                >
                                                    {groupedAvailability.map(({ day, slots }) => (
                                                        <div key={day}>
                                                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                                                                {day}
                                                            </p>
                                                            <div className="flex flex-col gap-1.5">
                                                                {slots.map((slot) => {
                                                                    const isSelected = selectedSlotId === slot.id;
                                                                    return (
                                                                        <button
                                                                            key={slot.id}
                                                                            type="button"
                                                                            role="radio"
                                                                            aria-checked={isSelected}
                                                                            disabled={slot.is_booked}
                                                                            onClick={() => setSelectedSlotId(slot.id)}
                                                                            className={`w-full flex items-center gap-2.5 py-2 px-2.5 rounded-lg text-[10px] font-semibold border transition-all text-left ${slot.is_booked
                                                                                ? "bg-gray-50 text-gray-300 border-gray-200 cursor-not-allowed"
                                                                                : isSelected
                                                                                    ? "bg-green-50 text-green-700 border-green-700"
                                                                                    : "bg-gray-50 text-gray-700 border-gray-400 hover:bg-green-50 hover:border-green-700"
                                                                                }`}
                                                                        >
                                                                            {/* Radio circle */}
                                                                            <span
                                                                                className={`shrink-0 w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-all ${slot.is_booked
                                                                                    ? "border-gray-200"
                                                                                    : isSelected
                                                                                        ? "border-green-700"
                                                                                        : "border-gray-500 border"
                                                                                    }`}
                                                                            >
                                                                                {isSelected && !slot.is_booked && (
                                                                                    <span className="w-1.5 h-1.5 rounded-full bg-green-700" />
                                                                                )}
                                                                            </span>

                                                                            <span className={slot.is_booked ? "line-through" : ""}>
                                                                                {formatTime(slot.start_time)} – {formatTime(slot.end_time)}
                                                                            </span>
                                                                        </button>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-xs text-gray-400 italic">
                                                    This mentor hasn't set any availability yet
                                                </p>
                                            )}
                                        </div>

                                        {/* Fee Summary */}
                                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-4 space-y-1.5">
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs font-semibold text-gray-900">Session Fee (1hr)</span>
                                                <span className="text-xs text-gray-700">${rate.toFixed(2)}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs font-semibold text-gray-900">Service Fee</span>
                                                <span className="text-xs text-gray-700">$2.50</span>
                                            </div>
                                            <div className="border-t border-gray-200 pt-1.5 flex items-center justify-between">
                                                <span className="text-xs font-bold text-gray-900">Total</span>
                                                <span className="text-xs font-bold text-gray-900">${(rate + 2.5).toFixed(2)}</span>
                                            </div>
                                        </div>

                                        {bookingError && (
                                            <p className="text-[10px] text-red-500 font-medium text-center mb-3">{bookingError}</p>
                                        )}

                                        <button
                                            onClick={() => setShowDetailsModal(true)}
                                            disabled={!selectedSlot || !sessionType}
                                            className={`w-full py-3 rounded-full font-bold text-xs transition-all ${selectedSlot && sessionType
                                                ? "bg-green-700 text-white hover:bg-green-800"
                                                : "bg-gray-200 text-gray-400 cursor-not-allowed"
                                                }`}
                                        >
                                            {!sessionType ? "Select a session type" : !selectedSlot ? "Select a time slot" : "Confirm Booking"}
                                        </button>

                                        <p className="text-[10px] text-gray-500 text-center mt-3">
                                            You won't be charged yet. Cancellation is free up to 24 hours before the session.
                                        </p>
                                    </>
                                )}

                                {bookingStep === 2 && (
                                    <div className="text-center">
                                        <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <FiCheckCircle className="text-green-700" size={28} />
                                        </div>
                                        <h4 className="text-sm font-bold text-gray-900 mb-1">Booking Confirmed!</h4>
                                        <p className="text-xs text-gray-600 mb-2">
                                            Your session with {tutor.full_name} is confirmed for {selectedSlot?.day_of_week}{" "}
                                            {selectedSlot && `${formatTime(selectedSlot.start_time)} – ${formatTime(selectedSlot.end_time)}`}
                                        </p>
                                        {bookingDetails && (
                                            <p className="text-[10px] text-gray-500 mb-5">
                                                {bookingDetails.subject === "Other" ? bookingDetails.customSubject : bookingDetails.subject}
                                                {bookingDetails.notes ? ` • ${bookingDetails.notes}` : ""}
                                            </p>
                                        )}
                                        <button className="w-full py-2.5 bg-green-700 text-white rounded-full font-bold text-xs hover:bg-green-800 transition-all mb-2">
                                            View Confirmation
                                        </button>
                                        <button
                                            onClick={() => {
                                                setBookingStep(1);
                                                setBookingDetails(null);
                                                setSelectedSlotId(null);
                                                setSessionType(null);
                                                setBookingError(null);
                                                setShowSuccessModal(false);
                                            }}
                                            className="w-full py-2.5 border border-gray-300 text-xs font-semibold text-gray-700 rounded-full hover:bg-gray-50 transition-all"
                                        >
                                            Book Another Session
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {showMessageModal && (
                <StartChatModal
                    onClose={() => {
                        if (!isStartingChat) {
                            setShowMessageModal(false);
                            setChatError(null);
                        }
                    }}
                    onSubmit={handleStartChat}
                    isSubmitting={isStartingChat}
                    submitError={chatError}
                    tutorName={firstName}
                />
            )}

            {showChatSuccessModal && (
                <ChatSuccessModal
                    onClose={() => setShowChatSuccessModal(false)}
                    onViewMessage={() => navigate("/student/dashboard/messages", { state: { chatId: startedChatId } })}
                    tutorName={firstName}
                />
            )}

            {showDetailsModal && (
                <BookingDetailsModal
                    onClose={() => {
                        if (!isMakingBookings) setShowDetailsModal(false);
                    }}
                    onSubmit={handleDetailsSubmit}
                    isSubmitting={isMakingBookings}
                    submitError={bookingError}
                />
            )}

            {showSuccessModal && (
                <BookingSuccessModal
                    onClose={() => setShowSuccessModal(false)}
                    tutorName={tutor.full_name}
                    selectedSlot={selectedSlot}
                    bookingDetails={bookingDetails}
                />
            )}
        </div>
    );
};

export default StudentTutorProfile;