"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface PostDeleteButtonProps {
  id: string;
}

export default function PostDeleteButton({ id }: PostDeleteButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    setLoading(true);
    const supabase = createClient();
    await supabase.from("posts").delete().eq("id", id);
    router.refresh();
    setLoading(false);
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
      aria-label="Delete post"
    >
      <Trash2 size={15} />
    </button>
  );
}
