import { useState } from "react";
import { FiAward, FiBook, FiCheckCircle, FiClock, FiFlag, FiMapPin, FiMessageSquare } from "react-icons/fi";

const StudentTutorProfile = () => {
    const [selectedDate, setSelectedDate] = useState(18);
    const [selectedTime, setSelectedTime] = useState("10:00 AM");
    const [bookingStep, setBookingStep] = useState(1);

    const tutor = {
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
        {
            role: "Senior Math Tutor",
            company: "WeLearnGlobal",
            period: "2021 - Present",
        },
        {
            role: "Assistant Professor",
            company: "University of Oxford",
            period: "2015 - 2021",
        },
    ];

    const education = [
        {
            degree: "PhD in Theoretical Mathematics",
            school: "Cambridge University",
            year: "2014",
        },
        {
            degree: "M.Sc. in Applied Statistics",
            school: "Imperial College London",
            year: "2010",
        },
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

    return (
        <div className="md:pl-56 pb-20 md:pb-8">
            <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
                <div className="px-4 sm:px-6 lg:px-8 py-8">
                    {/* Breadcrumb */}
                    <div className="text-sm text-gray-600 mb-8">
                        <a href="/tutors" className="hover:text-emerald-600">Find Tutors</a>
                        <span className="mx-2">/</span>
                        <a href="/tutors/math" className="hover:text-emerald-600">Mathematics</a>
                        <span className="mx-2">/</span>
                        <span className="text-gray-900 font-semibold">{tutor.name}</span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column - Tutor Info */}
                        <div className="lg:col-span-2">
                            {/* Profile Header */}
                            <div className="bg-white rounded-2xl border border-gray-100 p-8 mb-8">
                                <div className="flex flex-col sm:flex-row gap-8">
                                    {/* Avatar */}
                                    <div className="flex-shrink-0">
                                        <div className="relative">
                                            <div className="w-40 h-40 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold text-4xl">
                                                SJ
                                            </div>
                                            {tutor.verified && (
                                                <div className="absolute -top-2 -right-2 bg-emerald-500 rounded-full p-2">
                                                    <FiCheckCircle className="text-white" size={20} />
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1">
                                        <div className="mb-2">
                                            <h1 className="text-3xl font-bold text-gray-900">{tutor.name}</h1>
                                            <p className="text-emerald-600 font-semibold">{tutor.title}</p>
                                        </div>

                                        {/* Rating */}
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="flex">
                                                {[...Array(5)].map((_, i) => (
                                                    <span key={i} className="text-yellow-400 text-lg">★</span>
                                                ))}
                                            </div>
                                            <span className="text-lg font-bold text-gray-900">{tutor.rating}/5.0</span>
                                            <span className="text-gray-600">({tutor.reviews} reviews)</span>
                                        </div>

                                        {/* Details */}
                                        <div className="space-y-3 mb-6">
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <FiMapPin size={16} className="text-emerald-600" />
                                                <span>Resides in {tutor.location}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <FiBook size={16} className="text-emerald-600" />
                                                <span>{tutor.languages.join(", ")}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <FiClock size={16} className="text-emerald-600" />
                                                <span>Typical Response: {tutor.responseTime}</span>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-3">
                                            <button className="flex-1 px-6 py-3 bg-emerald-500 text-white rounded-lg font-semibold hover:bg-emerald-600 transition-all flex items-center justify-center gap-2">
                                                <FiMessageSquare size={18} />
                                                Message Sarah
                                            </button>
                                            <button className="px-4 py-3 border border-gray-200 text-gray-600 rounded-lg hover:bg-red-50 hover:text-red-600 transition-all">
                                                <FiFlag size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* About Section */}
                            <div className="bg-white rounded-2xl border border-gray-100 p-8 mb-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">About Dr. Jenkins</h2>
                                <p className="text-gray-600 leading-relaxed mb-6 whitespace-pre-line">{tutor.bio}</p>
                            </div>

                            {/* Expertise Section */}
                            <div className="bg-white rounded-2xl border border-gray-100 p-8 mb-8">
                                <h3 className="text-xl font-bold text-gray-900 mb-4">Areas of Expertise</h3>
                                <div className="flex flex-wrap gap-3">
                                    {expertise.map((skill, idx) => (
                                        <span key={idx} className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Experience and Education */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                {/* Experience */}
                                <div className="bg-white rounded-2xl border border-gray-100 p-8">
                                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                        <FiAward size={20} className="text-emerald-600" />
                                        Experience
                                    </h3>
                                    <div className="space-y-6">
                                        {experience.map((exp, idx) => (
                                            <div key={idx}>
                                                <h4 className="font-semibold text-gray-900">{exp.role}</h4>
                                                <p className="text-sm text-emerald-600">{exp.company} • {exp.period}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Education */}
                                <div className="bg-white rounded-2xl border border-gray-100 p-8">
                                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                        <FiBook size={20} className="text-emerald-600" />
                                        Education
                                    </h3>
                                    <div className="space-y-6">
                                        {education.map((edu, idx) => (
                                            <div key={idx}>
                                                <h4 className="font-semibold text-gray-900">{edu.degree}</h4>
                                                <p className="text-sm text-emerald-600">{edu.school} • {edu.year}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Reviews Section */}
                            <div className="bg-white rounded-2xl border border-gray-100 p-8">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-2xl font-bold text-gray-900">Student Reviews</h3>
                                    <div className="flex items-center gap-2">
                                        <span className="flex">
                                            {[...Array(5)].map((_, i) => (
                                                <span key={i} className="text-yellow-400">★</span>
                                            ))}
                                        </span>
                                        <span className="font-bold text-gray-900">4.9 / 5.0</span>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    {reviews.map((review) => (
                                        <div key={review.id} className="border-b border-gray-100 pb-6 last:border-b-0">
                                            <div className="flex items-center justify-between mb-2">
                                                <h4 className="font-semibold text-gray-900">{review.author}</h4>
                                                <span className="text-sm text-gray-500">{review.date}</span>
                                            </div>
                                            <div className="flex items-center gap-2 mb-3">
                                                <div className="flex">
                                                    {[...Array(5)].map((_, i) => (
                                                        <span key={i} className={i < Math.round(review.rating) ? "text-yellow-400" : "text-gray-300"}>★</span>
                                                    ))}
                                                </div>
                                                {review.verified && (
                                                    <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full font-semibold">
                                                        Verified
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-gray-600">{review.text}</p>
                                        </div>
                                    ))}
                                </div>

                                <button className="w-full mt-8 py-3 text-emerald-600 font-semibold hover:text-emerald-700 transition-all">
                                    View All Reviews
                                </button>
                            </div>
                        </div>

                        {/* Right Column - Booking */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 sticky top-24">
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">Book a Session</h3>
                                <p className="text-emerald-600 font-bold text-xl mb-6">${tutor.price}<span className="text-sm text-gray-600 font-normal">/hr</span></p>

                                {bookingStep === 1 && (
                                    <>
                                        <div className="mb-6">
                                            <label className="block text-sm font-semibold text-gray-800 mb-3">
                                                Session Type
                                            </label>
                                            <div className="grid grid-cols-2 gap-2">
                                                <button className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg font-semibold text-sm border-2 border-emerald-500">
                                                    Online
                                                </button>
                                                <button className="px-4 py-2 bg-gray-50 text-gray-600 rounded-lg font-semibold text-sm border-2 border-gray-200 hover:border-emerald-500 hover:text-emerald-600 transition-all">
                                                    On-site
                                                </button>
                                            </div>
                                        </div>

                                        <div className="mb-6">
                                            <label className="block text-sm font-semibold text-gray-800 mb-3">
                                                October 2024
                                            </label>
                                            <div className="grid grid-cols-7 gap-2">
                                                {["M", "T", "W", "T", "F", "S", "S"].map((day, idx) => (
                                                    <div key={idx} className="text-center text-xs font-semibold text-gray-600 py-2">
                                                        {day}
                                                    </div>
                                                ))}
                                                {daysInMonth.map((day) => (
                                                    <button
                                                        key={day}
                                                        onClick={() => setSelectedDate(day)}
                                                        className={`py-2 rounded-lg text-sm font-medium transition-all ${selectedDate === day
                                                            ? "bg-emerald-500 text-white"
                                                            : "bg-gray-50 text-gray-700 hover:bg-emerald-100"
                                                            }`}
                                                    >
                                                        {day}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="mb-6">
                                            <label className="block text-sm font-semibold text-gray-800 mb-3">
                                                Available Times (GMT)
                                            </label>
                                            <div className="grid grid-cols-2 gap-2">
                                                {availableTimes.map((time) => (
                                                    <button
                                                        key={time}
                                                        onClick={() => setSelectedTime(time)}
                                                        className={`py-2 rounded-lg text-sm font-medium transition-all ${selectedTime === time
                                                            ? "bg-emerald-500 text-white"
                                                            : "bg-gray-50 text-gray-700 hover:bg-emerald-100 border border-gray-200"
                                                            }`}
                                                    >
                                                        {time}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="bg-emerald-50 rounded-lg p-4 mb-6">
                                            <p className="text-sm text-gray-600 mb-2">
                                                <span className="font-semibold text-gray-900">Session Fee (1hr)</span><br />
                                                ${tutor.price}.00
                                            </p>
                                            <p className="text-sm text-gray-600 mb-2">
                                                <span className="font-semibold text-gray-900">Service Fee</span><br />
                                                $2.50
                                            </p>
                                            <div className="border-t border-emerald-200 pt-2 mt-2">
                                                <p className="text-sm font-bold text-gray-900">
                                                    Total: ${tutor.price + 2.50}
                                                </p>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => setBookingStep(2)}
                                            className="w-full py-3 bg-gradient-to-r from-emerald-400 to-emerald-600 text-white rounded-lg font-bold hover:opacity-90 transition-all"
                                        >
                                            Confirm Booking
                                        </button>

                                        <p className="text-xs text-gray-600 text-center mt-4">
                                            You won't be charged yet. Cancellation is free up to 24 hours before the session.
                                        </p>
                                    </>
                                )}

                                {bookingStep === 2 && (
                                    <div className="text-center">
                                        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <FiCheckCircle className="text-emerald-600" size={32} />
                                        </div>
                                        <h4 className="text-lg font-bold text-gray-900 mb-2">Booking Confirmed!</h4>
                                        <p className="text-sm text-gray-600 mb-6">
                                            Your session with Dr. Sarah Jenkins is confirmed for October {selectedDate}, 2024 at {selectedTime}
                                        </p>
                                        <button className="w-full py-3 bg-emerald-500 text-white rounded-lg font-bold hover:bg-emerald-600 transition-all mb-3">
                                            View Confirmation
                                        </button>
                                        <button
                                            onClick={() => setBookingStep(1)}
                                            className="w-full py-3 border border-emerald-500 text-emerald-600 rounded-lg font-bold hover:bg-emerald-50 transition-all"
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