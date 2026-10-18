import { NextRequest, NextResponse } from "next/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { createClient } from "@/lib/supabase/server";
import { ALERT_FROM, alertMatches, newListingEmail, type ListingAlert } from "@/lib/alerts";
import { isUuid } from "@/lib/urls";
import type { Property } from "@/lib/types";

/**
 * Called by the admin dashboard after new properties are created.
 * Emails every active alert that matches. Admin-only.
 */
export async function POST(request: NextRequest) {
  const auth = await createClient();
  const {
    data: { user },
  } = await auth.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  const ids: string[] = (Array.isArray(body.property_ids) ? body.property_ids : [body.property_id])
    .filter(isUuid)
    .slice(0, 50);
  if (ids.length === 0) return NextResponse.json({ error: "No properties given." }, { status: 400 });

  const supabase = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const [{ data: properties }, { data: alerts, error: alertsError }] = await Promise.all([
    supabase.from("properties").select("*").in("id", ids),
    supabase.from("listing_alerts").select("*").eq("active", true),
  ]);
  if (alertsError) {
    // Table missing (migration not run) — nothing to send.
    return NextResponse.json({ sent: 0, skipped: "alerts unavailable" });
  }

  const newListings = (properties ?? []) as Property[];
  const activeAlerts = (alerts ?? []) as ListingAlert[];

  const emails = newListings
    .filter((p) => p.status !== "sold")
    .flatMap((p) =>
      activeAlerts
        .filter((a) => alertMatches(a, p))
        .map((a) => ({ from: ALERT_FROM, to: [a.email], ...newListingEmail(a, p) }))
    );

  if (emails.length === 0) return NextResponse.json({ sent: 0 });

  // Resend's batch endpoint takes up to 100 emails per call.
  let sent = 0;
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    for (let i = 0; i < emails.length; i += 100) {
      const chunk = emails.slice(i, i + 100);
      const { error } = await resend.batch.send(chunk);
      if (error) console.error("Alert batch error:", error);
      else sent += chunk.length;
    }
  } catch (error) {
    console.error("Alert notify error:", error);
  }

  return NextResponse.json({ sent });
}
