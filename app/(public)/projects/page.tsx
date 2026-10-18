import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import type { Property } from "@/lib/types";
import ProjectsClient from "./ProjectsClient";

interface Props {
  searchParams: { type?: string; status?: string; location?: string; sort?: string };
}

const TYPE_TITLES: Record<string, string> = {
  residential: "Residential properties",
  commercial: "Commercial properties",
  land: "Land",
};

const STATUS_TITLES: Record<string, string> = {
  available: "for sale",
  rented: "for rent",
  sold: "sold",
};

/** Filtered searches get their own title + canonical so shared links read well and can be indexed. */
export function generateMetadata({ searchParams }: Props): Metadata {
  const type = TYPE_TITLES[searchParams.type || ""] ? searchParams.type! : "";
  const status = STATUS_TITLES[searchParams.status || ""] ? searchParams.status! : "";
  const location = (searchParams.location || "").trim().slice(0, 60);

  if (!type && !status && !location) {
    return {
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
  }

  const title = [
    type ? TYPE_TITLES[type] : "Properties",
    status ? STATUS_TITLES[status] : "for sale & rent",
    `in ${location || "Accra"}`,
  ].join(" ");

  const params = new URLSearchParams();
  if (type) params.set("type", type);
  if (status) params.set("status", status);
  if (location) params.set("location", location);
  const url = `/projects?${params.toString()}`;
  const description = `Browse ${title.toLowerCase()} with MG Reliance Property Developers — trusted real estate across Greater Accra, Ghana.`;

  return {
    title,
    description,
    openGraph: { title: `${title} | MG Reliance`, description, url },
    alternates: { canonical: url },
  };
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
