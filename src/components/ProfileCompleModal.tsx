import { FiAlertCircle, FiArrowRight, FiX } from "react-icons/fi";
import { Link } from "react-router-dom";

export interface MissingField {
    key: string;
    label: string;
}

// Adjust this to match your actual route for the TutorProfile page
export const TUTOR_PROFILE_ROUTE = "/tutor/dashboard/profile";

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
 * Reads the raw tutor payload (as returned by the API) and returns a list
 * of human-readable fields that are still missing/empty.
 */
export const getMissingProfileFields = (tutor: any): MissingField[] => {
    if (!tutor) return [];

    const missing: MissingField[] = [];

    if (!tutor.professional_title?.trim()) missing.push({ key: "title", label: "Professional title" });
    if (!tutor.bio?.trim()) missing.push({ key: "bio", label: "Bio" });
    if (!tutor.location?.trim()) missing.push({ key: "location", label: "Location" });
    if (!tutor.language?.trim()) missing.push({ key: "language", label: "Language" });
    if (!tutor.phone_number?.trim()) missing.push({ key: "phone", label: "Phone number" });
    if (isEmptyArrayLike(tutor.skills)) missing.push({ key: "skills", label: "Skills" });
    if (isEmptyArrayLike(tutor.subjects)) missing.push({ key: "subjects", label: "Subjects taught" });
    if (!tutor.hourly_rate || Number(tutor.hourly_rate) <= 0) missing.push({ key: "rate", label: "Hourly rate" });
    if (isEmptyArrayLike(tutor.experience)) missing.push({ key: "experience", label: "Experience" });
    if (isEmptyArrayLike(tutor.education)) missing.push({ key: "education", label: "Education" });
    // if (!tutor.payment_info) missing.push({ key: "payment", label: "Bank / payout details" });
    if (!tutor.profile_image) missing.push({ key: "profile_image", label: "Profile photo" });

    return missing;
};

const ProfileCompletionModal = ({
    missingFields,
    onClose,
}: {
    missingFields: MissingField[];
    onClose: () => void;
}) => {
    if (missingFields.length === 0) return null;

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
                        <div key={f.key} className="flex items-center gap-2.5">
                            <span className="w-4 h-4 rounded-full border-2 border-dashed border-amber-300 shrink-0" />
                            <span className="text-sm text-gray-700">{f.label}</span>
                        </div>
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
                        to={TUTOR_PROFILE_ROUTE}
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