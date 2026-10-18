import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { slotsForDate, upcomingViewingDays } from "@/lib/contact";
import { isUuid, propertyUrl } from "@/lib/urls";
import { getAvailability, isSlotOpen } from "@/lib/viewings";

const SLOT_TAKEN = "Sorry — that time was just booked. Please pick another slot.";
import type { SubmissionKind } from "@/lib/types";

// Server-side Supabase client using service role key (bypasses RLS for inserts)
function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatViewingDate(date: string): string {
  return new Date(`${date}T12:00:00`).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

const KINDS: SubmissionKind[] = ["contact", "enquiry", "viewing"];

const EMAIL_HEADINGS: Record<SubmissionKind, string> = {
  contact: "New Contact Form Submission",
  enquiry: "New Property Enquiry",
  viewing: "New Viewing Request",
};

function bad(error: string) {
  return NextResponse.json({ error }, { status: 400 });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { full_name, email, phone, subject, message, property_id, viewing_date, viewing_time } = body;
    const kind: SubmissionKind = KINDS.includes(body.kind) ? body.kind : "contact";

    // Server-side validation
    if (!full_name || typeof full_name !== "string" || full_name.trim().length < 2) {
      return bad("Please provide a valid full name.");
    }

    if (!email || typeof email !== "string" || !isValidEmail(email.trim())) {
      return bad("Please provide a valid email address.");
    }

    if (kind !== "contact" && !isUuid(property_id)) {
      return bad("This property could not be found. Please refresh and try again.");
    }

    if (kind === "viewing") {
      if (!phone || String(phone).trim().length < 7) {
        return bad("Please provide a phone number so we can confirm your viewing.");
      }
      if (typeof viewing_date !== "string" || !upcomingViewingDays(30).includes(viewing_date)) {
        return bad("Please choose a valid viewing date.");
      }
      if (typeof viewing_time !== "string" || !slotsForDate(viewing_date).includes(viewing_time)) {
        return bad("Please choose a valid viewing time.");
      }
    } else if (!message || typeof message !== "string" || message.trim().length < 10) {
      return bad("Please provide a message of at least 10 characters.");
    }

    const supabase = getSupabase();

    let propertyTitle: string | null = null;
    let propertyLink: string | null = null;
    if (kind !== "contact") {
      // select("*") so this keeps working whether or not the slug column exists yet.
      const { data: property } = await supabase
        .from("properties")
        .select("*")
        .eq("id", property_id)
        .single();
      if (!property) {
        return bad("This property could not be found. Please refresh and try again.");
      }
      propertyTitle = property.title;
      propertyLink = propertyUrl(property);
    }

    if (kind === "viewing") {
      const availability = await getAvailability(property_id, viewing_date, viewing_date);
      if (!isSlotOpen(availability, viewing_date, viewing_time)) {
        return NextResponse.json({ error: SLOT_TAKEN, slotTaken: true }, { status: 409 });
      }
    }

    const defaultSubject =
      kind === "viewing"
        ? `Viewing request: ${propertyTitle}`
        : kind === "enquiry"
          ? `Enquiry: ${propertyTitle}`
          : null;

    const sanitized = {
      full_name: full_name.trim().slice(0, 200),
      email: email.trim().toLowerCase().slice(0, 200),
      phone: phone ? String(phone).trim().slice(0, 50) : null,
      subject: (subject ? String(subject).trim() : defaultSubject)?.slice(0, 300) || null,
      message:
        typeof message === "string" && message.trim()
          ? message.trim().slice(0, 5000)
          : "Viewing requested — no additional notes.",
      kind,
      property_id: kind === "contact" ? null : property_id,
      viewing_date: kind === "viewing" ? viewing_date : null,
      viewing_time: kind === "viewing" ? viewing_time : null,
    };

    // Save to Supabase
    const { error: dbError } = await supabase
      .from("contact_submissions")
      .insert([sanitized]);

    if (dbError) {
      // Unique slot index: someone else booked this slot a moment ago.
      if (dbError.code === "23505" && kind === "viewing") {
        return NextResponse.json({ error: SLOT_TAKEN, slotTaken: true }, { status: 409 });
      }
      console.error("Supabase insert error:", dbError);
      return NextResponse.json(
        { error: "Failed to save your message. Please try again." },
        { status: 500 }
      );
    }

    // Send email notification via Resend
    try {
      const e = {
        name: escapeHtml(sanitized.full_name),
        email: escapeHtml(sanitized.email),
        phone: sanitized.phone ? escapeHtml(sanitized.phone) : null,
        subject: sanitized.subject ? escapeHtml(sanitized.subject) : null,
        message: escapeHtml(sanitized.message),
        property: propertyTitle ? escapeHtml(propertyTitle) : null,
      };
      const row = (label: string, value: string) => `
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; color: #6b7280; font-size: 13px; width: 130px;">${label}</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; color: #1a1a1a;">${value}</td>
                </tr>`;

      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: "MG Reliance Website <onboarding@resend.dev>",
        to: ["info@mgrelianceproperties.com"],
        replyTo: sanitized.email,
        subject:
          kind === "viewing"
            ? `Viewing Request: ${propertyTitle} — ${formatViewingDate(sanitized.viewing_date!)} at ${sanitized.viewing_time}`
            : `New Enquiry: ${sanitized.subject || "Contact Form Submission"}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background-color: #1a3c34; padding: 20px; border-radius: 12px 12px 0 0;">
              <h1 style="color: #c9a84c; margin: 0; font-size: 22px;">${EMAIL_HEADINGS[kind]}</h1>
              <p style="color: rgba(255,255,255,0.7); margin: 5px 0 0;">MG Reliance Property Developers</p>
            </div>
            <div style="background-color: #ffffff; padding: 24px; border: 1px solid #e5e7eb; border-radius: 0 0 12px 12px;">
              <table style="width: 100%; border-collapse: collapse;">
                ${row("Name", `<strong>${e.name}</strong>`)}
                ${row("Email", `<a href="mailto:${e.email}" style="color: #1a3c34;">${e.email}</a>`)}
                ${e.phone ? row("Phone", e.phone) : ""}
                ${e.property ? row("Property", `<a href="${propertyLink}" style="color: #1a3c34;">${e.property}</a>`) : ""}
                ${kind === "viewing" ? row("Viewing", `<strong>${formatViewingDate(sanitized.viewing_date!)} at ${sanitized.viewing_time}</strong>`) : ""}
                ${e.subject && kind === "contact" ? row("Subject", e.subject) : ""}
              </table>
              <div style="margin-top: 20px;">
                <p style="color: #6b7280; font-size: 13px; margin-bottom: 8px;">Message:</p>
                <div style="background-color: #f9f7f4; padding: 16px; border-radius: 8px; color: #1a1a1a; line-height: 1.6; font-size: 15px; white-space: pre-wrap;">${e.message}</div>
              </div>
              <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #f3f4f6;">
                <p style="color: #9ca3af; font-size: 12px; margin: 0;">Submitted via the MG Reliance website.</p>
              </div>
            </div>
          </div>
        `,
      });
    } catch (emailError) {
      // Don't fail the whole request if email fails — the data was saved
      console.error("Resend email error:", emailError);
    }

    return NextResponse.json(
      { success: true, message: "Your message has been received. We will be in touch shortly." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
