import { useState } from "react";
import { FaStar } from "react-icons/fa";
import {
    FiBookmark,
    FiChevronDown,
    FiFilter,
    FiMapPin,
    FiMessageCircle,
    FiSearch,
    FiX,
} from "react-icons/fi";

const StudentTutors = () => {
    const [selectedFilters, setSelectedFilters] = useState({
        subject: "",
        location: "",
        priceMin: 20,
        priceMax: 150,
        sessionType: "all",
        minRating: 0,
        availability: [],
    });

    const [sortBy, setSortBy] = useState("best-match");
    const [currentPage, setCurrentPage] = useState(1);
    const [expandedFilters, setExpandedFilters] = useState({
        subject: true,
        location: true,
        price: true,
        sessionType: true,
        rating: true,
        availability: true,
    });

    const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

    const tutors = [
        {
            id: 1,
            name: "Dr. Sarah Mitchell",
            title: "PhD in Mathematics with 10+ years of teaching experience",
            rating: 4.9,
            reviews: 128,
            price: 45,
            image: "SM",
            subjects: ["Calculus", "Linear Algebra"],
            tags: ["SAT Math"],
            sessionType: ["online"],
            bio: "Expert in helping students conquer complex mathematical concepts with patient, structured approach.",
            verified: true,
        },
        {
            id: 2,
            name: "James Anderson",
            title: "Native English Speaker & IELTS Expert. Let's master the language.",
            rating: 4.8,
            reviews: 84,
            price: 35,
            image: "JA",
            subjects: ["English", "IELTS"],
            tags: ["Public Speaking"],
            sessionType: ["online"],
            bio: "Specialized in IELTS preparation and conversational English for non-native speakers.",
            verified: true,
        },
        {
            id: 3,
            name: "Elena Rodriguez",
            title: "Passionate Spanish Teacher. Cultural immersion through language.",
            rating: 5.0,
            reviews: 42,
            price: 30,
            image: "ER",
            subjects: ["Spanish", "Hispanic Literature"],
            tags: ["Business Spanish"],
            sessionType: ["online", "on-site"],
            bio: "Native Spanish speaker providing cultural immersion and practical language skills.",
            verified: true,
        },
        {
            id: 4,
            name: "Prof. Michael Chen",
            title: "Expert Physics Tutor. Simplifying complex concepts.",
            rating: 4.7,
            reviews: 215,
            price: 60,
            image: "MC",
            subjects: ["Physics", "Mechanics"],
            tags: ["IB Physics"],
            sessionType: ["online"],
            bio: "Former university professor bringing real-world physics insights to tutoring.",
            verified: true,
        },
        {
            id: 5,
            name: "Sophie Thompson",
            title: "Professional Designer & Creative Tech Lead. Learn UI/UX Design.",
            rating: 4.9,
            reviews: 56,
            price: 80,
            image: "ST",
            subjects: ["UI/UX Design", "Figma"],
            tags: ["Web Development"],
            sessionType: ["online"],
            bio: "Industry professional teaching practical design skills used in top tech companies.",
            verified: false,
        },
        {
            id: 6,
            name: "David Wilson",
            title: "Chartered Accountant (CPA). Practical Accounting and Finance.",
            rating: 4.8,
            reviews: 92,
            price: 55,
            image: "DW",
            subjects: ["Accounting", "Finance"],
            tags: ["Excel"],
            sessionType: ["on-site"],
            bio: "Certified accountant with 15+ years of corporate finance experience.",
            verified: true,
        },
    ];

    const toggleFilter = (filterName) => {
        setExpandedFilters((prev) => ({
            ...prev,
            [filterName]: !prev[filterName],
        }));
    };

    const handleRatingChange = (rating) => {
        setSelectedFilters((prev) => ({
            ...prev,
            minRating: prev.minRating === rating ? 0 : rating,
        }));
    };

    const handleAvailabilityChange = (day) => {
        setSelectedFilters((prev) => ({
            ...prev,
            availability: prev.availability.includes(day)
                ? prev.availability.filter((d) => d !== day)
                : [...prev.availability, day],
        }));
    };

    const StarRating = ({ rating, reviews }) => (
        <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                    <FaStar
                        key={i}
                        size={16}
                        className={i < Math.round(rating) ? "text-yellow-400" : "text-gray-300"}
                    />
                ))}
            </div>
            <span className="font-bold text-gray-900">{rating}</span>
            <span className="text-sm text-gray-600">({reviews} reviews)</span>
        </div>
    );

    const TutorCard = ({ tutor }) => (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all">
            <div className="p-6">
                {/* Header */}
                <div className="flex items-start gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                        {tutor.image}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 text-lg">{tutor.name}</h3>
                        <p className="text-sm text-gray-600 line-clamp-2">{tutor.title}</p>
                    </div>
                    <button className="p-2 text-gray-400 hover:text-emerald-600 transition-colors">
                        <FiBookmark size={20} />
                    </button>
                </div>

                {/* Rating */}
                <div className="mb-4">
                    <StarRating rating={tutor.rating} reviews={tutor.reviews} />
                </div>

                {/* Bio */}
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{tutor.bio}</p>

                {/* Subjects and Tags */}
                <div className="mb-4">
                    <div className="flex flex-wrap gap-2 mb-2">
                        {tutor.subjects.map((subject, idx) => (
                            <span key={idx} className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold">
                                {subject}
                            </span>
                        ))}
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {tutor.tags.map((tag, idx) => (
                            <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Session Type and Price */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100 mb-4">
                    <div className="flex items-center gap-2">
                        {tutor.sessionType.includes("online") && (
                            <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-semibold">
                                Online
                            </span>
                        )}
                        {tutor.sessionType.includes("on-site") && (
                            <span className="px-2 py-1 bg-purple-50 text-purple-700 rounded-md text-xs font-semibold">
                                On-site
                            </span>
                        )}
                    </div>
                    <div className="text-right">
                        <span className="text-lg font-bold text-gray-900">${tutor.price}</span>
                        <span className="text-xs text-gray-600">/hr</span>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3">
                    <button className="px-4 py-2 bg-white border border-emerald-500 text-emerald-600 rounded-lg font-semibold text-sm hover:bg-emerald-50 transition-all">
                        View Profile
                    </button>
                    <button className="px-4 py-2 bg-emerald-500 text-white rounded-lg font-semibold text-sm hover:bg-emerald-600 transition-all">
                        Book Session
                    </button>
                </div>
            </div>
        </div>
    );

    const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    const FilterSection = ({ title, name, children }) => (
        <div className="border-b border-gray-200 py-4">
            <button
                onClick={() => toggleFilter(name)}
                className="w-full flex items-center justify-between font-semibold text-gray-900 hover:text-emerald-600 transition-colors"
            >
                <span className="uppercase text-sm tracking-wide">{title}</span>
                <FiChevronDown
                    size={20}
                    className={`transition-transform ${expandedFilters[name] ? "rotate-180" : ""}`}
                />
            </button>
            {expandedFilters[name] && <div className="mt-4">{children}</div>}
        </div>
    );

    return (
        <div className="md:pl-56 pb-20 md:pb-8">
            <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
                <div className="px-4 sm:px-6 lg:px-8 py-8">
                    {/* Header with Search */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">
                                    1,248 Tutors Available Now
                                </h1>
                                <p className="text-gray-600 text-sm mt-1">
                                    Searching for "Mathematics" in "London" •{" "}
                                    <a href="#" className="text-emerald-600 font-semibold hover:text-emerald-700">
                                        Edit
                                    </a>
                                </p>
                            </div>
                            <button className="md:hidden p-3 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-all">
                                <FiFilter size={20} className="text-gray-600" />
                            </button>
                        </div>

                        {/* Sort Options */}
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-600 font-semibold">SORT BY</span>
                            <div className="flex gap-2">
                                {["Best Match", "Price", "Rating"].map((option) => (
                                    <button
                                        key={option}
                                        onClick={() => setSortBy(option.toLowerCase())}
                                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${sortBy === option.toLowerCase()
                                            ? "bg-emerald-500 text-white"
                                            : "bg-white text-emerald-600 border border-emerald-200 hover:bg-emerald-50"
                                            }`}
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {/* Filter Sidebar */}
                        <div
                            className={`${mobileFilterOpen ? "block" : "hidden"
                                } md:block md:col-span-1 bg-white rounded-2xl border border-gray-100 p-6 h-fit sticky top-24`}
                        >
                            {/* Mobile Filter Header */}
                            <div className="flex items-center justify-between mb-6 md:hidden">
                                <h3 className="text-lg font-bold text-gray-900">Filters</h3>
                                <button
                                    onClick={() => setMobileFilterOpen(false)}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-all"
                                >
                                    <FiX size={20} />
                                </button>
                            </div>

                            {/* Subject Filter */}
                            <FilterSection title="Subject" name="subject">
                                <div className="relative">
                                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                    <input
                                        type="text"
                                        placeholder="e.g. Mathematics"
                                        value={selectedFilters.subject}
                                        onChange={(e) =>
                                            setSelectedFilters((prev) => ({
                                                ...prev,
                                                subject: e.target.value,
                                            }))
                                        }
                                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                                    />
                                </div>
                            </FilterSection>

                            {/* Location Filter */}
                            <FilterSection title="Location" name="location">
                                <div className="space-y-3">
                                    <div className="relative">
                                        <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                        <input
                                            type="text"
                                            placeholder="Enter city or zip code"
                                            value={selectedFilters.location}
                                            onChange={(e) =>
                                                setSelectedFilters((prev) => ({
                                                    ...prev,
                                                    location: e.target.value,
                                                }))
                                            }
                                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                                        />
                                    </div>
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <label className="text-sm font-semibold text-gray-700">Radius</label>
                                            <span className="text-emerald-600 font-semibold">25 miles</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="1"
                                            max="50"
                                            defaultValue="25"
                                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                                        />
                                    </div>
                                </div>
                            </FilterSection>

                            {/* Price Range Filter */}
                            <FilterSection title="Price Range" name="price">
                                <div className="space-y-4">
                                    <input
                                        type="range"
                                        min="0"
                                        max="300"
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                                    />
                                    <div className="flex gap-3">
                                        <input
                                            type="number"
                                            placeholder="MIN"
                                            value={selectedFilters.priceMin}
                                            onChange={(e) =>
                                                setSelectedFilters((prev) => ({
                                                    ...prev,
                                                    priceMin: e.target.value,
                                                }))
                                            }
                                            className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-emerald-400"
                                        />
                                        <input
                                            type="number"
                                            placeholder="MAX"
                                            value={selectedFilters.priceMax}
                                            onChange={(e) =>
                                                setSelectedFilters((prev) => ({
                                                    ...prev,
                                                    priceMax: e.target.value,
                                                }))
                                            }
                                            className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-emerald-400"
                                        />
                                    </div>
                                </div>
                            </FilterSection>

                            {/* Session Type Filter */}
                            <FilterSection title="Session Type" name="sessionType">
                                <div className="space-y-3 flex gap-2">
                                    {["All", "Online", "On-site"].map((type) => (
                                        <button
                                            key={type}
                                            onClick={() =>
                                                setSelectedFilters((prev) => ({
                                                    ...prev,
                                                    sessionType: type.toLowerCase(),
                                                }))
                                            }
                                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex-1 ${selectedFilters.sessionType === type.toLowerCase()
                                                ? "bg-emerald-100 text-emerald-700 border border-emerald-300"
                                                : "bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100"
                                                }`}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            </FilterSection>

                            {/* Minimum Rating Filter */}
                            <FilterSection title="Minimum Rating" name="rating">
                                <div className="space-y-2">
                                    {[5, 4, 3, 2].map((rating) => (
                                        <label key={rating} className="flex items-center gap-3 cursor-pointer group">
                                            <input
                                                type="checkbox"
                                                checked={selectedFilters.minRating === rating}
                                                onChange={() => handleRatingChange(rating)}
                                                className="w-4 h-4 rounded border-gray-300 text-emerald-600 cursor-pointer"
                                            />
                                            <div className="flex items-center gap-1">
                                                {[...Array(rating)].map((_, i) => (
                                                    <FaStar key={i} size={16} className="text-yellow-400" />
                                                ))}
                                                {[...Array(5 - rating)].map((_, i) => (
                                                    <FaStar key={i} size={16} className="text-gray-300" />
                                                ))}
                                            </div>
                                            <span className="text-sm text-gray-600 font-medium">& Up</span>
                                        </label>
                                    ))}
                                </div>
                            </FilterSection>

                            {/* Availability Filter */}
                            <FilterSection title="Availability" name="availability">
                                <div className="grid grid-cols-3 gap-2">
                                    {daysOfWeek.map((day) => (
                                        <button
                                            key={day}
                                            onClick={() => handleAvailabilityChange(day)}
                                            className={`py-2 rounded-lg text-sm font-semibold transition-all ${selectedFilters.availability.includes(day)
                                                ? "bg-emerald-100 text-emerald-700 border border-emerald-300"
                                                : "bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100"
                                                }`}
                                        >
                                            {day}
                                        </button>
                                    ))}
                                </div>
                            </FilterSection>

                            {/* Clear All Button */}
                            <button className="w-full mt-6 py-2 text-emerald-600 font-semibold hover:text-emerald-700 transition-colors text-sm">
                                Clear All Filters
                            </button>
                        </div>

                        {/* Tutors Grid */}
                        <div className="md:col-span-3">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                                {tutors.map((tutor) => (
                                    <TutorCard key={tutor.id} tutor={tutor} />
                                ))}
                            </div>

                            {/* End of Results Message */}
                            <div className="text-center py-12 mb-12">
                                <div className="text-emerald-600 mb-4 text-4xl">⏱️</div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">End of current search results</h3>
                                <p className="text-gray-600">
                                    Try adjusting your filters or search terms to find more tutors matching your needs.
                                </p>
                            </div>

                            {/* Pagination */}
                            <div className="flex items-center justify-center gap-2 mb-12">
                                <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all">
                                    Previous Page
                                </button>
                                {[1, 2, 3, "...", 42].map((page, idx) => (
                                    <button
                                        key={idx}
                                        className={`w-10 h-10 rounded-lg font-semibold text-sm transition-all ${page === 1
                                            ? "bg-emerald-500 text-white"
                                            : "border border-gray-200 text-gray-700 hover:bg-gray-50"
                                            }`}
                                    >
                                        {page}
                                    </button>
                                ))}
                                <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all">
                                    Next Page
                                </button>
                            </div>

                            {/* Consultant CTA */}
                            <div className="bg-emerald-50 rounded-2xl border-2 border-emerald-200 p-8 flex flex-col md:flex-row items-center gap-6">
                                <div className="flex-1">
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                        Can't find the perfect match?
                                    </h3>
                                    <p className="text-gray-700 mb-4">
                                        Our educational consultants are here to help you find the best tutor for your specific learning goals.
                                        Schedule a free 15-minute consultation.
                                    </p>
                                    <button className="px-6 py-3 bg-emerald-500 text-white rounded-lg font-semibold hover:bg-emerald-600 transition-all flex items-center gap-2">
                                        <FiMessageCircle size={18} />
                                        Talk to a Consultant
                                    </button>
                                </div>
                                <div className="w-48 h-48 bg-gradient-to-br from-emerald-200 to-emerald-300 rounded-xl flex-shrink-0 hidden md:block">
                                    <div className="w-full h-full rounded-xl overflow-hidden bg-emerald-300 flex items-center justify-center">
                                        <span className="text-4xl">👩‍💼</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Filter Toggle */}
                    <button
                        onClick={() => setMobileFilterOpen(true)}
                        className={`md:hidden fixed bottom-28 right-4 p-4 bg-emerald-500 text-white rounded-full shadow-lg hover:bg-emerald-600 transition-all ${mobileFilterOpen ? "hidden" : "block"
                            }`}
                    >
                        <FiFilter size={24} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StudentTutors;