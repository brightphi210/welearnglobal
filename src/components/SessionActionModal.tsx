import { FiExternalLink, FiVideo, FiX } from "react-icons/fi";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

// Central place for the session-details route so every page links to the
// exact same URL shape.
export const TUTOR_SESSION_ROUTE = (id: string | number) => `/tutor/dashboard/sessions/${id}`;

interface SessionActionModalProps {
    open: boolean;
    onClose: () => void;
    sessionId: string | number;
    sessionLink?: string;
}

const SessionActionModal = ({ open, onClose, sessionId, sessionLink }: SessionActionModalProps) => {
    if (!open) return null;

    const handleJoinMeeting = () => {
        if (!sessionLink) {
            toast("No meeting link is available yet.", { type: "info" });
            return;
        }
        window.open(sessionLink, "_blank", "noopener,noreferrer");
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-2xl border border-gray-200 shadow-xl max-w-sm w-full p-6">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-600 rounded-lg transition-all"
                >
                    <FiX size={16} />
                </button>

                <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center mb-4">
                    <FiVideo size={22} className="text-green-700" />
                </div>

                <h3 className="text-lg font-extrabold text-gray-900 mb-1.5">Session options</h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-5">
                    Jump straight into the meeting, or open the full session page for all the details.
                </p>

                <div className="flex flex-col gap-2">
                    <button
                        onClick={handleJoinMeeting}
                        className="w-full flex items-center justify-center gap-1.5 py-3 bg-green-700 text-white rounded-full text-xs font-semibold hover:bg-green-800 transition-all"
                    >
                        <FiVideo size={14} />
                        Join Meeting
                    </button>
                    <Link
                        to={TUTOR_SESSION_ROUTE(sessionId)}
                        onClick={onClose}
                        className="w-full flex items-center justify-center gap-1.5 py-3 border border-gray-300 text-gray-700 rounded-full text-xs font-semibold hover:bg-gray-50 transition-all"
                    >
                        <FiExternalLink size={14} />
                        View Session Page
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default SessionActionModal;