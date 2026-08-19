import { useState } from "react";
import {
    FiArrowLeft,
    FiBookOpen,
    FiCalendar,
    FiCheckCircle,
    FiClock,
    FiDollarSign,
    FiMail,
    FiMapPin,
    FiMessageCircle,
    FiPhone,
    FiSend,
    FiStar,
    FiTag,
    FiVideo,
    FiX,
} from "react-icons/fi";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import LoadingOverlay from "../../components/LoadingOverlay";
import { useCompleteBooking, useStartUserChat } from "../../hooks/mutations/allMutation";
import { useGetBookingById } from "../../hooks/queries/allQueries";
import {
    formatDisplayDate,
    formatDisplayTime,
    formatSessionType,
    getInitials,
    normalizeStatus,
} from "../../utils/bookingHelpers";

const statusStyles: Record<string, { badge: string; dot: string }> = {
    upcoming: { badge: "bg-green-50 text-green-700 ring-green-600/20", dot: "bg-green-500" },
    accepted: { badge: "bg-green-50 text-green-700 ring-green-600/20", dot: "bg-green-500" },
    pending: { badge: "bg-amber-50 text-amber-700 ring-amber-600/20", dot: "bg-amber-500" },
    completed: { badge: "bg-gray-100 text-gray-700 ring-gray-500/20", dot: "bg-gray-500" },
    cancelled: { badge: "bg-red-50 text-red-700 ring-red-600/20", dot: "bg-red-500" },
};

const formatMoney = (value?: string | number | null) => {
    if (value === null || value === undefined || value === "") return null;
    const num = Number(value);
    if (Number.isNaN(num)) return null;
    return `$${num.toFixed(2)}`;
};

const InfoTile = ({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value: React.ReactNode;
}) => (
    <div className="bg-white rounded-2xl border border-gray-200 p-5">
        <div className="flex items-center gap-2 text-gray-500 mb-1.5">
            {icon}
            <span className="text-xs font-semibold uppercase tracking-wide">{label}</span>
        </div>
        <p className="text-sm font-semibold text-gray-900">{value}</p>
    </div>
);

const Pill = ({ children }: { children: React.ReactNode }) => (
    <span className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-medium">
        {children}
    </span>
);

const PersonCard = ({
    role,
    name,
    email,
    phone,
    image,
    subtitle,
    extra,
}: {
    role: string;
    name?: string;
    email?: string;
    phone?: string;
    image?: string | null;
    subtitle?: string;
    extra?: React.ReactNode;
}) => (
    <div className="bg-white rounded-2xl border border-gray-200 p-5">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">{role}</p>
        <div className="flex items-center gap-3">
            {image ? (
                <img src={image} alt={name || role} className="w-14 h-14 rounded-full object-cover shrink-0" />
            ) : (
                <div className="w-14 h-14 rounded-full bg-gray-700 text-white flex items-center justify-center font-bold text-lg shrink-0">
                    {getInitials(name)}
                </div>
            )}
            <div className="min-w-0">
                <p className="font-bold text-gray-900 truncate">{name || "Not provided"}</p>
                {subtitle && <p className="text-xs text-gray-500 truncate">{subtitle}</p>}
            </div>
        </div>
        <div className="mt-4 flex flex-col gap-1.5 text-sm text-gray-600">
            {email && (
                <p className="flex items-center gap-2 truncate">
                    <FiMail size={13} className="text-gray-400 shrink-0" />
                    {email}
                </p>
            )}
            {phone && (
                <p className="flex items-center gap-2 truncate">
                    <FiPhone size={13} className="text-gray-400 shrink-0" />
                    {phone}
                </p>
            )}
            {!email && !phone && <p className="text-gray-400">No contact details on file.</p>}
        </div>
        {extra}
    </div>
);

/* ─── Start Chat Modal (mirrors StudentTutorProfile) ─────────────────── */
const StartChatModal = ({
    onClose,
    onSubmit,
    isSubmitting,
    submitError,
    recipientName,
}: {
    onClose: () => void;
    onSubmit: (message: string) => void;
    isSubmitting: boolean;
    submitError: string | null;
    recipientName: string;
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
                    <FiMessageCircle size={20} className="text-green-700" />
                </div>

                <h3 className="text-lg font-extrabold text-gray-900 mb-1.5">
                    Message {recipientName}
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
                        placeholder={`Hi ${recipientName}, I'd like to ask about...`}
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

const ChatSuccessModal = ({
    onClose,
    onViewMessage,
    recipientName,
}: {
    onClose: () => void;
    onViewMessage: () => void;
    recipientName: string;
}) => (
    <div className="fixed inset-0 z-60 flex items-center justify-center px-4">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
        <div className="relative bg-white rounded-2xl border border-gray-200 shadow-xl max-w-md w-full p-6 sm:p-7 text-center">
            <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiCheckCircle className="text-green-700" size={28} />
            </div>
            <h3 className="text-lg font-extrabold text-gray-900 mb-2">Message Sent</h3>
            <p className="text-sm text-gray-600 mb-6">
                Your message to {recipientName} has been sent. You'll be notified when they reply.
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

const TutorSessionDetails = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const { booking, isLoading } = useGetBookingById(id || "");
    const { mutate: completeBooking, isPending } = useCompleteBooking(id || "");
    const { mutate: startChat, isPending: isStartingChat } = useStartUserChat();

    const [showMessageModal, setShowMessageModal] = useState(false);
    const [chatError, setChatError] = useState<string | null>(null);
    const [showChatSuccessModal, setShowChatSuccessModal] = useState(false);
    const [startedChatId, setStartedChatId] = useState<number | null>(null);

    const session = booking?.data;
    const status = normalizeStatus(session?.status);
    const isFinished = status === "completed" || status === "cancelled";
    const statusStyle = statusStyles[status] || statusStyles.pending;

    const tutor = session?.tutor_profile;
    const student = session?.student;
    const studentFirstName = student?.full_name?.split(" ")[0] || student?.first_name || "this student";

    const handleCompleteSession = () => {
        completeBooking(undefined as any, {
            onSuccess: () => {
                toast("Session marked as completed!", { type: "success" });
            },
        });
    };

    const handleJoinMeeting = () => {
        if (!session?.session_link) {
            toast("No meeting link is available yet.", { type: "info" });
            return;
        }
        window.open(session.session_link, "_blank", "noopener,noreferrer");
    };

    const handleMessageUser = () => {
        if (!student?.id) {
            toast("No student to message yet.", { type: "info" });
            return;
        }
        setChatError(null);
        setShowMessageModal(true);
    };

    // NOTE: /chat/start/ expects the recipient's USER id. If `student.user` (or similar)
    // isn't present on this payload, swap `student.id` below for whatever field your
    // useGetBookingById response exposes for the underlying user account.
    const handleStartChat = (message: string) => {
        setChatError(null);

        startChat(
            { tutor_id: student?.user ?? student?.id, message },
            {
                onSuccess: (res: any) => {
                    setShowMessageModal(false);
                    setStartedChatId(res?.data?.id);
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
        <div className="md:pl-56 pb-20 md:pb-8 lg:pt-20 pt-8">
            <LoadingOverlay visible={isLoading || isPending} />
            <ToastContainer />
            <div className="min-h-screen pt-8 bg-gray-50 px-4 sm:px-6 lg:px-8 max-w-7xl m-auto">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-gray-700 mb-6"
                >
                    <FiArrowLeft size={14} />
                    Back
                </button>

                {!isLoading && !session ? (
                    <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
                        <p className="font-bold text-gray-900 mb-1">Session not found</p>
                        <p className="text-sm text-gray-500">
                            This session may have been removed, or the link you followed is incorrect.
                        </p>
                        <Link
                            to="/tutor/dashboard/bookings"
                            className="inline-block mt-4 text-sm font-semibold text-green-700 hover:text-green-800"
                        >
                            Back to bookings
                        </Link>
                    </div>
                ) : session ? (
                    <>
                        {/* Hero */}
                        <div className="relative overflow-hidden bg-gray-900 rounded-2xl mb-6">
                            {tutor?.banner && (
                                <img
                                    src={tutor.banner}
                                    alt=""
                                    className="absolute inset-0 w-full h-full object-cover opacity-30"
                                />
                            )}
                            <div className="relative z-10 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold capitalize ring-1 ${statusStyle.badge}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
                                            {session.status_display || status}
                                        </span>
                                        <Pill>{session.session_type_display || formatSessionType(session.session_type)}</Pill>
                                    </div>
                                    <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-1">
                                        {session.subject || "Session details"}
                                    </h1>
                                    <p className="text-gray-300 text-sm">
                                        {formatDisplayDate(session.scheduled_date)} · {formatDisplayTime(session.start_time)}
                                        {session.end_time ? ` – ${formatDisplayTime(session.end_time)}` : ""}
                                    </p>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-2 shrink-0">
                                    <button
                                        onClick={handleMessageUser}
                                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3.5 bg-white/10 text-white border border-white/20 rounded-full text-sm font-semibold hover:bg-white/20 transition-all"
                                    >
                                        <FiMessageCircle size={16} />
                                        Message User
                                    </button>
                                    <button
                                        onClick={handleJoinMeeting}
                                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3.5 bg-white/10 text-white border border-white/20 rounded-full text-sm font-semibold hover:bg-white/20 transition-all"
                                    >
                                        <FiVideo size={16} />
                                        Join Session
                                    </button>
                                    {!isFinished && (
                                        <button
                                            onClick={handleCompleteSession}
                                            disabled={isPending}
                                            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-gray-900 rounded-full text-sm font-semibold hover:bg-gray-100 transition-all disabled:opacity-60"
                                        >
                                            <FiCheckCircle size={16} />
                                            {isPending ? "Completing..." : "Mark as Completed"}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Quick facts */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                            <InfoTile
                                icon={<FiCalendar size={14} />}
                                label="Date"
                                value={formatDisplayDate(session.scheduled_date)}
                            />
                            <InfoTile
                                icon={<FiClock size={14} />}
                                label="Time"
                                value={`${formatDisplayTime(session.start_time)}${session.end_time ? ` – ${formatDisplayTime(session.end_time)}` : ""}`}
                            />
                            <InfoTile
                                icon={<FiBookOpen size={14} />}
                                label="Session type"
                                value={session.session_type_display || formatSessionType(session.session_type)}
                            />
                            <InfoTile
                                icon={<FiDollarSign size={14} />}
                                label="Amount"
                                value={formatMoney(session.total_amount) || (tutor?.hourly_rate ? `${formatMoney(tutor.hourly_rate)} / hr` : "Not set")}
                            />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                            {/* Left: main content */}
                            <div className="lg:col-span-2 flex flex-col gap-4">
                                {/* Notes */}
                                {(session.notes || session.tutor_response_note) && (
                                    <div className="bg-white rounded-2xl border border-gray-200 p-5">
                                        <div className="flex items-center gap-2 text-gray-700 mb-3">
                                            <FiMessageCircle size={14} />
                                            <p className="text-sm font-semibold">Notes</p>
                                        </div>
                                        <div className="flex flex-col gap-4">
                                            {session.notes && (
                                                <div>
                                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
                                                        From student
                                                    </p>
                                                    <p className="text-sm text-gray-600 wrap-break-word">{session.notes}</p>
                                                </div>
                                            )}
                                            {session.tutor_response_note && (
                                                <div>
                                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
                                                        Your response
                                                    </p>
                                                    <p className="text-sm text-gray-600 wrap-break-word">
                                                        {session.tutor_response_note}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Location */}
                                <div className="bg-white rounded-2xl border border-gray-200 p-5">
                                    <div className="flex items-center gap-2 text-gray-700 mb-2">
                                        <FiMapPin size={14} />
                                        <p className="text-sm font-semibold">Location</p>
                                    </div>
                                    <p className="text-sm text-gray-600 wrap-break-word">
                                        {session.location_address || tutor?.location || "No physical location provided."}
                                    </p>
                                </div>

                                {/* Meeting link */}
                                <div className="bg-white rounded-2xl border border-gray-200 p-5">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 flex-wrap">
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold text-gray-900">Meeting link</p>
                                            <p className="text-sm text-gray-500 break-all">
                                                {session.session_link || "No link provided yet."}
                                            </p>
                                        </div>
                                        {session.session_link && (
                                            <button
                                                onClick={handleJoinMeeting}
                                                className="inline-flex sm:w-fit w-full justify-center items-center gap-2 rounded-full bg-green-700 px-4 py-3 text-sm font-semibold text-white hover:bg-green-800 transition-all"
                                            >
                                                <FiVideo size={14} />
                                                Join Meeting
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Mentor profile */}
                                {tutor && (
                                    <div className="bg-white rounded-2xl border border-gray-200 p-5">
                                        <p className="text-sm font-semibold text-gray-900 mb-3">About the mentor</p>
                                        <div className="flex flex-wrap items-center gap-4 mb-3 text-sm text-gray-600">
                                            <span className="flex items-center gap-1.5">
                                                <FiStar size={14} className="text-amber-500" />
                                                {tutor.average_rating || "0.00"} ({tutor.total_reviews || 0} reviews)
                                            </span>
                                            <span className="flex items-center gap-1.5">
                                                <FiDollarSign size={14} className="text-gray-400" />
                                                {formatMoney(tutor.hourly_rate) || "Not set"} / hr
                                            </span>
                                            <span>{tutor.total_sessions || 0} sessions taught</span>
                                        </div>
                                        {tutor.bio && (
                                            <p className="text-sm text-gray-600 wrap-break-word mb-3">{tutor.bio}</p>
                                        )}
                                        {!!tutor.subjects?.length && (
                                            <div className="mb-2">
                                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">
                                                    Subjects
                                                </p>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {tutor.subjects.map((subject: string) => (
                                                        <Pill key={subject}>{subject}</Pill>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        {!!tutor.skills?.length && (
                                            <div>
                                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">
                                                    Skills
                                                </p>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {tutor.skills.map((skill: string) => (
                                                        <Pill key={skill}>{skill}</Pill>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Right: people */}
                            <div className="flex flex-col gap-4">
                                <PersonCard
                                    role="Mentee"
                                    name={student?.full_name || student?.first_name}
                                    email={student?.email}
                                    phone={student?.phone_number}
                                    image={student?.profile_image}
                                />
                                <PersonCard
                                    role="Mentor (you)"
                                    name={tutor?.full_name}
                                    email={tutor?.email}
                                    phone={tutor?.phone_number}
                                    image={tutor?.profile_image}
                                    subtitle={tutor?.professional_title}
                                    extra={
                                        tutor?.session_status && (
                                            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-2 text-xs text-gray-500">
                                                <FiTag size={12} />
                                                <span className="capitalize">{tutor.session_status} sessions</span>
                                            </div>
                                        )
                                    }
                                />
                            </div>
                        </div>
                    </>
                ) : null}
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
                    recipientName={studentFirstName}
                />
            )}

            {showChatSuccessModal && (
                <ChatSuccessModal
                    onClose={() => setShowChatSuccessModal(false)}
                    onViewMessage={() => navigate("/tutor/dashboard/messages", { state: { chatId: startedChatId } })}
                    recipientName={studentFirstName}
                />
            )}
        </div>
    );
};

export default TutorSessionDetails;