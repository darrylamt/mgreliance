export type PropertyType = "residential" | "commercial" | "land";
export type PropertyStatus = "available" | "sold" | "rented";

export interface Property {
  id: string;
  title: string;
  type: PropertyType;
  location: string;
  price: string | null;
  description: string | null;
  status: PropertyStatus;
  images: string[];
  featured: boolean;
  bedrooms: number | null;
  bathrooms: number | null;
  area: number | null;
  amenities: string[];
  agent_name: string | null;
  created_at: string;
  updated_at: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  cover_image_url: string | null;
  category: string | null;
  published: boolean;
  published_at: string | null;
  author: string;
  created_at: string;
  updated_at: string;
}

export interface ContactSubmission {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  property_id: string | null;
  read: boolean;
  created_at: string;
}

export interface ContactFormData {
  full_name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  property_id?: string;
}
