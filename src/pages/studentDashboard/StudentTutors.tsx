import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import {
    FiCheckCircle,
    FiChevronDown,
    FiFilter,
    FiMapPin,
    FiSearch,
    FiX
} from "react-icons/fi";
import { Link, useSearchParams } from "react-router-dom";
import LoadingOverlay from "../../components/LoadingOverlay";
import TutorsBanner from "../../components/TutorsBanner";
import { useGetTutors } from "../../hooks/queries/allQueries";

type SelectedFilters = {
    search: string;
    subject: string;
    location: string;
    language: string;
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
    search: "",
    subject: "",
    location: "",
    language: "",
    priceMin: 0,
    priceMax: 0,
    sessionType: "all",
    minRating: 0,
    availability: [],
};

const LANGUAGES = ["English", "Spanish", "French", "Mandarin Chinese", "Arabic"];

const parseFiltersFromParams = (params: URLSearchParams): SelectedFilters => ({
    search: params.get("search") || "",
    subject: params.get("subject") || "",
    location: params.get("location") || "",
    language: params.get("language") || "",
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
    if (filters.search) params.set("search", filters.search);
    if (filters.subject) params.set("subject", filters.subject);
    if (filters.location) params.set("location", filters.location);
    if (filters.language) params.set("language", filters.language);
    if (filters.priceMin) params.set("priceMin", String(filters.priceMin));
    if (filters.priceMax) params.set("priceMax", String(filters.priceMax));
    if (filters.sessionType !== "all") params.set("sessionType", filters.sessionType);
    if (filters.minRating) params.set("minRating", String(filters.minRating));
    if (filters.availability.length) params.set("availability", filters.availability.join(","));
    return params;
};

const StudentTutors = () => {
    const [searchParams, setSearchParams] = useSearchParams();

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
        language: true,
        price: true,
        sessionType: true,
        rating: true,
        availability: true,
    });
    const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

    const { tutors, isLoading: isTutorLoading } = useGetTutors();
    const tutorsList = tutors?.data?.results ?? [];

    const filteredTutors = useMemo(() => {
        const searchQuery = selectedFilters.search.trim().toLowerCase();
        const subjectQuery = selectedFilters.subject.trim().toLowerCase();
        const locationQuery = selectedFilters.location.trim().toLowerCase();
        const languageQuery = selectedFilters.language.trim().toLowerCase();
        const minPrice = Number(selectedFilters.priceMin) || 0;
        const maxPrice = Number(selectedFilters.priceMax) || Infinity;
        const sessionType = selectedFilters.sessionType.toLowerCase();
        const minRating = Number(selectedFilters.minRating) || 0;
        const chosenAvailability = selectedFilters.availability;

        return tutorsList.filter((tutor: TutorData) => {
            const displayName = (tutor.full_name || tutor.name || "").toLowerCase();
            const title = (tutor.professional_title || tutor.title || "").toLowerCase();
            const bio = (tutor.bio || "").toLowerCase();
            const subjectText = [...(tutor.subjects || []), ...(tutor.skills || [])].join(" ").toLowerCase();
            const locationText = `${tutor.location || ""} ${tutor.language || ""}`.toLowerCase();
            const tutorLanguage = (tutor.language || "").toLowerCase();
            const rate = Number(tutor.hourly_rate || tutor.price || 0);
            const rating = Number(tutor.average_rating || tutor.rating || 0);
            const sessionState = (tutor.session_status || tutor.sessionType || "both").toLowerCase();
            const availability = tutor.availability || [];

            // Free-text search spans name, title, subjects/skills, and bio —
            // separate from the sidebar's "Subject" field, which is narrower.
            const matchesSearch =
                !searchQuery ||
                displayName.includes(searchQuery) ||
                title.includes(searchQuery) ||
                subjectText.includes(searchQuery) ||
                bio.includes(searchQuery);

            const matchesSubject = !subjectQuery || displayName.includes(subjectQuery) || title.includes(subjectQuery) || subjectText.includes(subjectQuery);
            const matchesLocation = !locationQuery || locationText.includes(locationQuery);
            const matchesLanguage = !languageQuery || tutorLanguage === languageQuery;
            const matchesPrice = Number.isFinite(rate) && rate >= minPrice && rate <= maxPrice;
            const matchesRating = rating >= minRating;
            const matchesSessionType =
                sessionType === "all" ||
                (sessionType === "online" && (sessionState === "online" || sessionState === "both")) ||
                (sessionType === "onsite" && (sessionState === "onsite" || sessionState === "both"));
            const matchesAvailability =
                chosenAvailability.length === 0 ||
                chosenAvailability.some((day) => availability.some((value) => value.toLowerCase() === day.toLowerCase()));

            return (
                matchesSearch &&
                matchesSubject &&
                matchesLocation &&
                matchesLanguage &&
                matchesPrice &&
                matchesRating &&
                matchesSessionType &&
                matchesAvailability
            );
        });
    }, [selectedFilters, tutorsList]);

    const toggleFilter = (filterName: keyof typeof expandedFilters) => {
        setExpandedFilters((prev) => ({
            ...prev,
            [filterName]: !prev[filterName],
        }));
    };

    const resetFilters = () => setSelectedFilters(DEFAULT_FILTERS);

    const activeFilterCount = [
        selectedFilters.search,
        selectedFilters.subject,
        selectedFilters.location,
        selectedFilters.language,
        selectedFilters.priceMin > 0 || selectedFilters.priceMax > 0 ? "price" : "",
        selectedFilters.sessionType !== "all" ? selectedFilters.sessionType : "",
        selectedFilters.minRating > 0 ? "rating" : "",
        selectedFilters.availability.length > 0 ? "avail" : "",
    ].filter(Boolean).length;

    const TutorCard = ({ tutor }: { tutor: TutorData }) => {
        const initials =
            tutor.full_name
                ?.split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)
                .toUpperCase() || "?";

        const tags = tutor.subjects?.length ? tutor.subjects : tutor.skills || [];
        const rate = Number(tutor.hourly_rate) || 0;

        return (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden transition-all">
                {/* Banner — use the tutor's real uploaded banner if present */}
                {tutor.banner ? (
                    <img
                        src={tutor.banner}
                        alt={`${tutor.full_name} banner`}
                        className="h-16 lg:h-24 w-full object-cover"
                    />
                ) : (
                    <TutorsBanner seed={tutor.id} className="h-16 lg:h-24 w-full" />
                )}

                <div className="lg:p-6 p-3 pt-0 flex flex-col h-full">
                    <div className="flex items-start justify-between gap-4 mb-2 relative -mt-8">
                        <div className="lg:w-14 w-11 lg:h-14 h-11 rounded-lg bg-green-950 ring-2 left-0 ring-gray-100 flex items-center justify-center text-white font-bold text-base shrink-0 overflow-hidden">
                            {tutor.profile_image ? (
                                <img
                                    src={tutor.profile_image}
                                    alt={tutor.full_name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                initials
                            )}
                        </div>
                    </div>

                    {/* Name and Title */}
                    <div className="mb-2">
                        <div className="flex items-center gap-1.5">
                            <h4 className="text-sm font-bold text-gray-900 truncate">{tutor.full_name}</h4>
                            {tutor.is_verified && (
                                <FiCheckCircle size={14} className="text-green-600 shrink-0" />
                            )}
                        </div>
                        <p className="text-[11px] text-gray-600 line-clamp-2 leading-tight">
                            {tutor.professional_title || "Mentor"}
                        </p>
                    </div>

                    {/* Tags (subjects, or skills as fallback) */}
                    {tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-2">
                            {tags.slice(0, 3).map((tag, idx) => (
                                <span
                                    key={idx}
                                    className="px-2 py-1 bg-gray-200 text-gray-700 font-semibold rounded-full text-[10px]"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Session Type and Price */}
                    <div className="flex items-center justify-between pt-1 border-t border-gray-300 mb-2">
                        <div className="flex items-center gap-2 flex-wrap">
                            {(tutor.session_status === "online" || tutor.session_status === "both") && (
                                <span className="px-2 py-1 bg-green-50 text-green-700 rounded text-[10px] font-semibold">
                                    Online
                                </span>
                            )}
                            {(tutor.session_status === "onsite" || tutor.session_status === "both") && (
                                <span className="px-2 py-1 bg-orange-50 text-orange-700 rounded text-[11px] font-semibold">
                                    Onsite
                                </span>
                            )}
                        </div>
                        <div className="text-right">
                            <span className="text-sm font-bold text-gray-900">${rate.toFixed(0)}</span>
                            <span className="text-xs text-gray-600">/hr</span>
                        </div>
                    </div>

                    {/* Action Button */}
                    <Link to={`/student/dashboard/tutor/${tutor.id}`}>
                        <button className="w-full px-4 py-2 border-2 border-green-700 text-green-700 bg-white rounded-full font-semibold transition-all text-xs hover:bg-green-50">
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
                    ? "No tutors match your current search or filters. Try adjusting or clearing them to see more results."
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

            <FilterSection title="Language" name="language">
                <select
                    value={selectedFilters.language}
                    onChange={(event) => setSelectedFilters((prev) => ({ ...prev, language: event.target.value }))}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 bg-white"
                >
                    <option value="">Any language</option>
                    {LANGUAGES.map((lang) => (
                        <option key={lang} value={lang}>{lang}</option>
                    ))}
                </select>
            </FilterSection>

            <FilterSection title="Price Range" name="price">
                <div className="grid grid-cols-2 gap-3">
                    <input
                        type="number"
                        placeholder="Min"
                        value={selectedFilters.priceMin || ""}
                        onChange={(event) => setSelectedFilters((prev) => ({ ...prev, priceMin: Number(event.target.value) }))}
                        className="px-3 py-2 rounded border border-gray-200 text-xs focus:outline-none focus:border-green-400"
                    />
                    <input
                        type="number"
                        placeholder="Max"
                        value={selectedFilters.priceMax || ""}
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

        </>
    );

    return (
        <div className="md:pl-56 pb-20 md:pb-8">
            <LoadingOverlay visible={isTutorLoading} />
            <div className="min-h-screen pt-8 bg-gray-50">
                <div className="px-4 sm:px-6 lg:px-8 max-w-7xl m-auto py-8">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                        <div>
                            <h1 className="text-xl sm:text-xl font-extrabold text-gray-900 mb-1">
                                Find a Tutor
                            </h1>
                            <p className="text-gray-600 text-xs">
                                {filteredTutors.length > 0
                                    ? `${filteredTutors.length} tutor${filteredTutors.length === 1 ? "" : "s"} available now`
                                    : "Browse available tutors"}
                            </p>
                        </div>

                        <button
                            onClick={() => setMobileFilterOpen(true)}
                            className="md:hidden relative flex items-center justify-center gap-2 px-4 py-2 bg-white rounded-full border border-gray-300 hover:bg-gray-50 transition-all text-xs font-semibold text-gray-700 w-fit"
                        >
                            <FiFilter size={12} />
                            Filters
                            {activeFilterCount > 0 && (
                                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-green-700 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                    {activeFilterCount}
                                </span>
                            )}
                        </button>
                    </div>

                    {/* Top search bar — broad free-text search across name, title, subjects, bio */}
                    <div className="relative mb-6 sm:mb-8">
                        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search tutors by name, subject, or keyword…"
                            value={selectedFilters.search}
                            onChange={(event) => setSelectedFilters((prev) => ({ ...prev, search: event.target.value }))}
                            className="w-full pl-11 pr-11 py-3 rounded-full border border-gray-200 bg-white text-sm focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 shadow-sm"
                        />
                        {selectedFilters.search && (
                            <button
                                onClick={() => setSelectedFilters((prev) => ({ ...prev, search: "" }))}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <FiX size={16} />
                            </button>
                        )}
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
                                    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 gap-2 lg:gap-4 mb-8">
                                        {filteredTutors.map((tutor: TutorData) => (
                                            <TutorCard key={tutor.id} tutor={tutor} />
                                        ))}
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
                className={`md:hidden fixed bottom-28 right-4 p-4 bg-green-900 border-4 border-white text-white rounded-full shadow-lg transition-all ${mobileFilterOpen ? "opacity-0 pointer-events-none scale-90" : "opacity-100 scale-100"}`}
            >
                <FiFilter size={20} />
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