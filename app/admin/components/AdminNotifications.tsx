"use client";

import { useEffect, useState, useRef, useCallback } from "react";

type NewReservationToast = {
  name: string;
  date: string;
  time: string;
  guests: number;
  status: string;
};

type AdminNotificationsProps = {
  onRefresh?: () => void | Promise<void>;
};

const TOAST_DURATION_MS = 4000;
const SSE_URL = "/admin/api/notifications";

export default function AdminNotifications({ onRefresh }: AdminNotificationsProps) {
  const [toast, setToast] = useState<NewReservationToast | null>(null);
  const dismissTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onRefreshRef = useRef(onRefresh);
  onRefreshRef.current = onRefresh;

  const clearDismissTimer = useCallback(() => {
    if (dismissTimerRef.current) {
      clearTimeout(dismissTimerRef.current);
      dismissTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    let es: EventSource | null = null;
    let reconnectTimeout: ReturnType<typeof setTimeout> | null = null;

    function connect() {
      try {
        es = new EventSource(SSE_URL);
      } catch (err) {
        if (typeof console !== "undefined" && console.warn) {
          console.warn("[AdminNotifications] SSE connect failed", err);
        }
        reconnectTimeout = setTimeout(connect, 3000);
        return;
      }

      es.addEventListener("new-reservation", (e: MessageEvent) => {
        try {
          const data = JSON.parse(e.data) as NewReservationToast;
          setToast(data);
          clearDismissTimer();
          dismissTimerRef.current = setTimeout(() => setToast(null), TOAST_DURATION_MS);
          const fn = onRefreshRef.current;
          if (typeof fn === "function") {
            Promise.resolve(fn()).catch(() => {});
          }
        } catch {
          // ignore parse errors
        }
      });

      es.onerror = () => {
        es?.close();
        es = null;
        reconnectTimeout = setTimeout(connect, 3000);
      };
    }

    connect();

    return () => {
      clearDismissTimer();
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
      es?.close();
    };
  }, [clearDismissTimer]);

  if (!toast) return null;

  return (
    <div
      className="admin-notification-toast"
      role="status"
      aria-live="polite"
      aria-label="New reservation received"
    >
      <p className="font-medium text-white">New Reservation</p>
      <p className="text-white/70 mt-1 text-sm">
        {toast.name} · {toast.guests} guest{toast.guests !== 1 ? "s" : ""} · {toast.date} {toast.time}
        {toast.status ? ` · ${toast.status}` : ""}
      </p>
    </div>
  );
}
