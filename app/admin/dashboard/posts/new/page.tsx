import AdminHeader from "@/components/admin/AdminHeader";
import PostForm from "../PostForm";

export default function NewPostPage() {
  return (
    <>
      <AdminHeader
        title="New Blog Post"
        description="Write and publish a new article."
      />
      <PostForm />
    </>
  );
}
