import { useState } from "react";
import { FaStar } from "react-icons/fa";
import { FiAward, FiBook, FiCheckCircle, FiClock, FiFlag, FiMapPin, FiMessageSquare } from "react-icons/fi";
import TutorsBanner from "../../components/TutorsBanner";


const StudentTutorProfile = () => {
    const [selectedDate, setSelectedDate] = useState(18);
    const [selectedTime, setSelectedTime] = useState("10:00 AM");
    const [bookingStep, setBookingStep] = useState(1);

    const tutor = {
        id: 101,
        name: "Dr. Sarah Jenkins",
        title: "Senior Mathematics Professor",
        rating: 4.9,
        reviews: 124,
        price: 45,
        verified: true,
        location: "London, UK",
        languages: ["English (Native)", "French (Fluent)"],
        responseTime: "< 2 hours",
        bio: "With over 12 years of experience in higher education, I specialize in helping students conquer their fear of complex mathematical concepts. My approach is patient, structured, and tailored to each individual's learning style.\n\nWhether you are preparing for university entrance exams or need help with advanced calculus, I provide the tools and confidence necessary to excel. I have successfully mentored over 1,000 students across the globe.",
    };

    const expertise = [
        "Advanced Calculus",
        "Linear Algebra",
        "Pure Mathematics",
        "Statistics",
        "SAT/ACT Math",
        "Differential Equations",
        "Trigonometry",
    ];

    const experience = [
        { role: "Senior Math Tutor", company: "WeLearnGlobal", period: "2021 - Present" },
        { role: "Assistant Professor", company: "University of Oxford", period: "2015 - 2021" },
    ];

    const education = [
        { degree: "PhD in Theoretical Mathematics", school: "Cambridge University", year: "2014" },
        { degree: "M.Sc. in Applied Statistics", school: "Imperial College London", year: "2010" },
    ];

    const reviews = [
        {
            id: 1,
            author: "James Wilson",
            rating: 4.9,
            date: "2 days ago",
            verified: true,
            text: "Sarah is incredible! She made complex differential equations look like child's play. I feel much more confident for my finals now.",
        },
        {
            id: 2,
            author: "Emily Chen",
            rating: 4.9,
            date: "1 week ago",
            verified: true,
            text: "Best tutor I've found on this platform. Very structured lessons and always on time. Highly recommended for GRE preparation.",
        },
        {
            id: 3,
            author: "Michael Park",
            rating: 4.8,
            date: "2 weeks ago",
            verified: false,
            text: "Very knowledgeable. Sometimes the pace is a bit fast, but she is always happy to slow down if you ask.",
        },
    ];

    const availableTimes = ["09:00 AM", "10:00 AM", "02:00 PM", "04:00 PM"];
    const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);

    const StarRating = ({ rating, reviews }: { rating: number; reviews: number }) => (
        <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                    <FaStar key={i} size={10} className={i < Math.round(rating) ? "text-yellow-400" : "text-gray-300"} />
                ))}
            </div>
            <span className="font-bold text-sm text-gray-900">{rating}</span>
            <span className="text-xs text-gray-600">({reviews} reviews)</span>
        </div>
    );

    return (
        <div className="md:pl-56 pb-20 md:pb-8">
            <div className="min-h-screen pt-8 bg-gray-50">
                <div className="px-4 sm:px-6 lg:px-8 max-w-7xl m-auto py-8 text-sm">

                    {/* Breadcrumb */}
                    <div className="text-xs text-gray-600 mb-6">
                        <a href="/tutors" className="hover:text-green-700">Find Tutors</a>
                        <span className="mx-2">/</span>
                        <a href="/tutors/math" className="hover:text-green-700">Mathematics</a>
                        <span className="mx-2">/</span>
                        <span className="text-gray-900 font-semibold">{tutor.name}</span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

                        {/* ── Left Column ── */}
                        <div className="lg:col-span-3 space-y-4">

                            {/* Profile Header Card — matches TutorCard design */}
                            <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden">
                                <TutorsBanner seed={tutor.id} className="h-26 w-full" />

                                <div className="p-6 pt-0">
                                    <div className="flex items-start justify-between gap-4 mb-2 relative -mt-8">
                                        {/* Avatar */}
                                        <div className="relative">
                                            <div className="w-16 h-16 rounded-lg bg-green-950 ring-4 ring-gray-100 flex items-center justify-center text-white font-bold text-lg shrink-0">
                                                SJ
                                            </div>
                                            {tutor.verified && (
                                                <div className="absolute -top-1.5 -right-1.5 bg-green-600 rounded-full p-1">
                                                    <FiCheckCircle className="text-white" size={12} />
                                                </div>
                                            )}
                                        </div>

                                        <button className="p-3 text-gray-500 bg-white rounded-full mt-2 shadow-sm hover:bg-red-50 hover:text-red-500 transition-all">
                                            <FiFlag size={18} />
                                        </button>
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <h1 className="text-lg font-bold text-gray-900">{tutor.name}</h1>
                                        <p className="text-xs text-gray-600 mb-2">{tutor.title}</p>

                                        <StarRating rating={tutor.rating} reviews={tutor.reviews} />

                                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 mb-4">
                                            <span className="flex items-center gap-1 text-xs text-gray-600">
                                                <FiMapPin size={12} className="text-green-700" />
                                                {tutor.location}
                                            </span>
                                            <span className="flex items-center gap-1 text-xs text-gray-600">
                                                <FiBook size={12} className="text-green-700" />
                                                {tutor.languages.join(", ")}
                                            </span>
                                            <span className="flex items-center gap-1 text-xs text-gray-600">
                                                <FiClock size={12} className="text-green-700" />
                                                Response: {tutor.responseTime}
                                            </span>
                                        </div>

                                        {/* Session type badges */}
                                        <div className="flex gap-2 mb-4">
                                            <span className="px-2 py-1 bg-green-50 text-green-700 rounded text-xs font-semibold">Online</span>
                                            <span className="px-2 py-1 bg-orange-50 text-orange-700 rounded text-xs font-semibold">Onsite</span>
                                        </div>

                                        {/* Actions — message stays solid, secondary uses white/border format */}
                                        <div className="flex gap-2">
                                            <button className="flex-1 px-4 py-3 bg-green-700 text-white rounded-full font-semibold text-sm flex items-center justify-center gap-2 hover:bg-green-800 transition-all">
                                                <FiMessageSquare size={14} />
                                                Message Sarah
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* About */}
                            <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6">
                                <h2 className="font-bold text-gray-900 mb-3">About Dr. Jenkins</h2>
                                <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-line">{tutor.bio}</p>
                            </div>

                            {/* Expertise */}
                            <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6">
                                <h3 className="font-bold text-gray-900 mb-3">Areas of Expertise</h3>
                                <div className="flex flex-wrap gap-2">
                                    {expertise.map((skill, idx) => (
                                        <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 font-semibold rounded-full text-[10px]">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Experience & Education */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6">
                                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <FiAward size={14} className="text-green-700" />
                                        Experience
                                    </h3>
                                    <div className="space-y-4">
                                        {experience.map((exp, idx) => (
                                            <div key={idx}>
                                                <h4 className="font-semibold text-xs text-gray-900">{exp.role}</h4>
                                                <p className="text-[10px] text-green-700">{exp.company} • {exp.period}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6">
                                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <FiBook size={14} className="text-green-700" />
                                        Education
                                    </h3>
                                    <div className="space-y-4">
                                        {education.map((edu, idx) => (
                                            <div key={idx}>
                                                <h4 className="font-semibold text-xs text-gray-900">{edu.degree}</h4>
                                                <p className="text-[10px] text-green-700">{edu.school} • {edu.year}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Reviews */}
                            <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-bold text-gray-900">Student Reviews</h3>
                                    <StarRating rating={4.9} reviews={tutor.reviews} />
                                </div>

                                <div className="space-y-4">
                                    {reviews.map((review) => (
                                        <div key={review.id} className="border-b border-gray-100 pb-4 last:border-b-0">
                                            <div className="flex items-center justify-between mb-1">
                                                <h4 className="font-semibold text-xs text-gray-900">{review.author}</h4>
                                                <span className="text-[10px] text-gray-500">{review.date}</span>
                                            </div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="flex items-center gap-0.5">
                                                    {[...Array(5)].map((_, i) => (
                                                        <FaStar key={i} size={9} className={i < Math.round(review.rating) ? "text-yellow-400" : "text-gray-300"} />
                                                    ))}
                                                </div>
                                                {review.verified && (
                                                    <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">
                                                        Verified
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xs text-gray-600">{review.text}</p>
                                        </div>
                                    ))}
                                </div>

                                <button className="w-full mt-6 py-2.5 border border-gray-300 text-xs font-semibold text-gray-700 rounded-full hover:bg-gray-50 transition-all">
                                    View All Reviews
                                </button>
                            </div>
                        </div>

                        {/* ── Right Column — Booking ── */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 sticky top-8">
                                <h3 className="font-bold text-gray-900 mb-1">Book a Session</h3>
                                <p className="text-green-700 font-bold text-lg mb-4">
                                    ${tutor.price}<span className="text-xs text-gray-600 font-normal">/hr</span>
                                </p>

                                {bookingStep === 1 && (
                                    <>
                                        {/* Session Type */}
                                        <div className="mb-4">
                                            <label className="block text-xs font-semibold text-gray-800 mb-2">Session Type</label>
                                            <div className="flex gap-2">
                                                {["Online", "On-site"].map((type) => (
                                                    <button key={type} className={`flex-1 px-3 py-2 rounded-lg font-semibold text-xs border transition-all ${type === "Online" ? "bg-green-50 text-green-700 border-green-300" : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"}`}>
                                                        {type}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Calendar */}
                                        <div className="mb-4">
                                            <label className="block text-xs font-semibold text-gray-800 mb-2">October 2024</label>
                                            <div className="grid grid-cols-7 gap-1">
                                                {["M", "T", "W", "T", "F", "S", "S"].map((day, idx) => (
                                                    <div key={idx} className="text-center text-[10px] font-semibold text-gray-500 py-1">
                                                        {day}
                                                    </div>
                                                ))}
                                                {daysInMonth.map((day) => (
                                                    <button
                                                        key={day}
                                                        onClick={() => setSelectedDate(day)}
                                                        className={`py-1.5 rounded-lg text-[10px] font-medium transition-all ${selectedDate === day ? "bg-green-700 text-white" : "bg-gray-50 text-gray-700 border border-gray-200 hover:bg-green-50"}`}
                                                    >
                                                        {day}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Time Slots */}
                                        <div className="mb-4">
                                            <label className="block text-xs font-semibold text-gray-800 mb-2">Available Times (GMT)</label>
                                            <div className="grid grid-cols-2 gap-2">
                                                {availableTimes.map((time) => (
                                                    <button
                                                        key={time}
                                                        onClick={() => setSelectedTime(time)}
                                                        className={`py-2 rounded-lg text-[10px] font-semibold transition-all ${selectedTime === time ? "bg-green-50 text-green-700 border border-green-300" : "bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100"}`}
                                                    >
                                                        {time}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Fee Summary */}
                                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-4 space-y-1.5">
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs font-semibold text-gray-900">Session Fee (1hr)</span>
                                                <span className="text-xs text-gray-700">${tutor.price}.00</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs font-semibold text-gray-900">Service Fee</span>
                                                <span className="text-xs text-gray-700">$2.50</span>
                                            </div>
                                            <div className="border-t border-gray-200 pt-1.5 flex items-center justify-between">
                                                <span className="text-xs font-bold text-gray-900">Total</span>
                                                <span className="text-xs font-bold text-gray-900">${tutor.price + 2.50}</span>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => setBookingStep(2)}
                                            className="w-full py-3 bg-green-700 text-white rounded-full font-bold text-xs hover:bg-green-800 transition-all"
                                        >
                                            Confirm Booking
                                        </button>

                                        <p className="text-[10px] text-gray-500 text-center mt-3">
                                            You won't be charged yet. Cancellation is free up to 24 hours before the session.
                                        </p>
                                    </>
                                )}

                                {bookingStep === 2 && (
                                    <div className="text-center">
                                        <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <FiCheckCircle className="text-green-700" size={28} />
                                        </div>
                                        <h4 className="text-sm font-bold text-gray-900 mb-1">Booking Confirmed!</h4>
                                        <p className="text-xs text-gray-600 mb-5">
                                            Your session with Dr. Sarah Jenkins is confirmed for October {selectedDate}, 2024 at {selectedTime}
                                        </p>
                                        <button className="w-full py-2.5 bg-green-700 text-white rounded-full font-bold text-xs hover:bg-green-800 transition-all mb-2">
                                            View Confirmation
                                        </button>
                                        <button
                                            onClick={() => setBookingStep(1)}
                                            className="w-full py-2.5 border border-gray-300 text-xs font-semibold text-gray-700 rounded-full hover:bg-gray-50 transition-all"
                                        >
                                            Book Another Session
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentTutorProfile;