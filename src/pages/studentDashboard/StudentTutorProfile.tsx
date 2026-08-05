import { useState } from "react";
import { FaStar } from "react-icons/fa";
import {
    FiAward,
    FiBook,
    FiCalendar,
    FiCheckCircle,
    FiFlag,
    FiMapPin,
    FiMessageSquare,
    FiX,
} from "react-icons/fi";
import { useParams } from "react-router-dom";
import LoadingOverlay from "../../components/LoadingOverlay";
import TutorsBanner from "../../components/TutorsBanner";
import { useGetSingleTutor } from "../../hooks/queries/allQueries";

/* ─── Shape returned by the tutors API ───────────────────────────────── */
interface ExperienceItem { role: string; org: string; period: string; }
interface EducationItem { degree: string; school: string; year: string; }

interface TutorData {
    id: number;
    full_name: string;
    email?: string;
    bio?: string;
    subjects?: string[] | null;
    skills?: string[] | null;
    session_status?: "online" | "onsite" | "both" | string;
    experience?: ExperienceItem[] | null;
    education?: EducationItem[] | null;
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

interface BookingDetails {
    subject: string;
    customSubject: string;
    title: string;
    notes: string;
}

const SUBJECT_OPTIONS = ["English", "Maths", "Product Design", "Marketing", "Other"];

/* ─── Booking Details Modal ──────────────────────────────────────────── */
const BookingDetailsModal = ({
    onClose,
    onSubmit,
}: {
    onClose: () => void;
    onSubmit: (details: BookingDetails) => void;
}) => {
    const [subject, setSubject] = useState("");
    const [customSubject, setCustomSubject] = useState("");
    const [title, setTitle] = useState("");
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
        if (!title.trim()) {
            setError("Please add a title for the session");
            return;
        }
        setError("");
        onSubmit({ subject, customSubject, title, notes });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

            <div className="relative bg-white rounded-2xl border border-gray-200 shadow-xl max-w-md w-full p-6 sm:p-7 max-h-[90vh] overflow-y-auto">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-600 rounded-lg transition-all"
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

                    {/* Title */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-800 mb-2">Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. Struggling with Maths"
                            className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400"
                        />
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
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={onClose}
                        className="flex-1 py-2.5 border border-gray-200 rounded-full text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="flex-1 py-2.5 bg-green-700 text-white rounded-full text-sm font-semibold hover:bg-green-800 transition-all"
                    >
                        Continue
                    </button>
                </div>
            </div>
        </div>
    );
};

const StudentTutorProfile = () => {
    const { id } = useParams<{ id: string }>();

    const [selectedDate, setSelectedDate] = useState(18);
    const [selectedTime, setSelectedTime] = useState("10:00 AM");
    const [bookingStep, setBookingStep] = useState(1);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);
    const { tutorData, isLoading } = useGetSingleTutor(id!);
    const tutor = tutorData?.data || null;

    console.log("tutorData:", tutor);

    const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);
    const availableTimes = ["09:00 AM", "10:00 AM", "02:00 PM", "04:00 PM"];

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
    const expertise = Array.from(new Set([...(tutor.subjects || []), ...(tutor.skills || [])]));

    const experience = tutor.experience || [];
    const education = tutor.education || [];
    const languages = tutor.language ? [tutor.language] : [];

    const isOnline = tutor.session_status === "online" || tutor.session_status === "both";
    const isOnsite = tutor.session_status === "onsite" || tutor.session_status === "both";

    const firstName = tutor.full_name?.split(" ")[0] || "this mentor";

    const handleDetailsSubmit = (details: BookingDetails) => {
        setBookingDetails(details);
        setShowDetailsModal(false);
        // TODO: send { tutor_id, date, time, subject, title, notes } to your booking API here
        setBookingStep(2);
    };

    return (
        <div className="md:pl-56 pb-20 md:pb-8">
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
                                            <button className="flex-1 px-4 py-3 bg-green-700 text-white rounded-full font-semibold text-sm flex items-center justify-center gap-2 hover:bg-green-800 transition-all">
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
                                                {["Online", "On-site"].map((type) => {
                                                    const active = type === "Online" ? isOnline : isOnsite;
                                                    return (
                                                        <button
                                                            key={type}
                                                            disabled={!active}
                                                            className={`flex-1 px-3 py-2 rounded-lg font-semibold text-xs border transition-all ${active
                                                                ? "bg-green-50 text-green-700 border-green-300"
                                                                : "bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed"
                                                                }`}
                                                        >
                                                            {type}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        {/* Calendar */}
                                        <div className="mb-4">
                                            <label className="block text-xs font-semibold text-gray-800 mb-2">October 2024</label>
                                            <div className="grid grid-cols-7 gap-1">
                                                {["M", "T", "W", "T", "F", "S", "S"].map((day, idx) => (
                                                    <div key={idx} className="text-center text-[10px] font-semibold text-gray-500 py-1">
                                                        {day}
                                                    </div>
                                                ))}
                                                {daysInMonth.map((day) => (
                                                    <button
                                                        key={day}
                                                        onClick={() => setSelectedDate(day)}
                                                        className={`py-1.5 rounded-lg text-[10px] font-medium transition-all ${selectedDate === day ? "bg-green-700 text-white" : "bg-gray-50 text-gray-700 border border-gray-200 hover:bg-green-50"}`}
                                                    >
                                                        {day}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Time Slots */}
                                        <div className="mb-4">
                                            <label className="block text-xs font-semibold text-gray-800 mb-2">Available Times (GMT)</label>
                                            <div className="grid grid-cols-2 gap-2">
                                                {availableTimes.map((time) => (
                                                    <button
                                                        key={time}
                                                        onClick={() => setSelectedTime(time)}
                                                        className={`py-2 rounded-lg text-[10px] font-semibold transition-all ${selectedTime === time ? "bg-green-50 text-green-700 border border-green-300" : "bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100"}`}
                                                    >
                                                        {time}
                                                    </button>
                                                ))}
                                            </div>
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

                                        <button
                                            onClick={() => setShowDetailsModal(true)}
                                            className="w-full py-3 bg-green-700 text-white rounded-full font-bold text-xs hover:bg-green-800 transition-all"
                                        >
                                            Confirm Booking
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
                                            Your session with {tutor.full_name} is confirmed for October {selectedDate}, 2024 at {selectedTime}
                                        </p>
                                        {bookingDetails && (
                                            <p className="text-[10px] text-gray-500 mb-5">
                                                {bookingDetails.subject === "Other" ? bookingDetails.customSubject : bookingDetails.subject} · "{bookingDetails.title}"
                                            </p>
                                        )}
                                        <button className="w-full py-2.5 bg-green-700 text-white rounded-full font-bold text-xs hover:bg-green-800 transition-all mb-2">
                                            View Confirmation
                                        </button>
                                        <button
                                            onClick={() => {
                                                setBookingStep(1);
                                                setBookingDetails(null);
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

            {showDetailsModal && (
                <BookingDetailsModal
                    onClose={() => setShowDetailsModal(false)}
                    onSubmit={handleDetailsSubmit}
                />
            )}
        </div>
    );
};

export default StudentTutorProfile;