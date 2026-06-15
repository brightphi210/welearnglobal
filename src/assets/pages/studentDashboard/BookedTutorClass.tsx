import { useState } from "react";
import { FiCalendar, FiClock, FiVideo } from "react-icons/fi";

const BookedTutorClass = () => {
  const [bookings, setBookings] = useState([
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
    setBookings(bookings.filter(booking => booking.id !== id));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Confirmed":
        return "bg-green-50 text-green-700 border-green-200";
      case "Pending":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "Cancelled":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getSessionTypeColor = (type: string) => {
    switch (type) {
      case "Online":
        return "bg-blue-50 text-blue-700";
      case "On-site":
        return "bg-purple-50 text-purple-700";
      default:
        return "bg-gray-50 text-gray-700";
    }
  };

  return (
    <div className="md:pl-56 pb-20 md:pb-8">
      <div className="min-h-screen bg-white">
        <div className="px-4 sm:px-6 lg:px-8 pt-24 max-w-6xl mx-auto py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bookings</h1>
            <p className="text-gray-600">Manage and view all your tutor sessions</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-2 gap-2 mb-5">
            <div className="bg-emerald-900 relative overflow-hidden rounded-xl border border-gray-100 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white text-sm font-medium">Total Bookings</p>
                  <p className="text-3xl font-bold text-white">{bookings.length}</p>
                </div>
                <div className="w-16 h-16 absolute -bottom-8 right-3 opacity-40 bg-emerald-100 rounded-full flex items-center justify-center">
                  <FiCalendar className="text-emerald-600" size={30} />
                </div>
              </div>
            </div>

            <div className="bg-emerald-900 relative rounded-xl overflow-hidden border border-gray-100 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white text-sm font-medium">Confirmed</p>
                  <p className="text-3xl font-bold text-white">
                    {bookings.filter(b => b.status === "Confirmed").length}
                  </p>
                </div>
                <div className="w-16 h-16 absolute -bottom-8 right-3 opacity-40 bg-green-100 rounded-full flex items-center justify-center">
                  <FiVideo className="text-green-600" size={30} />
                </div>
              </div>
            </div>
          </div>

          {/* Bookings Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings.length > 0 ? (
              bookings.map((booking) => (
                <div key={booking.id} className="bg-neutral-100 rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all flex flex-col">
                  <div className="p-6 flex flex-col flex-1">
                    {/* Header with Avatar and Tutor Info */}
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-10 h-10 rounded bg-neutral-200 flex items-center justify-center text-neutral-700 font-bold text-base shrink-0">
                        {booking.tutorAvatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-bold text-gray-900 truncate">{booking.tutorName}</h3>
                        <p className="text-emerald-600 font-semibold text-xs truncate">{booking.subject}</p>
                      </div>
                    </div>

                    {/* Status and Session Type Badges */}
                    <div className="flex gap-2 mb-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getSessionTypeColor(booking.sessionType)}`}>
                        {booking.sessionType}
                      </span>
                    </div>

                    {/* Booking Details */}
                    <div className="space-y-3 mb-4 flex-1">
                      <div className="flex items-start gap-3">
                        <FiCalendar className="text-emerald-900 shrink-0 mt-0.5" size={16} />
                        <div>
                          <p className="text-xs text-gray-600">Date</p>
                          <p className="text-sm font-semibold text-gray-900">{booking.date}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <FiClock className="text-emerald-600 shrink-0 mt-0.5" size={16} />
                        <div>
                          <p className="text-xs text-gray-600">Time</p>
                          <p className="text-sm font-semibold text-gray-900">{booking.time}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="text-emerald-600 shrink-0 mt-0.5 text-sm">⏱</div>
                        <div>
                          <p className="text-xs text-gray-600">Duration</p>
                          <p className="text-sm font-semibold text-gray-900">{booking.duration}</p>
                        </div>
                      </div>
                    </div>

                    {/* Notes */}
                    {booking.notes && (
                      <p className="text-xs text-gray-600 p-2.5 bg-gray-50 rounded-lg border border-gray-200 mb-4 line-clamp-2">
                        {booking.notes}
                      </p>
                    )}

                    <div className="flex flex-col gap-2">
                      {booking.status === "Confirmed" && (
                        <button className="w-full px-4 py-2.5 bg-emerald-900 text-white rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2">
                          <FiVideo size={16} />
                          Join Class
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                <FiCalendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">No bookings yet</h3>
                <p className="text-gray-600">Start booking sessions with tutors to see them here.</p>
                <button className="mt-6 px-6 py-3 bg-emerald-500 text-white rounded-lg font-semibold text-sm hover:bg-emerald-600 transition-all">
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




