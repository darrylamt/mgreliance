import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { full_name, email, phone, subject, message } = body;

    // Server-side validation
    if (!full_name || typeof full_name !== "string" || full_name.trim().length < 2) {
      return NextResponse.json(
        { error: "Please provide a valid full name." },
        { status: 400 }
      );
    }

    if (!email || typeof email !== "string" || !isValidEmail(email.trim())) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    if (!message || typeof message !== "string" || message.trim().length < 10) {
      return NextResponse.json(
        { error: "Please provide a message of at least 10 characters." },
        { status: 400 }
      );
    }

    const sanitized = {
      full_name: full_name.trim().slice(0, 200),
      email: email.trim().toLowerCase().slice(0, 200),
      phone: phone ? String(phone).trim().slice(0, 50) : null,
      subject: subject ? String(subject).trim().slice(0, 300) : null,
      message: message.trim().slice(0, 5000),
    };

    // Save to Supabase
    const supabase = getSupabase();
    const { error: dbError } = await supabase
      .from("contact_submissions")
      .insert([sanitized]);

    if (dbError) {
      console.error("Supabase insert error:", dbError);
      return NextResponse.json(
        { error: "Failed to save your message. Please try again." },
        { status: 500 }
      );
    }

    // Send email notification via Resend
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: "MG Reliance Website <onboarding@resend.dev>",
        to: ["info@mgrelianceproperty.com"],
        replyTo: sanitized.email,
        subject: `New Enquiry: ${sanitized.subject || "Contact Form Submission"}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background-color: #1a3c34; padding: 20px; border-radius: 8px 8px 0 0;">
              <h1 style="color: #c9a84c; margin: 0; font-size: 22px;">New Contact Form Submission</h1>
              <p style="color: rgba(255,255,255,0.7); margin: 5px 0 0;">MG Reliance Property Developers</p>
            </div>
            <div style="background-color: #ffffff; padding: 24px; border: 1px solid #e5e7eb; border-radius: 0 0 8px 8px;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; color: #6b7280; font-size: 13px; width: 130px;">Name</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; color: #1a1a1a; font-weight: 600;">${sanitized.full_name}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; color: #6b7280; font-size: 13px;">Email</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; color: #1a1a1a;"><a href="mailto:${sanitized.email}" style="color: #1a3c34;">${sanitized.email}</a></td>
                </tr>
                ${sanitized.phone ? `
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; color: #6b7280; font-size: 13px;">Phone</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; color: #1a1a1a;">${sanitized.phone}</td>
                </tr>` : ""}
                ${sanitized.subject ? `
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; color: #6b7280; font-size: 13px;">Subject</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; color: #1a1a1a;">${sanitized.subject}</td>
                </tr>` : ""}
              </table>
              <div style="margin-top: 20px;">
                <p style="color: #6b7280; font-size: 13px; margin-bottom: 8px;">Message:</p>
                <div style="background-color: #f9f7f4; padding: 16px; border-radius: 6px; color: #1a1a1a; line-height: 1.6; font-size: 15px; white-space: pre-wrap;">${sanitized.message}</div>
              </div>
              <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #f3f4f6;">
                <p style="color: #9ca3af; font-size: 12px; margin: 0;">This message was submitted via the MG Reliance website contact form.</p>
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
