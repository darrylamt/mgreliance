export const PHONE_DISPLAY = "+233 24 427 4630";
export const PHONE_TEL = "+233244274630";
/** International format, digits only, as wa.me expects. */
export const WHATSAPP_NUMBER = "233244274630";

export function whatsappLink(message?: string): string {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/** Viewing slots, matching office hours (Mon–Fri 08:00–18:00, Sat 09:00–14:00, closed Sunday). */
export const WEEKDAY_SLOTS = ["09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00"];
export const SATURDAY_SLOTS = ["09:00", "10:00", "11:00", "12:00", "13:00"];

/** `date` is YYYY-MM-DD. */
export function slotsForDate(date: string): string[] {
  const day = new Date(`${date}T12:00:00`).getDay();
  if (day === 0) return [];
  return day === 6 ? SATURDAY_SLOTS : WEEKDAY_SLOTS;
}

export function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** The next `count` bookable days, starting tomorrow and skipping Sundays. */
export function upcomingViewingDays(count = 14, from = new Date()): string[] {
  const days: string[] = [];
  const d = new Date(from);
  while (days.length < count) {
    d.setDate(d.getDate() + 1);
    if (d.getDay() !== 0) days.push(toISODate(d));
  }
  return days;
}
