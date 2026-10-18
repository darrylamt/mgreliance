import { NextRequest, NextResponse } from "next/server";
import { upcomingViewingDays } from "@/lib/contact";
import { EMPTY_AVAILABILITY, getAvailability } from "@/lib/viewings";
import { isUuid } from "@/lib/urls";

/** Taken + blocked viewing slots for a property over the bookable window. */
export async function GET(request: NextRequest) {
  const propertyId = request.nextUrl.searchParams.get("property_id");
  if (!isUuid(propertyId)) {
    return NextResponse.json({ error: "Invalid property." }, { status: 400 });
  }

  const days = upcomingViewingDays(30);
  try {
    const availability = await getAvailability(propertyId, days[0], days[days.length - 1]);
    return NextResponse.json(availability, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Availability error:", error);
    return NextResponse.json(EMPTY_AVAILABILITY, { headers: { "Cache-Control": "no-store" } });
  }
}
