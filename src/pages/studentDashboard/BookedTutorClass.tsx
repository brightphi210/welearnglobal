import { useState } from "react";
import {
  FiArrowRight,
  FiCalendar,
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
import { useGetMyBookingsAsUser } from "../../hooks/queries/allQueries";
import {
  type Booking,
  extractBookingList,
  mapBookingResponse,
} from "../../utils/bookingUtils";

const BookedTutorClass = () => {
  const [activeTab, setActiveTab] = useState<"confirmed" | "pending" | "cancelled">("confirmed");
  const [sessionDetailsOpen, setSessionDetailsOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<any | null>(null);

  const STUDENT_SESSION_ROUTE = (id: string | number) => `/student/dashboard/session/${id}`;


  const { myBookingsAsUser, isLoading } = useGetMyBookingsAsUser();

  const bookings: Booking[] = extractBookingList(myBookingsAsUser).map(mapBookingResponse);

  const tabs = [
    { id: "confirmed", label: "Confirmed", count: bookings.filter((b) => b.status === "Confirmed").length },
    { id: "pending", label: "Pending", count: bookings.filter((b) => b.status === "Pending").length },
    { id: "cancelled", label: "Cancelled", count: bookings.filter((b) => b.status === "Cancelled").length },
  ] as const;

  const filteredBookings = bookings.filter((b) => b.status.toLowerCase() === activeTab);

  const statusBadge: Record<string, string> = {
    Confirmed: "bg-green-50 text-green-700",
    Pending: "bg-amber-50 text-amber-700",
    Cancelled: "bg-red-50 text-red-700",
  };

  const sessionTypeBadge: Record<string, string> = {
    Online: "bg-gray-100 text-gray-700",
    "On-site": "bg-orange-50 text-orange-700",
  };

  const openSessionDetails = (booking: Booking) => {
    setSelectedSession(booking);
    setSessionDetailsOpen(true);
  };

  const handleJoinSession = () => {
    const link = (selectedSession as any)?.sessionLink;
    if (!link) {
      toast("No session link is available yet.", { type: "info" });
      return;
    }

    window.open(link, "_blank", "noopener,noreferrer");
  };

  const BookingCard = ({ booking }: { booking: Booking }) => {
    const [imgError, setImgError] = useState(false);

    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-3 sm:p-5 overflow-hidden">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {booking.image && !imgError ? (
              <img
                src={booking.image}
                alt={booking.tutorName}
                onError={() => setImgError(true)}
                className="w-10 h-10 sm:w-10 sm:h-10 rounded-full object-cover shrink-0"
              />
            ) : (
              <div className="w-10 h-10 sm:w-10 sm:h-10 rounded-full bg-gray-700 flex items-center justify-center text-white font-bold shrink-0">
                {booking.tutorAvatar}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="font-bold text-gray-900 text-sm leading-snug truncate">{booking.tutorName}</p>
              <p className="text-xs text-gray-600 wrap-break-word">{booking.subject}</p>
            </div>
          </div>

          <span className={`shrink-0 px-3 py-1 rounded-full text-[10px] font-semibold ${statusBadge[booking.status]}`}>
            {booking.status}
          </span>
        </div>

        <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-gray-100 text-xs text-gray-600">
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1.5 min-w-0">
              <FiCalendar size={13} />
              <span className="truncate">{booking.date}</span>
            </span>
            <span className="flex items-center gap-1.5 min-w-0">
              <FiClock size={13} />
              <span className="truncate">{booking.time}</span>
            </span>
          </div>
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <span className={`px-2 py-1 rounded text-[11px] font-semibold ${sessionTypeBadge[booking.sessionType]}`}>
              {booking.sessionType}
            </span>
          </div>
        </div>

        {booking.notes && (
          <div className="mt-3 rounded-xl bg-gray-50 p-3 text-xs text-gray-600 wrap-break-word border border-gray-200">
            <p className="font-semibold text-gray-700 mb-1">Notes</p>
            <p>{booking.notes}</p>
          </div>
        )}

        <div className="flex flex-col gap-2 mt-4">
          {booking.status === "Confirmed" && (
            <div className="flex flex-col sm:flex-row gap-2">
              <button className="flex-1 flex items-center justify-center gap-1.5 px-4 py-3 border border-gray-300 text-gray-700 rounded-full text-xs font-semibold hover:bg-gray-50 transition-all">
                <FiMessageCircle size={14} />
                Message
              </button>
              <button
                onClick={() => openSessionDetails(booking)}
                className="flex-1 flex items-center justify-center gap-1.5 px-4 py-3 bg-green-700 text-white rounded-full text-xs font-semibold hover:bg-green-800 transition-all"
              >
                <FiVideo size={14} />
                View Session
              </button>
            </div>
          )}

          {booking.status === "Pending" && (
            <button className="w-full px-4 py-3 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold cursor-default">
              Awaiting Confirmation
            </button>
          )}

          {booking.status === "Cancelled" && (
            <button className="w-full px-4 py-3.5 border border-gray-300 text-gray-500 rounded-full text-sm font-semibold hover:bg-gray-50 transition-all">
              View Details
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="md:pl-56 pb-20 md:pb-8 lg:pt-20">
      <LoadingOverlay visible={isLoading} />
      <ToastContainer />
      <div className="min-h-screen pt-8 bg-gray-50 px-4 sm:px-6 lg:px-8 max-w-7xl m-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-xl lg:text-3xl font-extrabold text-gray-900 tracking-tight mb-1">My Bookings</h1>
            <p className="text-gray-600 text-sm">
              Manage and view all your tutor sessions in one place.
            </p>
          </div>
          <div className="relative w-full sm:w-64 shrink-0">
            <FiSearch size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by tutor or subject"
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-full text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-200"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 mb-6 overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
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
                className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${activeTab === tab.id ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600"
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
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 p-8 sm:p-12 text-center">
            <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <FiCalendar size={22} className="text-gray-400" />
            </div>
            <h3 className="font-bold text-gray-900 text-base mb-1">No {activeTab} bookings</h3>
            <p className="text-sm text-gray-500 mb-6">
              {activeTab === "confirmed"
                ? "Book a session with a tutor to see it here."
                : "Bookings in this category will show up here once available."}
            </p>
            {activeTab === "confirmed" && (
              <button className="px-6 py-2.5 bg-green-700 text-white rounded-full font-semibold text-sm hover:bg-green-800 transition-all">
                Find a Tutor
              </button>
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
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSessionDetailsOpen(false)} />
          <div className="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto overflow-x-hidden mx-2 sm:mx-0">
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
                  <p className="text-sm text-green-50">Ready to begin your tutoring session</p>
                </div>
              </div>
            </div>

            <div className="p-2 sm:p-6 space-y-3">
              <div className="flex items-start justify-between gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4">
                <div>
                  <p className="text-sm font-bold text-gray-900">{selectedSession.tutorName}</p>
                  {selectedSession.tutorEmail && <p className="text-xs text-gray-500">{selectedSession.tutorEmail}</p>}
                </div>
                <p className="rounded-full w-fit bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                  {selectedSession.sessionType}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-gray-200 p-3">
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <FiCalendar size={14} />
                    <span className="text-xs font-semibold">Date</span>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">{selectedSession.date}</p>
                </div>
                <div className="rounded-xl border border-gray-200 p-3">
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <FiClock size={14} />
                    <span className="text-xs font-semibold">Time</span>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">{selectedSession.time}</p>
                </div>
              </div>

              <div className="rounded-xl border border-gray-200 p-4">
                <div className="flex items-center gap-2 text-gray-700 mb-2">
                  <FiUser size={14} />
                  <p className="text-sm font-semibold">Subject</p>
                </div>
                <p className="text-xs text-gray-600 wrap-break-word">{selectedSession.subject}</p>
              </div>

              {selectedSession.notes && (
                <div className="rounded-xl border border-gray-200 p-4">
                  <div className="flex items-center gap-2 text-gray-700 mb-2">
                    <FiMessageCircle size={14} />
                    <p className="text-sm font-semibold">Notes</p>
                  </div>
                  <p className="text-xs text-gray-600 wrap-break-word">{selectedSession.notes}</p>
                </div>
              )}

              {selectedSession.sessionType === "On-site" && (
                <div className="rounded-xl border border-gray-200 p-4">
                  <div className="flex items-center gap-2 text-gray-700 mb-2">
                    <FiMapPin size={14} />
                    <p className="text-sm font-semibold">Location</p>
                  </div>
                  <p className="text-xs text-gray-600 wrap-break-word">
                    {selectedSession.locationAddress || "No physical location provided yet."}
                  </p>
                </div>
              )}

              <div className="rounded-xl border border-gray-200 p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 flex-wrap">
                  <div>
                    <p className="text-xs font-semibold text-gray-900">Session link</p>
                    <p className="text-xs text-gray-500 break-all">
                      {selectedSession.sessionLink || "No link provided yet."}
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
                    <button
                      onClick={handleJoinSession}
                      className="inline-flex lg:w-fit w-full text-center justify-center items-center gap-2 rounded-full bg-green-700 px-4 py-3 text-xs font-semibold text-white hover:bg-green-800 transition-all"
                    >
                      <FiVideo size={13} />
                      Join Session
                    </button>
                  </div>
                </div>
              </div>

              {selectedSession.sessionLink && (
                <button
                  onClick={handleJoinSession}
                  className="flex w-full items-center justify-center gap-2 rounded-full border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700 hover:bg-green-100 transition-all"
                >
                  <FiExternalLink size={14} />
                  Open session link
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookedTutorClass;