import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { createClient } from "@/lib/supabase/server";
import { ALERT_FROM, escapeHtml } from "@/lib/alerts";
import { PHONE_DISPLAY, whatsappLink } from "@/lib/contact";
import { isUuid, propertyUrl } from "@/lib/urls";
import type { ViewingStatus } from "@/lib/viewing-slots";

const STATUSES: ViewingStatus[] = ["pending", "confirmed", "cancelled", "completed"];

function formatViewingDate(date: string): string {
  return new Date(`${date}T12:00:00`).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function viewerEmail(
  status: "confirmed" | "cancelled",
  v: { name: string; date: string; time: string; propertyTitle: string; propertyLink: string | null }
): { subject: string; html: string } {
  const when = `${formatViewingDate(v.date)} at ${v.time}`;
  const property = escapeHtml(v.propertyTitle);
  const first = escapeHtml(v.name.split(" ")[0]);
  const propertyHtml = v.propertyLink
    ? `<a href="${v.propertyLink}" style="color: #1a3c34; font-weight: bold;">${property}</a>`
    : `<strong>${property}</strong>`;

  const body =
    status === "confirmed"
      ? `<h1 style="font-size: 24px; margin: 0 0 12px;">Your viewing is confirmed.</h1>
         <p style="font-size: 15px; line-height: 1.6; color: #4a4a46;">Hi ${first}, we're looking forward to showing you ${propertyHtml}.</p>
         <div style="margin: 20px 0; padding: 16px 20px; background: #f6f5f1; border-radius: 12px;">
           <p style="margin: 0; font-size: 13px; color: #6b6b66;">When</p>
           <p style="margin: 4px 0 0; font-size: 17px; font-weight: bold;">${when}</p>
         </div>
         <p style="font-size: 15px; line-height: 1.6; color: #4a4a46;">We'll send directions on WhatsApp before the day. Need to reschedule? Just reply to this email or message us.</p>`
      : `<h1 style="font-size: 24px; margin: 0 0 12px;">Your viewing has been cancelled.</h1>
         <p style="font-size: 15px; line-height: 1.6; color: #4a4a46;">Hi ${first}, unfortunately we can't make your viewing of ${propertyHtml} on <strong>${when}</strong>. Sorry for the inconvenience.</p>
         <p style="font-size: 15px; line-height: 1.6; color: #4a4a46;">You can pick a new time on the property page, or reply to this email and we'll find one that works.</p>`;

  return {
    subject:
      status === "confirmed"
        ? `Viewing confirmed: ${v.propertyTitle} — ${when}`
        : `Viewing cancelled: ${v.propertyTitle}`,
    html: `
    <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; color: #141414;">
      <p style="margin: 0 0 20px; font-weight: bold; color: #1a3c34; font-size: 18px;">MG Reliance Property Developers</p>
      ${body}
      <p style="margin-top: 8px;"><a href="${whatsappLink()}" style="display: inline-block; background: #1a3c34; color: #fff; text-decoration: none; padding: 12px 22px; border-radius: 999px; font-weight: bold; font-size: 14px;">WhatsApp us</a></p>
      <p style="margin-top: 32px; font-size: 12px; color: #9a9a94;">Call or WhatsApp ${PHONE_DISPLAY} · info@mgrelianceproperties.com</p>
    </div>`,
  };
}

/** Admin changes a booking's status; the visitor is emailed when it's confirmed or cancelled. */
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  if (!isUuid(params.id)) return NextResponse.json({ error: "Booking not found." }, { status: 404 });

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const { status } = await request.json().catch(() => ({}));
  if (!STATUSES.includes(status)) return NextResponse.json({ error: "Invalid status." }, { status: 400 });

  const { data: row, error } = await supabase
    .from("contact_submissions")
    .update({ viewing_status: status, read: true })
    .eq("id", params.id)
    .eq("kind", "viewing")
    .select("*")
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message, code: error.code }, { status: 400 });
  }
  if (!row) return NextResponse.json({ error: "Booking not found." }, { status: 404 });

  let emailed = false;
  let emailError: string | null = null;
  if ((status === "confirmed" || status === "cancelled") && row.email) {
    let propertyTitle = "the property";
    let propertyLink: string | null = null;
    if (row.property_id) {
      const { data: property } = await supabase.from("properties").select("*").eq("id", row.property_id).maybeSingle();
      if (property) {
        propertyTitle = property.title;
        propertyLink = propertyUrl(property);
      }
    }
    try {
      const { subject, html } = viewerEmail(status, {
        name: row.full_name,
        date: row.viewing_date,
        time: row.viewing_time,
        propertyTitle,
        propertyLink,
      });
      const resend = new Resend(process.env.RESEND_API_KEY);
      const { error: sendError } = await resend.emails.send({
        from: ALERT_FROM,
        to: [row.email],
        replyTo: "info@mgrelianceproperties.com",
        subject,
        html,
      });
      if (sendError) emailError = sendError.message;
      else emailed = true;
    } catch (e) {
      emailError = e instanceof Error ? e.message : "Email failed";
    }
    if (emailError) console.error("Viewing status email error:", emailError);
  }

  return NextResponse.json({ success: true, emailed, emailError });
}
