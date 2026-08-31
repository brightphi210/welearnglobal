import { useEffect, useState } from "react";
import {
    FiAlertTriangle,
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
import { useApproveBookingCompletion, useStartUserChat } from "../../hooks/mutations/allMutation";
import { useGetBookingById } from "../../hooks/queries/allQueries";
import {
    formatDisplayDate,
    formatDisplayTime,
    formatSessionType,
    getInitials,
    normalizeStatus,
} from "../../utils/bookingHelpers";

const SUPPORT_EMAIL = "support@yourapp.com";

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
    <div className="bg-white rounded-2xl border border-gray-200 p-4">
        <div className="flex items-center gap-2 text-gray-500 mb-1">
            {icon}
            <span className="text-[11px] font-semibold uppercase tracking-wide">{label}</span>
        </div>
        <p className="text-xs font-semibold text-gray-900">{value}</p>
    </div>
);

const Pill = ({ children }: { children: React.ReactNode }) => (
    <span className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 text-[11px] font-medium">
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
    <div className="bg-white rounded-2xl border border-gray-200 p-4">
        <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-3">{role}</p>
        <div className="flex items-center gap-3">
            {image ? (
                <img src={image} alt={name || role} className="w-12 h-12 rounded-full object-cover shrink-0" />
            ) : (
                <div className="w-12 h-12 rounded-full bg-gray-700 text-white flex items-center justify-center font-bold text-sm shrink-0">
                    {getInitials(name)}
                </div>
            )}
            <div className="min-w-0">
                <p className="font-bold text-sm text-gray-900 truncate">{name || "Not provided"}</p>
                {subtitle && <p className="text-xs text-gray-500 truncate">{subtitle}</p>}
            </div>
        </div>
        <div className="mt-4 flex flex-col gap-1.5 text-xs text-gray-600">
            {email && (
                <p className="flex items-center gap-2 truncate">
                    <FiMail size={12} className="text-gray-400 shrink-0" />
                    {email}
                </p>
            )}
            {phone && (
                <p className="flex items-center gap-2 truncate">
                    <FiPhone size={12} className="text-gray-400 shrink-0" />
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
                    <FiMessageCircle size={20} className="text-green-700" />
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

const APPROVAL_CONFIRMATION_PHRASE = "I have acknowledged";

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

const CompletionApprovalModal = ({
    onClose,
    onApprove,
    onContactSupport,
    isSubmitting,
    submitError,
    tutorName,
    tutorNote,
}: {
    onClose: () => void;
    onApprove: () => void;
    onContactSupport: () => void;
    isSubmitting: boolean;
    submitError: string | null;
    tutorName: string;
    tutorNote?: string;
}) => {
    const [confirmText, setConfirmText] = useState("");
    const isConfirmed = confirmText.trim().toLowerCase() === APPROVAL_CONFIRMATION_PHRASE.toLowerCase();

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
                    <FiCheckCircle size={20} className="text-green-700" />
                </div>

                <h3 className="text-lg font-extrabold text-gray-900 mb-1.5">
                    {tutorName} marked this session complete
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-4">
                    Please confirm the session happened as expected. If that's right, approve it below.
                    If something's off, contact support instead of approving.
                </p>

                {tutorNote && (
                    <div className="mb-5 rounded-xl bg-gray-50 border border-gray-200 p-3">
                        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-1">
                            Note from {tutorName}
                        </p>
                        <p className="text-sm text-gray-600 wrap-break-word">{tutorNote}</p>
                    </div>
                )}

                <div className="mb-5">
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        Type "<span className="text-green-700">{APPROVAL_CONFIRMATION_PHRASE}</span>" to confirm
                    </label>
                    <input
                        type="text"
                        value={confirmText}
                        onChange={(e) => setConfirmText(e.target.value)}
                        disabled={isSubmitting}
                        placeholder={APPROVAL_CONFIRMATION_PHRASE}
                        className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400 disabled:opacity-60 disabled:cursor-not-allowed"
                    />
                </div>

                {submitError && <p className="text-xs text-red-500 font-medium mb-3">{submitError}</p>}

                <div className="flex flex-col gap-2">
                    <button
                        onClick={onApprove}
                        disabled={isSubmitting || !isConfirmed}
                        title={!isConfirmed ? `Type "${APPROVAL_CONFIRMATION_PHRASE}" to enable this button` : undefined}
                        className="w-full py-3.5 bg-green-700 text-white rounded-full text-xs font-semibold hover:bg-green-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? "Approving..." : (
                            <>
                                <FiCheckCircle size={14} />
                                Approve Completion
                            </>
                        )}
                    </button>
                    <button
                        onClick={onContactSupport}
                        disabled={isSubmitting}
                        className="w-full py-3.5 bg-gray-100 border border-gray-200 rounded-full text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        <FiAlertTriangle size={14} />
                        This isn't right — Contact Support
                    </button>
                </div>
            </div>
        </div>
    );
};

const StudentSessionDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const { booking, isLoading } = useGetBookingById(id || "");
    const { mutate: startChat, isPending: isStartingChat } = useStartUserChat();
    const { mutate: approveCompletion, isPending: isApproving } = useApproveBookingCompletion(id || "");

    const [showMessageModal, setShowMessageModal] = useState(false);
    const [chatError, setChatError] = useState<string | null>(null);
    const [showChatSuccessModal, setShowChatSuccessModal] = useState(false);
    const [startedChatId, setStartedChatId] = useState<number | null>(null);

    const [showCompletionModal, setShowCompletionModal] = useState(false);
    const [completionError, setCompletionError] = useState<string | null>(null);

    const session = booking?.data;
    const status = normalizeStatus(session?.status);
    const statusStyle = statusStyles[status] || statusStyles.pending;

    const tutor = session?.tutor_profile;
    const student = session?.student;
    const tutorFirstName = tutor?.full_name?.split(" ")[0] || "this tutor";

    // The tutor has requested completion but the student hasn't reviewed it yet.
    const needsCompletionApproval = Boolean(session?.tutor_completed) && !session?.student_acknowledged;

    useEffect(() => {
        if (needsCompletionApproval) {
            setShowCompletionModal(true);
        }
    }, [needsCompletionApproval]);

    const handleJoinMeeting = () => {
        if (!session?.session_link) {
            toast("No meeting link is available yet.", { type: "info" });
            return;
        }
        window.open(session.session_link, "_blank", "noopener,noreferrer");
    };

    const handleMessageTutor = () => {
        if (!tutor?.id) {
            toast("No tutor to message yet.", { type: "info" });
            return;
        }
        setChatError(null);
        setShowMessageModal(true);
    };

    const handleStartChat = (message: string) => {
        setChatError(null);

        startChat(
            { tutor_id: tutor?.user ?? tutor?.id, message },
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

    const handleApproveCompletion = () => {
        setCompletionError(null);

        approveCompletion(
            {} as any,
            {
                onSuccess: () => {
                    setShowCompletionModal(false);
                    toast("Session confirmed as completed. Thanks!", { type: "success" });
                    navigate('/student/dashboard/bookings')
                },
                onError: (err: any) => {
                    const data = err?.response?.data;
                    const message =
                        data?.detail ||
                        data?.message ||
                        data?.non_field_errors?.[0] ||
                        (typeof data === "string" ? data : null) ||
                        err?.message ||
                        "Something went wrong while approving this session. Please try again.";
                    setCompletionError(message);
                },
            }
        );
    };

    const handleContactSupport = () => {
        setShowCompletionModal(false);
        window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(
            `Dispute session completion — Booking #${id}`
        )}&body=${encodeURIComponent(
            `Hi,\n\nI'd like to dispute the completion request for session #${id} (${session?.subject || "N/A"
            }) with ${tutorFirstName}.\n\nDetails:\n`
        )}`;
    };

    return (
        <div className="md:pl-56 pb-20 md:pb-8 lg:pt-20 pt-8">
            <LoadingOverlay visible={isLoading} />
            <ToastContainer />
            <div className="min-h-screen pt-8 bg-gray-50 px-4 sm:px-6 lg:px-8 max-w-7xl m-auto">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-700 mb-6"
                >
                    <FiArrowLeft size={13} />
                    Back
                </button>

                {!isLoading && !session ? (
                    <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
                        <p className="font-bold text-sm text-gray-900 mb-1">Session not found</p>
                        <p className="text-xs text-gray-500">
                            This session may have been removed, or the link you followed is incorrect.
                        </p>
                        <Link
                            to="/student/dashboard/bookings"
                            className="inline-block mt-4 text-xs font-semibold text-green-700 hover:text-green-800"
                        >
                            Back to bookings
                        </Link>
                    </div>
                ) : session ? (
                    <>
                        {needsCompletionApproval && (
                            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                                <div className="flex items-start gap-2.5">
                                    <FiAlertTriangle size={16} className="text-amber-600 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-bold text-amber-900">
                                            {tutorFirstName} marked this session complete
                                        </p>
                                        <p className="text-xs text-amber-800">
                                            Review it and approve, or contact support if that's not right.
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowCompletionModal(true)}
                                    className="shrink-0 w-full sm:w-auto px-5 py-2.5 bg-amber-600 text-white rounded-full text-xs font-semibold hover:bg-amber-700 transition-all"
                                >
                                    Review Completion
                                </button>
                            </div>
                        )}

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
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold capitalize ring-1 ${statusStyle.badge}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
                                            {session.status_display || status}
                                        </span>
                                        <Pill>{session.session_type_display || formatSessionType(session.session_type)}</Pill>
                                    </div>
                                    <h1 className="text-lg sm:text-xl font-extrabold text-white mb-1">
                                        {session.subject || "Session details"}
                                    </h1>
                                    <p className="text-gray-300 text-xs">
                                        {formatDisplayDate(session.scheduled_date)} · {formatDisplayTime(session.start_time)}
                                        {session.end_time ? ` – ${formatDisplayTime(session.end_time)}` : ""}
                                    </p>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-2 shrink-0">
                                    <button
                                        onClick={handleMessageTutor}
                                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 bg-white/10 text-white border border-white/20 rounded-full text-xs font-semibold hover:bg-white/20 transition-all"
                                    >
                                        <FiMessageCircle size={14} />
                                        Message Tutor
                                    </button>
                                    <button
                                        onClick={handleJoinMeeting}
                                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 bg-white text-gray-900 rounded-full text-xs font-semibold hover:bg-gray-100 transition-all"
                                    >
                                        <FiVideo size={14} />
                                        Join Session
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Quick facts */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                            <InfoTile
                                icon={<FiCalendar size={13} />}
                                label="Date"
                                value={formatDisplayDate(session.scheduled_date)}
                            />
                            <InfoTile
                                icon={<FiClock size={13} />}
                                label="Time"
                                value={`${formatDisplayTime(session.start_time)}${session.end_time ? ` – ${formatDisplayTime(session.end_time)}` : ""}`}
                            />
                            <InfoTile
                                icon={<FiBookOpen size={13} />}
                                label="Session type"
                                value={session.session_type_display || formatSessionType(session.session_type)}
                            />
                            <InfoTile
                                icon={<FiDollarSign size={13} />}
                                label="Amount"
                                value={formatMoney(session.total_amount) || (tutor?.hourly_rate ? `${formatMoney(tutor.hourly_rate)} / hr` : "Not set")}
                            />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                            {/* Left: main content */}
                            <div className="lg:col-span-2 flex flex-col gap-4">
                                {/* Notes */}
                                {(session.notes || session.tutor_response_note) && (
                                    <div className="bg-white rounded-2xl border border-gray-200 p-4">
                                        <div className="flex items-center gap-2 text-gray-700 mb-3">
                                            <FiMessageCircle size={13} />
                                            <p className="text-xs font-semibold">Notes</p>
                                        </div>
                                        <div className="flex flex-col gap-4">
                                            {session.notes && (
                                                <div>
                                                    <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-1">
                                                        Your note
                                                    </p>
                                                    <p className="text-xs text-gray-600 wrap-break-word">{session.notes}</p>
                                                </div>
                                            )}
                                            {session.tutor_response_note && (
                                                <div>
                                                    <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-1">
                                                        Tutor's response
                                                    </p>
                                                    <p className="text-xs text-gray-600 wrap-break-word">
                                                        {session.tutor_response_note}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Location */}
                                <div className="bg-white rounded-2xl border border-gray-200 p-4">
                                    <div className="flex items-center gap-2 text-gray-700 mb-2">
                                        <FiMapPin size={13} />
                                        <p className="text-xs font-semibold">Location</p>
                                    </div>
                                    <p className="text-xs text-gray-600 wrap-break-word">
                                        {session.location_address || tutor?.location || "No physical location provided."}
                                    </p>
                                </div>

                                {/* Meeting link */}
                                <div className="bg-white rounded-2xl border border-gray-200 p-4">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 flex-wrap">
                                        <div className="min-w-0">
                                            <p className="text-xs font-semibold text-gray-900">Meeting link</p>
                                            <p className="text-xs text-gray-500 break-all">
                                                {session.session_link || "No link provided yet."}
                                            </p>
                                        </div>
                                        {session.session_link && (
                                            <button
                                                onClick={handleJoinMeeting}
                                                className="inline-flex sm:w-fit w-full justify-center items-center gap-2 rounded-full bg-green-700 px-4 py-2.5 text-xs font-semibold text-white hover:bg-green-800 transition-all"
                                            >
                                                <FiVideo size={13} />
                                                Join Meeting
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Tutor profile */}
                                {tutor && (
                                    <div className="bg-white rounded-2xl border border-gray-200 p-4">
                                        <p className="text-xs font-semibold text-gray-900 mb-3">About the tutor</p>
                                        <div className="flex flex-wrap items-center gap-4 mb-3 text-xs text-gray-600">
                                            <span className="flex items-center gap-1.5">
                                                <FiStar size={13} className="text-amber-500" />
                                                {tutor.average_rating || "0.00"} ({tutor.total_reviews || 0} reviews)
                                            </span>
                                            <span className="flex items-center gap-1.5">
                                                <FiDollarSign size={13} className="text-gray-400" />
                                                {formatMoney(tutor.hourly_rate) || "Not set"} / hr
                                            </span>
                                            <span>{tutor.total_sessions || 0} sessions taught</span>
                                        </div>
                                        {tutor.bio && (
                                            <p className="text-xs text-gray-600 wrap-break-word mb-3">{tutor.bio}</p>
                                        )}
                                        {!!tutor.subjects?.length && (
                                            <div className="mb-2">
                                                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-1.5">
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
                                                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-1.5">
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
                                    role="Tutor"
                                    name={tutor?.full_name}
                                    email={tutor?.email}
                                    phone={tutor?.phone_number}
                                    image={tutor?.profile_image}
                                    subtitle={tutor?.professional_title}
                                    extra={
                                        tutor?.session_status && (
                                            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-2 text-[11px] text-gray-500">
                                                <FiTag size={11} />
                                                <span className="capitalize">{tutor.session_status} sessions</span>
                                            </div>
                                        )
                                    }
                                />
                                <PersonCard
                                    role="You"
                                    name={student?.full_name || student?.first_name}
                                    email={student?.email}
                                    phone={student?.phone_number}
                                    image={student?.profile_image}
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
                    tutorName={tutorFirstName}
                />
            )}

            {showChatSuccessModal && (
                <ChatSuccessModal
                    onClose={() => setShowChatSuccessModal(false)}
                    onViewMessage={() => navigate("/student/dashboard/messages", { state: { chatId: startedChatId } })}
                    tutorName={tutorFirstName}
                />
            )}

            {showCompletionModal && session && (
                <CompletionApprovalModal
                    onClose={() => {
                        if (!isApproving) {
                            setShowCompletionModal(false);
                            setCompletionError(null);
                        }
                    }}
                    onApprove={handleApproveCompletion}
                    onContactSupport={handleContactSupport}
                    isSubmitting={isApproving}
                    submitError={completionError}
                    tutorName={tutorFirstName}
                    tutorNote={session.tutor_response_note}
                />
            )}
        </div>
    );
};

export default StudentSessionDetail;