import { areaByName, locationInArea } from "@/lib/areas";
import { propertyUrl, SITE_URL } from "@/lib/urls";
import type { Property } from "@/lib/types";

export interface ListingAlert {
  id: string;
  email: string;
  type: string | null;
  status: string | null;
  location: string | null;
  token: string;
  active: boolean;
}

/** Sender for alert emails. Resend's onboarding@resend.dev can only deliver to the account owner. */
export const ALERT_FROM =
  process.env.RESEND_FROM || "MG Reliance Website <onboarding@resend.dev>";

export function alertMatches(alert: ListingAlert, p: Property): boolean {
  if (alert.type && alert.type !== p.type) return false;
  if (alert.status && alert.status !== p.status) return false;
  if (alert.location) {
    const area = areaByName(alert.location);
    const matches = area
      ? locationInArea(p.location, area)
      : (p.location || "").toLowerCase().includes(alert.location.toLowerCase());
    if (!matches) return false;
  }
  return true;
}

const TYPE_WORDS: Record<string, string> = { residential: "homes", commercial: "commercial property", land: "land" };
const STATUS_WORDS: Record<string, string> = { available: "for sale", rented: "for rent", sold: "sold" };

export function describeAlert(a: { type?: string | null; status?: string | null; location?: string | null }): string {
  return [
    a.type ? TYPE_WORDS[a.type] : "properties",
    a.status ? STATUS_WORDS[a.status] : null,
    a.location ? `in ${a.location}` : "in Greater Accra",
  ]
    .filter(Boolean)
    .join(" ");
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function unsubscribeUrl(token: string): string {
  return `${SITE_URL}/api/alerts/unsubscribe?token=${token}`;
}

function shell(body: string, token: string): string {
  return `
  <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; color: #141414;">
    <p style="margin: 0 0 20px; font-weight: bold; color: #1a3c34; font-size: 18px;">MG Reliance Property Developers</p>
    ${body}
    <p style="margin-top: 32px; font-size: 12px; color: #9a9a94; line-height: 1.6;">
      You're receiving this because you asked for listing alerts on mgrelianceproperties.com.<br/>
      <a href="${unsubscribeUrl(token)}" style="color: #6b6b66;">Unsubscribe</a>
    </p>
  </div>`;
}

export function confirmationEmail(alert: ListingAlert): { subject: string; html: string } {
  const what = escapeHtml(describeAlert(alert));
  return {
    subject: "Your MG Reliance listing alert is on",
    html: shell(
      `<h1 style="font-size: 24px; margin: 0 0 12px;">You're on the list.</h1>
       <p style="font-size: 15px; line-height: 1.6; color: #4a4a46;">We'll email you as soon as new <strong>${what}</strong> are listed.</p>
       <p><a href="${SITE_URL}/projects" style="display: inline-block; margin-top: 8px; background: #1a3c34; color: #fff; text-decoration: none; padding: 12px 22px; border-radius: 999px; font-weight: bold; font-size: 14px;">Browse current listings</a></p>`,
      alert.token
    ),
  };
}

export function newListingEmail(alert: ListingAlert, p: Property): { subject: string; html: string } {
  const title = escapeHtml(p.title);
  const location = escapeHtml(p.location || "");
  const price = p.price ? escapeHtml(p.price) : "Price on request";
  const photo = p.images?.[0];
  const specs = [
    p.bedrooms != null && `${p.bedrooms} bed`,
    p.bathrooms != null && `${p.bathrooms} bath`,
    p.area != null && `${p.area} m²`,
  ]
    .filter(Boolean)
    .join(" · ");
  const url = propertyUrl(p);

  return {
    subject: `New listing: ${p.title}${p.price ? ` — ${p.price}` : ""}`,
    html: shell(
      `<p style="margin: 0 0 12px; font-size: 13px; color: #6b6b66; text-transform: uppercase; letter-spacing: 1px;">New ${escapeHtml(describeAlert(alert))}</p>
       ${photo ? `<a href="${url}"><img src="${escapeHtml(photo)}" alt="" width="512" style="width: 100%; max-width: 512px; border-radius: 20px; display: block;" /></a>` : ""}
       <h1 style="font-size: 22px; margin: 18px 0 6px;">${title}</h1>
       <p style="margin: 0; font-size: 14px; color: #6b6b66;">${location}${specs ? ` · ${escapeHtml(specs)}` : ""}</p>
       <p style="margin: 10px 0 0; font-size: 20px; font-weight: bold; color: #1a3c34;">${price}</p>
       <p><a href="${url}" style="display: inline-block; margin-top: 16px; background: #1a3c34; color: #fff; text-decoration: none; padding: 12px 22px; border-radius: 999px; font-weight: bold; font-size: 14px;">View property</a></p>`,
      alert.token
    ),
  };
}
