import { createClient } from "@/lib/supabase/server";
import type { ContactSubmission } from "@/lib/types";
import AdminHeader from "@/components/admin/AdminHeader";
import { formatDate } from "@/lib/utils";
import MessageReadToggle from "./MessageReadToggle";
import { Mail, MailOpen, Phone } from "lucide-react";

export default async function MessagesPage() {
  let messages: ContactSubmission[] = [];

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("contact_submissions")
      .select("*")
      .order("created_at", { ascending: false });
    messages = data || [];
  } catch {
    // handle gracefully
  }

  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <>
      <AdminHeader
        title="Contact Messages"
        description={`${messages.length} total messages · ${unreadCount} unread`}
      />

      <div className="space-y-4">
        {messages.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 text-center py-16">
            <Mail size={32} className="text-gray-300 mx-auto mb-3" />
            <p className="text-text-secondary text-sm">No messages yet.</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`bg-white rounded-xl border transition-colors ${
                message.read
                  ? "border-gray-100"
                  : "border-primary/20 bg-primary/[0.02]"
              }`}
            >
              <div className="p-6">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        message.read
                          ? "bg-gray-100"
                          : "bg-primary/10"
                      }`}
                    >
                      {message.read ? (
                        <MailOpen
                          size={16}
                          className="text-text-secondary"
                        />
                      ) : (
                        <Mail size={16} className="text-primary" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-text-main text-sm">
                          {message.full_name}
                        </h3>
                        {!message.read && (
                          <span className="w-2 h-2 bg-primary rounded-full" />
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-text-secondary mt-0.5">
                        <a
                          href={`mailto:${message.email}`}
                          className="hover:text-primary transition-colors"
                        >
                          {message.email}
                        </a>
                        {message.phone && (
                          <>
                            <span>·</span>
                            <span className="flex items-center gap-1">
                              <Phone size={11} />
                              {message.phone}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs text-text-secondary">
                      {formatDate(message.created_at)}
                    </span>
                    <MessageReadToggle id={message.id} read={message.read} />
                  </div>
                </div>

                {message.subject && (
                  <p className="text-sm font-medium text-text-main mb-2">
                    {message.subject}
                  </p>
                )}

                <p className="text-sm text-text-secondary leading-relaxed bg-gray-50 rounded-xl p-4">
                  {message.message}
                </p>

                <div className="mt-4 flex gap-3">
                  <a
                    href={`mailto:${message.email}?subject=Re: ${message.subject || "Your Enquiry"}`}
                    className="text-xs font-semibold text-primary hover:text-accent transition-colors"
                  >
                    Reply via Email →
                  </a>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
