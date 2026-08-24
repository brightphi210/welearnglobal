import { useMemo, useState } from "react";
import {
  FiArrowRight,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiExternalLink,
  FiMapPin,
  FiMessageCircle,
  FiSearch,
  FiUser,
  FiVideo,
  FiX,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import LoadingOverlay from "../../components/LoadingOverlay";
import {
  useGetMyBookingsAsUser,
  useMakePayment,
} from "../../hooks/queries/allQueries";

// ---- raw API booking shape (no mapping/utils) ----
interface TutorProfile {
  id: number;
  full_name: string;
  profile_image: string | null;
  professional_title: string;
  location: string;
}

interface RawBooking {
  id: number;
  student: { id: number; full_name: string };
  tutor_profile: TutorProfile;
  subject: string;
  session_type: "onsite" | "online";
  session_type_display: string;
  scheduled_date: string; // "2026-08-12"
  start_time: string; // "09:00:00"
  end_time: string; // "10:00:00"
  status: "pending" | "accepted" | "cancelled" | "payment_confirmed" | string;
  status_display: string;
  notes?: string;
  total_amount: string;
  created_at: string;
  session_link?: string | null;
  tutor_completed?: boolean;
  student_acknowledged?: boolean;
  duration?: number;
}

// ---- small local formatters (no bookingUtils) ----
const formatDate = (dateStr: string) => {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatTime = (timeStr: string) => {
  const [h, m] = timeStr.split(":");
  const hour = parseInt(h, 10);
  const suffix = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${hour12}:${m} ${suffix}`;
};

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const STUDENT_SESSION_ROUTE = (id: string | number) =>
  `/student/dashboard/session/${id}`;
const isFullyCompleted = (b: RawBooking) =>
  b.status === "completed" && !!b.tutor_completed && !!b.student_acknowledged;

const isAwaitingStudentApproval = (b: RawBooking) =>
  b.status === "payment_confirmed" && !!b.tutor_completed && !b.student_acknowledged;

const getTabKey = (
  b: RawBooking
): "confirmed" | "pending" | "completed" | "cancelled" | null => {
  if (isFullyCompleted(b)) return "completed";
  if (b.status === "accepted" || b.status === "payment_confirmed") return "confirmed";
  if (b.status === "pending") return "pending";
  if (b.status === "declined") return "cancelled";
  return null;
};


const getDisplayStatus = (b: RawBooking): { key: string; label: string } => {
  if (isFullyCompleted(b)) return { key: "completed", label: "Completed" };
  return { key: b.status, label: b.status_display };
};

const statusBadge: Record<string, string> = {
  accepted: "bg-blue-50 text-blue-700",
  payment_confirmed: "bg-green-50 text-green-700",
  pending: "bg-amber-50 text-amber-700",
  cancelled: "bg-red-50 text-red-700",
  completed: "bg-gray-100 text-gray-700",
};

const sessionTypeBadge: Record<string, string> = {
  online: "bg-gray-100 text-gray-700",
  onsite: "bg-orange-50 text-orange-700",
};

const BookingCard = ({
  booking,
  onOpenSessionDetails,
}: {
  booking: RawBooking;
  onOpenSessionDetails: (booking: RawBooking) => void;
}) => {
  const [imgError, setImgError] = useState(false);

  const { getPaymentUrl, isLoading: isPaying } = useMakePayment(booking.id);
  const handlePayment = async () => {
    try {
      const response = await getPaymentUrl;
      const url = response?.data?.checkout_url;

      if (!url) {
        toast("No payment link was returned. Please try again.", { type: "error" });
        return;
      }

      window.location.href = url;
    } catch (error) {
      console.error("Payment error:", error);
      toast("Something went wrong starting your payment. Please try again.", {
        type: "error",
      });
    }
  };


  const displayStatus = getDisplayStatus(booking);
  const fullyCompleted = isFullyCompleted(booking);
  const awaitingApproval = isAwaitingStudentApproval(booking);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-3 sm:p-5 overflow-hidden">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {booking.tutor_profile.profile_image && !imgError ? (
            <img
              src={booking.tutor_profile.profile_image}
              alt={booking.tutor_profile.full_name}
              onError={() => setImgError(true)}
              className="w-10 h-10 rounded-full object-cover shrink-0"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-white font-bold shrink-0">
              {getInitials(booking.tutor_profile.full_name)}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="font-bold text-gray-900 text-sm leading-snug truncate">
              {booking.tutor_profile.full_name}
            </p>
            <p className="text-xs text-gray-600 wrap-break-word">{booking.subject}</p>
          </div>
        </div>

        <span
          className={`shrink-0 px-3 py-1 rounded-full text-[10px] font-semibold ${statusBadge[displayStatus.key] ?? "bg-gray-100 text-gray-700"
            }`}
        >
          {displayStatus.label}
        </span>
      </div>

      <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-gray-100 text-xs text-gray-600">
        <div className="flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-1.5 min-w-0">
            <FiCalendar size={13} />
            <span className="truncate">{formatDate(booking.scheduled_date)}</span>
          </span>
          <span className="flex items-center gap-1.5 min-w-0">
            <FiClock size={13} />
            <span className="truncate">
              {formatTime(booking.start_time)} - {formatTime(booking.end_time)}
            </span>
          </span>
        </div>
        <div className="flex items-center justify-between gap-2 flex-wrap">

          <div>
            <span
              className={`px-2 py-1 rounded-full text-[11px] font-semibold ${sessionTypeBadge[booking.session_type] ?? "bg-gray-100 text-gray-700"
                }`}
            >
              {booking.session_type_display}
            </span>

            <span
              className={`px-2 py-1 rounded-full text-[11px] font-semibold ${sessionTypeBadge[booking.session_type] ?? "bg-gray-100 text-gray-700"
                }`}
            >
              Duration: {booking.duration}days
            </span>
          </div>

          <span className="text-base font-semibold text-gray-700">
            ₦{booking.total_amount}
          </span>
        </div>
      </div>

      {awaitingApproval && (
        <div className="mt-3 flex items-start gap-2 rounded-xl bg-amber-50 p-3 text-xs text-amber-800">
          <FiCheckCircle size={14} className="mt-0.5 shrink-0" />
          <p>
            Your tutor marked this session as complete. Please confirm below so it can
            be closed out.
          </p>
        </div>
      )}

      {booking.notes && (
        <div className="mt-3 rounded-xl bg-gray-50 p-3 text-xs text-gray-600 wrap-break-word">
          <p className="font-semibold text-gray-700 mb-1">Notes</p>
          <p>{booking.notes}</p>
        </div>
      )}

      <div className="flex flex-col gap-2 mt-4">
        {booking.status === "accepted" && (
          <button
            onClick={handlePayment}
            disabled={isPaying}

            className="w-full flex items-center justify-center gap-1.5 px-4 cursor-pointer py-3 bg-green-900 text-white rounded-full text-xs font-semibold hover:bg-green-800 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isPaying ? "Processing..." : "Proceed to Payment"}
          </button>
        )}

        {booking.status === "payment_confirmed" && (
          <>
            {fullyCompleted ? (
              <button
                onClick={() => onOpenSessionDetails(booking)}
                className="w-full flex items-center justify-center gap-1.5 px-4 py-3 bg-gray-700 text-white rounded-full text-xs font-semibold hover:bg-gray-800 transition-all"
              >
                <FiVideo size={14} />
                View Summary
              </button>
            ) : awaitingApproval ? (
              <button
                onClick={() => onOpenSessionDetails(booking)}
                className="w-full flex items-center justify-center gap-1.5 px-4 py-3 bg-yellow-600 text-white rounded-full text-xs font-semibold cursor-pointer transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <FiCheckCircle size={14} />
                Approve Completed Request
              </button>
            ) : (
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={() => onOpenSessionDetails(booking)}
                  className="w-full text-center flex justify-center gap-2 items-center px-4 py-3.5 border-2 border-green-700 text-green-700 rounded-full text-xs font-semibold hover:bg-green-50 transition-all"
                // className="flex-1 flex items-center justify-center gap-1.5 px-4 py-3 bg-green-700 text-white cursor-pointer rounded-full text-xs font-semibold hover:bg-green-800 transition-all"
                >
                  <FiVideo size={14} />
                  View Session
                </button>
              </div>
            )}
          </>
        )}

        {booking.status === "pending" && (
          <button className="w-full px-4 py-3 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold cursor-default">
            Awaiting Confirmation
          </button>
        )}

        {booking.status === "cancelled" && (
          <button className="w-full px-4 py-3.5 border border-gray-300 text-gray-500 rounded-full text-sm font-semibold hover:bg-gray-50 transition-all">
            View Details
          </button>
        )}
      </div>
    </div>
  );
};

const BookedTutorClass = () => {
  const [activeTab, setActiveTab] = useState<
    "confirmed" | "pending" | "completed" | "cancelled"
  >("confirmed");
  const [searchTerm, setSearchTerm] = useState("");
  const [sessionDetailsOpen, setSessionDetailsOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<RawBooking | null>(null);

  const { myBookingsAsUser, isLoading } = useGetMyBookingsAsUser();
  const bookings: RawBooking[] = Array.isArray(myBookingsAsUser?.data)
    ? myBookingsAsUser.data
    : [];

  console.log('This is booking', myBookingsAsUser)

  const countForTab = (tab: "confirmed" | "pending" | "completed" | "cancelled") =>
    bookings.filter((b) => getTabKey(b) === tab).length;

  // Search matches tutor name or subject, case-insensitive, on top of the
  // active status tab.
  const filteredBookings = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return bookings.filter((b) => {
      const matchesTab = getTabKey(b) === activeTab;
      if (!matchesTab) return false;

      if (!query) return true;

      const tutorName = (b.tutor_profile?.full_name || "").toLowerCase();
      const subject = (b.subject || "").toLowerCase();
      return tutorName.includes(query) || subject.includes(query);
    });
  }, [bookings, activeTab, searchTerm]);

  const tabs = [
    { id: "confirmed", label: "Confirmed", count: countForTab("confirmed") },
    { id: "pending", label: "Pending", count: countForTab("pending") },
    { id: "completed", label: "Completed", count: countForTab("completed") },
    { id: "cancelled", label: "Cancelled", count: countForTab("cancelled") },
  ] as const;

  const openSessionDetails = (booking: RawBooking) => {
    setSelectedSession(booking);
    setSessionDetailsOpen(true);
  };

  return (
    <div className="md:pl-56 pb-20 md:pb-8 lg:pt-20">
      <LoadingOverlay visible={isLoading} />
      <ToastContainer />
      <div className="min-h-screen lg:pt-8 pt-18 bg-gray-50 px-4 sm:px-6 lg:px-8 max-w-7xl m-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-xl lg:text-2xl font-extrabold text-gray-900 tracking-tight mb-1">
              My Bookings
            </h1>
            <p className="text-gray-600 text-sm">
              Manage and view all your tutor sessions in one place.
            </p>
          </div>
          <div className="relative w-full sm:w-64 shrink-0">
            <FiSearch
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search by tutor or subject"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="w-full pl-10 pr-9 py-2.5 border border-gray-300 rounded-full text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-200"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FiX size={14} />
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 mb-6 overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${activeTab === tab.id
                ? "bg-green-700 text-white"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                }`}
            >
              {tab.label}
              <span
                className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${activeTab === tab.id
                  ? "bg-white/20 text-white"
                  : "bg-gray-100 text-gray-600"
                  }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-8 sm:p-12 text-center text-sm text-gray-500">
            Loading your bookings...
          </div>
        ) : filteredBookings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 gap-4">
            {filteredBookings.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                onOpenSessionDetails={openSessionDetails}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 p-8 sm:p-12 text-center">
            <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <FiCalendar size={22} className="text-gray-400" />
            </div>
            <h3 className="font-bold text-gray-900 text-base mb-1">
              {searchTerm ? "No matching bookings" : `No ${activeTab} bookings`}
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              {searchTerm
                ? "Try a different tutor name or subject."
                : activeTab === "confirmed"
                  ? "Book a session with a tutor to see it here."
                  : activeTab === "completed"
                    ? "Sessions you've completed and approved will show up here."
                    : "Bookings in this category will show up here once available."}
            </p>
            {activeTab === "confirmed" && !searchTerm && (
              <Link to={'/student/dashboard/tutors'}>
                <button className="px-6 py-2.5 bg-green-700 text-white rounded-full font-semibold text-sm hover:bg-green-800 transition-all">
                  Find a Tutor
                </button>
              </Link>
            )}
          </div>
        )}

        {filteredBookings.length > 0 && (
          <div className="flex items-center justify-center mt-8">
            <button className="flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-gray-700">
              Load more
              <FiArrowRight size={12} />
            </button>
          </div>
        )}
      </div>

      {sessionDetailsOpen && selectedSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setSessionDetailsOpen(false)}
          />
          <div className="relative bg-white rounded-xl shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto overflow-x-hidden mx-2 sm:mx-0">
            <button
              onClick={() => setSessionDetailsOpen(false)}
              className="absolute top-4 right-4 z-10 p-2 text-gray-400 hover:text-gray-600 rounded-full bg-white/80 backdrop-blur"
            >
              <FiX size={16} />
            </button>

            <div className="bg-green-950 px-4 py-4 text-white">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-4 rounded-full bg-white/20">
                  <FiVideo size={20} />
                </div>
                <div>
                  <h3 className="text-base font-extrabold">Session details</h3>
                  <p className="text-sm text-green-50">
                    {isFullyCompleted(selectedSession)
                      ? "This session has been completed"
                      : "Ready to begin your tutoring session"}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-2 sm:p-6 space-y-3">
              <div className="flex items-start justify-between gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4">
                <div>
                  <p className="text-xs font-bold text-gray-900">
                    {selectedSession.tutor_profile.full_name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {selectedSession.tutor_profile.professional_title}
                  </p>
                </div>
                <p className="rounded-full w-fit bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                  {selectedSession.session_type_display}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-gray-200 p-3">
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <FiCalendar size={14} />
                    <span className="text-xs font-semibold">Date</span>
                  </div>
                  <p className="text-xs font-semibold text-gray-900">
                    {formatDate(selectedSession.scheduled_date)}
                  </p>
                </div>
                <div className="rounded-xl border border-gray-200 p-3">
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <FiClock size={14} />
                    <span className="text-xs font-semibold">Time</span>
                  </div>
                  <p className="text-xs font-semibold text-gray-900">
                    {formatTime(selectedSession.start_time)} -{" "}
                    {formatTime(selectedSession.end_time)}
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-gray-200 p-4">
                <div className="flex items-center gap-2 text-gray-700 mb-2">
                  <FiUser size={14} />
                  <p className="text-xs font-semibold">Subject</p>
                </div>
                <p className="text-xs text-gray-600 wrap-break-word">
                  {selectedSession.subject}
                </p>
              </div>

              {selectedSession.notes && (
                <div className="rounded-xl border border-gray-200 p-4">
                  <div className="flex items-center gap-2 text-gray-700 mb-2">
                    <FiMessageCircle size={14} />
                    <p className="text-xs font-semibold">Notes</p>
                  </div>
                  <p className="text-xs text-gray-600 wrap-break-word">
                    {selectedSession.notes}
                  </p>
                </div>
              )}

              {selectedSession.session_type === "onsite" && (
                <div className="rounded-xl border border-gray-200 p-4">
                  <div className="flex items-center gap-2 text-gray-700 mb-2">
                    <FiMapPin size={14} />
                    <p className="text-xs font-semibold">Location</p>
                  </div>
                  <p className="text-xs text-gray-600 wrap-break-word">
                    {selectedSession.tutor_profile.location ||
                      "No physical location provided yet."}
                  </p>
                </div>
              )}

              <div className="rounded-xl border border-gray-200 p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 flex-wrap">
                  <div>
                    <p className="text-xs font-semibold text-gray-900">Session link</p>
                    <p className="text-xs text-gray-500 break-all">
                      {selectedSession.session_link || "No link provided yet."}
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    <Link
                      to={STUDENT_SESSION_ROUTE(selectedSession.id)}
                      onClick={() => setSessionDetailsOpen(false)}
                      className="inline-flex lg:w-fit w-full text-center justify-center items-center gap-2 rounded-full border border-gray-300 text-gray-700 px-4 py-3 text-xs font-semibold hover:bg-gray-50 transition-all"
                    >
                      <FiExternalLink size={13} />
                      View Session Page
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookedTutorClass;