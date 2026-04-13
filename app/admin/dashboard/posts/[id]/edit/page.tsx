import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminHeader from "@/components/admin/AdminHeader";
import PostForm from "../../PostForm";

interface EditPostPageProps {
  params: { id: string };
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const supabase = await createClient();
  const { data: post, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error || !post) notFound();

  return (
    <>
      <AdminHeader
        title="Edit Post"
        description={`Editing: ${post.title}`}
      />
      <PostForm initialData={post} id={params.id} />
    </>
  );
}
