import { addClient, removeClient } from "@/lib/admin-notification-stream";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** GET – SSE stream for admin live notifications. Keeps connection open; never blocks if no clients. */
export async function GET() {
  let controllerRef: ReadableStreamDefaultController<Uint8Array> | null = null;
  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      controllerRef = controller;
      addClient(controller);
      const connected = new TextEncoder().encode(
        "event: connected\ndata: admin-ready\n\n"
      );
      try {
        controller.enqueue(connected);
      } catch {
        removeClient(controller);
      }
    },
    cancel() {
      if (controllerRef) removeClient(controllerRef);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
