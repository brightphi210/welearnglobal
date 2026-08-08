export interface Booking {
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
  sessionLink?: string;
  image?: string | null;
  // Raw values kept around for anything that needs to do real date math
  // (the formatted strings above are display-only and shouldn't be re-parsed).
  rawDate: string;
  rawStartTime: string;
  rawEndTime: string;
}

export const normalizeStatus = (status?: string): Booking["status"] => {
  const normalized = (status || "").toLowerCase();

  if (["accepted", "confirmed", "approved", "scheduled", "upcoming"].includes(normalized)) return "Confirmed";
  if (["pending", "requested"].includes(normalized)) return "Pending";
  if (["cancelled", "canceled", "declined"].includes(normalized)) return "Cancelled";

  return "Pending";
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

export const formatSessionType = (value?: string): string => {
  if (!value) return "Online";
  const normalized = value.toLowerCase();
  if (normalized === "online") return "Online";
  if (normalized === "onsite") return "On-site";
  if (normalized === "both") return "Online / On-site";
  return value;
};

export const getInitials = (name: string) => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "T";
  if (parts.length === 1) return parts[0][0]?.toUpperCase() || "T";
  return `${parts[0][0] || ""}${parts[parts.length - 1][0] || ""}`.toUpperCase();
};

/** Normalizes one raw booking object from the API into the shared Booking shape. */
export const mapBookingResponse = (booking: any): Booking => {
  const tutorName =
    booking.tutor?.full_name ||
    booking.tutor?.name ||
    booking.tutor_profile?.full_name ||
    booking.tutor_profile?.name ||
    "Tutor";

  const subject = booking.subject || booking.title || "No subject provided";
  const rawDate = booking.scheduled_date || booking.created_at || "";
  const rawStartTime = booking.start_time || "";
  const rawEndTime = booking.end_time || "";

  const date = formatDisplayDate(rawDate);
  const time =
    rawStartTime && rawEndTime
      ? `${formatDisplayTime(rawStartTime)} - ${formatDisplayTime(rawEndTime)}`
      : booking.scheduled_time || "Time TBD";

  return {
    id: booking.id,
    tutorName,
    tutorAvatar: getInitials(tutorName),
    subject,
    date,
    time,
    duration: rawStartTime && rawEndTime ? time : "Time TBD",
    sessionType: formatSessionType(booking.session_type) as Booking["sessionType"],
    status: normalizeStatus(booking.status),
    notes: booking.notes || booking.tutor_response_note || "No notes provided yet.",
    sessionLink: booking.session_link || booking.sessionLink || "",
    image: booking.tutor?.profile_image || booking.tutor_profile?.profile_image || null,
    rawDate,
    rawStartTime,
    rawEndTime,
  };
};

/** Handles the two response shapes the bookings endpoint has returned (array vs. { results }). */
export const extractBookingList = (bookingsResponse: any): any[] => {
  if (!bookingsResponse) return [];
  if (Array.isArray(bookingsResponse.data)) return bookingsResponse.data;
  return bookingsResponse.data?.results ?? [];
};