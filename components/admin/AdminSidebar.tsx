"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Building2, FileText, MessageSquare, LogOut, ExternalLink, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/dashboard/properties", label: "Properties", icon: Building2, exact: false },
  { href: "/admin/dashboard/posts", label: "Blog Posts", icon: FileText, exact: false },
  { href: "/admin/dashboard/messages", label: "Messages", icon: MessageSquare, exact: false },
];

interface Props {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function AdminSidebar({ isOpen, onClose }: Props) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  const handleNavClick = () => {
    onClose?.();
  };

  return (
    <aside
      className={cn(
        // Mobile: fixed overlay drawer
        "fixed inset-y-0 left-0 z-30 w-64 bg-primary flex flex-col shrink-0 transition-transform duration-300",
        // Desktop: static in flow
        "lg:static lg:translate-x-0 lg:transition-none",
        // Mobile open/closed
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/10 flex items-start justify-between gap-2">
        <Link href="/admin/dashboard" onClick={handleNavClick} className="flex-1">
          <div className="bg-white rounded-xl px-3 py-2">
            <Image
              src="/logo.jpeg"
              alt="MG Reliance Property Developers"
              width={160}
              height={60}
              className="h-10 w-auto object-contain mx-auto"
            />
          </div>
          <p className="text-white/40 text-xs mt-2 text-center">Admin Panel</p>
        </Link>
        {/* Close button — mobile only */}
        <button
          onClick={onClose}
          className="lg:hidden text-white/60 hover:text-white p-1 mt-1 shrink-0"
          aria-label="Close menu"
        >
          <X size={20} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto" aria-label="Admin navigation">
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
                  onClick={handleNavClick}
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
      <div className="px-3 py-4 border-t border-white/10 space-y-1 shrink-0">
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
