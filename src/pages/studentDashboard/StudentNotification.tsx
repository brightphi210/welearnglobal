import { FiArrowLeft, FiBell } from "react-icons/fi";
import { Link } from "react-router-dom";

const STUDENT_DASHBOARD_ROUTE = "/student/dashboard";

const StudentNotification = () => {
    return (
        <div className="md:pl-56 pb-20 md:pb-8 lg:pt-20">
            <div className="min-h-screen pt-8 bg-gray-50 px-4 sm:px-6 lg:px-8 max-w-7xl m-auto">
                <Link
                    to={STUDENT_DASHBOARD_ROUTE}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-gray-900 mb-6"
                >
                    <FiArrowLeft size={16} />
                    Back to Dashboard
                </Link>

                <div className="mb-6 sm:mb-8">
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-1">
                        Notifications
                    </h1>
                    <p className="text-gray-600 text-sm">
                        Updates on your bookings, lessons, and tutors.
                    </p>
                </div>

                <div className="bg-white rounded-2xl border border-gray-200 p-2 sm:p-4">
                    <div className="py-16 text-center">
                        <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                            <FiBell size={22} className="text-gray-400" />
                        </div>
                        <h3 className="font-bold text-gray-900 mb-1">No notifications yet</h3>
                        <p className="text-sm text-gray-500">
                            You're all caught up. New activity will show up here.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentNotification;