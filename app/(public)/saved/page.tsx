import type { Metadata } from "next";
import SavedContent from "./SavedContent";

export const metadata: Metadata = {
  title: "Saved Properties",
  description: "Properties you've saved on MG Reliance Property Developers.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/saved" },
};

export default function SavedPage() {
  return <SavedContent />;
}
