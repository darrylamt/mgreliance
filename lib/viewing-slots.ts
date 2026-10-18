import { slotsForDate } from "@/lib/contact";

/** Client-safe viewing types + helpers (no database access). */

export type ViewingStatus = "pending" | "confirmed" | "cancelled" | "completed";

/** Statuses that hold a slot. Cancelled / completed bookings free it. */
export const ACTIVE_VIEWING_STATUSES: ViewingStatus[] = ["pending", "confirmed"];

export interface Availability {
  /** date → times already booked for this property */
  taken: Record<string, string[]>;
  /** dates blocked entirely by the office */
  blockedDays: string[];
  /** date → individual times blocked by the office */
  blockedSlots: Record<string, string[]>;
}

export const EMPTY_AVAILABILITY: Availability = { taken: {}, blockedDays: [], blockedSlots: {} };

/** Is this slot bookable for the visitor? */
export function isSlotOpen(av: Availability, date: string, time: string): boolean {
  if (av.blockedDays.includes(date)) return false;
  if (av.blockedSlots[date]?.includes(time)) return false;
  if (av.taken[date]?.includes(time)) return false;
  return slotsForDate(date).includes(time);
}

/** Does the day have at least one open slot? */
export function dayHasOpenSlot(av: Availability, date: string): boolean {
  return slotsForDate(date).some((t) => isSlotOpen(av, date, t));
}
