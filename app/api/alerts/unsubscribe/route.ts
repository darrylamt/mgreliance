import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { isUuid } from "@/lib/urls";

/** One-click unsubscribe from the link in every alert email. */
export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  const done = new URL("/alerts/unsubscribed", request.url);

  if (isUuid(token)) {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    const { error } = await supabase.from("listing_alerts").update({ active: false }).eq("token", token);
    if (error) console.error("Unsubscribe error:", error);
  }

  return NextResponse.redirect(done, { status: 303 });
}
