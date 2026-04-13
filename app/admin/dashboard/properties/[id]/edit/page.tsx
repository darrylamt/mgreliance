import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminHeader from "@/components/admin/AdminHeader";
import PropertyForm from "../../PropertyForm";

interface EditPropertyPageProps {
  params: { id: string };
}

export default async function EditPropertyPage({
  params,
}: EditPropertyPageProps) {
  const supabase = await createClient();
  const { data: property, error } = await supabase
    .from("properties")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error || !property) notFound();

  return (
    <>
      <AdminHeader
        title="Edit Property"
        description={`Editing: ${property.title}`}
      />
      <PropertyForm initialData={property} id={params.id} />
    </>
  );
}
