import { createClient } from "@/lib/supabase/server";
import AdminHeader from "@/components/admin/AdminHeader";
import { toISODate, upcomingViewingDays } from "@/lib/contact";
import type { ContactSubmission } from "@/lib/types";
import ViewingsBoard, { type ViewingBlock, type ViewingRow } from "./ViewingsBoard";

export const dynamic = "force-dynamic";

export default async function ViewingsPage() {
  const supabase = await createClient();
  const today = toISODate(new Date());
  const since = new Date();
  since.setDate(since.getDate() - 60);
  const days = upcomingViewingDays(30);

  const [{ data: rows }, blocksRes] = await Promise.all([
    supabase
      .from("contact_submissions")
      .select("*")
      .eq("kind", "viewing")
      .gte("viewing_date", toISODate(since))
      .order("viewing_date", { ascending: true })
      .order("viewing_time", { ascending: true }),
    supabase
      .from("viewing_blocks")
      .select("*")
      .gte("date", today)
      .lte("date", days[days.length - 1]),
  ]);

  const viewings = (rows || []) as (ContactSubmission & { viewing_status?: string })[];

  const propertyIds = Array.from(new Set(viewings.map((v) => v.property_id).filter(Boolean))) as string[];
  let titles: Record<string, { title: string; slug: string | null }> = {};
  if (propertyIds.length > 0) {
    const { data: props } = await supabase.from("properties").select("*").in("id", propertyIds);
    titles = Object.fromEntries((props || []).map((p) => [p.id, { title: p.title, slug: p.slug ?? null }]));
  }

  const board: ViewingRow[] = viewings.map((v) => ({
    id: v.id,
    name: v.full_name,
    email: v.email,
    phone: v.phone,
    notes: v.message,
    date: v.viewing_date!,
    time: v.viewing_time!,
    status: (v.viewing_status as ViewingRow["status"]) ?? "pending",
    propertyId: v.property_id,
    propertyTitle: v.property_id ? titles[v.property_id]?.title ?? "Deleted property" : "—",
    propertySlug: v.property_id ? titles[v.property_id]?.slug ?? null : null,
    createdAt: v.created_at,
  }));

  const pending = board.filter((v) => v.status === "pending" && v.date >= today).length;
  const upcoming = board.filter((v) => v.status === "confirmed" && v.date >= today).length;

  return (
    <>
      <AdminHeader
        title="Viewings"
        description={`${pending} awaiting confirmation · ${upcoming} confirmed upcoming`}
      />
      <ViewingsBoard
        viewings={board}
        blocks={(blocksRes.data || []) as ViewingBlock[]}
        blocksAvailable={!blocksRes.error}
        statusAvailable={viewings.length === 0 || "viewing_status" in viewings[0]}
        today={today}
        days={days}
      />
    </>
  );
}
