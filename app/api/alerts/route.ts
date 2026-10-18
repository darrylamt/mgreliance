import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { ALERT_FROM, confirmationEmail, type ListingAlert } from "@/lib/alerts";

const TYPES = ["residential", "commercial", "land"];
const STATUSES = ["available", "rented", "sold"];
const MAX_ALERTS_PER_EMAIL = 5;

function getSupabase() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
}

/** Subscribe to new-listing emails for a search. */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase().slice(0, 200) : "";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    const criteria = {
      type: TYPES.includes(body.type) ? body.type : null,
      status: STATUSES.includes(body.status) ? body.status : null,
      location:
        typeof body.location === "string" && body.location.trim()
          ? body.location.trim().slice(0, 80)
          : null,
    };

    const supabase = getSupabase();
    const { data: existing, error: readError } = await supabase
      .from("listing_alerts")
      .select("*")
      .eq("email", email)
      .eq("active", true);

    if (readError) {
      console.error("listing_alerts read error:", readError);
      return NextResponse.json(
        { error: "Alerts aren't available right now. Please try again later." },
        { status: 503 }
      );
    }

    const same = (existing || []).find(
      (a) => a.type === criteria.type && a.status === criteria.status && (a.location || null) === criteria.location
    );
    if (same) {
      return NextResponse.json({ success: true, already: true });
    }
    if ((existing || []).length >= MAX_ALERTS_PER_EMAIL) {
      return NextResponse.json(
        { error: `You already have ${MAX_ALERTS_PER_EMAIL} alerts. Unsubscribe from one to add another.` },
        { status: 400 }
      );
    }

    const { data: alert, error: insertError } = await supabase
      .from("listing_alerts")
      .insert([{ email, ...criteria }])
      .select("*")
      .single();

    if (insertError || !alert) {
      console.error("listing_alerts insert error:", insertError);
      return NextResponse.json({ error: "Couldn't save your alert. Please try again." }, { status: 500 });
    }

    // Confirmation (also lets someone signed up by mistake unsubscribe immediately).
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const { subject, html } = confirmationEmail(alert as ListingAlert);
      await resend.emails.send({ from: ALERT_FROM, to: [email], subject, html });
    } catch (emailError) {
      console.error("Alert confirmation email error:", emailError);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Alerts API error:", error);
    return NextResponse.json({ error: "An unexpected error occurred. Please try again." }, { status: 500 });
  }
}
