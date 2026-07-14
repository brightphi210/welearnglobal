import { useEffect, useRef, useState } from "react";
import { FaGraduationCap } from "react-icons/fa";
import {
    FiArrowLeft,
    FiArrowRight,
    FiAward,
    FiBook,
    FiBriefcase,
    FiCheck,
    FiCheckCircle,
    FiClock,
    FiCreditCard,
    FiDollarSign,
    FiEdit2,
    FiGlobe,
    FiLock,
    FiMapPin,
    FiMessageCircle,
    FiPhone,
    FiPlus,
    FiShield,
    FiStar,
    FiTrash2,
    FiUpload,
    FiUser,
    FiX
} from "react-icons/fi";
import LoadingOverlay from "../../components/LoadingOverlay";
import { useCreateTutorProfile, useUpdateTutorProfile } from "../../hooks/mutations/auth";
import { useGetTutorProfile, useGetUserProfile } from "../../hooks/queries/allQueries";

/* ─── Types ──────────────────────────────────────────────────────────── */
type SessionMode = "online" | "onsite" | "both";
type PayoutMethod = "bank_transfer" | "paypal";
type Step = 1 | 2 | 3;
// empty  -> no profile exists yet, show a call-to-action
// view   -> profile exists, show it read-only
// edit   -> the multi-step wizard, used for both first-time creation and updates
type PageMode = "empty" | "view" | "edit";

interface ExperienceItem { id: number; role: string; org: string; period: string; }
interface EducationItem { id: number; degree: string; school: string; year: string; }

interface ProfileData {
    // Name/email are read-only here — they come from the base user profile,
    // not the tutor-profile payload.
    firstName: string; lastName: string; email: string;
    title: string;
    phone: string; bio: string; skills: string[];
    location: string; language: string; responseTime: string;
    sessionMode: SessionMode; bannerGradient: number;
    experience: ExperienceItem[]; education: EducationItem[];
    // The backend only stores a flat list of subjects + a single hourly rate —
    // there is no per-course name/description/level/duration on the API, so
    // we model exactly that instead of a richer "courses" shape that can
    // never be reloaded from the server.
    subjects: string[]; hourlyRate: string;
    payoutMethod: PayoutMethod;
    accountName: string; bankName: string; accountNumber: string;
    routingNumber: string; accountType: "checking" | "savings";
    paypalEmail: string;
    // Read-only stats returned by the API — displayed, never edited.
    averageRating: string; totalSessions: number;
    isVerified: boolean; verificationStatus: string;
}

/* ─── Constants ──────────────────────────────────────────────────────── */
const BANNER_THEMES = [
    { gradient: "from-yellow-400 via-lime-600 to-green-800", dir: "bg-gradient-to-br", label: "Sunrise" },
    { gradient: "from-green-700 via-green-800 to-lime-900", dir: "bg-gradient-to-br", label: "Forest" },
    { gradient: "from-lime-600 via-green-700 to-green-900", dir: "bg-gradient-to-tr", label: "Lime" },
    { gradient: "from-green-900 via-teal-800 to-green-700", dir: "bg-gradient-to-bl", label: "Deep" },
    { gradient: "from-emerald-600 via-green-700 to-lime-800", dir: "bg-gradient-to-br", label: "Emerald" },
    { gradient: "from-yellow-600 via-green-600 to-emerald-800", dir: "bg-gradient-to-tr", label: "Gold" },
];

const HATCH = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14'%3E%3Cpath d='M0 14L14 0' stroke='white' stroke-width='0.6' opacity='0.5'/%3E%3C/svg%3E";
const SUBJECTS = ["Mathematics", "Physics", "Chemistry", "Biology", "English", "Spanish", "French", "Music", "Programming", "Design", "Business", "History"];
const LANGUAGES = ["English", "Spanish", "French", "Mandarin Chinese", "Arabic"];

const STEPS = [
    { id: 1, label: "Basic Details", short: "Personal info, skills & bio" },
    { id: 2, label: "Teaching Setup", short: "Status, subjects & rate" },
    { id: 3, label: "Banking Info", short: "Payout account & payment" },
];

/* ─── Banner Component ───────────────────────────────────────────────── */
const BannerPreview = ({ themeIdx, imageUrl, className = "" }: { themeIdx: number; imageUrl?: string; className?: string }) => {
    // If a real banner image was uploaded, show that instead of the gradient theme.
    if (imageUrl) {
        return (
            <div className={`relative overflow-hidden ${className}`}>
                <img src={imageUrl} alt="Banner" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/0 to-black/20" />
            </div>
        );
    }

    const t = BANNER_THEMES[themeIdx] ?? BANNER_THEMES[0];
    return (
        <div className={`relative overflow-hidden ${t.dir} ${t.gradient} ${className}`}>
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 110" preserveAspectRatio="none">
                <path d="M -20 90 Q 90 40 200 75 T 420 60 V 130 H -20 Z" fill="white" opacity="0.07" />
                <path d="M -20 105 Q 130 65 260 95 T 420 85 V 130 H -20 Z" fill="white" opacity="0.05" />
                <circle cx="345" cy="18" r="46" fill="white" opacity="0.06" />
                <circle cx="370" cy="22" r="20" fill="white" opacity="0.08" />
            </svg>
            <div className="absolute inset-0 opacity-[0.07] mix-blend-overlay" style={{ backgroundImage: `url("${HATCH}")` }} />
            <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/0 to-black/20" />
        </div>
    );
};

/* ─── Live Profile Preview (mirrors screenshot layout) ───────────────── */
const LivePreviewCard = ({ data, profileImagePreview, bannerImagePreview }: { data: ProfileData; profileImagePreview?: string; bannerImagePreview?: string }) => {
    const fullName = [data.firstName, data.lastName].filter(Boolean).join(" ") || "Your Name";
    const initials = [data.firstName?.[0], data.lastName?.[0]].filter(Boolean).join("").toUpperCase() || "?";
    const rating = Number(data.averageRating) || 0;
    const filledStars = Math.round(rating);

    return (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm text-left">
            {/* Banner */}
            <div className="relative">
                <BannerPreview themeIdx={data.bannerGradient} imageUrl={bannerImagePreview} className="h-24 sm:h-28 w-full" />
                <div className="absolute bottom-0 left-5 translate-y-1/2">
                    <div className="relative w-14 h-14 rounded-xl bg-green-950 ring-4 ring-white flex items-center justify-center text-white font-bold text-base overflow-hidden">
                        {profileImagePreview ? (
                            <img src={profileImagePreview} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            initials
                        )}
                        {data.isVerified && (
                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-600 rounded-full border-2 border-white flex items-center justify-center">
                                <FiCheckCircle size={9} className="text-white" />
                            </div>
                        )}
                    </div>
                </div>
                <div className="absolute bottom-3 right-4">
                    <div className="w-7 h-7 bg-white/90 rounded-full flex items-center justify-center">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" /><line x1="4" y1="22" x2="4" y2="15" /></svg>
                    </div>
                </div>
            </div>

            {/* Info */}
            <div className="px-5 pt-10 pb-5">
                <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-base font-extrabold text-gray-900 leading-tight">{fullName}</h3>
                    {!data.isVerified && (
                        <span className="px-2 py-0.5 bg-amber-50 text-amber-600 border border-amber-200 rounded-full text-[10px] font-semibold capitalize">
                            {data.verificationStatus || "pending"}
                        </span>
                    )}
                </div>
                {data.title && <p className="text-xs text-gray-500 mt-0.5">{data.title}</p>}

                {/* Stars */}
                <div className="flex items-center gap-1 mt-2 flex-wrap">
                    {[1, 2, 3, 4, 5].map(i => (
                        <FiStar key={i} size={10} className={i <= filledStars ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"} />
                    ))}
                    <span className="text-xs font-bold text-gray-800 ml-1">{rating.toFixed(1)}</span>
                    <span className="text-xs text-gray-500">({data.totalSessions} session{data.totalSessions === 1 ? "" : "s"})</span>
                </div>

                {/* Meta row */}
                <div className="flex flex-wrap items-center gap-3 mt-2">
                    {data.location && (
                        <span className="flex items-center gap-1 text-[11px] text-gray-500">
                            <FiMapPin size={10} /> {data.location}
                        </span>
                    )}
                    {data.language && (
                        <span className="flex items-center gap-1 text-[11px] text-gray-500">
                            <FiGlobe size={10} /> {data.language}
                        </span>
                    )}
                    {data.responseTime && (
                        <span className="flex items-center gap-1 text-[11px] text-gray-500">
                            <FiClock size={10} /> Responds {data.responseTime}
                        </span>
                    )}
                </div>

                {/* Session badges */}
                <div className="flex gap-1.5 mt-3 flex-wrap">
                    {data.sessionMode !== "onsite" && (
                        <span className="px-2.5 py-0.5 border border-green-400 text-green-700 rounded-full text-[10px] font-semibold">Online</span>
                    )}
                    {data.sessionMode !== "online" && (
                        <span className="px-2.5 py-0.5 border border-orange-400 text-orange-700 rounded-full text-[10px] font-semibold bg-orange-50">Onsite</span>
                    )}
                    {data.hourlyRate && (
                        <span className="px-2.5 py-0.5 border border-gray-300 text-gray-600 rounded-full text-[10px] font-semibold">${data.hourlyRate}/hr</span>
                    )}
                </div>

                {/* Message button */}
                <button className="w-full mt-4 py-2.5 bg-green-800 text-white rounded-full text-xs font-semibold flex items-center justify-center gap-1.5">
                    <FiMessageCircle size={12} /> Message {data.firstName || "Tutor"}
                </button>
            </div>
        </div>
    );
};

/* ─── Empty state (no profile created yet) ───────────────────────────── */
const EmptyState = ({ onCreate }: { onCreate: () => void }) => (
    <div className="flex items-center justify-center min-h-[70vh] px-4">
        <div className="max-w-md w-full text-center rounded-3xl p-8 sm:p-10">
            <div className="w-16 h-16 rounded-2xl bg-green-50 flex items-center justify-center mx-auto mb-5">
                <FaGraduationCap size={28} className="text-green-700" />
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-2">Set up your instructor profile</h2>
            <p className="text-sm text-gray-500 mb-7 leading-relaxed">
                You haven't created an instructor profile yet. Add your bio, subjects, and payout details so students can find and book you.
            </p>
            <button
                onClick={onCreate}
                className="inline-flex items-center gap-2 px-6 py-3 bg-green-700 text-white rounded-full text-sm font-semibold hover:bg-green-800 transition-all"
            >
                <FiPlus size={16} /> Create Instructor Profile
            </button>
        </div>
    </div>
);

/* ─── Verification status modal ──────────────────────────────────────── */
const VerificationModal = ({ isVerified, verificationStatus, onClose }: { isVerified: boolean; verificationStatus: string; onClose: () => void }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
        <div className="relative bg-white rounded-2xl border border-gray-200 shadow-xl max-w-sm w-full p-6 sm:p-7">
            <button
                onClick={onClose}
                className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-600 rounded-lg transition-all"
            >
                <FiX size={16} />
            </button>

            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${isVerified ? "bg-green-100" : "bg-amber-100"}`}>
                {isVerified ? (
                    <FiCheckCircle size={22} className="text-green-700" />
                ) : (
                    <FiShield size={22} className="text-amber-600" />
                )}
            </div>

            <h3 className="text-lg font-extrabold text-gray-900 mb-1.5">
                {isVerified ? "You're verified" : "Verification status"}
            </h3>

            {isVerified ? (
                <p className="text-sm text-gray-500 leading-relaxed">
                    Your instructor profile has been verified. Students can see a verified badge on your profile.
                </p>
            ) : (
                <>
                    <span className="inline-block px-2.5 py-0.5 bg-amber-50 text-amber-600 border border-amber-200 rounded-full text-[11px] font-semibold capitalize mb-3">
                        {verificationStatus || "pending"}
                    </span>
                    <p className="text-sm text-gray-500 leading-relaxed">
                        Profile is under review and will be verified soon. We'll notify you as soon as the review is complete — no action is needed from you right now.
                    </p>
                </>
            )}

            <button
                onClick={onClose}
                className="w-full mt-5 py-2.5 bg-green-700 text-white rounded-full text-sm font-semibold hover:bg-green-800 transition-all"
            >
                Got it
            </button>
        </div>
    </div>
);

/* ─── Read-only profile view ─────────────────────────────────────────── */
const InfoRow = ({ icon: Icon, label, value }: { icon: any; label: string; value?: string | number }) => {
    if (!value) return null;
    return (
        <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center shrink-0">
                <Icon size={14} className="text-gray-500" />
            </div>
            <div className="min-w-0">
                <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wide">{label}</p>
                <p className="text-sm font-semibold text-gray-800 break-words">{value}</p>
            </div>
        </div>
    );
};

const ProfileView = ({
    data, profileImagePreview, bannerImagePreview, onEdit, onViewVerification,
}: {
    data: ProfileData; profileImagePreview: string; bannerImagePreview: string; onEdit: () => void; onViewVerification: () => void;
}) => {
    const fullName = [data.firstName, data.lastName].filter(Boolean).join(" ") || "Your Name";
    const initials = [data.firstName?.[0], data.lastName?.[0]].filter(Boolean).join("").toUpperCase() || "?";
    const rating = Number(data.averageRating) || 0;

    return (
        <div className="max-w-4xl mx-auto">
            {/* Verification status bar */}
            <button
                onClick={onViewVerification}
                className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-2xl border mb-4 text-left transition-all ${data.isVerified ? "bg-green-50 border-green-200 hover:bg-green-100" : "bg-amber-50 border-amber-200 hover:bg-amber-100"}`}
            >
                <div className="flex items-center gap-2.5">
                    {data.isVerified ? (
                        <FiCheckCircle size={16} className="text-green-700 shrink-0" />
                    ) : (
                        <FiShield size={16} className="text-amber-600 shrink-0" />
                    )}
                    <span className={`text-sm font-semibold ${data.isVerified ? "text-green-700" : "text-amber-700"}`}>
                        {data.isVerified ? "Verified instructor" : "View verification status"}
                    </span>
                </div>
                <span className={`text-[11px] font-semibold capitalize px-2 py-0.5 rounded-full ${data.isVerified ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                    {data.isVerified ? "Verified" : data.verificationStatus || "Pending"}
                </span>
            </button>

            {/* Header card */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm mb-6">
                <div className="relative">
                    <BannerPreview themeIdx={data.bannerGradient} imageUrl={bannerImagePreview} className="h-32 sm:h-40 w-full" />
                    <div className="absolute bottom-0 left-5 sm:left-8 translate-y-1/2">
                        <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-green-950 ring-4 ring-white flex items-center justify-center text-white font-bold text-2xl overflow-hidden">
                            {profileImagePreview ? (
                                <img src={profileImagePreview} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                initials
                            )}
                            {data.isVerified && (
                                <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-600 rounded-full border-2 border-white flex items-center justify-center">
                                    <FiCheckCircle size={11} className="text-white" />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="px-5 sm:px-8 pt-14 sm:pt-16 pb-6 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900">{fullName}</h2>
                            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold capitalize ${data.isVerified ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                                {data.isVerified ? "Verified" : data.verificationStatus || "Pending"}
                            </span>
                        </div>
                        {data.title && <p className="text-sm text-gray-500 mt-1">{data.title}</p>}

                        <div className="flex items-center gap-1 mt-2 flex-wrap">
                            {[1, 2, 3, 4, 5].map(i => (
                                <FiStar key={i} size={12} className={i <= Math.round(rating) ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"} />
                            ))}
                            <span className="text-xs font-bold text-gray-800 ml-1">{rating.toFixed(1)}</span>
                            <span className="text-xs text-gray-500">({data.totalSessions} session{data.totalSessions === 1 ? "" : "s"})</span>
                        </div>

                        <div className="flex gap-1.5 mt-3 flex-wrap">
                            {data.sessionMode !== "onsite" && (
                                <span className="px-2.5 py-0.5 border border-green-400 text-green-700 rounded-full text-[10px] font-semibold">Online</span>
                            )}
                            {data.sessionMode !== "online" && (
                                <span className="px-2.5 py-0.5 border border-orange-400 text-orange-700 rounded-full text-[10px] font-semibold bg-orange-50">Onsite</span>
                            )}
                            {data.hourlyRate && (
                                <span className="px-2.5 py-0.5 border border-gray-300 text-gray-600 rounded-full text-[10px] font-semibold">${data.hourlyRate}/hr</span>
                            )}
                        </div>
                    </div>

                    <button
                        onClick={onEdit}
                        className="flex items-center justify-center gap-2 px-5 py-2.5 bg-green-700 text-white rounded-full text-sm font-semibold hover:bg-green-800 transition-all shrink-0 w-full sm:w-auto"
                    >
                        <FiEdit2 size={15} /> Update Profile
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
                <div className="bg-white rounded-2xl border border-gray-200 p-5">
                    <InfoRow icon={FiPhone} label="Phone" value={data.phone} />
                </div>
                <div className="bg-white rounded-2xl border border-gray-200 p-5">
                    <InfoRow icon={FiMapPin} label="Location" value={data.location} />
                </div>
                <div className="bg-white rounded-2xl border border-gray-200 p-5">
                    <InfoRow icon={FiGlobe} label="Language" value={data.language} />
                </div>
                <div className="bg-white rounded-2xl border border-gray-200 p-5">
                    <InfoRow icon={FiClock} label="Response time" value={data.responseTime} />
                </div>
            </div>

            {/* Bio */}
            {data.bio && (
                <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 mb-6">
                    <SectionTitle icon={FiUser}>Bio</SectionTitle>
                    <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{data.bio}</p>
                </div>
            )}

            {/* Skills */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 mb-6">
                <SectionTitle icon={FiAward}>Skills</SectionTitle>
                {data.skills.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                        {data.skills.map(s => (
                            <span key={s} className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold">{s}</span>
                        ))}
                    </div>
                ) : (
                    <p className="text-xs text-gray-400 italic">No skills added yet</p>
                )}
            </div>

            {/* Subjects */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 mb-6">
                <SectionTitle icon={FiBook}>Subjects taught</SectionTitle>
                {data.subjects.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                        {data.subjects.map(s => (
                            <span key={s} className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 border border-gray-200 text-gray-700 rounded-full text-xs font-semibold">
                                <FaGraduationCap size={11} className="text-green-700" /> {s}
                            </span>
                        ))}
                    </div>
                ) : (
                    <p className="text-xs text-gray-400 italic">No subjects added yet</p>
                )}
            </div>

            {/* Experience + Education */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
                <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6">
                    <SectionTitle icon={FiBriefcase}>Experience</SectionTitle>
                    {data.experience.length > 0 ? (
                        <div className="flex flex-col gap-3">
                            {data.experience.map(e => (
                                <div key={e.id} className="border-l-2 border-green-200 pl-3">
                                    <p className="text-sm font-bold text-gray-900">{e.role}</p>
                                    <p className="text-xs text-green-700 font-semibold">{e.org}{e.period ? ` • ${e.period}` : ""}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-xs text-gray-400 italic">No experience added yet</p>
                    )}
                </div>
                <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6">
                    <SectionTitle icon={FaGraduationCap}>Education</SectionTitle>
                    {data.education.length > 0 ? (
                        <div className="flex flex-col gap-3">
                            {data.education.map(e => (
                                <div key={e.id} className="border-l-2 border-green-200 pl-3">
                                    <p className="text-sm font-bold text-gray-900">{e.degree}</p>
                                    <p className="text-xs text-green-700 font-semibold">{e.school}{e.year ? ` • ${e.year}` : ""}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-xs text-gray-400 italic">No education added yet</p>
                    )}
                </div>
            </div>

            {/* Payout */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 mb-10">
                <SectionTitle icon={FiCreditCard}>Payout method</SectionTitle>
                {data.payoutMethod === "bank_transfer" ? (
                    data.bankName || data.accountNumber ? (
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-green-700 flex items-center justify-center shrink-0">
                                <FiCreditCard size={16} className="text-white" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-bold text-gray-900 truncate">
                                    {data.bankName || "Bank account"} {data.accountNumber ? `••••${data.accountNumber.slice(-4)}` : ""}
                                </p>
                                {data.accountName && <p className="text-xs text-gray-500 truncate">{data.accountName}</p>}
                            </div>
                        </div>
                    ) : (
                        <p className="text-xs text-gray-400 italic">No bank account added yet</p>
                    )
                ) : data.paypalEmail ? (
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-green-700 flex items-center justify-center shrink-0">
                            <FiGlobe size={16} className="text-white" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-900">PayPal</p>
                            <p className="text-xs text-gray-500">{data.paypalEmail}</p>
                        </div>
                    </div>
                ) : (
                    <p className="text-xs text-gray-400 italic">No PayPal email added yet</p>
                )}
            </div>
        </div>
    );
};

/* ─── Reusable input styles ──────────────────────────────────────────── */
const fieldCls = "flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-3 focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-100 transition-all bg-white";
const inpCls = "flex-1 min-w-0 border-none outline-none text-sm text-gray-800 placeholder-gray-400 bg-transparent";
const baseCls = "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all bg-white";

const Label = ({ children }: { children: React.ReactNode }) => (
    <label className="block text-sm font-semibold text-gray-800 mb-2">{children}</label>
);

const SectionTitle = ({ icon: Icon, children }: { icon: any; children: React.ReactNode }) => (
    <div className="flex items-center gap-2 mb-4">
        <Icon size={16} className="text-green-700 shrink-0" />
        <h3 className="text-base font-bold text-gray-900">{children}</h3>
    </div>
);

/* ─── Formatting helpers ─────────────────────────────────────────────── */
// Keeps digits + a single leading "+" for international numbers, strips everything else.
const formatPhoneInput = (raw: string) => {
    const hasPlus = raw.trim().startsWith("+");
    const digits = raw.replace(/\D/g, "").slice(0, 15);
    return (hasPlus ? "+" : "") + digits;
};

// Strips non-numeric characters (keeping a single decimal point, max 2 dp) so
// the stored value is always a clean number string, e.g. "1234.5".
const sanitizeMoneyInput = (raw: string) => {
    let cleaned = raw.replace(/[^0-9.]/g, "");
    const firstDot = cleaned.indexOf(".");
    if (firstDot !== -1) {
        cleaned = cleaned.slice(0, firstDot + 1) + cleaned.slice(firstDot + 1).replace(/\./g, "");
        const [whole, decimals] = cleaned.split(".");
        cleaned = decimals !== undefined ? `${whole}.${decimals.slice(0, 2)}` : whole;
    }
    return cleaned;
};

// Adds thousand separators for display only, e.g. "1234.5" -> "1,234.5"
const formatMoneyDisplay = (value: string) => {
    if (!value) return "";
    const [whole, decimals] = value.split(".");
    const withCommas = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return decimals !== undefined ? `${withCommas}.${decimals}` : withCommas;
};

/* ─── Step 1: Basic Details ──────────────────────────────────────────── */
interface Step1Props {
    data: ProfileData;
    setData: (d: ProfileData) => void;
    disabled?: boolean;
    profileImagePreview: string;
    onProfileImageChange: (file: File) => void;
    bannerImagePreview: string;
    onBannerImageChange: (file: File) => void;
    onBannerImageClear: () => void;
}

const Step1 = ({
    data, setData, disabled,
    profileImagePreview, onProfileImageChange,
    bannerImagePreview, onBannerImageChange, onBannerImageClear,
}: Step1Props) => {
    const [skillInput, setSkillInput] = useState("");
    const profileImageInputRef = useRef<HTMLInputElement>(null);
    const bannerImageInputRef = useRef<HTMLInputElement>(null);

    const initials = [data.firstName?.[0], data.lastName?.[0]].filter(Boolean).join("").toUpperCase() || "?";

    const handleProfileFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) onProfileImageChange(file);
        e.target.value = "";
    };

    const handleBannerFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) onBannerImageChange(file);
        e.target.value = "";
    };

    const addSkill = () => {
        const s = skillInput.trim();
        if (s && !data.skills.includes(s)) {
            setData({ ...data, skills: [...data.skills, s] });
        }
        setSkillInput("");
    };

    const removeSkill = (s: string) => setData({ ...data, skills: data.skills.filter(x => x !== s) });

    return (
        <div className="space-y-7">
            <div>
                <p className="text-xs font-bold text-green-700 uppercase tracking-widest mb-1">Step 1 of 3</p>
                <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-1">Basic Details</h2>
                <p className="text-sm text-gray-500">Your public profile information. Tutors with detailed profiles book 3× more sessions.</p>
            </div>

            {/* Banner */}
            <div>
                <Label>Profile banner</Label>
                <div className="relative h-24 sm:h-28 rounded-2xl overflow-hidden border border-gray-200">
                    <BannerPreview themeIdx={data.bannerGradient} imageUrl={bannerImagePreview} className="w-full h-full" />
                    <button
                        type="button"
                        disabled={disabled}
                        onClick={() => bannerImageInputRef.current?.click()}
                        className="absolute inset-0 flex items-center justify-center group"
                    >
                        <div className="bg-black/30 backdrop-blur-sm rounded-xl px-3 py-1.5 flex items-center gap-1.5 text-white text-xs font-semibold opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                            <FiUpload size={11} /> Upload custom image
                        </div>
                    </button>
                    {bannerImagePreview && (
                        <button
                            type="button"
                            disabled={disabled}
                            onClick={onBannerImageClear}
                            className="absolute top-2 right-2 bg-black/40 hover:bg-black/60 text-white p-1.5 rounded-full transition-all"
                        >
                            <FiX size={12} />
                        </button>
                    )}
                    <input
                        ref={bannerImageInputRef}
                        type="file"
                        accept="image/png, image/jpeg, image/jpg, image/webp"
                        className="hidden"
                        onChange={handleBannerFile}
                    />
                </div>
                <p className="text-xs text-gray-400 mt-1.5">Upload a custom banner, or pick one of the preset themes above</p>
            </div>

            {/* Profile photo */}
            <div>
                <Label>Profile photo</Label>
                <div className="flex items-center gap-4">
                    <div className="relative shrink-0">
                        <div className="w-16 h-16 rounded-xl bg-green-950 flex items-center justify-center text-white font-bold text-lg ring-4 ring-gray-100 overflow-hidden">
                            {profileImagePreview ? (
                                <img src={profileImagePreview} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                initials
                            )}
                        </div>
                        <button
                            type="button"
                            disabled={disabled}
                            onClick={() => profileImageInputRef.current?.click()}
                            className="absolute -bottom-1 -right-1 bg-green-700 text-white p-1.5 rounded-full hover:bg-green-800 transition-all shadow-lg"
                        >
                            <FiUpload size={12} />
                        </button>
                        <input
                            ref={profileImageInputRef}
                            type="file"
                            accept="image/png, image/jpeg, image/jpg, image/webp"
                            className="hidden"
                            onChange={handleProfileFile}
                        />
                    </div>
                    <p className="text-xs text-gray-400">JPG, PNG or WEBP. Max 5MB.</p>
                </div>
            </div>

            {/* Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <Label>First name</Label>
                    <div className={fieldCls + " opacity-60"}>
                        <FiUser size={15} className="text-gray-400 shrink-0" />
                        <input className={inpCls} placeholder="Sarah" value={data.firstName} disabled readOnly />
                    </div>
                    <p className="text-xs text-gray-400 mt-1.5">Edit your name from your account settings</p>
                </div>
                <div>
                    <Label>Last name</Label>
                    <div className={fieldCls + " opacity-60"}>
                        <FiUser size={15} className="text-gray-400 shrink-0" />
                        <input className={inpCls} placeholder="Jenkins" value={data.lastName} disabled readOnly />
                    </div>
                </div>
            </div>

            {/* Title + Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <Label>Professional title</Label>
                    <div className={fieldCls}>
                        <FaGraduationCap size={15} className="text-gray-400 shrink-0" />
                        <input disabled={disabled} className={inpCls} placeholder="Senior Mathematics Professor" value={data.title}
                            onChange={e => setData({ ...data, title: e.target.value })} />
                    </div>
                    <p className="text-xs text-gray-400 mt-1.5">Shown under your name on search results</p>
                </div>
                <div>
                    <Label>Phone number</Label>
                    <div className={fieldCls}>
                        <FiPhone size={15} className="text-gray-400 shrink-0" />
                        <input
                            disabled={disabled}
                            className={inpCls}
                            type="tel"
                            inputMode="tel"
                            placeholder="+1 5550001234"
                            value={data.phone}
                            onChange={e => setData({ ...data, phone: formatPhoneInput(e.target.value) })}
                        />
                    </div>
                    <p className="text-xs text-gray-400 mt-1.5">Numbers only, e.g. +15550001234</p>
                </div>
            </div>

            {/* Bio */}
            <div>
                <Label>Bio</Label>
                <textarea rows={5} disabled={disabled} placeholder="With over 12 years of experience in higher education, I specialise in helping students conquer their fear of complex mathematical concepts. My approach is patient, structured, and tailored to each individual's learning style..." value={data.bio}
                    onChange={e => setData({ ...data, bio: e.target.value })}
                    className={baseCls + " resize-none"} />
                <div className="flex justify-between mt-1.5">
                    <p className="text-xs text-gray-400">Minimum 100 characters recommended</p>
                    <p className={`text-xs font-semibold ${data.bio.length < 100 ? "text-amber-500" : "text-green-600"}`}>{data.bio.length} chars</p>
                </div>
            </div>

            {/* Skills */}
            <div>
                <Label>Areas of expertise / Skills</Label>
                <div className="flex flex-col sm:flex-row gap-2 mb-3">
                    <div className={fieldCls + " flex-1"}>
                        <FiAward size={15} className="text-gray-400 shrink-0" />
                        <input disabled={disabled} className={inpCls} placeholder="e.g. Advanced Calculus, Linear Algebra…"
                            value={skillInput}
                            onChange={e => setSkillInput(e.target.value)}
                            onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addSkill(); } }} />
                    </div>
                    <button disabled={disabled} onClick={addSkill}
                        className="px-4 py-3 bg-green-700 text-white rounded-xl text-sm font-semibold hover:bg-green-800 transition-all flex items-center justify-center gap-1.5 shrink-0 disabled:opacity-50">
                        <FiPlus size={14} /> Add
                    </button>
                </div>
                {data.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {data.skills.map(s => (
                            <span key={s} className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold">
                                {s}
                                <button onClick={() => removeSkill(s)} className="text-gray-400 hover:text-red-500 transition-colors">
                                    <FiX size={11} />
                                </button>
                            </span>
                        ))}
                    </div>
                )}
                {data.skills.length === 0 && (
                    <p className="text-xs text-gray-400 italic">No skills added yet. Type a skill and press Enter or click Add.</p>
                )}
            </div>

            {/* Location + Language + Response time */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                    <Label>Location</Label>
                    <div className={fieldCls}>
                        <FiMapPin size={15} className="text-gray-400 shrink-0" />
                        <input disabled={disabled} className={inpCls} placeholder="London, UK" value={data.location}
                            onChange={e => setData({ ...data, location: e.target.value })} />
                    </div>
                </div>
                <div>
                    <Label>Language</Label>
                    <div className={fieldCls}>
                        <FiGlobe size={15} className="text-gray-400 shrink-0" />
                        <select
                            disabled={disabled}
                            className={inpCls}
                            value={data.language}
                            onChange={e => setData({ ...data, language: e.target.value })}
                        >
                            <option value="">Select a language</option>
                            {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
                        </select>
                    </div>
                </div>
                <div>
                    <Label>Response time</Label>
                    <div className={fieldCls}>
                        <FiClock size={15} className="text-gray-400 shrink-0" />
                        <select
                            disabled={disabled}
                            className={inpCls}
                            value={data.responseTime}
                            onChange={e => setData({ ...data, responseTime: e.target.value })}
                        >
                            {["< 1 hour", "< 2 hours", "< 6 hours", "< 24 hours"].map(o => <option key={o}>{o}</option>)}
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
};

/* ─── Mini add-item form (module scope so it never remounts on parent
     re-renders — was previously nested inside Step2, which recreated it as a
     brand-new component type on every keystroke and stole input focus) ──── */
interface MiniFormProps {
    title: string;
    onClose: () => void;
    onAdd: () => void;
    disabled: boolean;
    children: React.ReactNode;
}

const MiniForm = ({ title, onClose, onAdd, disabled, children }: MiniFormProps) => (
    <div className="mt-3 p-4 sm:p-5 bg-green-50 rounded-2xl border border-green-100">
        <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-bold text-gray-900">{title}</p>
            <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 rounded-lg transition-all"><FiX size={15} /></button>
        </div>
        <div className="space-y-3">{children}</div>
        <button onClick={onAdd} disabled={disabled}
            className="w-full mt-4 py-2.5 bg-green-700 text-white rounded-xl text-sm font-semibold hover:bg-green-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
            Save
        </button>
    </div>
);

/* ─── Step 2: Teaching Setup ─────────────────────────────────────────── */
const Step2 = ({ data, setData, disabled }: { data: ProfileData; setData: (d: ProfileData) => void; disabled?: boolean }) => {
    const [showExpForm, setShowExpForm] = useState(false);
    const [showEduForm, setShowEduForm] = useState(false);
    const [subjectPick, setSubjectPick] = useState("");

    const [newExp, setNewExp] = useState<Omit<ExperienceItem, "id">>({ role: "", org: "", period: "" });
    const [newEdu, setNewEdu] = useState<Omit<EducationItem, "id">>({ degree: "", school: "", year: "" });

    const nextId = (items: { id: number }[]) => (items.length ? Math.max(...items.map(i => i.id)) + 1 : 1);

    const addSubject = () => {
        const s = subjectPick.trim();
        if (s && !data.subjects.includes(s)) {
            setData({ ...data, subjects: [...data.subjects, s] });
        }
        setSubjectPick("");
    };
    const removeSubject = (s: string) => setData({ ...data, subjects: data.subjects.filter(x => x !== s) });

    const addExp = () => {
        if (!newExp.role || !newExp.org) return;
        setData({ ...data, experience: [...data.experience, { ...newExp, id: nextId(data.experience) }] });
        setNewExp({ role: "", org: "", period: "" });
        setShowExpForm(false);
    };
    const removeExp = (id: number) => setData({ ...data, experience: data.experience.filter(e => e.id !== id) });

    const addEdu = () => {
        if (!newEdu.degree || !newEdu.school) return;
        setData({ ...data, education: [...data.education, { ...newEdu, id: nextId(data.education) }] });
        setNewEdu({ degree: "", school: "", year: "" });
        setShowEduForm(false);
    };
    const removeEdu = (id: number) => setData({ ...data, education: data.education.filter(e => e.id !== id) });

    return (
        <div className="space-y-8">
            <div>
                <p className="text-xs font-bold text-green-700 uppercase tracking-widest mb-1">Step 2 of 3</p>
                <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-1">Teaching Setup</h2>
                <p className="text-sm text-gray-500">Your teaching mode, subjects, rate, experience, and education.</p>
            </div>

            {/* ── Session Status ── */}
            <div className="bg-gray-50 rounded-2xl border border-gray-200 p-4 sm:p-5">
                <SectionTitle icon={FiGlobe}>Session status</SectionTitle>
                <p className="text-xs text-gray-500 mb-4">How can students attend your sessions?</p>
                <div className="grid grid-cols-3 gap-2 max-w-full sm:max-w-sm">
                    {([
                        { mode: "online", icon: FiGlobe, label: "Online" },
                        { mode: "onsite", icon: FiMapPin, label: "On-site" },
                        { mode: "both", icon: FiCheckCircle, label: "Both" },
                    ] as { mode: SessionMode; icon: any; label: string }[]).map(({ mode, icon: Icon, label }) => (
                        <button key={mode} onClick={() => setData({ ...data, sessionMode: mode })}
                            className={`flex items-center justify-center gap-1.5 px-2 py-2 rounded-xl border transition-all ${data.sessionMode === mode
                                ? "border-green-700 bg-green-700 text-white"
                                : "border-gray-200 bg-white text-gray-600 hover:border-green-300 hover:bg-green-50"}`}>
                            <Icon size={13} />
                            <span className="text-xs font-semibold">{label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* ── Subjects & Rate ── */}
            <div className="bg-gray-50 rounded-2xl border border-gray-200 p-4 sm:p-5">
                <SectionTitle icon={FiBook}>Subjects & hourly rate</SectionTitle>

                <Label>Subjects you teach</Label>
                <div className="flex flex-col sm:flex-row gap-2 mb-3">
                    <select
                        disabled={disabled}
                        className={baseCls + " flex-1"}
                        value={subjectPick}
                        onChange={e => setSubjectPick(e.target.value)}
                    >
                        <option value="">Select a subject to add</option>
                        {SUBJECTS.filter(s => !data.subjects.includes(s)).map(s => <option key={s}>{s}</option>)}
                    </select>
                    <button disabled={disabled || !subjectPick} onClick={addSubject}
                        className="px-4 py-3 bg-green-700 text-white rounded-xl text-sm font-semibold hover:bg-green-800 transition-all flex items-center justify-center gap-1.5 shrink-0 disabled:opacity-50">
                        <FiPlus size={14} /> Add
                    </button>
                </div>

                {data.subjects.length > 0 ? (
                    <div className="flex flex-wrap gap-2 mb-5">
                        {data.subjects.map(s => (
                            <span key={s} className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 text-gray-700 rounded-full text-xs font-semibold">
                                <FaGraduationCap size={11} className="text-green-700" />
                                {s}
                                <button onClick={() => removeSubject(s)} className="text-gray-400 hover:text-red-500 transition-colors">
                                    <FiX size={11} />
                                </button>
                            </span>
                        ))}
                    </div>
                ) : (
                    <p className="text-xs text-gray-400 italic mb-5">No subjects added yet — add at least one so students know what you teach.</p>
                )}

                <Label>Hourly rate</Label>
                <div className={fieldCls + " max-w-full sm:max-w-xs"}>
                    <FiDollarSign size={15} className="text-gray-400 shrink-0" />
                    <input
                        disabled={disabled}
                        type="text"
                        inputMode="decimal"
                        className={inpCls}
                        placeholder="e.g. 25.00"
                        value={formatMoneyDisplay(data.hourlyRate)}
                        onChange={e => setData({ ...data, hourlyRate: sanitizeMoneyInput(e.target.value) })}
                    />
                    <span className="text-xs text-gray-400 shrink-0">/hr</span>
                </div>
            </div>

            {/* ── Experience + Education side by side ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Experience */}
                <div className="bg-gray-50 rounded-2xl border border-gray-200 p-4 sm:p-5">
                    <div className="flex items-center justify-between mb-1">
                        <SectionTitle icon={FiBriefcase}>Experience</SectionTitle>
                        <button onClick={() => setShowExpForm(v => !v)}
                            className="text-green-700 text-xs font-semibold flex items-center gap-1 hover:text-green-800 -mt-3 shrink-0">
                            <FiPlus size={13} /> Add
                        </button>
                    </div>

                    <div className="flex flex-col gap-3">
                        {data.experience.map(e => (
                            <div key={e.id} className="flex items-start justify-between gap-2 bg-white rounded-xl border border-gray-200 p-3">
                                <div className="min-w-0">
                                    <p className="text-sm font-bold text-gray-900 leading-tight truncate">{e.role}</p>
                                    <p className="text-xs text-green-700 font-semibold mt-0.5 truncate">{e.org}{e.period ? ` • ${e.period}` : ""}</p>
                                </div>
                                <button onClick={() => removeExp(e.id)} className="p-1 text-gray-300 hover:text-red-400 transition-colors shrink-0">
                                    <FiTrash2 size={12} />
                                </button>
                            </div>
                        ))}
                        {data.experience.length === 0 && !showExpForm && (
                            <p className="text-xs text-gray-400 italic text-center py-2">No experience added yet</p>
                        )}
                    </div>

                    {showExpForm && (
                        <MiniForm title="Add experience" onClose={() => setShowExpForm(false)} onAdd={addExp}
                            disabled={!newExp.role || !newExp.org}>
                            <input className={baseCls} placeholder="Role / title e.g. Senior Math Tutor"
                                value={newExp.role} onChange={e => setNewExp(prev => ({ ...prev, role: e.target.value }))} />
                            <input className={baseCls} placeholder="Organisation e.g. WeLearnGlobal"
                                value={newExp.org} onChange={e => setNewExp(prev => ({ ...prev, org: e.target.value }))} />
                            <input className={baseCls} placeholder="Period e.g. 2021 – Present"
                                value={newExp.period} onChange={e => setNewExp(prev => ({ ...prev, period: e.target.value }))} />
                        </MiniForm>
                    )}
                </div>

                {/* Education */}
                <div className="bg-gray-50 rounded-2xl border border-gray-200 p-4 sm:p-5">
                    <div className="flex items-center justify-between mb-1">
                        <SectionTitle icon={FaGraduationCap}>Education</SectionTitle>
                        <button onClick={() => setShowEduForm(v => !v)}
                            className="text-green-700 text-xs font-semibold flex items-center gap-1 hover:text-green-800 -mt-3 shrink-0">
                            <FiPlus size={13} /> Add
                        </button>
                    </div>

                    <div className="flex flex-col gap-3">
                        {data.education.map(e => (
                            <div key={e.id} className="flex items-start justify-between gap-2 bg-white rounded-xl border border-gray-200 p-3">
                                <div className="min-w-0">
                                    <p className="text-sm font-bold text-gray-900 leading-tight truncate">{e.degree}</p>
                                    <p className="text-xs text-green-700 font-semibold mt-0.5 truncate">{e.school}{e.year ? ` • ${e.year}` : ""}</p>
                                </div>
                                <button onClick={() => removeEdu(e.id)} className="p-1 text-gray-300 hover:text-red-400 transition-colors shrink-0">
                                    <FiTrash2 size={12} />
                                </button>
                            </div>
                        ))}
                        {data.education.length === 0 && !showEduForm && (
                            <p className="text-xs text-gray-400 italic text-center py-2">No education added yet</p>
                        )}
                    </div>

                    {showEduForm && (
                        <MiniForm title="Add education" onClose={() => setShowEduForm(false)} onAdd={addEdu}
                            disabled={!newEdu.degree || !newEdu.school}>
                            <input className={baseCls} placeholder="Degree e.g. PhD in Theoretical Mathematics"
                                value={newEdu.degree} onChange={e => setNewEdu(prev => ({ ...prev, degree: e.target.value }))} />
                            <input className={baseCls} placeholder="School e.g. Cambridge University"
                                value={newEdu.school} onChange={e => setNewEdu(prev => ({ ...prev, school: e.target.value }))} />
                            <input className={baseCls} placeholder="Year e.g. 2014"
                                value={newEdu.year} onChange={e => setNewEdu(prev => ({ ...prev, year: e.target.value }))} />
                        </MiniForm>
                    )}
                </div>
            </div>
        </div>
    );
};

/* ─── Step 3: Banking Info ───────────────────────────────────────────── */
const Step3 = ({ data, setData }: { data: ProfileData; setData: (d: ProfileData) => void }) => {
    const [showNumber, setShowNumber] = useState(false);

    const isBankMethod = data.payoutMethod === "bank_transfer";
    const isBankFilled = !!(data.bankName && data.accountNumber);

    return (
        <div className="space-y-7">
            <div>
                <p className="text-xs font-bold text-green-700 uppercase tracking-widest mb-1">Step 3 of 3</p>
                <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-1">Banking Info</h2>
                <p className="text-sm text-gray-500">Where should we send your earnings? All details are encrypted and never visible to students.</p>
            </div>

            {/* Security notice */}
            <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-2xl">
                <FiShield size={16} className="text-amber-600 shrink-0 mt-0.5" />
                <div>
                    <p className="text-xs font-bold text-amber-800 mb-0.5">Your data is secure</p>
                    <p className="text-xs text-amber-700 leading-relaxed">
                        Banking details are stored with 256-bit AES encryption. WeLearnGlobal never shares your financial information with students or third parties.
                    </p>
                </div>
            </div>

            {/* Payout method toggle */}
            <div>
                <label className="block text-sm font-semibold text-gray-800 mb-3">Payout method</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {([
                        { key: "bank_transfer", icon: FiCreditCard, label: "Bank Transfer", sub: "Direct to your account" },
                        { key: "paypal", icon: FiGlobe, label: "PayPal", sub: "Instant payout option" },
                    ] as { key: PayoutMethod; icon: any; label: string; sub: string }[]).map(({ key, icon: Icon, label, sub }) => (
                        <button
                            key={key}
                            onClick={() => setData({ ...data, payoutMethod: key })}
                            className={`flex items-center gap-3 p-4 rounded-2xl border-2 text-left transition-all ${data.payoutMethod === key
                                ? "border-green-700 bg-green-50"
                                : "border-gray-200 bg-white hover:border-green-200 hover:bg-green-50/50"}`}
                        >
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${data.payoutMethod === key ? "bg-green-700" : "bg-gray-100"}`}>
                                <Icon size={18} className={data.payoutMethod === key ? "text-white" : "text-gray-500"} />
                            </div>
                            <div className="min-w-0">
                                <p className={`text-sm font-bold leading-none ${data.payoutMethod === key ? "text-green-800" : "text-gray-700"}`}>{label}</p>
                                <p className="text-[11px] text-gray-400 mt-0.5">{sub}</p>
                            </div>
                            {data.payoutMethod === key && (
                                <FiCheckCircle size={16} className="text-green-700 ml-auto shrink-0" />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Bank transfer form — matches the API payload exactly:
                { method: "bank_transfer", bank_name, account_number } */}
            {isBankMethod && (
                <div className="space-y-5">
                    {/* Account holder name — kept for the tutor's own reference/display only,
                        not part of the payment_info payload the backend expects. */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-2">Account holder name <span className="text-gray-400 font-normal">(optional, for your reference)</span></label>
                        <div className={fieldCls}>
                            <FiUser size={15} className="text-gray-400 shrink-0" />
                            <input className={inpCls} placeholder="Full legal name as it appears on your bank account"
                                value={data.accountName}
                                onChange={e => setData({ ...data, accountName: e.target.value })} />
                        </div>
                    </div>

                    {/* Bank name */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-2">Bank name</label>
                        <div className={fieldCls}>
                            <FiCreditCard size={15} className="text-gray-400 shrink-0" />
                            <input className={inpCls} placeholder="e.g. Chase, Barclays"
                                value={data.bankName}
                                onChange={e => setData({ ...data, bankName: e.target.value })} />
                        </div>
                    </div>

                    {/* Account number */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-2">Account number</label>
                        <div className={fieldCls}>
                            <FiLock size={15} className="text-gray-400 shrink-0" />
                            <input
                                type={showNumber ? "text" : "password"}
                                inputMode="numeric"
                                className={inpCls}
                                placeholder="Enter your account number"
                                value={data.accountNumber}
                                onChange={e => setData({ ...data, accountNumber: e.target.value.replace(/\D/g, "") })}
                            />
                            <button
                                type="button"
                                onClick={() => setShowNumber(v => !v)}
                                className="text-gray-400 hover:text-gray-600 transition-colors bg-transparent border-none cursor-pointer p-0 shrink-0"
                            >
                                {showNumber
                                    ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" /><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                                    : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                                }
                            </button>
                        </div>
                        <p className="text-xs text-gray-400 mt-1.5 flex items-center gap-1">
                            <FiLock size={10} /> Masked for your security · numbers only
                        </p>
                    </div>

                    {/* Saved account confirmation */}
                    {isBankFilled && (
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-green-50 border border-green-200 rounded-2xl">
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="w-10 h-10 rounded-xl bg-green-700 flex items-center justify-center shrink-0">
                                    <FiCreditCard size={16} className="text-white" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-bold text-gray-900 truncate">
                                        {data.bankName} ••••{data.accountNumber.slice(-4)}
                                    </p>
                                    {data.accountName && <p className="text-xs text-gray-500 truncate">{data.accountName}</p>}
                                </div>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                                <FiCheckCircle size={15} className="text-green-700" />
                                <span className="text-xs font-semibold text-green-700">Primary</span>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* PayPal form */}
            {!isBankMethod && (
                <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">PayPal email address</label>
                    <div className={fieldCls}>
                        <FiGlobe size={15} className="text-gray-400 shrink-0" />
                        <input
                            type="email"
                            className={inpCls}
                            placeholder="paypal@example.com"
                            value={data.paypalEmail}
                            onChange={e => setData({ ...data, paypalEmail: e.target.value })}
                        />
                    </div>
                    {data.paypalEmail && (
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-4 p-4 bg-green-50 border border-green-200 rounded-2xl">
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="w-10 h-10 rounded-xl bg-green-700 flex items-center justify-center shrink-0">
                                    <FiGlobe size={16} className="text-white" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-bold text-gray-900">PayPal</p>
                                    <p className="text-xs text-gray-500 truncate">{data.paypalEmail}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                                <FiCheckCircle size={15} className="text-green-700" />
                                <span className="text-xs font-semibold text-green-700">Connected</span>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Payout schedule info */}
            <div className="bg-green-950 rounded-2xl p-5 text-white">
                <div className="flex items-center gap-2 mb-3">
                    <FiClock size={14} className="text-green-300" />
                    <p className="text-xs font-bold text-green-300 uppercase tracking-widest">Payout schedule</p>
                </div>
                <p className="text-sm font-semibold text-white mb-1">Weekly on Fridays</p>
                <p className="text-xs text-green-200 leading-relaxed">Earnings from confirmed sessions are released 48 hours after completion and paid out every Friday. Minimum payout threshold is $20.</p>
            </div>
        </div>
    );
};

function safeParseArray<T extends Record<string, any>>(value: unknown): (T & { id: number })[] {
    let arr: any[] = [];
    if (Array.isArray(value)) {
        arr = value;
    } else if (typeof value === "string" && value.trim()) {
        try {
            const parsed = JSON.parse(value);
            arr = Array.isArray(parsed) ? parsed : [];
        } catch {
            arr = [];
        }
    }
    return arr.map((item, idx) => ({ ...item, id: typeof item?.id === "number" ? item.id : idx + 1 }));
}

// Skills come back from the API as a real string[] — but guard for the
// legacy/alternate case where a backend might send a comma-separated string.
function normalizeSkills(value: unknown): string[] {
    if (Array.isArray(value)) return value.filter(Boolean);
    if (typeof value === "string" && value.trim()) {
        return value.split(",").map(s => s.trim()).filter(Boolean);
    }
    return [];
}

const emptyProfileData: ProfileData = {
    firstName: "", lastName: "", email: "",
    title: "",
    phone: "", bio: "", skills: [],
    location: "", language: "",
    responseTime: "< 2 hours", sessionMode: "both", bannerGradient: 0,
    experience: [],
    education: [],
    subjects: [], hourlyRate: "",
    payoutMethod: "bank_transfer",
    accountName: "", bankName: "", accountNumber: "",
    routingNumber: "", accountType: "checking", paypalEmail: "",
    averageRating: "0.00", totalSessions: 0,
    isVerified: false, verificationStatus: "pending",
};

/* ─── Main ───────────────────────────────────────────────────────────── */
const TutorProfile = () => {
    const [mode, setMode] = useState<PageMode>("view");
    const modeInitialized = useRef(false);

    const [step, setStep] = useState<Step>(1);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [showVerificationModal, setShowVerificationModal] = useState(false);

    const [data, setData] = useState<ProfileData>(emptyProfileData);

    // Actual File objects to upload, kept separate from the preview URLs shown in the UI.
    const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
    const [profileImagePreview, setProfileImagePreview] = useState<string>("");
    const [bannerImageFile, setBannerImageFile] = useState<File | null>(null);
    const [bannerImagePreview, setBannerImagePreview] = useState<string>("");

    const { userProfile, isLoading: isUserLoading } = useGetUserProfile();
    const user = userProfile?.data;

    const { tutorProfile, isLoading: isTutorLoading } = useGetTutorProfile();
    const tutor = tutorProfile?.data;
    const hasProfile = !!tutor;

    // Creating uses one hook, updating an existing profile uses another —
    // pick whichever applies at save time.
    const { mutate: createTutorProfile, isPending: isCreating } = useCreateTutorProfile();
    const { mutate: updateTutorProfile, isPending: isUpdating } = useUpdateTutorProfile();
    const isPending = isCreating || isUpdating;

    const isLoading = isUserLoading || isTutorLoading;

    // Decide the initial page mode exactly once, after the tutor profile has
    // finished loading: no profile -> empty state, existing profile -> view.
    // Done only once so it doesn't fight with the user's own mode changes
    // (e.g. clicking "Update Profile") on subsequent re-renders/refetches.
    useEffect(() => {
        if (!isTutorLoading && !modeInitialized.current) {
            modeInitialized.current = true;
            setMode(hasProfile ? "view" : "empty");
        }
    }, [isTutorLoading, hasProfile]);

    const handleProfileImageChange = (file: File) => {
        if (file.size > 5 * 1024 * 1024) {
            setErrorMessage("Profile image should be less than 5MB");
            return;
        }
        setProfileImageFile(file);
        setProfileImagePreview(URL.createObjectURL(file));
    };

    const handleBannerImageChange = (file: File) => {
        if (file.size > 5 * 1024 * 1024) {
            setErrorMessage("Banner image should be less than 5MB");
            return;
        }
        setBannerImageFile(file);
        setBannerImagePreview(URL.createObjectURL(file));
    };

    const handleBannerImageClear = () => {
        setBannerImageFile(null);
        setBannerImagePreview("");
    };

    // Sync name/email from the base user profile
    useEffect(() => {
        if (user) {
            setData(prev => ({
                ...prev,
                firstName: user.first_name || "",
                lastName: user.last_name || "",
                email: user.email || "",
            }));
            if (user.profile_image) setProfileImagePreview(user.profile_image);
        }
    }, [user]);

    // Sync tutor-specific fields whenever the fetched tutor profile changes
    useEffect(() => {
        if (!tutor) return;

        const paymentInfo = typeof tutor.payment_info === "string"
            ? (() => { try { return JSON.parse(tutor.payment_info); } catch { return {}; } })()
            : (tutor.payment_info || {});

        setData(prev => ({
            ...prev,
            title: tutor.professional_title ?? prev.title,
            phone: tutor.phone_number ?? prev.phone,
            bio: tutor.bio ?? prev.bio,
            skills: tutor.skills !== undefined ? normalizeSkills(tutor.skills) : prev.skills,
            location: tutor.location ?? prev.location,
            language: tutor.language ?? prev.language,
            sessionMode: (tutor.session_status as SessionMode) ?? prev.sessionMode,
            experience: safeParseArray<Omit<ExperienceItem, "id">>(tutor.experience),
            education: safeParseArray<Omit<EducationItem, "id">>(tutor.education),
            subjects: Array.isArray(tutor.subjects) ? tutor.subjects : prev.subjects,
            hourlyRate: tutor.hourly_rate !== undefined && tutor.hourly_rate !== null
                ? String(Number(tutor.hourly_rate) || "")
                : prev.hourlyRate,
            payoutMethod: (paymentInfo.method as PayoutMethod) ?? prev.payoutMethod,
            accountName: paymentInfo.account_holder_name ?? prev.accountName,
            bankName: paymentInfo.bank_name ?? prev.bankName,
            accountNumber: paymentInfo.account_number ?? prev.accountNumber,
            paypalEmail: paymentInfo.paypal_email ?? prev.paypalEmail,
            averageRating: tutor.average_rating ?? prev.averageRating,
            totalSessions: typeof tutor.total_sessions === "number" ? tutor.total_sessions : prev.totalSessions,
            isVerified: typeof tutor.is_verified === "boolean" ? tutor.is_verified : prev.isVerified,
            verificationStatus: tutor.verification_status ?? prev.verificationStatus,
        }));

        // banner/profile_image now come back as real uploaded file URLs, not theme labels
        if (tutor.banner) setBannerImagePreview(tutor.banner);
        if (tutor.profile_image) setProfileImagePreview(prev => prev || tutor.profile_image);
    }, [tutor]);

    const isStep1Done = !!(data.title);
    const isStep2Done = data.subjects.length > 0 && !!data.hourlyRate;
    const isStep3Done = data.payoutMethod === "bank_transfer"
        ? !!(data.bankName && data.accountNumber)
        : !!data.paypalEmail;
    const pct = Math.round([isStep1Done, isStep2Done, isStep3Done].filter(Boolean).length / 3 * 100);

    const buildPayload = () => {
        // hourly_rate must be a valid number — never send "", "-", or anything non-numeric.
        const parsedRate = data.hourlyRate ? Number(data.hourlyRate) : NaN;
        const hourlyRate = Number.isFinite(parsedRate) ? parsedRate : 0;

        // Matches the API's payment_info shape exactly:
        // bank transfer -> { method, bank_name, account_number }
        // paypal        -> { method, paypal_email }
        const paymentInfo = data.payoutMethod === "paypal"
            ? { method: "paypal", paypal_email: data.paypalEmail }
            : {
                method: "bank_transfer",
                bank_name: data.bankName,
                account_number: data.accountNumber,
            };

        const formData = new FormData();
        formData.append("bio", data.bio);
        formData.append("subjects", JSON.stringify(data.subjects));
        formData.append("session_status", data.sessionMode);
        formData.append("experience", JSON.stringify(data.experience.map(({ role, org, period }) => ({ role, org, period }))));
        formData.append("education", JSON.stringify(data.education.map(({ degree, school, year }) => ({ degree, school, year }))));
        formData.append("location", data.location);
        formData.append("language", data.language);
        formData.append("phone_number", data.phone);
        formData.append("professional_title", data.title);
        formData.append("payment_info", JSON.stringify(paymentInfo));
        formData.append("hourly_rate", String(hourlyRate));
        formData.append("skills", JSON.stringify(data.skills));

        // Only send these as actual files, and only when a new one was picked —
        // omitting them on edit lets the backend keep the existing upload.
        if (profileImageFile instanceof File) {
            formData.append("profile_image", profileImageFile, profileImageFile.name);
        }
        if (bannerImageFile instanceof File) {
            formData.append("banner", bannerImageFile, bannerImageFile.name);
        }

        return formData;
    };

    const handleSave = () => {
        setErrorMessage("");
        const payload = buildPayload();
        const mutateFn = hasProfile ? updateTutorProfile : createTutorProfile;

        mutateFn(payload, {
            onSuccess: () => {
                setBannerImageFile(null);
                setProfileImageFile(null);
                setSuccessMessage(hasProfile ? "Profile updated successfully!" : "Profile created successfully!");
                setTimeout(() => setSuccessMessage(""), 3000);
                setMode("view");
            },
            onError: (e: any) => {
                setErrorMessage(
                    e.response?.data?.message ||
                    e.response?.data?.detail ||
                    "Failed to save profile."
                );
            },
        });
    };

    const handleStartCreate = () => {
        setStep(1);
        setMode("edit");
    };

    const handleStartEdit = () => {
        setStep(1);
        setMode("edit");
    };

    const handleCancelEdit = () => {
        setErrorMessage("");
        setMode(hasProfile ? "view" : "empty");
    };

    if (isLoading) {
        return (
            <div className="md:pl-56 pb-20 md:pb-8 flex items-center justify-center min-h-screen">
                <LoadingOverlay visible={isLoading} />
            </div>
        );
    }

    // No profile yet, and the user hasn't started creating one -> empty state only.
    if (mode === "empty") {
        return (
            <div className="md:pl-56 pb-20 md:pb-8 pt-20 bg-gray-50 min-h-screen">
                <EmptyState onCreate={handleStartCreate} />
            </div>
        );
    }

    if (mode === "view") {
        return (
            <div className="md:pl-56 pb-20 md:pb-8 lg:pt-20 bg-gray-50 min-h-screen">
                <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                    {successMessage && (
                        <div className="max-w-4xl mx-auto mb-6 bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center gap-3">
                            <div className="w-5 h-5 bg-green-600 rounded-full flex items-center justify-center shrink-0">
                                <FiCheck className="text-white" size={12} />
                            </div>
                            <p className="text-sm font-semibold text-green-700">{successMessage}</p>
                        </div>
                    )}
                    <ProfileView
                        data={data}
                        profileImagePreview={profileImagePreview}
                        bannerImagePreview={bannerImagePreview}
                        onEdit={handleStartEdit}
                        onViewVerification={() => setShowVerificationModal(true)}
                    />
                </div>
                {showVerificationModal && (
                    <VerificationModal
                        isVerified={data.isVerified}
                        verificationStatus={data.verificationStatus}
                        onClose={() => setShowVerificationModal(false)}
                    />
                )}
            </div>
        );
    }

    return (
        <div className="md:pl-56 pb-20 md:pb-8 lg:pt-20 bg-gray-50 min-h-screen">
            <LoadingOverlay visible={isPending} />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <div className="flex items-center gap-2 flex-wrap">
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-1">
                                {hasProfile ? "Update Profile" : "Create Instructor Profile"}
                            </h1>
                            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold capitalize mb-1 ${data.isVerified ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                                {data.isVerified ? "Verified" : data.verificationStatus || "Pending"}
                            </span>
                        </div>
                        <p className="text-sm text-gray-500">{pct}% complete · {pct < 100 ? "Keep going to boost your visibility" : "Your profile is fully set up"}</p>
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        {hasProfile && (
                            <button onClick={handleCancelEdit} disabled={isPending}
                                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all shrink-0 border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-50">
                                Cancel
                            </button>
                        )}
                        <button onClick={handleSave} disabled={isPending}
                            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all shrink-0 bg-green-700 text-white hover:bg-green-800 disabled:opacity-50 flex-1 sm:flex-none">
                            <FiEdit2 size={15} /> {isPending ? "Saving..." : hasProfile ? "Save Changes" : "Create Profile"}
                        </button>
                    </div>
                </div>

                {/* Success / Error banners */}
                {successMessage && (
                    <div className="mb-6 bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center gap-3">
                        <div className="w-5 h-5 bg-green-600 rounded-full flex items-center justify-center shrink-0">
                            <FiCheck className="text-white" size={12} />
                        </div>
                        <p className="text-sm font-semibold text-green-700">{successMessage}</p>
                    </div>
                )}
                {errorMessage && (
                    <div className="mb-6 bg-red-50 border border-red-200 rounded-2xl p-4">
                        <p className="text-sm font-semibold text-red-600">{errorMessage}</p>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

                    {/* ── Left sidebar ── */}
                    <div className="lg:col-span-1 flex flex-col gap-5 lg:sticky lg:top-8 order-2 lg:order-1">
                        {/* Step nav */}
                        <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-5">
                            {/* Progress */}
                            <div className="flex items-center gap-3 mb-5">
                                <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-green-600 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                                </div>
                                <span className="text-xs font-bold text-gray-500 shrink-0">{pct}%</span>
                            </div>

                            {STEPS.map(s => {
                                const done = s.id === 1 ? isStep1Done : s.id === 2 ? isStep2Done : isStep3Done;
                                const active = step === s.id;
                                return (
                                    <button key={s.id} onClick={() => setStep(s.id as Step)}
                                        className={`w-full flex items-center gap-3 px-3 py-3.5 rounded-xl text-left transition-all mb-1 ${active ? "bg-green-50 border border-green-200" : "hover:bg-gray-50"}`}>
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all ${done ? "bg-green-700 text-white" : active ? "bg-white text-green-700 border-2 border-green-700" : "bg-gray-100 text-gray-500"}`}>
                                            {done ? <FiCheckCircle size={14} /> : s.id}
                                        </div>
                                        <div className="min-w-0">
                                            <p className={`text-sm font-bold leading-none ${active ? "text-green-800" : "text-gray-700"}`}>{s.label}</p>
                                            <p className="text-[11px] text-gray-400 mt-0.5 truncate">{s.short}</p>
                                        </div>
                                        {done && <FiCheckCircle size={13} className="text-green-500 ml-auto shrink-0" />}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Live preview */}
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">Live preview</p>
                            <LivePreviewCard data={data} profileImagePreview={profileImagePreview} bannerImagePreview={bannerImagePreview} />
                            <p className="text-[10px] text-gray-400 text-center mt-2">This is how students see your card</p>
                        </div>
                    </div>

                    {/* ── Right: form panel ── */}
                    <div className="lg:col-span-2 order-1 lg:order-2">
                        <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 lg:p-8">
                            {step === 1 && (
                                <Step1
                                    data={data}
                                    setData={setData}
                                    disabled={isPending}
                                    profileImagePreview={profileImagePreview}
                                    onProfileImageChange={handleProfileImageChange}
                                    bannerImagePreview={bannerImagePreview}
                                    onBannerImageChange={handleBannerImageChange}
                                    onBannerImageClear={handleBannerImageClear}
                                />
                            )}
                            {step === 2 && <Step2 data={data} setData={setData} disabled={isPending} />}
                            {step === 3 && <Step3 data={data} setData={setData} />}

                            {/* Nav footer */}
                            <div className="flex flex-wrap items-center justify-between gap-3 pt-6 mt-8 border-t border-gray-100">
                                <button onClick={() => setStep(s => Math.max(1, s - 1) as Step)} disabled={step === 1}
                                    className="flex items-center gap-2 px-4 sm:px-5 py-2.5 border border-gray-200 rounded-full text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all disabled:opacity-40 disabled:cursor-not-allowed order-1">
                                    <FiArrowLeft size={14} /> Previous
                                </button>

                                {/* Dot indicators */}
                                <div className="flex items-center gap-2 order-3 sm:order-2 w-full sm:w-auto justify-center">
                                    {STEPS.map(s => (
                                        <button key={s.id} onClick={() => setStep(s.id as Step)}
                                            className={`rounded-full transition-all ${step === s.id ? "w-6 h-2 bg-green-700" : "w-2 h-2 bg-gray-200 hover:bg-gray-300"}`} />
                                    ))}
                                </div>

                                {step < 3 ? (
                                    <button onClick={() => setStep(s => (s + 1) as Step)}
                                        className="flex items-center gap-2 px-4 sm:px-5 py-2.5 bg-green-700 text-white rounded-full text-sm font-semibold hover:bg-green-800 transition-all order-2 sm:order-3">
                                        Continue <FiArrowRight size={14} />
                                    </button>
                                ) : (
                                    <button onClick={handleSave} disabled={isPending}
                                        className="flex items-center gap-2 px-5 sm:px-6 py-2.5 rounded-full text-sm font-semibold transition-all bg-green-700 text-white hover:bg-green-800 disabled:opacity-50 order-2 sm:order-3">
                                        {isPending
                                            ? (hasProfile ? "Saving..." : "Publishing...")
                                            : <>{hasProfile ? "Save Changes" : "Publish Profile"} <FiArrowRight size={14} /></>}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TutorProfile;