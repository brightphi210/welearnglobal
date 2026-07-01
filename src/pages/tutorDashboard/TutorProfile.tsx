import { useRef, useState } from "react";
import { FaGraduationCap } from "react-icons/fa";
import {
    FiArrowLeft,
    FiArrowRight,
    FiAward,
    FiBook,
    FiBriefcase,
    FiCheckCircle,
    FiClock,
    FiCreditCard,
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

/* ─── Types ──────────────────────────────────────────────────────────── */
type SessionMode = "online" | "onsite" | "both";
type Step = 1 | 2 | 3;

interface ExperienceItem { id: number; role: string; org: string; period: string; }
interface EducationItem { id: number; degree: string; school: string; year: string; }
interface CourseItem {
    id: number; name: string; subject: string; description: string;
    level: string; price: string; duration: string;
}

interface ProfileData {
    firstName: string; lastName: string; title: string;
    phone: string; bio: string; skills: string[];
    location: string; language: string; responseTime: string;
    sessionMode: SessionMode; bannerGradient: number;
    experience: ExperienceItem[]; education: EducationItem[];
    courses: CourseItem[];
    accountName: string; bankName: string; accountNumber: string;
    routingNumber: string; accountType: "checking" | "savings";
    paypalEmail: string;
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
const LEVELS = ["Beginner", "Intermediate", "Advanced", "All Levels"];
const SUBJECTS = ["Mathematics", "Physics", "Chemistry", "Biology", "English", "Spanish", "French", "Music", "Programming", "Design", "Business", "History"];
const DURATIONS = ["30 min", "1 hour", "1.5 hours", "2 hours"];

const STEPS = [
    { id: 1, label: "Basic Details", short: "Personal info, skills & bio" },
    { id: 2, label: "Teaching Setup", short: "Status, courses & credentials" },
    { id: 3, label: "Banking Info", short: "Payout account & payment" },
];

/* ─── Banner Component ───────────────────────────────────────────────── */
const BannerPreview = ({ themeIdx, className = "" }: { themeIdx: number; className?: string }) => {
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
const LivePreviewCard = ({ data }: { data: ProfileData }) => {
    const fullName = [data.firstName, data.lastName].filter(Boolean).join(" ") || "Your Name";
    const initials = [data.firstName?.[0], data.lastName?.[0]].filter(Boolean).join("").toUpperCase() || "?";

    return (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm text-left">
            {/* Banner */}
            <div className="relative">
                <BannerPreview themeIdx={data.bannerGradient} className="h-28 w-full" />
                <div className="absolute bottom-0 left-5 translate-y-1/2">
                    <div className="relative w-14 h-14 rounded-xl bg-green-950 ring-4 ring-white flex items-center justify-center text-white font-bold text-base">
                        {initials}
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-600 rounded-full border-2 border-white flex items-center justify-center">
                            <FiCheckCircle size={9} className="text-white" />
                        </div>
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
                <h3 className="text-base font-extrabold text-gray-900 leading-tight">{fullName}</h3>
                {data.title && <p className="text-xs text-gray-500 mt-0.5">{data.title}</p>}

                {/* Stars */}
                <div className="flex items-center gap-1 mt-2">
                    {[1, 2, 3, 4, 5].map(i => <FiStar key={i} size={10} className="text-amber-400 fill-amber-400" />)}
                    <span className="text-xs font-bold text-gray-800 ml-1">4.9</span>
                    <span className="text-xs text-gray-500">(124 reviews)</span>
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
                <div className="flex gap-1.5 mt-3">
                    {data.sessionMode !== "onsite" && (
                        <span className="px-2.5 py-0.5 border border-green-400 text-green-700 rounded-full text-[10px] font-semibold">Online</span>
                    )}
                    {data.sessionMode !== "online" && (
                        <span className="px-2.5 py-0.5 border border-orange-400 text-orange-700 rounded-full text-[10px] font-semibold bg-orange-50">Onsite</span>
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

/* ─── Reusable input styles ──────────────────────────────────────────── */
const fieldCls = "flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-3 focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-100 transition-all bg-white";
const inpCls = "flex-1 border-none outline-none text-sm text-gray-800 placeholder-gray-400 bg-transparent";
const baseCls = "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all bg-white";

const Label = ({ children }: { children: React.ReactNode }) => (
    <label className="block text-sm font-semibold text-gray-800 mb-2">{children}</label>
);

const SectionTitle = ({ icon: Icon, children }: { icon: any; children: React.ReactNode }) => (
    <div className="flex items-center gap-2 mb-4">
        <Icon size={16} className="text-green-700" />
        <h3 className="text-base font-bold text-gray-900">{children}</h3>
    </div>
);

/* ─── Step 1: Basic Details ──────────────────────────────────────────── */
const Step1 = ({ data, setData }: { data: ProfileData; setData: (d: ProfileData) => void }) => {
    const [skillInput, setSkillInput] = useState("");

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
                <p className="text-xs font-bold text-green-700 uppercase tracking-widest mb-1">Step 1 of 2</p>
                <h2 className="text-2xl font-extrabold text-gray-900 mb-1">Basic Details</h2>
                <p className="text-sm text-gray-500">Your public profile information. Tutors with detailed profiles book 3× more sessions.</p>
            </div>

            {/* Banner */}
            <div>
                <Label>Profile banner</Label>
                <div className="grid grid-cols-6 gap-2 mb-3">
                    {BANNER_THEMES.map((t, i) => (
                        <button
                            key={i}
                            onClick={() => setData({ ...data, bannerGradient: i })}
                            className={`relative rounded-lg overflow-hidden transition-all ${data.bannerGradient === i ? "ring-2 ring-green-700 ring-offset-2 scale-95" : "hover:scale-95 hover:ring-2 hover:ring-gray-300 hover:ring-offset-1"}`}
                            style={{ aspectRatio: "16/9" }}
                        >
                            <div className={`absolute inset-0 ${t.dir} ${t.gradient}`} />
                            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 110" preserveAspectRatio="none">
                                <path d="M -20 90 Q 90 40 200 75 T 420 60 V 130 H -20 Z" fill="white" opacity="0.08" />
                            </svg>
                            {data.bannerGradient === i && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
                                        <FiCheckCircle size={11} className="text-green-700" />
                                    </div>
                                </div>
                            )}
                        </button>
                    ))}
                </div>
                <div className="relative h-28 rounded-2xl overflow-hidden border border-gray-200">
                    <BannerPreview themeIdx={data.bannerGradient} className="w-full h-full" />
                    <button className="absolute inset-0 flex items-center justify-center group">
                        <div className="bg-black/30 backdrop-blur-sm rounded-xl px-3 py-1.5 flex items-center gap-1.5 text-white text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                            <FiUpload size={11} /> Upload custom image
                        </div>
                    </button>
                </div>
            </div>

            {/* Name */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label>First name</Label>
                    <div className={fieldCls}>
                        <FiUser size={15} className="text-gray-400 shrink-0" />
                        <input className={inpCls} placeholder="Sarah" value={data.firstName}
                            onChange={e => setData({ ...data, firstName: e.target.value })} />
                    </div>
                </div>
                <div>
                    <Label>Last name</Label>
                    <div className={fieldCls}>
                        <FiUser size={15} className="text-gray-400 shrink-0" />
                        <input className={inpCls} placeholder="Jenkins" value={data.lastName}
                            onChange={e => setData({ ...data, lastName: e.target.value })} />
                    </div>
                </div>
            </div>

            {/* Title + Phone */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label>Professional title</Label>
                    <div className={fieldCls}>
                        <FaGraduationCap size={15} className="text-gray-400 shrink-0" />
                        <input className={inpCls} placeholder="Senior Mathematics Professor" value={data.title}
                            onChange={e => setData({ ...data, title: e.target.value })} />
                    </div>
                    <p className="text-xs text-gray-400 mt-1.5">Shown under your name on search results</p>
                </div>
                <div>
                    <Label>Phone number</Label>
                    <div className={fieldCls}>
                        <FiPhone size={15} className="text-gray-400 shrink-0" />
                        <input className={inpCls} placeholder="+1 (555) 000-0000" value={data.phone}
                            onChange={e => setData({ ...data, phone: e.target.value })} />
                    </div>
                </div>
            </div>

            {/* Bio */}
            <div>
                <Label>Bio</Label>
                <textarea rows={5} placeholder="With over 12 years of experience in higher education, I specialise in helping students conquer their fear of complex mathematical concepts. My approach is patient, structured, and tailored to each individual's learning style..." value={data.bio}
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
                <div className="flex gap-2 mb-3">
                    <div className={fieldCls + " flex-1"}>
                        <FiAward size={15} className="text-gray-400 shrink-0" />
                        <input className={inpCls} placeholder="e.g. Advanced Calculus, Linear Algebra…"
                            value={skillInput}
                            onChange={e => setSkillInput(e.target.value)}
                            onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addSkill(); } }} />
                    </div>
                    <button onClick={addSkill}
                        className="px-4 py-3 bg-green-700 text-white rounded-xl text-sm font-semibold hover:bg-green-800 transition-all flex items-center gap-1.5 shrink-0">
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
            <div className="grid grid-cols-3 gap-4">
                <div>
                    <Label>Location</Label>
                    <div className={fieldCls}>
                        <FiMapPin size={15} className="text-gray-400 shrink-0" />
                        <input className={inpCls} placeholder="London, UK" value={data.location}
                            onChange={e => setData({ ...data, location: e.target.value })} />
                    </div>
                </div>
                <div>
                    <Label>Teaching language(s)</Label>
                    <div className={fieldCls}>
                        <FiGlobe size={15} className="text-gray-400 shrink-0" />
                        <input className={inpCls} placeholder="English (Native), French…" value={data.language}
                            onChange={e => setData({ ...data, language: e.target.value })} />
                    </div>
                </div>
                <div>
                    <Label>Response time</Label>
                    <div className={fieldCls}>
                        <FiClock size={15} className="text-gray-400 shrink-0" />
                        <input className={inpCls} placeholder="< 2 hours" value={data.responseTime}
                            onChange={e => setData({ ...data, responseTime: e.target.value })} />
                    </div>
                </div>
            </div>
        </div>
    );
};

/* ─── Step 2: Teaching Setup ─────────────────────────────────────────── */
const Step2 = ({ data, setData }: { data: ProfileData; setData: (d: ProfileData) => void }) => {
    const [showCourseForm, setShowCourseForm] = useState(false);
    const [showExpForm, setShowExpForm] = useState(false);
    const [showEduForm, setShowEduForm] = useState(false);

    const [newCourse, setNewCourse] = useState<Omit<CourseItem, "id">>({ name: "", subject: "", description: "", level: "All Levels", price: "", duration: "1 hour" });
    const [newExp, setNewExp] = useState<Omit<ExperienceItem, "id">>({ role: "", org: "", period: "" });
    const [newEdu, setNewEdu] = useState<Omit<EducationItem, "id">>({ degree: "", school: "", year: "" });

    const courseId = useRef(1);
    const expId = useRef(1);
    const eduId = useRef(1);

    const addCourse = () => {
        if (!newCourse.name || !newCourse.subject || !newCourse.price) return;
        setData({ ...data, courses: [...data.courses, { ...newCourse, id: courseId.current++ }] });
        setNewCourse({ name: "", subject: "", description: "", level: "All Levels", price: "", duration: "1 hour" });
        setShowCourseForm(false);
    };
    const removeCourse = (id: number) => setData({ ...data, courses: data.courses.filter(c => c.id !== id) });

    const addExp = () => {
        if (!newExp.role || !newExp.org) return;
        setData({ ...data, experience: [...data.experience, { ...newExp, id: expId.current++ }] });
        setNewExp({ role: "", org: "", period: "" });
        setShowExpForm(false);
    };
    const removeExp = (id: number) => setData({ ...data, experience: data.experience.filter(e => e.id !== id) });

    const addEdu = () => {
        if (!newEdu.degree || !newEdu.school) return;
        setData({ ...data, education: [...data.education, { ...newEdu, id: eduId.current++ }] });
        setNewEdu({ degree: "", school: "", year: "" });
        setShowEduForm(false);
    };
    const removeEdu = (id: number) => setData({ ...data, education: data.education.filter(e => e.id !== id) });

    const MiniForm = ({ title, onClose, onAdd, disabled, children }: { title: string; onClose: () => void; onAdd: () => void; disabled: boolean; children: React.ReactNode }) => (
        <div className="mt-3 p-5 bg-green-50 rounded-2xl border border-green-100">
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

    return (
        <div className="space-y-8">
            <div>
                <p className="text-xs font-bold text-green-700 uppercase tracking-widest mb-1">Step 2 of 2</p>
                <h2 className="text-2xl font-extrabold text-gray-900 mb-1">Teaching Setup</h2>
                <p className="text-sm text-gray-500">Your teaching mode, courses, experience, and education.</p>
            </div>

            {/* ── Session Status ── */}
            <div className="bg-gray-50 rounded-2xl border border-gray-200 p-5">
                <SectionTitle icon={FiGlobe}>Session status</SectionTitle>
                <p className="text-xs text-gray-500 mb-4">How can students attend your sessions?</p>
                <div className="grid grid-cols-3 gap-3">
                    {([
                        { mode: "online", icon: FiGlobe, label: "Online", sub: "Video call" },
                        { mode: "onsite", icon: FiMapPin, label: "On-site", sub: "In person" },
                        { mode: "both", icon: FiCheckCircle, label: "Both", sub: "Flexible" },
                    ] as { mode: SessionMode; icon: any; label: string; sub: string }[]).map(({ mode, icon: Icon, label, sub }) => (
                        <button key={mode} onClick={() => setData({ ...data, sessionMode: mode })}
                            className={`flex flex-col items-center justify-center gap-1.5 p-4 rounded-2xl border-2 transition-all ${data.sessionMode === mode
                                ? "border-green-700 bg-green-700 text-white shadow-md shadow-green-200"
                                : "border-gray-200 bg-white text-gray-600 hover:border-green-300 hover:bg-green-50"}`}>
                            <Icon size={22} />
                            <span className="text-sm font-bold">{label}</span>
                            <span className={`text-[11px] ${data.sessionMode === mode ? "text-green-100" : "text-gray-400"}`}>{sub}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* ── Courses ── */}
            <div className="bg-gray-50 rounded-2xl border border-gray-200 p-5">
                <div className="flex items-center justify-between mb-1">
                    <SectionTitle icon={FiBook}>Courses offered</SectionTitle>
                    <button onClick={() => setShowCourseForm(v => !v)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-green-700 text-white rounded-full text-xs font-semibold hover:bg-green-800 transition-all -mt-3">
                        <FiPlus size={12} /> Add Course
                    </button>
                </div>

                {data.courses.length === 0 && !showCourseForm && (
                    <div className="border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center bg-white">
                        <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-2">
                            <FaGraduationCap size={18} className="text-green-700" />
                        </div>
                        <p className="text-sm font-semibold text-gray-600 mb-1">No courses yet</p>
                        <p className="text-xs text-gray-400">Add at least one course so students know what you teach.</p>
                    </div>
                )}

                <div className="flex flex-col gap-3">
                    {data.courses.map(c => (
                        <div key={c.id} className="bg-white rounded-2xl border border-gray-200 p-4 flex items-start justify-between gap-3">
                            <div className="flex items-start gap-3 min-w-0">
                                <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center shrink-0 mt-0.5">
                                    <FaGraduationCap size={16} className="text-green-700" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-bold text-gray-900">{c.name}</p>
                                    <div className="flex flex-wrap items-center gap-2 mt-0.5">
                                        <span className="text-xs text-gray-500">{c.subject}</span>
                                        <span className="w-1 h-1 rounded-full bg-gray-300" />
                                        <span className="text-xs text-gray-500">{c.level}</span>
                                        <span className="w-1 h-1 rounded-full bg-gray-300" />
                                        <span className="text-xs text-gray-500">{c.duration}</span>
                                    </div>
                                    {c.description && <p className="text-xs text-gray-400 mt-1 line-clamp-2">{c.description}</p>}
                                </div>
                            </div>
                            <div className="flex items-center gap-3 shrink-0">
                                <span className="text-sm font-extrabold text-gray-900">${c.price}<span className="text-xs font-normal text-gray-400">/hr</span></span>
                                <button onClick={() => removeCourse(c.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                                    <FiTrash2 size={13} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {showCourseForm && (
                    <MiniForm title="New course" onClose={() => setShowCourseForm(false)} onAdd={addCourse}
                        disabled={!newCourse.name || !newCourse.subject || !newCourse.price}>
                        <input className={baseCls} placeholder="Course name e.g. Advanced Calculus" value={newCourse.name}
                            onChange={e => setNewCourse({ ...newCourse, name: e.target.value })} />
                        <textarea rows={3} className={baseCls + " resize-none"} placeholder="Brief description of what the course covers and who it's for..."
                            value={newCourse.description} onChange={e => setNewCourse({ ...newCourse, description: e.target.value })} />
                        <div className="grid grid-cols-2 gap-3">
                            <select className={baseCls} value={newCourse.subject} onChange={e => setNewCourse({ ...newCourse, subject: e.target.value })}>
                                <option value="">Select subject</option>
                                {SUBJECTS.map(s => <option key={s}>{s}</option>)}
                            </select>
                            <select className={baseCls} value={newCourse.level} onChange={e => setNewCourse({ ...newCourse, level: e.target.value })}>
                                {LEVELS.map(l => <option key={l}>{l}</option>)}
                            </select>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-3 bg-white focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-100 transition-all">
                                <span className="text-sm font-semibold text-gray-400">$</span>
                                <input type="number" className="flex-1 border-none outline-none text-sm text-gray-800 placeholder-gray-400 bg-transparent"
                                    placeholder="Hourly rate" value={newCourse.price} onChange={e => setNewCourse({ ...newCourse, price: e.target.value })} />
                                <span className="text-xs text-gray-400">/hr</span>
                            </div>
                            <select className={baseCls} value={newCourse.duration} onChange={e => setNewCourse({ ...newCourse, duration: e.target.value })}>
                                {DURATIONS.map(d => <option key={d}>{d}</option>)}
                            </select>
                        </div>
                    </MiniForm>
                )}
            </div>

            {/* ── Experience + Education side by side ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Experience */}
                <div className="bg-gray-50 rounded-2xl border border-gray-200 p-5">
                    <div className="flex items-center justify-between mb-1">
                        <SectionTitle icon={FiBriefcase}>Experience</SectionTitle>
                        <button onClick={() => setShowExpForm(v => !v)}
                            className="text-green-700 text-xs font-semibold flex items-center gap-1 hover:text-green-800 -mt-3">
                            <FiPlus size={13} /> Add
                        </button>
                    </div>

                    <div className="flex flex-col gap-3">
                        {data.experience.map(e => (
                            <div key={e.id} className="flex items-start justify-between gap-2 bg-white rounded-xl border border-gray-200 p-3">
                                <div>
                                    <p className="text-sm font-bold text-gray-900 leading-tight">{e.role}</p>
                                    <p className="text-xs text-green-700 font-semibold mt-0.5">{e.org}{e.period ? ` • ${e.period}` : ""}</p>
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
                                value={newExp.role} onChange={e => setNewExp({ ...newExp, role: e.target.value })} />
                            <input className={baseCls} placeholder="Organisation e.g. WeLearnGlobal"
                                value={newExp.org} onChange={e => setNewExp({ ...newExp, org: e.target.value })} />
                            <input className={baseCls} placeholder="Period e.g. 2021 – Present"
                                value={newExp.period} onChange={e => setNewExp({ ...newExp, period: e.target.value })} />
                        </MiniForm>
                    )}
                </div>

                {/* Education */}
                <div className="bg-gray-50 rounded-2xl border border-gray-200 p-5">
                    <div className="flex items-center justify-between mb-1">
                        <SectionTitle icon={FaGraduationCap}>Education</SectionTitle>
                        <button onClick={() => setShowEduForm(v => !v)}
                            className="text-green-700 text-xs font-semibold flex items-center gap-1 hover:text-green-800 -mt-3">
                            <FiPlus size={13} /> Add
                        </button>
                    </div>

                    <div className="flex flex-col gap-3">
                        {data.education.map(e => (
                            <div key={e.id} className="flex items-start justify-between gap-2 bg-white rounded-xl border border-gray-200 p-3">
                                <div>
                                    <p className="text-sm font-bold text-gray-900 leading-tight">{e.degree}</p>
                                    <p className="text-xs text-green-700 font-semibold mt-0.5">{e.school}{e.year ? ` • ${e.year}` : ""}</p>
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
                                value={newEdu.degree} onChange={e => setNewEdu({ ...newEdu, degree: e.target.value })} />
                            <input className={baseCls} placeholder="School e.g. Cambridge University"
                                value={newEdu.school} onChange={e => setNewEdu({ ...newEdu, school: e.target.value })} />
                            <input className={baseCls} placeholder="Year e.g. 2014"
                                value={newEdu.year} onChange={e => setNewEdu({ ...newEdu, year: e.target.value })} />
                        </MiniForm>
                    )}
                </div>
            </div>
        </div>
    );
};

/* ─── Step 3: Banking Info ───────────────────────────────────────────── */
const Step3 = ({ data, setData }: { data: ProfileData; setData: (d: ProfileData) => void }) => {
    const [showAccount, setShowAccount] = useState(true);
    const [showNumber, setShowNumber] = useState(false);
    const [showRouting, setShowRouting] = useState(false);

    const isBankFilled = !!(data.accountName && data.bankName && data.accountNumber && data.routingNumber);

    return (
        <div className="space-y-7">
            <div>
                <p className="text-xs font-bold text-green-700 uppercase tracking-widest mb-1">Step 3 of 3</p>
                <h2 className="text-2xl font-extrabold text-gray-900 mb-1">Banking Info</h2>
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
                <div className="grid grid-cols-2 gap-3">
                    {([
                        { key: "bank", icon: FiCreditCard, label: "Bank Transfer", sub: "Direct to your account" },
                        { key: "paypal", icon: FiGlobe, label: "PayPal", sub: "Instant payout option" },
                    ] as { key: string; icon: any; label: string; sub: string }[]).map(({ key, icon: Icon, label, sub }) => (
                        <button
                            key={key}
                            onClick={() => setShowAccount(key === "bank")}
                            className={`flex items-center gap-3 p-4 rounded-2xl border-2 text-left transition-all ${showAccount === (key === "bank")
                                ? "border-green-700 bg-green-50"
                                : "border-gray-200 bg-white hover:border-green-200 hover:bg-green-50/50"}`}
                        >
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${showAccount === (key === "bank") ? "bg-green-700" : "bg-gray-100"}`}>
                                <Icon size={18} className={showAccount === (key === "bank") ? "text-white" : "text-gray-500"} />
                            </div>
                            <div>
                                <p className={`text-sm font-bold leading-none ${showAccount === (key === "bank") ? "text-green-800" : "text-gray-700"}`}>{label}</p>
                                <p className="text-[11px] text-gray-400 mt-0.5">{sub}</p>
                            </div>
                            {showAccount === (key === "bank") && (
                                <FiCheckCircle size={16} className="text-green-700 ml-auto shrink-0" />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Bank transfer form */}
            {showAccount && (
                <div className="space-y-5">
                    {/* Account holder name */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-2">Account holder name</label>
                        <div className={fieldCls}>
                            <FiUser size={15} className="text-gray-400 shrink-0" />
                            <input className={inpCls} placeholder="Full legal name as it appears on your bank account"
                                value={data.accountName}
                                onChange={e => setData({ ...data, accountName: e.target.value })} />
                        </div>
                    </div>

                    {/* Bank name + Account type */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-800 mb-2">Bank name</label>
                            <div className={fieldCls}>
                                <FiCreditCard size={15} className="text-gray-400 shrink-0" />
                                <input className={inpCls} placeholder="e.g. Chase, Barclays"
                                    value={data.bankName}
                                    onChange={e => setData({ ...data, bankName: e.target.value })} />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-800 mb-2">Account type</label>
                            <div className="grid grid-cols-2 gap-2 h-[50px]">
                                {(["checking", "savings"] as const).map(type => (
                                    <button
                                        key={type}
                                        onClick={() => setData({ ...data, accountType: type })}
                                        className={`rounded-xl border-2 text-xs font-semibold capitalize transition-all ${data.accountType === type
                                            ? "border-green-700 bg-green-700 text-white"
                                            : "border-gray-200 bg-white text-gray-600 hover:border-green-300"}`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Account number */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-2">Account number</label>
                        <div className={fieldCls}>
                            <FiLock size={15} className="text-gray-400 shrink-0" />
                            <input
                                type={showNumber ? "text" : "password"}
                                className={inpCls}
                                placeholder="Enter your account number"
                                value={data.accountNumber}
                                onChange={e => setData({ ...data, accountNumber: e.target.value })}
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
                            <FiLock size={10} /> Masked for your security
                        </p>
                    </div>

                    {/* Routing number */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-2">Routing / Sort code</label>
                        <div className={fieldCls}>
                            <FiLock size={15} className="text-gray-400 shrink-0" />
                            <input
                                type={showRouting ? "text" : "password"}
                                className={inpCls}
                                placeholder="9-digit routing number"
                                value={data.routingNumber}
                                onChange={e => setData({ ...data, routingNumber: e.target.value })}
                            />
                            <button
                                type="button"
                                onClick={() => setShowRouting(v => !v)}
                                className="text-gray-400 hover:text-gray-600 transition-colors bg-transparent border-none cursor-pointer p-0 shrink-0"
                            >
                                {showRouting
                                    ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" /><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                                    : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                                }
                            </button>
                        </div>
                    </div>

                    {/* Saved account confirmation */}
                    {isBankFilled && (
                        <div className="flex items-center justify-between gap-3 p-4 bg-green-50 border border-green-200 rounded-2xl">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-green-700 flex items-center justify-center shrink-0">
                                    <FiCreditCard size={16} className="text-white" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-900">
                                        {data.bankName} ••••{data.accountNumber.slice(-4)}
                                    </p>
                                    <p className="text-xs text-gray-500 capitalize">{data.accountName} · {data.accountType}</p>
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
            {!showAccount && (
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
                        <div className="flex items-center justify-between gap-3 mt-4 p-4 bg-green-50 border border-green-200 rounded-2xl">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-green-700 flex items-center justify-center shrink-0">
                                    <FiGlobe size={16} className="text-white" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-900">PayPal</p>
                                    <p className="text-xs text-gray-500">{data.paypalEmail}</p>
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

/* ─── Main ───────────────────────────────────────────────────────────── */
const TutorProfile = () => {
    const [step, setStep] = useState<Step>(1);
    const [saved, setSaved] = useState(false);

    const [data, setData] = useState<ProfileData>({
        firstName: "Sarah", lastName: "Jenkins",
        title: "Senior Mathematics Professor",
        phone: "", bio: "", skills: ["Advanced Calculus", "Linear Algebra", "Pure Mathematics", "Statistics"],
        location: "London, UK", language: "English (Native), French (Fluent)",
        responseTime: "< 2 hours", sessionMode: "both", bannerGradient: 0,
        experience: [
            { id: 1, role: "Senior Math Tutor", org: "WeLearnGlobal", period: "2021 – Present" },
            { id: 2, role: "Assistant Professor", org: "University of Oxford", period: "2015 – 2021" },
        ],
        education: [
            { id: 1, degree: "PhD in Theoretical Mathematics", school: "Cambridge University", year: "2014" },
            { id: 2, degree: "M.Sc. in Applied Statistics", school: "Imperial College London", year: "2010" },
        ],
        courses: [
            { id: 1, name: "Advanced Calculus", subject: "Mathematics", description: "Deep dive into differential and integral calculus for university-level students.", level: "Advanced", price: "45", duration: "1 hour" },
        ],
        accountName: "", bankName: "", accountNumber: "",
        routingNumber: "", accountType: "checking", paypalEmail: "",
    });

    const isStep1Done = !!(data.firstName && data.lastName && data.title);
    const isStep2Done = data.courses.length > 0;
    const isStep3Done = !!(data.accountName && data.bankName && data.accountNumber && data.routingNumber) || !!(data.paypalEmail);
    const pct = Math.round([isStep1Done, isStep2Done, isStep3Done].filter(Boolean).length / 3 * 100);

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
    };

    return (
        <div className="md:pl-56 pb-20 md:pb-8 pt-20 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 mb-1">Edit Profile</h1>
                        <p className="text-sm text-gray-500">{pct}% complete · {pct < 100 ? "Keep going to boost your visibility" : "Your profile is fully set up"}</p>
                    </div>
                    <button onClick={handleSave}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all shrink-0 ${saved ? "bg-green-100 text-green-700 border border-green-200" : "bg-green-700 text-white hover:bg-green-800"}`}>
                        {saved ? <><FiCheckCircle size={15} /> Saved!</> : <><FiEdit2 size={15} /> Save Changes</>}
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

                    {/* ── Left sidebar ── */}
                    <div className="lg:col-span-1 flex flex-col gap-5 lg:sticky lg:top-8">
                        {/* Step nav */}
                        <div className="bg-white rounded-2xl border border-gray-200 p-5">
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
                            <LivePreviewCard data={data} />
                            <p className="text-[10px] text-gray-400 text-center mt-2">This is how students see your card</p>
                        </div>
                    </div>

                    {/* ── Right: form panel ── */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8">
                            {step === 1 && <Step1 data={data} setData={setData} />}
                            {step === 2 && <Step2 data={data} setData={setData} />}
                            {step === 3 && <Step3 data={data} setData={setData} />}

                            {/* Nav footer */}
                            <div className="flex items-center justify-between pt-6 mt-8 border-t border-gray-100">
                                <button onClick={() => setStep(s => Math.max(1, s - 1) as Step)} disabled={step === 1}
                                    className="flex items-center gap-2 px-5 py-2.5 border border-gray-200 rounded-full text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                                    <FiArrowLeft size={14} /> Previous
                                </button>

                                {/* Dot indicators */}
                                <div className="flex items-center gap-2">
                                    {STEPS.map(s => (
                                        <button key={s.id} onClick={() => setStep(s.id as Step)}
                                            className={`rounded-full transition-all ${step === s.id ? "w-6 h-2 bg-green-700" : "w-2 h-2 bg-gray-200 hover:bg-gray-300"}`} />
                                    ))}
                                </div>

                                {step < 3 ? (
                                    <button onClick={() => setStep(s => (s + 1) as Step)}
                                        className="flex items-center gap-2 px-5 py-2.5 bg-green-700 text-white rounded-full text-sm font-semibold hover:bg-green-800 transition-all">
                                        Continue <FiArrowRight size={14} />
                                    </button>
                                ) : (
                                    <button onClick={handleSave}
                                        className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${saved ? "bg-green-100 text-green-700 border border-green-200" : "bg-green-700 text-white hover:bg-green-800"}`}>
                                        {saved ? <><FiCheckCircle size={14} /> Saved!</> : <>Publish Profile <FiArrowRight size={14} /></>}
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