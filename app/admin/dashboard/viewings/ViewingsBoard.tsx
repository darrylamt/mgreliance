"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CalendarCheck, CalendarX, Check, CheckCheck, Clock, ExternalLink, Lock, Mail, Phone, RotateCcw, Unlock, X,
} from "lucide-react";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";
import { createClient } from "@/lib/supabase/client";
import { slotsForDate } from "@/lib/contact";
import type { ViewingStatus } from "@/lib/viewing-slots";
import { cn } from "@/lib/utils";

export interface ViewingRow {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  notes: string;
  date: string;
  time: string;
  status: ViewingStatus;
  propertyId: string | null;
  propertyTitle: string;
  propertySlug: string | null;
  createdAt: string;
}

export interface ViewingBlock {
  id: string;
  date: string;
  time: string | null;
  reason: string | null;
}

interface Props {
  viewings: ViewingRow[];
  blocks: ViewingBlock[];
  blocksAvailable: boolean;
  statusAvailable: boolean;
  today: string;
  days: string[];
}

const STATUS_STYLES: Record<ViewingStatus, { label: string; className: string }> = {
  pending: { label: "Awaiting confirmation", className: "bg-amber-50 text-amber-700" },
  confirmed: { label: "Confirmed", className: "bg-green-50 text-green-700" },
  completed: { label: "Done", className: "bg-gray-100 text-gray-600" },
  cancelled: { label: "Cancelled", className: "bg-red-50 text-red-600" },
};

const MIGRATION_HINT = "Run supabase/migrations/004_viewing_bookings.sql in the Supabase SQL editor to enable this.";

function longDate(date: string) {
  return new Date(`${date}T12:00:00`).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

function shortDay(date: string) {
  const d = new Date(`${date}T12:00:00`);
  return {
    weekday: d.toLocaleDateString("en-GB", { weekday: "short" }),
    day: d.getDate(),
    month: d.toLocaleDateString("en-GB", { month: "short" }),
  };
}

/** wa.me wants international digits; accept local Ghana numbers like 024… too. */
function waNumber(phone: string | null): string | null {
  if (!phone) return null;
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("233")) return digits;
  if (digits.startsWith("0") && digits.length === 10) return `233${digits.slice(1)}`;
  return digits.length >= 9 ? digits : null;
}

export default function ViewingsBoard({ viewings, blocks, blocksAvailable, statusAvailable, today, days }: Props) {
  const router = useRouter();
  const [tab, setTab] = useState<"upcoming" | "past" | "cancelled">("upcoming");
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [day, setDay] = useState(days[0]);

  const groups = useMemo(() => {
    const filtered = viewings.filter((v) => {
      if (tab === "cancelled") return v.status === "cancelled";
      if (v.status === "cancelled") return false;
      return tab === "upcoming"
        ? v.date >= today && v.status !== "completed"
        : v.date < today || v.status === "completed";
    });
    if (tab !== "upcoming") filtered.reverse();
    const byDate = new Map<string, ViewingRow[]>();
    for (const v of filtered) byDate.set(v.date, [...(byDate.get(v.date) || []), v]);
    return Array.from(byDate.entries());
  }, [viewings, tab, today]);

  const setStatus = async (id: string, status: ViewingStatus) => {
    setBusy(id);
    setError(null);
    const { error: dbError } = await createClient()
      .from("contact_submissions")
      .update({ viewing_status: status, read: true })
      .eq("id", id);
    setBusy(null);
    if (dbError) {
      setError(dbError.code === "23505"
        ? "Another active booking already holds that slot for this property."
        : statusAvailable ? dbError.message : MIGRATION_HINT);
      return;
    }
    router.refresh();
  };

  // ─── Availability panel ───
  const dayBookings = viewings.filter(
    (v) => v.date === day && (v.status === "pending" || v.status === "confirmed")
  );
  const dayBlocked = blocks.find((b) => b.date === day && b.time === null);
  const slotBlock = (time: string) => blocks.find((b) => b.date === day && b.time === time);

  const toggleBlock = async (time: string | null) => {
    if (!blocksAvailable) {
      setError(MIGRATION_HINT);
      return;
    }
    const key = `block-${day}-${time ?? "day"}`;
    setBusy(key);
    setError(null);
    const supabase = createClient();
    const existing = time === null ? dayBlocked : slotBlock(time);
    const { error: dbError } = existing
      ? await supabase.from("viewing_blocks").delete().eq("id", existing.id)
      : await supabase.from("viewing_blocks").insert([{ date: day, time }]);
    setBusy(null);
    if (dbError) {
      setError(dbError.message);
      return;
    }
    router.refresh();
  };

  return (
    <div className="space-y-8">
      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <X size={16} className="mt-0.5 shrink-0" />
          <span className="flex-1">{error}</span>
          <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700" aria-label="Dismiss">
            <X size={14} />
          </button>
        </div>
      )}

      {/* ─── Bookings ─── */}
      <section>
        <div className="flex flex-wrap gap-1 bg-white border border-gray-100 rounded-xl p-1 w-fit mb-5">
          {(
            [
              { key: "upcoming", label: "Upcoming" },
              { key: "past", label: "Past" },
              { key: "cancelled", label: "Cancelled" },
            ] as const
          ).map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-semibold transition-colors",
                tab === t.key ? "bg-primary text-white" : "text-text-secondary hover:text-text-main"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        {groups.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 text-center py-16">
            <CalendarCheck size={32} className="text-gray-300 mx-auto mb-3" />
            <p className="text-text-secondary text-sm">
              {tab === "upcoming" ? "No upcoming viewings." : tab === "past" ? "No past viewings yet." : "No cancelled viewings."}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {groups.map(([date, rows]) => (
              <div key={date}>
                <h2 className="text-sm font-semibold text-text-main mb-2">
                  {longDate(date)}
                  {date === today && <span className="ml-2 text-xs font-medium text-primary">Today</span>}
                </h2>
                <div className="space-y-2">
                  {rows.map((v) => {
                    const wa = waNumber(v.phone);
                    const waText = `Hi ${v.name.split(" ")[0]}, this is MG Reliance confirming your viewing of "${v.propertyTitle}" on ${longDate(v.date)} at ${v.time}. See you then!`;
                    const style = STATUS_STYLES[v.status];
                    return (
                      <div key={v.id} className="bg-white rounded-xl border border-gray-100 p-4 sm:p-5">
                        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                          <div className="flex items-center gap-2 sm:w-24 shrink-0">
                            <Clock size={15} className="text-text-secondary" />
                            <span className="text-lg font-semibold tabular-nums text-text-main">{v.time}</span>
                          </div>

                          <div className="flex-1 min-w-0 space-y-1.5">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="font-semibold text-text-main">{v.name}</p>
                              <span className={cn("rounded-full px-2.5 py-0.5 text-[11px] font-semibold", style.className)}>
                                {style.label}
                              </span>
                            </div>
                            {v.propertyId && (
                              <Link
                                href={`/projects/${v.propertySlug || v.propertyId}`}
                                target="_blank"
                                className="inline-flex items-center gap-1 text-sm text-primary hover:text-accent"
                              >
                                {v.propertyTitle}
                                <ExternalLink size={12} />
                              </Link>
                            )}
                            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-text-secondary">
                              {v.phone && (
                                <a href={`tel:${v.phone}`} className="inline-flex items-center gap-1 hover:text-primary">
                                  <Phone size={11} /> {v.phone}
                                </a>
                              )}
                              <a href={`mailto:${v.email}`} className="inline-flex items-center gap-1 hover:text-primary truncate">
                                <Mail size={11} /> {v.email}
                              </a>
                            </div>
                            {v.notes && !v.notes.startsWith("Viewing requested") && (
                              <p className="text-sm text-text-secondary bg-gray-50 rounded-lg p-2.5">{v.notes}</p>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="flex flex-wrap gap-2 sm:justify-end sm:max-w-[260px]">
                            {wa && (
                              <a
                                href={`https://wa.me/${wa}?text=${encodeURIComponent(waText)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 rounded-lg bg-[#25D366]/10 px-3 py-1.5 text-xs font-semibold text-[#128C7E] hover:bg-[#25D366]/20"
                              >
                                <WhatsAppIcon size={13} /> WhatsApp
                              </a>
                            )}
                            {v.status === "pending" && (
                              <button
                                disabled={busy === v.id}
                                onClick={() => setStatus(v.id, "confirmed")}
                                className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary/90 disabled:opacity-50"
                              >
                                <Check size={13} /> Confirm
                              </button>
                            )}
                            {v.status === "confirmed" && (
                              <button
                                disabled={busy === v.id}
                                onClick={() => setStatus(v.id, "completed")}
                                className="inline-flex items-center gap-1.5 rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-semibold text-text-main hover:bg-gray-200 disabled:opacity-50"
                              >
                                <CheckCheck size={13} /> Mark done
                              </button>
                            )}
                            {(v.status === "pending" || v.status === "confirmed") && (
                              <button
                                disabled={busy === v.id}
                                onClick={() => setStatus(v.id, "cancelled")}
                                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
                              >
                                <CalendarX size={13} /> Cancel
                              </button>
                            )}
                            {(v.status === "cancelled" || v.status === "completed") && v.date >= today && (
                              <button
                                disabled={busy === v.id}
                                onClick={() => setStatus(v.id, "pending")}
                                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-text-secondary hover:bg-gray-100 disabled:opacity-50"
                              >
                                <RotateCcw size={13} /> Reopen
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ─── Availability ─── */}
      <section className="bg-white rounded-xl border border-gray-100 p-4 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
          <div>
            <h2 className="font-display text-lg font-bold text-text-main">Availability</h2>
            <p className="text-sm text-text-secondary mt-0.5">
              Click a free slot to block it for every property. Booked slots are only taken for their own property.
            </p>
          </div>
          {!blocksAvailable && (
            <p className="text-xs text-amber-700 bg-amber-50 rounded-lg px-3 py-2">{MIGRATION_HINT}</p>
          )}
        </div>

        {/* Day strip */}
        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2 -mx-1 px-1">
          {days.map((d) => {
            const p = shortDay(d);
            const active = d === day;
            const closed = blocks.some((b) => b.date === d && b.time === null);
            const count = viewings.filter(
              (v) => v.date === d && (v.status === "pending" || v.status === "confirmed")
            ).length;
            return (
              <button
                key={d}
                onClick={() => setDay(d)}
                className={cn(
                  "relative shrink-0 w-16 rounded-xl py-2.5 text-center border transition-colors",
                  active ? "bg-primary border-primary text-white" : "bg-white border-gray-100 hover:border-primary/30",
                  closed && !active && "bg-gray-50 text-text-secondary"
                )}
              >
                <span className={cn("block text-[11px]", active ? "text-white/70" : "text-text-secondary")}>{p.weekday}</span>
                <span className="block text-base font-semibold leading-tight">{p.day}</span>
                <span className={cn("block text-[11px]", active ? "text-white/70" : "text-text-secondary")}>
                  {closed ? "Closed" : p.month}
                </span>
                {count > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-accent text-[10px] font-bold text-white flex items-center justify-center">
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-semibold text-text-main">{longDate(day)}</p>
          <button
            onClick={() => toggleBlock(null)}
            disabled={busy === `block-${day}-day`}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold disabled:opacity-50",
              dayBlocked ? "bg-primary/10 text-primary hover:bg-primary/15" : "bg-red-50 text-red-600 hover:bg-red-100"
            )}
          >
            {dayBlocked ? <Unlock size={13} /> : <Lock size={13} />}
            {dayBlocked ? "Re-open this day" : "Close this whole day"}
          </button>
        </div>

        <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {slotsForDate(day).map((time) => {
            const booked = dayBookings.filter((v) => v.time === time);
            const blocked = Boolean(dayBlocked || slotBlock(time));
            return (
              <button
                key={time}
                onClick={() => !dayBlocked && toggleBlock(time)}
                disabled={Boolean(dayBlocked) || busy === `block-${day}-${time}`}
                title={blocked ? "Blocked — click to unblock" : "Open — click to block"}
                className={cn(
                  "rounded-xl border p-2.5 text-left transition-colors disabled:cursor-not-allowed",
                  blocked
                    ? "border-gray-200 bg-gray-50 text-text-secondary"
                    : "border-gray-100 bg-white hover:border-red-200 hover:bg-red-50/40"
                )}
              >
                <span className="flex items-center justify-between text-sm font-semibold tabular-nums text-text-main">
                  {time}
                  {blocked && <Lock size={12} className="text-text-secondary" />}
                </span>
                <span className="block mt-1 text-[11px] leading-tight">
                  {blocked ? (
                    "Blocked"
                  ) : booked.length > 0 ? (
                    <span className="text-primary font-medium">
                      {booked.length === 1 ? booked[0].name : `${booked.length} bookings`}
                    </span>
                  ) : (
                    <span className="text-text-secondary">Open</span>
                  )}
                </span>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
