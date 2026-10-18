import { createClient } from "@supabase/supabase-js";
import { ACTIVE_VIEWING_STATUSES, type Availability, type ViewingStatus } from "@/lib/viewing-slots";

export * from "@/lib/viewing-slots";

function serviceClient() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
}

function push(map: Record<string, string[]>, date: string, time: string) {
  (map[date] ||= []).push(time);
}

/**
 * Booked + blocked slots between `from` and `to` (YYYY-MM-DD, inclusive) for one property.
 * Server-only (service role). Degrades to "everything free" if the tables aren't migrated yet.
 */
export async function getAvailability(propertyId: string, from: string, to: string): Promise<Availability> {
  const supabase = serviceClient();
  const result: Availability = { taken: {}, blockedDays: [], blockedSlots: {} };

  const [bookings, blocks] = await Promise.all([
    // select("*") so this works before migration 004 adds viewing_status.
    supabase
      .from("contact_submissions")
      .select("*")
      .eq("kind", "viewing")
      .eq("property_id", propertyId)
      .gte("viewing_date", from)
      .lte("viewing_date", to),
    supabase.from("viewing_blocks").select("date, time").gte("date", from).lte("date", to),
  ]);

  for (const b of bookings.data || []) {
    // Without a status column every request holds its slot.
    const status = (b.viewing_status as ViewingStatus | undefined) ?? "pending";
    if (b.viewing_date && b.viewing_time && ACTIVE_VIEWING_STATUSES.includes(status)) {
      push(result.taken, b.viewing_date, b.viewing_time);
    }
  }

  for (const block of blocks.data || []) {
    if (block.time) push(result.blockedSlots, block.date, block.time);
    else result.blockedDays.push(block.date);
  }

  return result;
}
