import { useState } from "react";
import { FaStar } from "react-icons/fa";
import {
    FiBookmark,
    FiChevronDown,
    FiFilter,
    FiMapPin,
    FiSearch,
    FiX
} from "react-icons/fi";
import { Link } from "react-router-dom";
import LoadingOverlay from "../../components/LoadingOverlay";
import TutorsBanner from "../../components/TutorsBanner";
import { useGetTutors } from "../../hooks/queries/allQueries";

type SelectedFilters = {
    subject: string;
    location: string;
    priceMin: number;
    priceMax: number;
    sessionType: string;
    minRating: number;
    availability: string[];
};

const DEFAULT_FILTERS: SelectedFilters = {
    subject: "",
    location: "",
    priceMin: 20,
    priceMax: 150,
    sessionType: "all",
    minRating: 0,
    availability: [],
};

const StudentTutors = () => {
    const [selectedFilters, setSelectedFilters] = useState<SelectedFilters>(DEFAULT_FILTERS);

    const [expandedFilters, setExpandedFilters] = useState({
        subject: true,
        location: true,
        price: true,
        sessionType: true,
        rating: true,
        availability: true,
    });

    const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

    // ── API data ──────────────────────────────────────────────────────────
    const { tutors, isLoading: isTutorLoading } = useGetTutors();
    const tutorsList = tutors?.data?.results ?? [];

    const toggleFilter = (filterName: keyof typeof expandedFilters) => {
        setExpandedFilters((prev) => ({
            ...prev,
            [filterName]: !prev[filterName],
        }));
    };

    const handleAvailabilityChange = (day: string) => {
        setSelectedFilters((prev) => ({
            ...prev,
            availability: prev.availability.includes(day)
                ? prev.availability.filter((d) => d !== day)
                : [...prev.availability, day],
        }));
    };

    const resetFilters = () => setSelectedFilters(DEFAULT_FILTERS);

    const activeFilterCount = [
        selectedFilters.subject,
        selectedFilters.location,
        selectedFilters.sessionType !== "all" ? selectedFilters.sessionType : "",
        selectedFilters.availability.length > 0 ? "avail" : "",
    ].filter(Boolean).length;

    const StarRating = ({ rating, reviews }: { rating: number; reviews: number }) => (
        <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                    <FaStar
                        key={i}
                        size={10}
                        className={i < Math.round(rating) ? "text-yellow-400" : "text-gray-300"}
                    />
                ))}
            </div>
            <span className="font-bold text-sm text-gray-900">{rating}</span>
            <span className="text-xs text-gray-600">({reviews} reviews)</span>
        </div>
    );

    const TutorCard = ({ tutor }: { tutor: any }) => (
        <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden transition-all">
            {/* Banner */}
            <TutorsBanner seed={tutor.id} className="h-26 w-full" />

            <div className="p-6 pt-0 flex flex-col h-full">
                <div className="flex items-start justify-between gap-4 mb-2 relative -mt-8">
                    <div className="w-16 h-16 rounded-lg bg-green-950 ring-4 ring-gray-100 flex items-center justify-center text-white font-bold text-lg shrink-0 overflow-hidden">
                        {tutor.image_url || tutor.profile_image ? (
                            <img
                                src={tutor.image_url || tutor.profile_image}
                                alt={tutor.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            tutor.image || tutor.name?.split(" ").map((n: string) => n[0]).join("").slice(0, 2)
                        )}
                    </div>
                    <button className="p-3 text-green-800 bg-white rounded-full mt-2 shadow-sm">
                        <FiBookmark size={25} />
                    </button>
                </div>

                {/* Name and Title */}
                <div className="mb-4">
                    <h4 className="text-lg font-bold text-gray-900">{tutor.name}</h4>
                    <p className="text-xs text-gray-600 line-clamp-2 leading-tight">{tutor.title}</p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-2">
                    {tutor.tags?.map((tag: string, idx: number) => (
                        <span key={idx} className="px-2 py-1 bg-gray-200 text-gray-700 font-semibold rounded-full text-[10px]">
                            {tag}
                        </span>
                    ))}
                </div>

                {/* Rating */}
                <div className="mb-2">
                    <StarRating rating={tutor.rating} reviews={tutor.reviews} />
                </div>

                {/* Session Type and Price */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-300 mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                        {tutor.sessionType?.includes("online") && (
                            <span className="px-2 py-1 bg-green-50 text-green-700 rounded text-xs font-semibold">
                                Online
                            </span>
                        )}
                        {tutor.sessionType?.includes("on-site") && (
                            <span className="px-2 py-1 bg-orange-50 text-orange-700 rounded text-xs font-semibold">
                                Onsite
                            </span>
                        )}
                    </div>
                    <div className="text-right">
                        <span className="text-lg font-bold text-gray-900">${tutor.price}</span>
                        <span className="text-xs text-gray-600">/hr</span>
                    </div>
                </div>

                {/* Action Button — white with border format */}
                <Link to={`/student/dashboard/tutor/${tutor.id}`}>
                    <button className="w-full px-4 py-3 border-2 border-green-700 text-green-700 bg-white rounded-full font-semibold transition-all text-sm hover:bg-green-50">
                        View Profile
                    </button>
                </Link>
            </div>
        </div>
    );

    // ── Empty state for when no tutors match / are available ────────────────
    const EmptyTutorsState = () => (
        <div className="flex flex-col items-center justify-center text-center py-16 px-6 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            <div className="w-16 h-16 rounded-full bg-white border border-gray-200 flex items-center justify-center mb-4">
                <FiSearch size={24} className="text-gray-400" />
            </div>
            <h4 className="text-base font-bold text-gray-900 mb-1">No tutors found</h4>
            <p className="text-sm text-gray-500 max-w-sm mb-6">
                {activeFilterCount > 0
                    ? "No tutors match your current filters. Try adjusting or clearing them to see more results."
                    : "There are no tutors available right now. Please check back again soon."}
            </p>
            {activeFilterCount > 0 && (
                <button
                    onClick={resetFilters}
                    className="px-5 py-2.5 bg-green-900 text-white rounded-full font-semibold text-sm hover:bg-green-800 transition-all"
                >
                    Clear All Filters
                </button>
            )}
        </div>
    );

    const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    const FilterSection = ({
        title,
        name,
        children,
    }: {
        title: string;
        name: keyof typeof expandedFilters;
        children: React.ReactNode;
    }) => (
        <div className="border-b border-gray-200 py-4">
            <button
                onClick={() => toggleFilter(name)}
                className="w-full flex items-center justify-between font-semibold text-gray-900 hover:text-green-600 transition-colors"
            >
                <span className="text-xs tracking-wide">{title}</span>
                <FiChevronDown
                    size={15}
                    className={`transition-transform ${expandedFilters[name] ? "rotate-180" : ""}`}
                />
            </button>
            {expandedFilters[name] && <div className="mt-4">{children}</div>}
        </div>
    );

    const FilterPanelContent = () => (
        <>
            <FilterSection title="Subject" name="subject">
                <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                        type="text"
                        placeholder="e.g. Mathematics"
                        value={selectedFilters.subject}
                        onChange={(e) =>
                            setSelectedFilters((prev) => ({ ...prev, subject: e.target.value }))
                        }
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100"
                    />
                </div>
            </FilterSection>

            <FilterSection title="Location" name="location">
                <div className="relative">
                    <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                        type="text"
                        placeholder="Enter city or zip code"
                        value={selectedFilters.location}
                        onChange={(e) =>
                            setSelectedFilters((prev) => ({ ...prev, location: e.target.value }))
                        }
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100"
                    />
                </div>
            </FilterSection>

            <FilterSection title="Price Range" name="price">
                <div className="grid grid-cols-2 gap-3">
                    <input
                        type="number"
                        placeholder="Min"
                        value={selectedFilters.priceMin}
                        onChange={(e) =>
                            setSelectedFilters((prev) => ({ ...prev, priceMin: Number(e.target.value) }))
                        }
                        className="px-3 py-2 rounded border border-gray-200 text-sm focus:outline-none focus:border-green-400"
                    />
                    <input
                        type="number"
                        placeholder="Max"
                        value={selectedFilters.priceMax}
                        onChange={(e) =>
                            setSelectedFilters((prev) => ({ ...prev, priceMax: Number(e.target.value) }))
                        }
                        className="px-3 py-2 rounded border border-gray-200 text-sm focus:outline-none focus:border-green-400"
                    />
                </div>
            </FilterSection>

            <FilterSection title="Session Type" name="sessionType">
                <div className="flex gap-2">
                    {["All", "Online", "Onsite"].map((type) => (
                        <button
                            key={type}
                            onClick={() =>
                                setSelectedFilters((prev) => ({
                                    ...prev,
                                    sessionType: type.toLowerCase(),
                                }))
                            }
                            className={`px-2 py-2 rounded text-xs font-semibold transition-all flex-1 ${selectedFilters.sessionType === type.toLowerCase()
                                ? "bg-green-100 text-green-700 border border-green-300"
                                : "bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100"
                                }`}
                        >
                            {type}
                        </button>
                    ))}
                </div>
            </FilterSection>

            <FilterSection title="Availability" name="availability">
                <div className="grid grid-cols-3 gap-2">
                    {daysOfWeek.map((day) => (
                        <button
                            key={day}
                            onClick={() => handleAvailabilityChange(day)}
                            className={`py-2 rounded-sm text-xs font-semibold transition-all ${selectedFilters.availability.includes(day)
                                ? "bg-green-100 text-green-700 border border-green-300"
                                : "bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100"
                                }`}
                        >
                            {day}
                        </button>
                    ))}
                </div>
            </FilterSection>
        </>
    );

    return (
        <div className="md:pl-56 pb-20 md:pb-8">
            <LoadingOverlay visible={isTutorLoading} />
            <div className="min-h-screen pt-8 bg-gray-50">
                <div className="px-4 sm:px-6 lg:px-8 max-w-7xl m-auto py-8">

                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-1">
                                Find a Tutor
                            </h1>
                            <p className="text-gray-600 text-sm">
                                {tutorsList.length > 0
                                    ? `${tutorsList.length} tutor${tutorsList.length === 1 ? "" : "s"} available now`
                                    : "Browse available tutors"}
                            </p>
                        </div>

                        {/* Mobile filter trigger button (top-right header) */}
                        <button
                            onClick={() => setMobileFilterOpen(true)}
                            className="md:hidden relative flex items-center justify-center gap-2 px-4 py-2.5 bg-white rounded-full border border-gray-300 hover:bg-gray-50 transition-all text-sm font-semibold text-gray-700 w-fit"
                        >
                            <FiFilter size={16} />
                            Filters
                            {activeFilterCount > 0 && (
                                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-green-700 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                    {activeFilterCount}
                                </span>
                            )}
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">

                        {/* Desktop Sidebar */}
                        <div className="hidden md:block md:col-span-1 bg-white rounded-2xl border border-gray-200 p-6 h-fit sticky top-8">
                            <FilterPanelContent />
                        </div>

                        {/* Tutors Grid */}
                        <div className="md:col-span-3">
                            {!isTutorLoading && tutorsList.length === 0 ? (
                                <EmptyTutorsState />
                            ) : (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-8">
                                        {tutorsList.map((tutor: any) => (
                                            <TutorCard key={tutor.id} tutor={tutor} />
                                        ))}
                                    </div>

                                    {/* Pagination */}
                                    <div className="flex items-center justify-center gap-2">
                                        <button className="px-4 py-2 bg-white border border-gray-200 rounded-full text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-all">
                                            Previous
                                        </button>
                                        {[1, 2, 3, "...", 42].map((page, idx) => (
                                            <button
                                                key={idx}
                                                className={`w-9 h-9 rounded-full font-semibold text-xs transition-all ${page === 1
                                                    ? "bg-green-700 text-white"
                                                    : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                                                    }`}
                                            >
                                                {page}
                                            </button>
                                        ))}
                                        <button className="px-4 py-2 bg-white border border-gray-200 rounded-full text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-all">
                                            Next
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Mobile Filter Bottom-Sheet Modal ── */}

            {/* Backdrop */}
            <div
                onClick={() => setMobileFilterOpen(false)}
                className={`md:hidden fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ${mobileFilterOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                    }`}
            />

            {/* Sheet */}
            <div
                className={`md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl shadow-2xl transition-transform duration-300 ease-out ${mobileFilterOpen ? "translate-y-0" : "translate-y-full"
                    }`}
                style={{ maxHeight: "88vh" }}
            >
                {/* Drag handle */}
                <div className="flex justify-center pt-3 pb-1">
                    <div className="w-10 h-1 bg-gray-300 rounded-full" />
                </div>

                {/* Sheet header */}
                <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-gray-900">Filters</h3>
                        {activeFilterCount > 0 && (
                            <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                                {activeFilterCount} active
                            </span>
                        )}
                    </div>
                    <button
                        onClick={() => setMobileFilterOpen(false)}
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500"
                    >
                        <FiX size={20} />
                    </button>
                </div>

                {/* Scrollable filter content */}
                <div className="overflow-y-auto px-5" style={{ maxHeight: "calc(88vh - 120px)" }}>
                    <FilterPanelContent />
                    <div className="h-4" />
                </div>

                {/* Sheet footer: actions */}
                <div className="px-5 py-4 border-t border-gray-100 flex gap-3 bg-white">
                    <button
                        onClick={resetFilters}
                        className="flex-1 py-3 rounded-full border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all"
                    >
                        Clear All
                    </button>
                    <button
                        onClick={() => setMobileFilterOpen(false)}
                        className="flex-[2] py-3 rounded-full bg-green-700 text-white text-sm font-semibold hover:bg-green-800 transition-all"
                    >
                        Show Results
                    </button>
                </div>
            </div>

            {/* Floating Filter FAB (mobile only) — hidden when sheet is open */}
            <button
                onClick={() => setMobileFilterOpen(true)}
                className={`md:hidden fixed bottom-28 right-4 p-5 bg-green-700 border-4 border-white text-white rounded-full shadow-lg transition-all ${mobileFilterOpen ? "opacity-0 pointer-events-none scale-90" : "opacity-100 scale-100"
                    }`}
            >
                <FiFilter size={24} />
                {activeFilterCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-white text-green-700 text-[10px] font-bold rounded-full flex items-center justify-center">
                        {activeFilterCount}
                    </span>
                )}
            </button>
        </div>
    );
};

export default StudentTutors;