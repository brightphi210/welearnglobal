// Shared formatting helpers for tutor bookings.
// Extracted so any page (TutorBookings, TutorOverview, etc.) that needs to
// render booking status/date/time uses exactly the same logic.

export const normalizeStatus = (status?: string) => {
    const normalized = (status || "").toLowerCase();

    if (["pending", "requested"].includes(normalized)) return "pending";
    if (["accepted", "confirmed", "approved", "scheduled", "upcoming"].includes(normalized)) return "upcoming";
    if (["completed", "done"].includes(normalized)) return "completed";
    if (["cancelled", "canceled", "declined"].includes(normalized)) return "cancelled";

    return "pending";
};

export const formatDisplayDate = (value?: string) => {
    if (!value) return "Date TBD";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;

    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

export const formatDisplayTime = (value?: string) => {
    if (!value) return "Time TBD";

    const [hours = "0", minutes = "0"] = value.split(":");
    const hourNumber = Number(hours);
    if (Number.isNaN(hourNumber)) return value;

    const period = hourNumber >= 12 ? "PM" : "AM";
    const normalizedHour = hourNumber % 12 || 12;
    return `${normalizedHour}:${minutes.padStart(2, "0")} ${period}`;
};

export const formatSessionType = (value?: string) => {
    if (!value) return "Session";
    const normalized = value.toLowerCase();
    if (normalized === "online") return "Online";
    if (normalized === "onsite") return "On-site";
    if (normalized === "both") return "Online / On-site";
    return value;
};

export const getInitials = (name?: string) => {
    const parts = (name || "").trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return "U";
    if (parts.length === 1) return parts[0][0]?.toUpperCase() || "U";
    return `${parts[0][0] || ""}${parts[parts.length - 1][0] || ""}`.toUpperCase();
};