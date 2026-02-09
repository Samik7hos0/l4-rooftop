"use client";

import { useEffect, useRef, useState } from "react";

type Item = {
  id: string;
  name: string;
  date: string;
  time: string;
  guests: number;
  status: string;
};

const STORAGE = "l4_admin_notifications";
const SOUND_KEY = "l4_admin_sound";

export default function AdminNotifications({ onRefresh }: { onRefresh?: () => void }) {
  const [items, setItems] = useState<Item[]>([]);
  const [open, setOpen] = useState(false);
  const [sound, setSound] = useState(true);
  const audio = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audio.current = new Audio("/sounds/notification.mp3");
    audio.current.volume = 0.4;

    const s = localStorage.getItem(SOUND_KEY);
    if (s === "off") setSound(false);

    const stored = localStorage.getItem(STORAGE);
    if (stored) setItems(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE, JSON.stringify(items));
    localStorage.setItem(SOUND_KEY, sound ? "on" : "off");
  }, [items, sound]);

  function jump(id: string, status: string) {
    document
      .querySelector(`[data-reservation-id="${id}"]`)
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
    setOpen(false);
  }

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed top-6 right-6 z-50 w-11 h-11 rounded-full bg-black/60 backdrop-blur border border-white/10"
      >
        🔔
      </button>

      {open && (
        <div className="fixed inset-x-0 bottom-0 md:top-20 md:right-6 md:left-auto md:w-[380px] bg-neutral-900/95 backdrop-blur-xl rounded-t-3xl md:rounded-2xl border border-white/10 shadow-2xl">
          <div className="px-5 py-4 flex justify-between items-center">
            <span className="text-white font-medium">Notifications</span>
            <div className="flex gap-3">
              <button onClick={() => setSound((s) => !s)}>
                {sound ? "🔊" : "🔇"}
              </button>
              <button onClick={() => setOpen(false)}>✕</button>
            </div>
          </div>

          <div className="max-h-[60vh] overflow-y-auto divide-y divide-white/5">
            {items.map((n) => (
              <button
                key={n.id}
                onClick={() => jump(n.id, n.status)}
                className="w-full px-6 py-4 text-left hover:bg-white/[0.05]"
              >
                <p className="text-white font-medium">
                  {n.name}
                  {n.guests >= 6 && (
                    <span className="ml-2 text-xs text-amber-400">PRIORITY</span>
                  )}
                </p>
                <p className="text-white/60 text-sm">
                  {n.guests} guests · {n.date} {n.time}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
