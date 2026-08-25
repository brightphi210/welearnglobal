import { FiLogOut, FiX } from "react-icons/fi";

interface ConfirmLogoutModalProps {
    onCancel: () => void;
    onConfirm: () => void;
}

const ConfirmLogoutModal = ({ onCancel, onConfirm }: ConfirmLogoutModalProps) => (
    <div className="fixed inset-0 z-[70] flex items-center justify-center px-4">
        <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onCancel}
        />
        <div className="relative bg-white rounded-2xl border border-gray-200 shadow-xl max-w-sm w-full p-6 sm:p-7 text-center">
            <button
                onClick={onCancel}
                className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-600 rounded-lg transition-all"
            >
                <FiX size={16} />
            </button>

            <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiLogOut className="text-red-600" size={24} />
            </div>

            <h3 className="text-lg font-extrabold text-gray-900 mb-2">Sign out?</h3>
            <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                You'll need to log in again to access your dashboard.
            </p>

            <div className="flex items-center gap-2">
                <button
                    onClick={onCancel}
                    className="flex-1 py-3 border border-gray-200 rounded-full text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all"
                >
                    Cancel
                </button>
                <button
                    onClick={onConfirm}
                    className="flex-1 py-3 bg-red-600 text-white rounded-full text-sm font-semibold hover:bg-red-700 transition-all"
                >
                    Sign Out
                </button>
            </div>
        </div>
    </div>
);

export default ConfirmLogoutModal;