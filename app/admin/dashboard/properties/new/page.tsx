import AdminHeader from "@/components/admin/AdminHeader";
import PropertyForm from "../PropertyForm";

export default function NewPropertyPage() {
  return (
    <>
      <AdminHeader
        title="Add Property"
        description="Create a new property listing."
      />
      <PropertyForm />
    </>
  );
}
