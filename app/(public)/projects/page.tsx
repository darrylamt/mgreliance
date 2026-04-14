import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import type { Property } from "@/lib/types";
import ProjectsClient from "./ProjectsClient";

export const metadata: Metadata = {
  title: "Properties for Sale & Rent in Accra, Ghana",
  description:
    "Browse MG Reliance's property listings across Greater Accra — residential homes, commercial spaces, and land for sale or rent. Filter by location, type, and price.",
  openGraph: {
    title: "Properties for Sale & Rent in Accra | MG Reliance",
    description:
      "Explore residential, commercial, and land listings across East Legon, Cantonments, Airport Residential, Tema, and beyond.",
    url: "/projects",
  },
  alternates: { canonical: "/projects" },
};

interface Props {
  searchParams: { type?: string; status?: string; location?: string; sort?: string };
}

export default async function ProjectsPage({ searchParams }: Props) {
  let properties: Property[] = [];

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("properties")
      .select("*")
      .order("created_at", { ascending: false });
    properties = data || [];
  } catch {
    // handle gracefully
  }

  return (
    <ProjectsClient
      properties={properties}
      initialType={searchParams.type || ""}
      initialStatus={searchParams.status || ""}
      initialLocation={searchParams.location || ""}
      initialSort={searchParams.sort || "newest"}
    />
  );
}
