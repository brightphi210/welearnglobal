import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { FaStar } from "react-icons/fa";
import {
    FiBookmark,
    FiCheckCircle,
    FiChevronDown,
    FiFilter,
    FiMapPin,
    FiSearch,
    FiX,
} from "react-icons/fi";
import { Link, useSearchParams } from "react-router-dom";
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

type TutorData = {
    id: number;
    full_name?: string;
    name?: string;
    professional_title?: string;
    title?: string;
    bio?: string;
    subjects?: string[] | null;
    skills?: string[] | null;
    session_status?: string;
    sessionType?: string;
    hourly_rate?: string | number;
    price?: string | number;
    average_rating?: string | number;
    rating?: string | number;
    total_sessions?: number;
    reviews?: number;
    is_verified?: boolean;
    location?: string;
    language?: string;
    profile_image?: string | null;
    image_url?: string | null;
    image?: string | null;
    banner?: string | null;
    availability?: string[] | null;
};

const DEFAULT_FILTERS: SelectedFilters = {
    subject: "",
    location: "",
    priceMin: 0,
    priceMax: 0,
    sessionType: "all",
    minRating: 0,
    availability: [],
};

/** Reads the full filter set out of a URLSearchParams — used both on initial
 *  load and whenever another page (e.g. StudentOverview's category buttons)
 *  navigates here with params already set. */
const parseFiltersFromParams = (params: URLSearchParams): SelectedFilters => ({
    subject: params.get("subject") || "",
    location: params.get("location") || "",
    priceMin: Number(params.get("priceMin")) || 0,
    priceMax: Number(params.get("priceMax")) || 0,
    sessionType: params.get("sessionType") || "all",
    minRating: Number(params.get("minRating")) || 0,
    availability: params.get("availability")
        ? params.get("availability")!.split(",").filter(Boolean)
        : [],
});

/** Serializes the filter set back into URLSearchParams, omitting default/empty values. */
const filtersToParams = (filters: SelectedFilters): URLSearchParams => {
    const params = new URLSearchParams();
    if (filters.subject) params.set("subject", filters.subject);
    if (filters.location) params.set("location", filters.location);
    if (filters.priceMin) params.set("priceMin", String(filters.priceMin));
    if (filters.priceMax) params.set("priceMax", String(filters.priceMax));
    if (filters.sessionType !== "all") params.set("sessionType", filters.sessionType);
    if (filters.minRating) params.set("minRating", String(filters.minRating));
    if (filters.availability.length) params.set("availability", filters.availability.join(","));
    return params;
};

const StudentTutors = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    // Seed all filters from the URL — e.g. StudentOverview's category buttons
    // navigate with ?subject=Programming, but any filter can be passed in.
    const [selectedFilters, setSelectedFilters] = useState<SelectedFilters>(() =>
        parseFiltersFromParams(searchParams)
    );

    // URL -> state: picks up params set by another page (or a bookmarked /
    // shared link) without needing the component to remount.
    useEffect(() => {
        const next = parseFiltersFromParams(searchParams);
        setSelectedFilters((prev) =>
            JSON.stringify(prev) === JSON.stringify(next) ? prev : next
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams]);

    // state -> URL: keeps the address bar in sync as the user adjusts filters
    // in the panel, so this page stays shareable/bookmarkable.
    useEffect(() => {
        const next = filtersToParams(selectedFilters);
        if (next.toString() !== searchParams.toString()) {
            setSearchParams(next, { replace: true });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedFilters]);

    const [expandedFilters, setExpandedFilters] = useState({
        subject: true,
        location: true,
        price: true,
        sessionType: true,
        rating: true,
        availability: true,
    });
    const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

    const { tutors, isLoading: isTutorLoading } = useGetTutors();
    const tutorsList = tutors?.data?.results ?? [];

    const filteredTutors = useMemo(() => {
        const subjectQuery = selectedFilters.subject.trim().toLowerCase();
        const locationQuery = selectedFilters.location.trim().toLowerCase();
        const minPrice = Number(selectedFilters.priceMin) || 0;
        const maxPrice = Number(selectedFilters.priceMax) || Infinity;
        const sessionType = selectedFilters.sessionType.toLowerCase();
        const minRating = Number(selectedFilters.minRating) || 0;
        const chosenAvailability = selectedFilters.availability;

        return tutorsList.filter((tutor: TutorData) => {
            const displayName = (tutor.full_name || tutor.name || "").toLowerCase();
            const title = (tutor.professional_title || tutor.title || "").toLowerCase();
            const subjectText = [...(tutor.subjects || []), ...(tutor.skills || [])].join(" ").toLowerCase();
            const locationText = `${tutor.location || ""} ${tutor.language || ""}`.toLowerCase();
            const rate = Number(tutor.hourly_rate || tutor.price || 0);
            const rating = Number(tutor.average_rating || tutor.rating || 0);
            const sessionState = (tutor.session_status || tutor.sessionType || "both").toLowerCase();
            const availability = tutor.availability || [];

            const matchesSubject = !subjectQuery || displayName.includes(subjectQuery) || title.includes(subjectQuery) || subjectText.includes(subjectQuery);
            const matchesLocation = !locationQuery || locationText.includes(locationQuery);
            const matchesPrice = Number.isFinite(rate) && rate >= minPrice && rate <= maxPrice;
            const matchesRating = rating >= minRating;
            const matchesSessionType =
                sessionType === "all" ||
                (sessionType === "online" && (sessionState === "online" || sessionState === "both")) ||
                (sessionType === "onsite" && (sessionState === "onsite" || sessionState === "both"));
            const matchesAvailability =
                chosenAvailability.length === 0 ||
                chosenAvailability.some((day) => availability.some((value) => value.toLowerCase() === day.toLowerCase()));

            return matchesSubject && matchesLocation && matchesPrice && matchesRating && matchesSessionType && matchesAvailability;
        });
    }, [selectedFilters, tutorsList]);

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
                ? prev.availability.filter((item) => item !== day)
                : [...prev.availability, day],
        }));
    };

    const resetFilters = () => setSelectedFilters(DEFAULT_FILTERS);

    const activeFilterCount = [
        selectedFilters.subject,
        selectedFilters.location,
        selectedFilters.sessionType !== "all" ? selectedFilters.sessionType : "",
        selectedFilters.minRating > 0 ? "rating" : "",
        selectedFilters.availability.length > 0 ? "avail" : "",
    ].filter(Boolean).length;

    const StarRating = ({ rating, sessions }: { rating: number; sessions: number }) => (
        <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
                {[...Array(5)].map((_, index) => (
                    <FaStar
                        key={index}
                        size={10}
                        className={index < Math.round(rating) ? "text-yellow-400" : "text-gray-300"}
                    />
                ))}
            </div>
            <span className="font-bold text-sm text-gray-900">{rating.toFixed(1)}</span>
            <span className="text-xs text-gray-600">({sessions} session{sessions === 1 ? "" : "s"})</span>
        </div>
    );

    const TutorCard = ({ tutor }: { tutor: TutorData }) => {
        const displayName = tutor.full_name || tutor.name || "Tutor";
        const title = tutor.professional_title || tutor.title || "Mentor";
        const initials = displayName
            .split(" ")
            .map((part) => part[0])
            .join("")
            .slice(0, 2)
            .toUpperCase() || "T";
        const rating = Number(tutor.average_rating || tutor.rating || 0);
        const sessions = Number(tutor.total_sessions || tutor.reviews || 0);
        const tags = Array.isArray(tutor.subjects) && tutor.subjects.length > 0
            ? tutor.subjects
            : (Array.isArray(tutor.skills) ? tutor.skills : []);
        const rate = Number(tutor.hourly_rate || tutor.price || 0);
        const sessionStatus = tutor.session_status || tutor.sessionType || "both";

        return (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden transition-all">
                {tutor.banner ? (
                    <img src={tutor.banner} alt={`${displayName} banner`} className="h-20 w-full object-cover" />
                ) : (
                    <TutorsBanner seed={tutor.id} className="h-26 w-full" />
                )}

                <div className="p-6 pt-0 flex flex-col h-full">
                    <div className="flex items-start justify-between gap-4 mb-2 relative -mt-8">
                        <div className="w-16 h-16 rounded-lg bg-green-950 ring-4 ring-gray-100 flex items-center justify-center text-white font-bold text-lg shrink-0 overflow-hidden">
                            {tutor.profile_image || tutor.image_url || tutor.image ? (
                                <img
                                    src={tutor.profile_image || tutor.image_url || tutor.image || ""}
                                    alt={displayName}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                initials
                            )}
                        </div>
                        <button className="p-3 text-green-800 bg-white rounded-full mt-2 shadow-sm">
                            <FiBookmark size={25} />
                        </button>
                    </div>

                    <div className="mb-4">
                        <div className="flex items-center gap-1.5">
                            <h4 className="text-lg font-bold text-gray-900 truncate">{displayName}</h4>
                            {tutor.is_verified && <FiCheckCircle size={14} className="text-green-600 shrink-0" />}
                        </div>
                        <p className="text-xs text-gray-600 line-clamp-2 leading-tight">{title}</p>
                    </div>

                    {tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-2">
                            {tags.slice(0, 3).map((tag: string, idx: number) => (
                                <span key={idx} className="px-2 py-1 bg-gray-200 text-gray-700 font-semibold rounded-full text-[10px]">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}

                    <div className="mb-2">
                        <StarRating rating={rating} sessions={sessions} />
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-gray-300 mb-2">
                        <div className="flex items-center gap-2 flex-wrap">
                            {(sessionStatus === "online" || sessionStatus === "both") && (
                                <span className="px-2 py-1 bg-green-50 text-green-700 rounded text-xs font-semibold">
                                    Online
                                </span>
                            )}
                            {(sessionStatus === "onsite" || sessionStatus === "both") && (
                                <span className="px-2 py-1 bg-orange-50 text-orange-700 rounded text-xs font-semibold">
                                    Onsite
                                </span>
                            )}
                        </div>
                        <div className="text-right">
                            <span className="text-lg font-bold text-gray-900">${Number.isFinite(rate) ? rate.toFixed(0) : "0"}</span>
                            <span className="text-xs text-gray-600">/hr</span>
                        </div>
                    </div>

                    {(tutor.location || tutor.language) && (
                        <div className="flex flex-wrap gap-3 text-[11px] text-gray-500 mb-3">
                            {tutor.location && <span>📍 {tutor.location}</span>}
                            {tutor.language && <span>💬 {tutor.language}</span>}
                        </div>
                    )}

                    <Link to={`/student/dashboard/tutor/${tutor.id}`}>
                        <button className="w-full px-4 py-3 border-2 text-xs border-green-700 text-green-700 bg-white rounded-full font-semibold transition-all hover:bg-green-50">
                            View Profile
                        </button>
                    </Link>
                </div>
            </div>
        );
    };

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
        children: ReactNode;
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
                        onChange={(event) => setSelectedFilters((prev) => ({ ...prev, subject: event.target.value }))}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 text-xs focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100"
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
                        onChange={(event) => setSelectedFilters((prev) => ({ ...prev, location: event.target.value }))}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 text-xs focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100"
                    />
                </div>
            </FilterSection>

            <FilterSection title="Price Range" name="price">
                <div className="grid grid-cols-2 gap-3">
                    <input
                        type="number"
                        placeholder="Min"
                        value={selectedFilters.priceMin}
                        onChange={(event) => setSelectedFilters((prev) => ({ ...prev, priceMin: Number(event.target.value) }))}
                        className="px-3 py-2 rounded border border-gray-200 text-xs focus:outline-none focus:border-green-400"
                    />
                    <input
                        type="number"
                        placeholder="Max"
                        value={selectedFilters.priceMax}
                        onChange={(event) => setSelectedFilters((prev) => ({ ...prev, priceMax: Number(event.target.value) }))}
                        className="px-3 py-2 rounded border border-gray-200 text-xs focus:outline-none focus:border-green-400"
                    />
                </div>
            </FilterSection>

            <FilterSection title="Session Type" name="sessionType">
                <div className="flex gap-2">
                    {["All", "Online", "Onsite"].map((type) => (
                        <button
                            key={type}
                            onClick={() => setSelectedFilters((prev) => ({ ...prev, sessionType: type.toLowerCase() }))}
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

            <FilterSection title="Minimum Rating" name="rating">
                <div className="flex gap-2">
                    {[0, 3, 4, 4.5].map((value) => (
                        <button
                            key={value}
                            onClick={() => setSelectedFilters((prev) => ({ ...prev, minRating: value }))}
                            className={`px-2 py-2 rounded text-xs font-semibold transition-all flex-1 ${selectedFilters.minRating === value
                                ? "bg-green-100 text-green-700 border border-green-300"
                                : "bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100"
                                }`}
                        >
                            {value === 0 ? "Any" : `${value}+`}
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
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-1">
                                Find a Tutor
                            </h1>
                            <p className="text-gray-600 text-sm">
                                {filteredTutors.length > 0
                                    ? `${filteredTutors.length} tutor${filteredTutors.length === 1 ? "" : "s"} available now`
                                    : "Browse available tutors"}
                            </p>
                        </div>

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
                        <div className="hidden md:block md:col-span-1 bg-white rounded-2xl border border-gray-200 p-6 h-fit sticky top-8">
                            <FilterPanelContent />
                        </div>

                        <div className="md:col-span-3">
                            {!isTutorLoading && filteredTutors.length === 0 ? (
                                <EmptyTutorsState />
                            ) : (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-8">
                                        {filteredTutors.map((tutor: TutorData) => (
                                            <TutorCard key={tutor.id} tutor={tutor} />
                                        ))}
                                    </div>

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

            <div
                onClick={() => setMobileFilterOpen(false)}
                className={`md:hidden fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ${mobileFilterOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
            />

            <div className={`md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl shadow-2xl transition-transform duration-300 ease-out ${mobileFilterOpen ? "translate-y-0" : "translate-y-full"}`} style={{ maxHeight: "88vh" }}>
                <div className="flex justify-center pt-3 pb-1">
                    <div className="w-10 h-1 bg-gray-300 rounded-full" />
                </div>

                <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-gray-900">Filters</h3>
                        {activeFilterCount > 0 && (
                            <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                                {activeFilterCount} active
                            </span>
                        )}
                    </div>
                    <button onClick={() => setMobileFilterOpen(false)} className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500">
                        <FiX size={20} />
                    </button>
                </div>

                <div className="overflow-y-auto px-5" style={{ maxHeight: "calc(88vh - 120px)" }}>
                    <FilterPanelContent />
                    <div className="h-4" />
                </div>

                <div className="px-5 py-4 border-t border-gray-100 flex gap-3 bg-white">
                    <button onClick={resetFilters} className="flex-1 py-3 rounded-full border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all">
                        Clear All
                    </button>
                    <button onClick={() => setMobileFilterOpen(false)} className="flex-2 py-3 rounded-full bg-green-700 text-white text-sm font-semibold hover:bg-green-800 transition-all">
                        Show Results
                    </button>
                </div>
            </div>

            <button
                onClick={() => setMobileFilterOpen(true)}
                className={`md:hidden fixed bottom-28 right-4 p-5 bg-green-700 border-4 border-white text-white rounded-full shadow-lg transition-all ${mobileFilterOpen ? "opacity-0 pointer-events-none scale-90" : "opacity-100 scale-100"}`}
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