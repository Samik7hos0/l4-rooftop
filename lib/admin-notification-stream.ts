/**
 * In-memory SSE subscriber list for admin real-time notifications.
 * Used by: app/admin/api/notifications/route.ts (add/remove clients)
 *          app/api/reservations/route.ts (emit on new reservation)
 */

const clients = new Set<ReadableStreamDefaultController<Uint8Array>>();

export function addClient(controller: ReadableStreamDefaultController<Uint8Array>): void {
  clients.add(controller);
}

export function removeClient(controller: ReadableStreamDefaultController<Uint8Array>): void {
  clients.delete(controller);
}

export type NewReservationPayload = {
  name: string;
  date: string;
  time: string;
  guests: number;
  status: string;
};

/** Emit "new-reservation" to all connected admin clients. Never blocks; no-op if no clients. */
export function notifyAdmins(payload: NewReservationPayload): void {
  if (clients.size === 0) return;
  const data = `event: new-reservation\ndata: ${JSON.stringify(payload)}\n\n`;
  const encoded = new TextEncoder().encode(data);
  const dead: ReadableStreamDefaultController<Uint8Array>[] = [];
  clients.forEach((client) => {
    try {
      client.enqueue(encoded);
    } catch {
      dead.push(client);
    }
  });
  dead.forEach((c) => clients.delete(c));
}
