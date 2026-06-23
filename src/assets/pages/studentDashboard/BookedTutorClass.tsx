import { useState } from "react";
import { FiCalendar, FiClock, FiMessageSquare, FiVideo } from "react-icons/fi";

interface Booking {
  id: number;
  tutorName: string;
  tutorAvatar: string;
  subject: string;
  date: string;
  time: string;
  duration: string;
  sessionType: "Online" | "On-site";
  status: "Confirmed" | "Pending" | "Cancelled";
  notes: string;
}

const BookedTutorClass = () => {
  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: 1,
      tutorName: "Dr. Sarah Jenkins",
      tutorAvatar: "SJ",
      subject: "Advanced Physics",
      date: "Tuesday, Oct 26, 2024",
      time: "04:00 PM - 05:00 PM",
      duration: "1 hr",
      sessionType: "Online",
      status: "Confirmed",
      notes: "Focus on electromagnetic induction problems",
    },
    {
      id: 2,
      tutorName: "Marcus Thompson",
      tutorAvatar: "MT",
      subject: "Calculus II",
      date: "Wednesday, Oct 27, 2024",
      time: "02:00 PM - 03:30 PM",
      duration: "1.5 hrs",
      sessionType: "Online",
      status: "Confirmed",
      notes: "Review integration techniques",
    },
    {
      id: 3,
      tutorName: "Elena Rodriguez",
      tutorAvatar: "ER",
      subject: "Spanish Literature",
      date: "Thursday, Oct 28, 2024",
      time: "06:00 PM - 07:00 PM",
      duration: "1 hr",
      sessionType: "On-site",
      status: "Pending",
      notes: "Discuss García Márquez's 100 Years of Solitude",
    },
    {
      id: 4,
      tutorName: "James Wilson",
      tutorAvatar: "JW",
      subject: "Web Development",
      date: "Friday, Oct 29, 2024",
      time: "03:00 PM - 04:30 PM",
      duration: "1.5 hrs",
      sessionType: "Online",
      status: "Confirmed",
      notes: "Building React components",
    },
    {
      id: 5,
      tutorName: "Prof. Michael Chen",
      tutorAvatar: "MC",
      subject: "Physics - Mechanics",
      date: "Saturday, Oct 30, 2024",
      time: "10:00 AM - 11:30 AM",
      duration: "1.5 hrs",
      sessionType: "Online",
      status: "Confirmed",
      notes: "Newton's laws and applications",
    },
  ]);

  const handleCancelBooking = (id: number) => {
    setBookings(bookings.filter((booking) => booking.id !== id));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Confirmed":
        return "bg-green-50 text-green-700 border border-green-200";
      case "Pending":
        return "bg-yellow-50 text-yellow-700 border border-yellow-200";
      case "Cancelled":
        return "bg-red-50 text-red-700 border border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border border-gray-200";
    }
  };

  const getSessionTypeColor = (type: string) => {
    switch (type) {
      case "Online":
        return "bg-green-50 text-green-700";
      case "On-site":
        return "bg-orange-50 text-orange-700";
      default:
        return "bg-gray-50 text-gray-700";
    }
  };

  const confirmedCount = bookings.filter((b) => b.status === "Confirmed").length;
  const pendingCount = bookings.filter((b) => b.status === "Pending").length;

  return (
    <div className="md:pl-56 pb-20 md:pb-8">
      <div className="min-h-screen pt-14 bg-linear-to-br from-green-50 via-white to-teal-50">
        <div className="px-4 sm:px-6 lg:px-8 pt-8 max-w-6xl mx-auto py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">
              My Bookings
            </h1>
            <p className="text-gray-600 text-sm">Manage and view all your tutor sessions</p>
          </div>


          {/* Bookings Summary */}
          <div className="grid grid-cols-3 gap-2 mb-8">
            <div className="bg-green-950 rounded-lg border border-gray-200 p-4">
              <p className="text-xs text-lime-200 font-semibold mb-1 pb-2">Total Bookings</p>
              <p className="text-xl font-bold text-white bg-green-900/40 p-2 rounded-full flex justify-center items-center w-8 h-8">{bookings.length}</p>
            </div>
            <div className="bg-green-950 rounded-lg border border-gray-200 p-3">
              <p className="text-xs text-lime-200 font-semibold mb-1 pb-2">Confirmed</p>
              <p className="text-xl font-bold text-white bg-green-900/40 p-2 rounded-full flex justify-center items-center w-8 h-8">{confirmedCount}</p>
            </div>
            <div className="bg-green-950 rounded-lg border border-gray-200 p-3">
              <p className="text-xs text-lime-200 font-semibold mb-1 pb-2">Pending</p>
              <p className="text-xl font-bold text-white bg-green-900/40 p-2 rounded-full flex justify-center items-center w-8 h-8">{pendingCount}</p>
            </div>
          </div>

          {/* Bookings Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings.length > 0 ? (
              bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-md transition-all flex flex-col"
                >
                  <div className="p-6 flex flex-col h-full">
                    {/* Header with Tutor Info */}
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-12 h-12 rounded-lg bg-green-950 flex items-center justify-center text-white font-bold text-sm shrink-0">
                        {booking.tutorAvatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-bold text-gray-900 truncate">
                          {booking.tutorName}
                        </h3>
                        <p className="text-green-700 font-semibold text-xs truncate">
                          {booking.subject}
                        </p>
                      </div>
                    </div>

                    {/* Status and Session Type Badges */}
                    <div className="flex gap-2 mb-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getSessionTypeColor(booking.sessionType)}`}>
                        {booking.sessionType}
                      </span>
                    </div>

                    {/* Booking Details */}
                    <div className="space-y-2.5 mb-4 flex-1">
                      <div className="flex items-start gap-3">
                        <FiCalendar className="text-green-700 shrink-0 mt-0.5" size={14} />
                        <div>
                          <p className="text-xs text-gray-600">Date</p>
                          <p className="text-xs font-semibold text-gray-900">{booking.date}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <FiClock className="text-green-700 shrink-0 mt-0.5" size={14} />
                        <div>
                          <p className="text-xs text-gray-600">Time</p>
                          <p className="text-xs font-semibold text-gray-900">{booking.time}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="text-green-700 shrink-0 mt-0.5 text-xs">⏱</span>
                        <div>
                          <p className="text-xs text-gray-600">Duration</p>
                          <p className="text-xs font-semibold text-gray-900">{booking.duration}</p>
                        </div>
                      </div>
                    </div>

                    {/* Notes */}
                    {booking.notes && (
                      <p className="text-xs text-gray-600 p-2.5 bg-gray-50 rounded-lg border border-gray-200 mb-4 line-clamp-2">
                        {booking.notes}
                      </p>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-2">
                      {booking.status === "Confirmed" && (
                        <>
                          <button className="w-full px-4 py-3 bg-green-900 text-white rounded-full font-semibold text-sm flex items-center justify-center gap-2 hover:bg-green-800 transition-all">
                            <FiVideo size={14} />
                            Join Class
                          </button>
                          <button className="w-full px-4 py-3 bg-white border-2 border-green-700 text-green-700 rounded-full font-semibold text-sm flex items-center justify-center gap-2 hover:bg-gray-50 transition-all">
                            <FiMessageSquare size={14} />
                            Message Tutor
                          </button>
                          <button
                            onClick={() => handleCancelBooking(booking.id)}
                            className="w-full px-4 py-3 text-red-600 text-sm font-semibold hover:text-red-700 transition-all"
                          >
                            Cancel Booking
                          </button>
                        </>
                      )}
                      {booking.status === "Pending" && (
                        <>
                          <button className="w-full px-4 py-3 bg-green-900 text-white rounded-lg font-semibold text-sm hover:bg-green-800 transition-all">
                            Awaiting Confirmation
                          </button>
                          <button
                            onClick={() => handleCancelBooking(booking.id)}
                            className="w-full px-4 py-2.5 text-red-600 text-sm font-semibold hover:text-red-700 transition-all"
                          >
                            Cancel Request
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full bg-white rounded-2xl border border-gray-200 p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <FiCalendar className="text-gray-400" size={32} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">No bookings yet</h3>
                <p className="text-gray-600 text-sm mb-6">
                  Start booking sessions with tutors to see them here.
                </p>
                <button className="px-6 py-3 bg-green-900 text-white rounded-lg font-semibold text-sm hover:bg-green-800 transition-all">
                  Find a Tutor
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookedTutorClass;