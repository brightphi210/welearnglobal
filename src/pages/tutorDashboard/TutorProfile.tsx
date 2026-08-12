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
    FiGlobe,
    FiImage,
    FiLock,
    FiMapPin,
    FiPhone,
    FiPlus,
    FiTrash2,
    FiUpload,
    FiUser,
    FiX
} from "react-icons/fi";
import LoadingOverlay from "../../components/LoadingOverlay";
import { useUpdateTutorProfile } from "../../hooks/mutations/auth";
import { useGetTutorProfile, useGetUserProfile } from "../../hooks/queries/allQueries";

/* ─── Types ──────────────────────────────────────────────────────────── */
type SessionMode = "online" | "onsite" | "both";
type Step = 1 | 2 | 3 | 4;
// empty  -> no profile exists yet, show a call-to-action
// view   -> profile exists, show it read-only
// edit   -> the multi-step wizard, used for both first-time creation and updates
type PageMode = "empty" | "view" | "edit";

interface ExperienceItem { id: number; title: string; company: string; description: string; }
interface EducationItem { id: number; degree: string; institution: string; description: string; }

interface TimeSlot { id: number; startTime: string; endTime: string; isBooked?: boolean; }
interface DayAvailability { day: string; enabled: boolean; slots: TimeSlot[]; }

interface ProfileData {
    firstName: string; lastName: string; email: string;
    title: string;
    phone: string; bio: string; skills: string[];
    location: string; language: string; responseTime: string;
    sessionMode: SessionMode;
    experience: ExperienceItem[]; education: EducationItem[];
    subjects: string[]; hourlyRate: string;
    availability: DayAvailability[];
    accountName: string; bankName: string; accountNumber: string;
    averageRating: string; totalSessions: number;
    isVerified: boolean; verificationStatus: string;
}

/* ─── Constants ──────────────────────────────────────────────────────── */
const SUBJECTS = ["Mathematics", "Physics", "Chemistry", "Biology", "English", "Spanish", "French", "Music", "Programming", "Design", "Business", "History"];
const LANGUAGES = ["English", "Spanish", "French", "Mandarin Chinese", "Arabic"];

const STEPS = [
    { id: 1, label: "Basic Details", short: "Personal info, skills & bio" },
    { id: 2, label: "Teaching Setup", short: "Status, subjects & rate" },
    { id: 3, label: "Availability", short: "Your weekly schedule" },
    { id: 4, label: "Banking Info", short: "Payout account & payment" },
];

const DAYS_OF_WEEK = [
    { key: "monday", label: "Monday" },
    { key: "tuesday", label: "Tuesday" },
    { key: "wednesday", label: "Wednesday" },
    { key: "thursday", label: "Thursday" },
    { key: "friday", label: "Friday" },
    { key: "saturday", label: "Saturday" },
    { key: "sunday", label: "Sunday" },
];

// Keep legacy numeric mapping for backwards compatibility with older API payloads.
const DAY_TO_INDEX: Record<string, number> = {
    sunday: 0, monday: 1, tuesday: 2, wednesday: 3, thursday: 4, friday: 5, saturday: 6,
};
const INDEX_TO_DAY: Record<number, string> = Object.fromEntries(
    Object.entries(DAY_TO_INDEX).map(([day, idx]) => [idx, day])
);

const normalizeDayKey = (value: unknown): string | undefined => {
    if (typeof value === "number") return INDEX_TO_DAY[value];
    if (typeof value === "string") {
        const normalized = value.trim().toLowerCase();
        if (normalized in DAY_TO_INDEX) return normalized;

        const dayNameMap: Record<string, string> = {
            sunday: "sunday",
            monday: "monday",
            tuesday: "tuesday",
            wednesday: "wednesday",
            thursday: "thursday",
            friday: "friday",
            saturday: "saturday",
        };

        if (dayNameMap[normalized]) return dayNameMap[normalized];

        const match = DAYS_OF_WEEK.find(d =>
            d.key === normalized ||
            d.label.toLowerCase() === normalized ||
            normalized === d.key.slice(0, 3)
        );
        return match?.key;
    }
    return undefined;
};

const MAX_SLOTS_PER_DAY = 3;

const defaultAvailability: DayAvailability[] = DAYS_OF_WEEK.map(d => ({
    day: d.key,
    enabled: false,
    slots: [],
}));

/* ─── Banner Component ───────────────────────────────────────────────── */
const BannerPreview = ({ imageUrl, className = "" }: { imageUrl?: string; className?: string }) => {
    if (imageUrl) {
        return (
            <div className={`relative overflow-hidden ${className}`}>
                <img src={imageUrl} alt="Banner" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/0 to-black/20" />
            </div>
        );
    }

    return (
        <div className={`relative overflow-hidden bg-gray-200 flex items-center justify-center ${className}`}>
            <FiImage size={28} className="text-gray-400" />
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



const fieldCls = "flex items-center gap-3 border border-gray-200 rounded-lg px-4 py-3 focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-100 transition-all bg-white";
const inpCls = "flex-1 min-w-0 border-none outline-none text-sm text-gray-800 placeholder-gray-400 bg-transparent";
const baseCls = "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-green-800  transition-all bg-white";

const Label = ({ children }: { children: React.ReactNode }) => (
    <label className="block text-sm font-semibold text-gray-800 mb-2">{children}</label>
);

const SectionTitle = ({ icon: Icon, children }: { icon: any; children: React.ReactNode }) => (
    <div className="flex items-center gap-2 mb-4">
        <Icon size={16} className="text-green-700 shrink-0" />
        <h3 className="text-sm font-bold text-gray-900">{children}</h3>
    </div>
);

const formatPhoneInput = (raw: string) => {
    const hasPlus = raw.trim().startsWith("+");
    const digits = raw.replace(/\D/g, "").slice(0, 15);
    return (hasPlus ? "+" : "") + digits;
};

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
                <p className="text-xs font-bold text-green-700 uppercase tracking-widest mb-1">Step 1 of 4</p>
                <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-1">Basic Details</h2>
                <p className="text-sm text-gray-500">Your public profile information. Tutors with detailed profiles book 3× more sessions.</p>
            </div>

            {/* Banner */}
            <div>
                <Label>Profile banner</Label>
                <div className="relative h-24 sm:h-28 rounded-2xl overflow-hidden border border-gray-200">
                    <BannerPreview imageUrl={bannerImagePreview} className="w-full h-full" />
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
                <p className="text-xs text-gray-400 mt-1.5">Upload a custom banner image to personalise your profile</p>
            </div>

            {/* Profile photo */}
            <div>
                <Label>Profile photo</Label>
                <div className="flex items-center gap-4">
                    <div className="relative shrink-0">
                        <div className="w-16 h-16 rounded-xl bg-green-950 flex items-center justify-center text-white font-bold text-sm ring-4 ring-gray-100 overflow-hidden">
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

interface MiniFormProps {
    title: string;
    onClose: () => void;
    onAdd: () => void;
    disabled: boolean;
    children: React.ReactNode;
}

const MiniForm = ({ title, onClose, onAdd, disabled, children }: MiniFormProps) => (
    <div className="mt-1 p-4 sm:p-5 bg-white rounded-2xl">
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

const emptyTimeSlot = (id: number): TimeSlot => ({ id, startTime: "09:00", endTime: "10:00", isBooked: false });

const AvailabilitySection = ({
    data, setData, disabled,
}: { data: ProfileData; setData: (d: ProfileData) => void; disabled?: boolean }) => {

    const updateDay = (dayKey: string, updater: (d: DayAvailability) => DayAvailability) => {
        setData({
            ...data,
            availability: data.availability.map(d => d.day === dayKey ? updater(d) : d),
        });
    };

    const toggleDay = (dayKey: string) => {
        updateDay(dayKey, d => {
            const enabling = !d.enabled;
            return {
                ...d,
                enabled: enabling,
                // seed a first slot when switching a day on for the first time
                slots: enabling && d.slots.length === 0 ? [emptyTimeSlot(1)] : d.slots,
            };
        });
    };

    const addSlot = (dayKey: string) => {
        updateDay(dayKey, d => {
            if (d.slots.length >= MAX_SLOTS_PER_DAY) return d;
            const nextId = d.slots.length ? Math.max(...d.slots.map(s => s.id)) + 1 : 1;
            return { ...d, slots: [...d.slots, emptyTimeSlot(nextId)] };
        });
    };

    const removeSlot = (dayKey: string, slotId: number) => {
        updateDay(dayKey, d => ({ ...d, slots: d.slots.filter(s => s.id !== slotId) }));
    };

    const updateSlot = (dayKey: string, slotId: number, field: "startTime" | "endTime", value: string) => {
        updateDay(dayKey, d => ({
            ...d,
            slots: d.slots.map(s => s.id === slotId ? { ...s, [field]: value } : s),
        }));
    };

    const applyToAllDays = (dayKey: string) => {
        const source = data.availability.find(d => d.day === dayKey);
        if (!source || source.slots.length === 0) return;
        setData({
            ...data,
            availability: data.availability.map(d => ({
                ...d,
                enabled: true,
                slots: source.slots.map((s, idx) => ({ ...s, id: idx + 1 })),
            })),
        });
    };

    return (
        <div className="bg-gray-50 rounded-2xl border border-gray-200 p-4 sm:p-5">
            <SectionTitle icon={FiClock}>Weekly availability</SectionTitle>
            <p className="text-xs text-gray-500 mb-4">
                Turn on the days you're available and add up to {MAX_SLOTS_PER_DAY} time slots per day.
            </p>

            <div className="flex flex-col gap-2.5">
                {data.availability.map(dayAv => {
                    const dayMeta = DAYS_OF_WEEK.find(d => d.key === dayAv.day)!;
                    const atMax = dayAv.slots.length >= MAX_SLOTS_PER_DAY;

                    return (
                        <div
                            key={dayAv.day}
                            className={`rounded-xl border p-3.5 transition-all ${dayAv.enabled ? "bg-white border-gray-200" : "bg-gray-100/60 border-gray-200"}`}
                        >
                            {/* Day header row */}
                            <div className="flex items-center justify-between gap-3 flex-wrap">
                                <div className="flex items-center gap-3">
                                    <button
                                        type="button"
                                        disabled={disabled}
                                        onClick={() => toggleDay(dayAv.day)}
                                        className={`relative w-9 h-5 rounded-full transition-all shrink-0 ${dayAv.enabled ? "bg-green-700" : "bg-gray-300"}`}
                                    >
                                        <span
                                            className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${dayAv.enabled ? "left-4" : "left-0.5"}`}
                                        />
                                    </button>
                                    <span className={`text-sm font-bold ${dayAv.enabled ? "text-gray-900" : "text-gray-400"}`}>
                                        {dayMeta.label}
                                    </span>
                                    {!dayAv.enabled && (
                                        <span className="text-xs text-gray-400 italic">Unavailable</span>
                                    )}
                                </div>

                                {dayAv.enabled && (
                                    <div className="flex items-center gap-3">
                                        <button
                                            type="button"
                                            disabled={disabled}
                                            onClick={() => applyToAllDays(dayAv.day)}
                                            className="text-[11px] font-semibold text-gray-400 hover:text-green-700 transition-colors"
                                        >
                                            Copy to all days
                                        </button>
                                        <button
                                            type="button"
                                            disabled={disabled || atMax}
                                            onClick={() => addSlot(dayAv.day)}
                                            className="flex items-center gap-1 text-xs font-semibold text-green-700 hover:text-green-800 disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                                        >
                                            <FiPlus size={12} /> Add slot
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Time slots */}
                            {dayAv.enabled && (
                                <div className="mt-3 flex flex-col gap-2">
                                    {dayAv.slots.map(slot => (
                                        <div key={slot.id} className="flex items-center gap-2">
                                            <input
                                                type="time"
                                                disabled={disabled || !!slot.isBooked}
                                                value={slot.startTime}
                                                onChange={e => updateSlot(dayAv.day, slot.id, "startTime", e.target.value)}
                                                className="flex-1 min-w-0 border border-gray-200 rounded-lg px-2.5 py-2 text-xs text-gray-700 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all disabled:opacity-60"
                                            />
                                            <span className="text-xs text-gray-400 shrink-0">to</span>
                                            <input
                                                type="time"
                                                disabled={disabled || !!slot.isBooked}
                                                value={slot.endTime}
                                                onChange={e => updateSlot(dayAv.day, slot.id, "endTime", e.target.value)}
                                                className="flex-1 min-w-0 border border-gray-200 rounded-lg px-2.5 py-2 text-xs text-gray-700 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all disabled:opacity-60"
                                            />
                                            {slot.isBooked ? (
                                                <span className="text-[10px] font-semibold text-amber-600 bg-amber-50 border border-amber-200 rounded-full px-2 py-1 shrink-0">Booked</span>
                                            ) : (
                                                <button
                                                    type="button"
                                                    disabled={disabled}
                                                    onClick={() => removeSlot(dayAv.day, slot.id)}
                                                    className="p-1.5 text-gray-300 hover:text-red-400 transition-colors shrink-0"
                                                >
                                                    <FiTrash2 size={13} />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                    {atMax && (
                                        <p className="text-[11px] text-gray-400 italic">Maximum {MAX_SLOTS_PER_DAY} slots reached for this day</p>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

/* ─── Step 2: Teaching Setup ─────────────────────────────────────────── */
const Step2 = ({ data, setData, disabled }: { data: ProfileData; setData: (d: ProfileData) => void; disabled?: boolean }) => {
    const [showExpForm, setShowExpForm] = useState(false);
    const [showEduForm, setShowEduForm] = useState(false);
    const [subjectPick, setSubjectPick] = useState("");

    const [newExp, setNewExp] = useState<Omit<ExperienceItem, "id">>({ title: "", company: "", description: "" });
    const [newEdu, setNewEdu] = useState<Omit<EducationItem, "id">>({ degree: "", institution: "", description: "" });

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
        if (!newExp.title || !newExp.company) return;
        setData({ ...data, experience: [...data.experience, { ...newExp, id: nextId(data.experience) }] });
        setNewExp({ title: "", company: "", description: "" });
        setShowExpForm(false);
    };
    const removeExp = (id: number) => setData({ ...data, experience: data.experience.filter(e => e.id !== id) });

    const addEdu = () => {
        if (!newEdu.degree || !newEdu.institution) return;
        setData({ ...data, education: [...data.education, { ...newEdu, id: nextId(data.education) }] });
        setNewEdu({ degree: "", institution: "", description: "" });
        setShowEduForm(false);
    };
    const removeEdu = (id: number) => setData({ ...data, education: data.education.filter(e => e.id !== id) });

    return (
        <div className="space-y-8">
            <div>
                <p className="text-xs font-bold text-green-700 uppercase tracking-widest mb-1">Step 2 of 4</p>
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
                                    <p className="text-sm font-bold text-gray-900 leading-tight truncate">{e.title}</p>
                                    <p className="text-xs text-green-700 font-semibold mt-0.5 truncate">{e.company}{e.description ? ` • ${e.description}` : ""}</p>
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
                            disabled={!newExp.title || !newExp.company}>
                            <input className={baseCls} placeholder="Role / title e.g. Senior Math Tutor"
                                value={newExp.title} onChange={e => setNewExp(prev => ({ ...prev, title: e.target.value }))} />
                            <input className={baseCls} placeholder="Organisation e.g. WeLearnGlobal"
                                value={newExp.company} onChange={e => setNewExp(prev => ({ ...prev, company: e.target.value }))} />
                            <input className={baseCls} placeholder="Period / description e.g. 2021 – Present"
                                value={newExp.description} onChange={e => setNewExp(prev => ({ ...prev, description: e.target.value }))} />
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
                                    <p className="text-xs text-green-700 font-semibold mt-0.5 truncate">{e.institution}{e.description ? ` • ${e.description}` : ""}</p>
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
                            disabled={!newEdu.degree || !newEdu.institution}>
                            <input className={baseCls} placeholder="Degree e.g. PhD in Theoretical Mathematics"
                                value={newEdu.degree} onChange={e => setNewEdu(prev => ({ ...prev, degree: e.target.value }))} />
                            <input className={baseCls} placeholder="School e.g. Cambridge University"
                                value={newEdu.institution} onChange={e => setNewEdu(prev => ({ ...prev, institution: e.target.value }))} />
                            <input className={baseCls} placeholder="Description e.g. Graduated 2014"
                                value={newEdu.description} onChange={e => setNewEdu(prev => ({ ...prev, description: e.target.value }))} />
                        </MiniForm>
                    )}
                </div>
            </div>
        </div>
    );
};

/* ─── Step 3: Availability (its own dedicated step/page) ─────────────── */
const Step3Availability = ({ data, setData, disabled }: { data: ProfileData; setData: (d: ProfileData) => void; disabled?: boolean }) => (
    <div className="space-y-7">
        <div>
            <p className="text-xs font-bold text-green-700 uppercase tracking-widest mb-1">Step 3 of 4</p>
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-1">Availability</h2>
            <p className="text-sm text-gray-500">Set the days and time slots when students can book sessions with you.</p>
        </div>
        <AvailabilitySection data={data} setData={setData} disabled={disabled} />
    </div>
);

/* ─── Step 4: Banking Info ───────────────────────────────────────────── */
const Step4 = ({ data, setData }: { data: ProfileData; setData: (d: ProfileData) => void }) => {
    const [showNumber, setShowNumber] = useState(false);

    return (
        <div className="space-y-7">
            <div>
                <p className="text-xs font-bold text-green-700 uppercase tracking-widest mb-1">Step 4 of 4</p>
                <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-1">Banking Info</h2>
                <p className="text-sm text-gray-500">Where should we send your earnings? All details are encrypted and never visible to students.</p>
            </div>

            <div className="space-y-5">

                <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">Account holder name</label>
                    <div className={fieldCls}>
                        <FiUser size={15} className="text-gray-400 shrink-0" />
                        <input className={inpCls} placeholder="Full legal name as it appears on your bank account"
                            value={data.accountName}
                            type="text"
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
                            type="text"
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
                            // inputMode="numeric"
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


function normalizeSkills(value: unknown): string[] {
    if (Array.isArray(value)) return value.filter(Boolean);
    if (typeof value === "string" && value.trim()) {
        return value.split(",").map(s => s.trim()).filter(Boolean);
    }
    return [];
}
const toShortTime = (t: unknown, fallback: string) =>
    typeof t === "string" && t.length >= 5 ? t.slice(0, 5) : fallback;

function normalizeAvailability(value: unknown): DayAvailability[] {
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

    if (arr.length === 0) return defaultAvailability;

    if (typeof arr[0]?.day_of_week === "number" || typeof arr[0]?.day_of_week === "string") {
        const grouped: Record<string, TimeSlot[]> = {};
        arr.forEach((item: any) => {
            const dayKey = normalizeDayKey(item?.day_of_week ?? item?.day ?? item?.day_name);
            if (!dayKey) return;
            if (!grouped[dayKey]) grouped[dayKey] = [];
            if (grouped[dayKey].length >= MAX_SLOTS_PER_DAY) return;
            grouped[dayKey].push({
                id: grouped[dayKey].length + 1,
                startTime: toShortTime(item?.start_time ?? item?.startTime, "09:00"),
                endTime: toShortTime(item?.end_time ?? item?.endTime, "10:00"),
                isBooked: !!(item?.is_booked ?? item?.is_booked === false),
            });
        });
        return DAYS_OF_WEEK.map(d => {
            const slots = grouped[d.key] || [];
            return { day: d.key, enabled: slots.length > 0, slots };
        });
    }

    // Legacy nested format: entries look like { day, enabled, slots: [...] }
    return DAYS_OF_WEEK.map(d => {
        const found = arr.find((a: any) => a?.day === d.key);
        if (!found) return { day: d.key, enabled: false, slots: [] };
        const slots: TimeSlot[] = Array.isArray(found.slots)
            ? found.slots.slice(0, MAX_SLOTS_PER_DAY).map((s: any, idx: number) => ({
                id: typeof s?.id === "number" ? s.id : idx + 1,
                startTime: toShortTime(s?.startTime, "09:00"),
                endTime: toShortTime(s?.endTime, "10:00"),
                isBooked: !!s?.isBooked,
            }))
            : [];
        return { day: d.key, enabled: !!found.enabled && slots.length > 0, slots };
    });
}

const emptyProfileData: ProfileData = {
    firstName: "", lastName: "", email: "",
    title: "",
    phone: "", bio: "", skills: [],
    location: "", language: "",
    responseTime: "< 2 hours", sessionMode: "both",
    experience: [],
    education: [],
    subjects: [], hourlyRate: "",
    availability: defaultAvailability,
    accountName: "", bankName: "", accountNumber: "",
    averageRating: "0.00", totalSessions: 0,
    isVerified: false, verificationStatus: "pending",
};

/* ─── Step validation ────────────────────────────────────────────────
   Each function returns null when the step's fields are all filled in,
   or a short human-readable error message describing what's missing. */
const validateStep1 = (d: ProfileData): string | null => {
    if (!d.title.trim()) return "Please add your professional title.";
    if (!d.phone.trim()) return "Please add your phone number.";
    if (!d.bio.trim()) return "Please add a bio.";
    if (d.bio.trim().length < 100) return "Your bio should be at least 100 characters.";
    if (d.skills.length === 0) return "Please add at least one skill.";
    if (!d.location.trim()) return "Please add your location.";
    if (!d.language.trim()) return "Please select a language.";
    if (!d.responseTime.trim()) return "Please select a response time.";
    return null;
};

const validateStep2 = (d: ProfileData): string | null => {
    if (d.subjects.length === 0) return "Please add at least one subject you teach.";
    if (!d.hourlyRate || Number(d.hourlyRate) <= 0) return "Please enter a valid hourly rate.";
    if (d.experience.length === 0) return "Please add at least one experience entry.";
    if (d.education.length === 0) return "Please add at least one education entry.";
    return null;
};

const validateStep3 = (d: ProfileData): string | null => {
    const hasSlot = d.availability.some(day => day.enabled && day.slots.length > 0);
    if (!hasSlot) return "Please set availability for at least one day.";
    return null;
};

const validateStep4 = (d: ProfileData): string | null => {
    if (!d.accountName.trim()) return "Please add the account holder name.";
    if (!d.bankName.trim()) return "Please add your bank name.";
    if (!d.accountNumber.trim()) return "Please add your account number.";
    return null;
};

const getStepError = (step: Step, d: ProfileData): string | null => {
    switch (step) {
        case 1: return validateStep1(d);
        case 2: return validateStep2(d);
        case 3: return validateStep3(d);
        case 4: return validateStep4(d);
        default: return null;
    }
};

/* ─── Main ───────────────────────────────────────────────────────────── */
const TutorProfile = () => {
    const [mode, setMode] = useState<PageMode>("view");
    const modeInitialized = useRef(false);

    const [step, setStep] = useState<Step>(1);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [data, setData] = useState<ProfileData>(emptyProfileData);

    const [profileImagePreview, setProfileImagePreview] = useState<string>("");
    const [bannerImagePreview, setBannerImagePreview] = useState<string>("");

    const { userProfile, isLoading: isUserLoading } = useGetUserProfile();
    const user = userProfile?.data;

    const { tutorProfile, isLoading: isTutorLoading } = useGetTutorProfile();
    const tutor = tutorProfile?.data;

    console.log("TutorProfile: tutor", tutor);

    const hasProfile = !!tutor;
    const { mutate: updateTutorProfile, isPending: isUpdating } = useUpdateTutorProfile();
    const isPending = isUpdating;

    const isLoading = isUserLoading || isTutorLoading;

    useEffect(() => {
        if (!isTutorLoading && !modeInitialized.current) {
            modeInitialized.current = true;
            setMode(hasProfile ? "view" : "empty");
        }
    }, [isTutorLoading, hasProfile]);

    const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
    const [bannerImageFile, setBannerImageFile] = useState<File | null>(null);

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

        const availabilitySource = tutor.availability_slots ?? tutor.availability;

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
            availability: availabilitySource !== undefined
                ? normalizeAvailability(availabilitySource)
                : prev.availability,
            accountName: paymentInfo.account_name ?? prev.accountName,
            bankName: paymentInfo.bank_name ?? prev.bankName,
            accountNumber: paymentInfo.account_number ?? prev.accountNumber,
            averageRating: tutor.average_rating ?? prev.averageRating,
            totalSessions: typeof tutor.total_sessions === "number" ? tutor.total_sessions : prev.totalSessions,
            isVerified: typeof tutor.is_verified === "boolean" ? tutor.is_verified : prev.isVerified,
            verificationStatus: tutor.verification_status ?? prev.verificationStatus,
        }));

        // banner/profile_image now come back as real uploaded file URLs
        if (tutor.banner) setBannerImagePreview(tutor.banner);
        if (tutor.profile_image) setProfileImagePreview(prev => prev || tutor.profile_image);
    }, [tutor]);

    const isStep1Done = !validateStep1(data);
    const isStep2Done = !validateStep2(data);
    const isStep3Done = !validateStep3(data);
    const isStep4Done = !validateStep4(data);
    const pct = Math.round([isStep1Done, isStep2Done, isStep3Done, isStep4Done].filter(Boolean).length / 4 * 100);

    // Build the availability payload in the backend's expected shape:
    // [{ day_of_week: "Monday", start_time: "09:00:00", end_time: "11:00:00", is_booked: false }]
    const buildAvailabilityPayload = () =>
        data.availability
            .filter(d => d.enabled)
            .flatMap(d =>
                d.slots.map(s => ({
                    day_of_week: d.day.charAt(0).toUpperCase() + d.day.slice(1),
                    start_time: `${s.startTime}:00`,
                    end_time: `${s.endTime}:00`,
                    is_booked: !!s.isBooked,
                }))
            );

    const buildPayload = () => {
        const parsedRate = data.hourlyRate ? Number(data.hourlyRate) : NaN;
        const hourlyRate = Number.isFinite(parsedRate) ? parsedRate : 0;

        const availabilityPayload = buildAvailabilityPayload();

        const payload = {
            professional_title: data.title,
            phone_number: data.phone,
            bio: data.bio,
            skills: data.skills,
            location: data.location,
            language: data.language,
            session_status: data.sessionMode,
            subjects: data.subjects,
            hourly_rate: hourlyRate,
            experience: data.experience.map(({ id, ...rest }) => rest),
            education: data.education.map(({ id, ...rest }) => rest),
            availability: availabilityPayload,
            payment_info: {
                account_name: data.accountName,
                bank_name: data.bankName,
                account_number: data.accountNumber,
            },
        };

        console.log("TutorProfile availability payload:", availabilityPayload);
        console.log("TutorProfile payload:", payload);

        return payload;
    };

    function toFormData(payload: Record<string, any>, profileImageFile: File | null, bannerImageFile: File | null) {
        const fd = new FormData();
        Object.entries(payload).forEach(([key, value]) => {
            if (value === undefined || value === null) return;
            fd.append(key, typeof value === "object" ? JSON.stringify(value) : String(value));
        });
        if (profileImageFile) fd.append("profile_image", profileImageFile);
        if (bannerImageFile) fd.append("banner", bannerImageFile);
        return fd;
    }

    const handleSave = () => {
        setErrorMessage("");
        const payload = buildPayload();

        const hasNewImage = !!profileImageFile || !!bannerImageFile;
        const body: any = hasNewImage ? toFormData(payload, profileImageFile, bannerImageFile) : payload;

        updateTutorProfile(body, {
            onSuccess: () => {
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

    // Validates every step before submitting. If any step is incomplete,
    // jumps to the first incomplete step and shows the relevant error.
    const handlePublish = () => {
        for (let s = 1; s <= 4; s++) {
            const err = getStepError(s as Step, data);
            if (err) {
                setErrorMessage(err);
                setStep(s as Step);
                return;
            }
        }
        handleSave();
    };

    // Moves forward only if the current step is fully filled in.
    const goNext = () => {
        const err = getStepError(step, data);
        if (err) {
            setErrorMessage(err);
            return;
        }
        setErrorMessage("");
        setStep(s => Math.min(4, s + 1) as Step);
    };

    // Jumping directly to a step (via sidebar nav or dots) is only allowed
    // once every step before it has been fully filled in.
    const goToStep = (target: Step) => {
        for (let s = 1; s < target; s++) {
            const err = getStepError(s as Step, data);
            if (err) {
                setErrorMessage(err);
                setStep(s as Step);
                return;
            }
        }
        setErrorMessage("");
        setStep(target);
    };

    const handleStartCreate = () => {
        setStep(1);
        setMode("edit");
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

                    {/* ── Left sidebar (step nav only) ── */}
                    <div className="lg:col-span-1 flex flex-col gap-5 lg:sticky lg:top-8 order-2 lg:order-1">
                        <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-5">
                            {STEPS.map(s => {
                                const done = s.id === 1 ? isStep1Done : s.id === 2 ? isStep2Done : s.id === 3 ? isStep3Done : isStep4Done;
                                const active = step === s.id;
                                return (
                                    <button key={s.id} onClick={() => goToStep(s.id as Step)}
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
                            {step === 3 && <Step3Availability data={data} setData={setData} disabled={isPending} />}
                            {step === 4 && <Step4 data={data} setData={setData} />}

                            {/* Nav footer */}
                            <div className="flex flex-wrap items-center justify-between gap-3 pt-6 mt-8 border-t border-gray-100">
                                <button onClick={() => setStep(s => Math.max(1, s - 1) as Step)} disabled={step === 1}
                                    className="flex items-center gap-2 px-4 sm:px-5 py-2.5 border border-gray-200 rounded-full text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all disabled:opacity-40 disabled:cursor-not-allowed order-1">
                                    <FiArrowLeft size={14} /> Previous
                                </button>

                                {/* Dot indicators */}
                                <div className="flex items-center gap-2 order-3 sm:order-2 w-full sm:w-auto justify-center">
                                    {STEPS.map(s => (
                                        <button key={s.id} onClick={() => goToStep(s.id as Step)}
                                            className={`rounded-full transition-all ${step === s.id ? "w-6 h-2 bg-green-700" : "w-2 h-2 bg-gray-200 hover:bg-gray-300"}`} />
                                    ))}
                                </div>

                                {step < 4 ? (
                                    <button onClick={goNext}
                                        className="flex items-center gap-2 px-4 sm:px-5 py-2.5 bg-green-700 text-white rounded-full text-sm font-semibold hover:bg-green-800 transition-all order-2 sm:order-3">
                                        Continue <FiArrowRight size={14} />
                                    </button>
                                ) : (
                                    <button onClick={handlePublish} disabled={isPending}
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