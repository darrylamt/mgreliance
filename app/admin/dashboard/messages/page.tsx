import { createClient } from "@/lib/supabase/server";
import type { ContactSubmission } from "@/lib/types";
import AdminHeader from "@/components/admin/AdminHeader";
import { formatDate } from "@/lib/utils";
import MessageReadToggle from "./MessageReadToggle";
import PaginationBar from "@/components/admin/PaginationBar";
import { Mail, MailOpen, Phone } from "lucide-react";

const PAGE_SIZE = 10;

export default async function MessagesPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const page = Math.max(1, parseInt(searchParams.page || "1", 10));
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  let messages: ContactSubmission[] = [];
  let total = 0;
  let unreadCount = 0;

  try {
    const supabase = await createClient();
    const { data, count } = await supabase
      .from("contact_submissions")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(from, to);
    messages = data || [];
    total = count || 0;

    const { count: unread } = await supabase
      .from("contact_submissions")
      .select("*", { count: "exact", head: true })
      .eq("read", false);
    unreadCount = unread || 0;
  } catch {
    // handle gracefully
  }

  return (
    <>
      <AdminHeader
        title="Messages"
        description={`${total} total · ${unreadCount} unread`}
      />

      {messages.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 text-center py-16">
          <Mail size={32} className="text-gray-300 mx-auto mb-3" />
          <p className="text-text-secondary text-sm">No messages yet.</p>
        </div>
      ) : (
        <div>
          <div className="space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`bg-white rounded-xl border transition-colors ${
                  message.read ? "border-gray-100" : "border-primary/20 bg-primary/[0.02]"
                }`}
              >
                <div className="p-4 sm:p-5">
                  {/* Header row */}
                  <div className="flex items-start gap-3 mb-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      message.read ? "bg-gray-100" : "bg-primary/10"
                    }`}>
                      {message.read
                        ? <MailOpen size={15} className="text-text-secondary" />
                        : <Mail size={15} className="text-primary" />
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-text-main text-sm">
                          {message.full_name}
                        </h3>
                        {!message.read && (
                          <span className="w-2 h-2 bg-primary rounded-full shrink-0" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 flex-wrap text-xs text-text-secondary mt-0.5">
                        <a href={`mailto:${message.email}`}
                          className="hover:text-primary transition-colors truncate max-w-[200px]">
                          {message.email}
                        </a>
                        {message.phone && (
                          <span className="flex items-center gap-1 shrink-0">
                            <Phone size={11} /> {message.phone}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs text-text-secondary hidden sm:block">
                        {formatDate(message.created_at)}
                      </span>
                      <MessageReadToggle id={message.id} read={message.read} />
                    </div>
                  </div>

                  {/* Date on mobile */}
                  <p className="text-xs text-text-secondary mb-2 sm:hidden">
                    {formatDate(message.created_at)}
                  </p>

                  {message.subject && (
                    <p className="text-sm font-medium text-text-main mb-2">
                      {message.subject}
                    </p>
                  )}

                  <p className="text-sm text-text-secondary leading-relaxed bg-gray-50 rounded-xl p-3">
                    {message.message}
                  </p>

                  <div className="mt-3">
                    <a
                      href={`mailto:${message.email}?subject=Re: ${message.subject || "Your Enquiry"}`}
                      className="text-xs font-semibold text-primary hover:text-accent transition-colors"
                    >
                      Reply via Email →
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <PaginationBar
            page={page}
            total={total}
            pageSize={PAGE_SIZE}
            basePath="/admin/dashboard/messages"
          />
        </div>
      )}
    </>
  );
}
