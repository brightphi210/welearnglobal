import { FiAlertCircle, FiArrowRight, FiX } from "react-icons/fi";
import { Link } from "react-router-dom";

export interface MissingField {
    key: string;
    label: string;
    route: string;
}

interface ProfileFieldCheck {
    key: string;
    label: string;
    done: boolean;
    route: string;
}

// Adjust these to match your actual routes
export const TUTOR_PROFILE_ROUTE = "/tutor/dashboard/profile";
export const TUTOR_AVAILABILITY_ROUTE = "/tutor/dashboard/schedule";

const isEmptyArrayLike = (value: unknown) => {
    if (!value) return true;
    if (Array.isArray(value)) return value.length === 0;
    if (typeof value === "string") {
        const trimmed = value.trim();
        if (!trimmed) return true;
        try {
            const parsed = JSON.parse(trimmed);
            return Array.isArray(parsed) ? parsed.length === 0 : false;
        } catch {
            return false;
        }
    }
    return true;
};

/**
 * Single source of truth for every field that counts toward profile
 * completion. Both the "missing fields" list and the completion
 * percentage are derived from this so they can never drift apart.
 */
const buildProfileFieldChecklist = (tutor: any): ProfileFieldCheck[] => {
    if (!tutor) return [];

    return [
        { key: "title", label: "Professional title", done: !!tutor.professional_title?.trim(), route: TUTOR_PROFILE_ROUTE },
        { key: "bio", label: "Bio", done: !!tutor.bio?.trim(), route: TUTOR_PROFILE_ROUTE },
        { key: "location", label: "Location", done: !!tutor.location?.trim(), route: TUTOR_PROFILE_ROUTE },
        { key: "language", label: "Language", done: !!tutor.language?.trim(), route: TUTOR_PROFILE_ROUTE },
        { key: "phone", label: "Phone number", done: !!tutor.phone_number?.trim(), route: TUTOR_PROFILE_ROUTE },
        { key: "skills", label: "Skills", done: !isEmptyArrayLike(tutor.skills), route: TUTOR_PROFILE_ROUTE },
        { key: "subjects", label: "Subjects taught", done: !isEmptyArrayLike(tutor.subjects), route: TUTOR_PROFILE_ROUTE },
        { key: "rate", label: "Hourly rate", done: !!tutor.hourly_rate && Number(tutor.hourly_rate) > 0, route: TUTOR_PROFILE_ROUTE },
        { key: "experience", label: "Experience", done: !isEmptyArrayLike(tutor.experience), route: TUTOR_PROFILE_ROUTE },
        { key: "education", label: "Education", done: !isEmptyArrayLike(tutor.education), route: TUTOR_PROFILE_ROUTE },
        { key: "profile_image", label: "Profile photo", done: !!tutor.profile_image, route: TUTOR_PROFILE_ROUTE },
        // if (!tutor.payment_info) missing.push({ key: "payment", label: "Bank / payout details" });
        { key: "availability", label: "Availability", done: !isEmptyArrayLike(tutor.availability_slots), route: TUTOR_AVAILABILITY_ROUTE },
    ];
};

/**
 * Reads the raw tutor payload (as returned by the API) and returns a list
 * of human-readable fields that are still missing/empty, each pointing at
 * the page where the tutor can go fix it (e.g. a missing Availability
 * entry routes to the schedule page instead of the profile edit page).
 */
export const getMissingProfileFields = (tutor: any): MissingField[] => {
    return buildProfileFieldChecklist(tutor)
        .filter((field) => !field.done)
        .map(({ key, label, route }) => ({ key, label, route }));
};

/**
 * Returns the overall completion percentage plus the full checklist
 * (done + not done), so pages like the dashboard's "Profile Status" card
 * can render real progress instead of hardcoded numbers.
 */
export const getProfileCompletion = (tutor: any) => {
    const checklist = buildProfileFieldChecklist(tutor);
    if (checklist.length === 0) return { percent: 0, checklist };

    const doneCount = checklist.filter((field) => field.done).length;
    const percent = Math.round((doneCount / checklist.length) * 100);

    return { percent, checklist };
};

const ProfileCompletionModal = ({
    missingFields,
    onClose,
}: {
    missingFields: MissingField[];
    onClose: () => void;
}) => {
    if (missingFields.length === 0) return null;

    // If everything left is Availability, send the primary CTA straight to
    // the schedule page instead of the profile editor.
    const primaryRoute = missingFields[0]?.route || TUTOR_PROFILE_ROUTE;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-2xl border border-gray-200 shadow-xl max-w-md w-full p-6 sm:p-7">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-600 rounded-lg transition-all"
                >
                    <FiX size={16} />
                </button>

                <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center mb-4">
                    <FiAlertCircle size={22} className="text-amber-600" />
                </div>

                <h3 className="text-lg font-extrabold text-gray-900 mb-1.5">
                    Finish setting up your profile
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-4">
                    Students can't fully find or book you yet. Complete the following{" "}
                    {missingFields.length} item{missingFields.length === 1 ? "" : "s"} to boost your visibility:
                </p>

                <div className="flex flex-col gap-2 mb-6 max-h-56 overflow-y-auto pr-1">
                    {missingFields.map((f) => (
                        <Link
                            key={f.key}
                            to={f.route}
                            onClick={onClose}
                            className="group flex items-center gap-2.5"
                        >
                            <span className="w-4 h-4 rounded-full border-2 border-dashed border-amber-300 shrink-0" />
                            <span className="text-sm text-gray-700 group-hover:text-green-700 group-hover:underline">
                                {f.label}
                            </span>
                        </Link>
                    ))}
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={onClose}
                        className="flex-1 py-2.5 border border-gray-200 rounded-full text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all"
                    >
                        Later
                    </button>
                    <Link
                        to={primaryRoute}
                        onClick={onClose}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-green-700 text-white rounded-full text-sm font-semibold hover:bg-green-800 transition-all"
                    >
                        Complete Profile <FiArrowRight size={14} />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ProfileCompletionModal;