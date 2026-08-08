import { useState } from "react";
import {
  FiArrowRight,
  FiCalendar,
  FiClock,
  FiSearch,
  FiVideo,
} from "react-icons/fi";
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

  const handleOpenSession = (booking: Booking) => {
    if (!booking.sessionLink) {
      toast("No session link is available yet.", { type: "info" });
      return;
    }

    window.open(booking.sessionLink, "_blank", "noopener,noreferrer");
  };

  const BookingCard = ({ booking }: { booking: Booking }) => {
    const [imgError, setImgError] = useState(false);

    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-5 overflow-hidden">
        <div className="flex items-start sm:items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3 min-w-0">
            {booking.image && !imgError ? (
              <img
                src={booking.image}
                alt={booking.tutorName}
                onError={() => setImgError(true)}
                className="w-11 h-11 sm:w-12 sm:h-12 rounded-full object-cover shrink-0"
              />
            ) : (
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gray-700 flex items-center justify-center text-white font-bold text-sm shrink-0">
                {booking.tutorAvatar}
              </div>
            )}
            <div className="min-w-0">
              <p className="font-bold text-gray-900 text-sm truncate">{booking.tutorName}</p>
              <p className="text-xs text-green-700 font-semibold wrap-break-word">{booking.subject}</p>
            </div>
          </div>

          <span className={`shrink-0 px-3 py-1 rounded-full text-xs font-semibold ${statusBadge[booking.status]}`}>
            {booking.status}
          </span>
        </div>

        <div className="flex items-center gap-x-3 gap-y-2 flex-wrap mt-4 pt-4 border-t border-gray-100 text-xs text-gray-600">
          <span className="flex items-center gap-1.5">
            <FiCalendar size={13} />
            {booking.date}
          </span>
          <span className="flex items-center gap-1.5">
            <FiClock size={13} />
            {booking.time}
          </span>
          <span className={`px-2 py-1 ml-auto rounded text-[11px] font-semibold ${sessionTypeBadge[booking.sessionType]}`}>
            {booking.sessionType}
          </span>
        </div>

        {booking.notes && (
          <p className="text-xs text-gray-600 p-2.5 bg-gray-50 rounded-lg border border-gray-200 mt-3 wrap-break-word">
            {booking.notes}
          </p>
        )}

        <div className="flex flex-col gap-2 mt-4">
          {booking.status === "Confirmed" && (
            <button
              onClick={() => handleOpenSession(booking)}
              className="flex-1 flex items-center justify-center gap-1.5 px-4 py-3.5 bg-green-700 text-white rounded-full text-xs font-semibold hover:bg-green-800 transition-all"
            >
              <FiVideo size={14} />
              Join Class
            </button>
          )}

          {booking.status === "Pending" && (
            <button className="w-full px-4 py-2 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold cursor-default">
              Awaiting Confirmation
            </button>
          )}

          {booking.status === "Cancelled" && (
            <button className="w-full px-4 py-2 border border-gray-300 text-gray-500 rounded-full text-xs font-semibold hover:bg-gray-50 transition-all">
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
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-1">My Bookings</h1>
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

        <div className="flex items-center gap-2 mb-6 overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden scrollbar-none">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${activeTab === tab.id
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
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredBookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 p-8 sm:p-12 text-center">
            <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <FiCalendar size={22} className="text-gray-400" />
            </div>
            <h3 className="font-bold text-gray-900 mb-1">No {activeTab} bookings</h3>
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
            <button className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-700">
              Load more
              <FiArrowRight size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookedTutorClass;