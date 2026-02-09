"use client";

import { useEffect, useRef, useState, useCallback } from "react";

type NotificationItem = {
  id: string;
  name: string;
  date: string;
  time: string;
  guests: number;
  status: string;
  createdAt: number;
};

type Props = {
  onRefresh?: () => void | Promise<void>;
};

const SSE_URL = "/admin/api/notifications";
const STORAGE_KEY = "l4_admin_notifications";
const UNREAD_KEY = "l4_admin_unread";
const MAX_ITEMS = 25;

export default function AdminNotifications({ onRefresh }: Props) {
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(0);

  const panelRef = useRef<HTMLDivElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const refreshRef = useRef(onRefresh);
  refreshRef.current = onRefresh;

  /* ================= LOAD PERSISTED ================= */

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const unreadStored = localStorage.getItem(UNREAD_KEY);
      if (stored) setItems(JSON.parse(stored));
      if (unreadStored) setUnread(Number(unreadStored));
    } catch {}
  }, []);

  /* ================= PERSIST ================= */

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    localStorage.setItem(UNREAD_KEY, String(unread));
  }, [items, unread]);

  /* ================= SOUND ================= */

  useEffect(() => {
    audioRef.current = new Audio("/sounds/notification.mp3");
    audioRef.current.volume = 0.4;

    const unlock = () => {
      audioRef.current?.play().catch(() => {});
      audioRef.current?.pause();
      window.removeEventListener("click", unlock);
    };

    window.addEventListener("click", unlock);
    return () => window.removeEventListener("click", unlock);
  }, []);

  /* ================= SSE ================= */

  useEffect(() => {
    let es: EventSource | null = null;
    let retry: any;

    function connect() {
      es = new EventSource(SSE_URL);

      es.addEventListener("new-reservation", (e) => {
        try {
          const raw = JSON.parse(e.data);

          const item: NotificationItem = {
            id: raw._id || crypto.randomUUID(),
            name: raw.name,
            date: raw.date,
            time: raw.time,
            guests: raw.guests,
            status: raw.status,
            createdAt: Date.now(),
          };

          setItems((prev) => [item, ...prev].slice(0, MAX_ITEMS));
          setUnread((u) => u + 1);

          audioRef.current?.play().catch(() => {});

          const fn = refreshRef.current;
          if (fn) Promise.resolve(fn()).catch(() => {});
        } catch {}
      });

      es.onerror = () => {
        es?.close();
        retry = setTimeout(connect, 3000);
      };
    }

    connect();
    return () => {
      es?.close();
      clearTimeout(retry);
    };
  }, []);

  /* ================= CLOSE HANDLERS ================= */

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    function onClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    if (open) {
      window.addEventListener("keydown", onKey);
      window.addEventListener("mousedown", onClick);
    }

    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  /* ================= SCROLL + HIGHLIGHT ================= */

  function jumpToReservation(id: string) {
    const el = document.querySelector(`[data-reservation-id="${id}"]`);
    if (!el) return;

    el.scrollIntoView({ behavior: "smooth", block: "center" });
    el.classList.add("ring-2", "ring-emerald-400/60");

    setTimeout(() => {
      el.classList.remove("ring-2", "ring-emerald-400/60");
    }, 2000);

    setOpen(false);
  }

  /* ================= UI ================= */

  return (
    <>
      {/* 🔔 BELL */}
      <button
        onClick={() => {
          setOpen((v) => !v);
          setUnread(0);
        }}
        className="
          fixed top-6 right-6 z-[9999]
          w-11 h-11 rounded-full
          bg-black/60 backdrop-blur-xl
          border border-white/10
          flex items-center justify-center
          text-white/80 hover:text-white
        "
      >
        🔔
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full bg-red-500 text-[11px] font-semibold flex items-center justify-center text-white">
            {unread}
          </span>
        )}
      </button>

      {/* 🔔 PANEL */}
      {open && (
        <div
          ref={panelRef}
          className="
            fixed md:top-20 md:right-6
            bottom-0 inset-x-0 md:inset-x-auto
            z-[9999]
            w-full md:w-[380px]
            max-h-[80vh]
            bg-neutral-900/95 backdrop-blur-xl
            border-t md:border border-white/10
            rounded-t-3xl md:rounded-2xl
            shadow-[0_30px_80px_rgba(0,0,0,0.7)]
            overflow-hidden
          "
        >
          {/* HEADER */}
          <div className="px-5 py-4 flex items-center justify-between border-b border-white/10">
            <span className="text-sm font-semibold text-white">
              Notifications
            </span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setUnread(0)}
                className="text-xs text-white/50 hover:text-white"
              >
                Mark all read
              </button>
              <button onClick={() => setOpen(false)}>✕</button>
            </div>
          </div>

          {/* LIST */}
          <div className="max-h-[60vh] overflow-y-auto divide-y divide-white/5">
            {items.length === 0 && (
              <p className="px-6 py-8 text-sm text-white/40 text-center">
                No notifications yet
              </p>
            )}

            {items.map((n) => (
              <button
                key={n.id}
                onClick={() => jumpToReservation(n.id)}
                className="
                  w-full text-left
                  px-6 py-4
                  hover:bg-white/[0.04]
                  transition
                "
              >
                <p className="text-white font-medium">{n.name}</p>
                <p className="text-white/60 text-sm mt-1">
                  {n.guests} guests · {n.date} {n.time}
                </p>
                <p className="text-[11px] text-white/40 mt-1">
                  {n.status}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
