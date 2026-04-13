import { createClient } from "@/lib/supabase/server";
import { Building2, FileText, MessageSquare, TrendingUp } from "lucide-react";
import Link from "next/link";
import AdminHeader from "@/components/admin/AdminHeader";

async function getStats() {
  try {
    const supabase = await createClient();
    const [properties, posts, messages, unread] = await Promise.all([
      supabase.from("properties").select("id", { count: "exact" }),
      supabase.from("posts").select("id", { count: "exact" }),
      supabase.from("contact_submissions").select("id", { count: "exact" }),
      supabase
        .from("contact_submissions")
        .select("id", { count: "exact" })
        .eq("read", false),
    ]);
    return {
      properties: properties.count ?? 0,
      posts: posts.count ?? 0,
      messages: messages.count ?? 0,
      unread: unread.count ?? 0,
    };
  } catch {
    return { properties: 0, posts: 0, messages: 0, unread: 0 };
  }
}

export default async function DashboardPage() {
  const stats = await getStats();

  const cards = [
    {
      label: "Total Properties",
      value: stats.properties,
      icon: Building2,
      href: "/admin/dashboard/properties",
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Blog Posts",
      value: stats.posts,
      icon: FileText,
      href: "/admin/dashboard/posts",
      color: "bg-purple-50 text-purple-600",
    },
    {
      label: "Total Messages",
      value: stats.messages,
      icon: MessageSquare,
      href: "/admin/dashboard/messages",
      color: "bg-green-50 text-green-600",
    },
    {
      label: "Unread Messages",
      value: stats.unread,
      icon: TrendingUp,
      href: "/admin/dashboard/messages",
      color: "bg-amber-50 text-amber-600",
    },
  ];

  return (
    <>
      <AdminHeader
        title="Dashboard"
        description="Welcome back! Here's a summary of your website."
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.label}
              href={card.href}
              className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-md transition-shadow group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${card.color}`}>
                  <Icon size={20} />
                </div>
                <span className="text-3xl font-bold text-text-main">
                  {card.value}
                </span>
              </div>
              <p className="text-text-secondary text-sm font-medium group-hover:text-primary transition-colors">
                {card.label}
              </p>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="font-playfair text-lg font-semibold text-text-main mb-5">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/admin/dashboard/properties/new"
            className="flex items-center gap-3 p-4 rounded-xl border border-gray-100 hover:border-primary hover:bg-primary/5 transition-all group"
          >
            <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center">
              <Building2 size={18} className="text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-text-main group-hover:text-primary transition-colors">
                Add Property
              </p>
              <p className="text-xs text-text-secondary">
                List a new property
              </p>
            </div>
          </Link>
          <Link
            href="/admin/dashboard/posts/new"
            className="flex items-center gap-3 p-4 rounded-xl border border-gray-100 hover:border-primary hover:bg-primary/5 transition-all group"
          >
            <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center">
              <FileText size={18} className="text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-text-main group-hover:text-primary transition-colors">
                Write Post
              </p>
              <p className="text-xs text-text-secondary">
                Create a blog article
              </p>
            </div>
          </Link>
          <Link
            href="/admin/dashboard/messages"
            className="flex items-center gap-3 p-4 rounded-xl border border-gray-100 hover:border-primary hover:bg-primary/5 transition-all group"
          >
            <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center">
              <MessageSquare size={18} className="text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-text-main group-hover:text-primary transition-colors">
                View Messages
              </p>
              <p className="text-xs text-text-secondary">
                {stats.unread > 0
                  ? `${stats.unread} unread`
                  : "All caught up"}
              </p>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
}
