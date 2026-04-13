"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { MailOpen, Mail } from "lucide-react";

interface MessageReadToggleProps {
  id: string;
  read: boolean;
}

export default function MessageReadToggle({ id, read }: MessageReadToggleProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const toggle = async () => {
    setLoading(true);
    const supabase = createClient();
    await supabase
      .from("contact_submissions")
      .update({ read: !read })
      .eq("id", id);
    router.refresh();
    setLoading(false);
  };

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50 ${
        read
          ? "text-text-secondary hover:text-primary hover:bg-primary/5"
          : "text-primary hover:bg-primary/10"
      }`}
      aria-label={read ? "Mark as unread" : "Mark as read"}
    >
      {read ? (
        <>
          <Mail size={12} />
          Unread
        </>
      ) : (
        <>
          <MailOpen size={12} />
          Read
        </>
      )}
    </button>
  );
}
