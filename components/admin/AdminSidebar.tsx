"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Building2, FileText, MessageSquare, LogOut, ExternalLink } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/dashboard/properties", label: "Properties", icon: Building2, exact: false },
  { href: "/admin/dashboard/posts", label: "Blog Posts", icon: FileText, exact: false },
  { href: "/admin/dashboard/messages", label: "Messages", icon: MessageSquare, exact: false },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <aside className="w-64 bg-primary min-h-screen flex flex-col shrink-0">
      {/* Logo */}
      <div className="px-5 py-6 border-b border-white/10">
        <Link href="/admin/dashboard">
          <div className="bg-white rounded-xl px-3 py-2 inline-block w-full">
            <Image
              src="/logo.jpeg"
              alt="MG Reliance Property Developers"
              width={160}
              height={60}
              className="h-12 w-auto object-contain mx-auto"
            />
          </div>
        </Link>
        <p className="text-white/40 text-xs mt-2 text-center">Admin Panel</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4" aria-label="Admin navigation">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-white/15 text-white"
                      : "text-white/60 hover:bg-white/10 hover:text-white"
                  )}
                >
                  <Icon size={18} />
                  {item.label}
                  {isActive && <span className="ml-auto w-1.5 h-1.5 bg-accent rounded-full" />}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-white/10 space-y-1">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white/60 hover:bg-white/10 hover:text-white transition-all"
        >
          <ExternalLink size={18} />
          View Website
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white/60 hover:bg-red-500/20 hover:text-red-300 transition-all"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
