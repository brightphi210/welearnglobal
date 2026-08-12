import {
    FiArrowLeft,
    FiBookOpen,
    FiCalendar,
    FiClock,
    FiDollarSign,
    FiMail,
    FiMapPin,
    FiMessageCircle,
    FiPhone,
    FiStar,
    FiTag,
    FiVideo,
} from "react-icons/fi";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import LoadingOverlay from "../../components/LoadingOverlay";
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

const StudentSessionDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();


    const { booking, isLoading } = useGetBookingById(id || "");

    const session = booking?.data;
    const status = normalizeStatus(session?.status);
    const statusStyle = statusStyles[status] || statusStyles.pending;

    const tutor = session?.tutor_profile;
    const student = session?.student;

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
        navigate(`/student/dashboard/messages?tutor=${tutor.id}`);
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
        </div>
    );
};

export default StudentSessionDetail;