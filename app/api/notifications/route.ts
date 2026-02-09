export const runtime = "nodejs";

let clients: ReadableStreamDefaultController[] = [];

export async function GET() {
  const stream = new ReadableStream({
    start(controller) {
      clients.push(controller);

      controller.enqueue(
        `event: connected\ndata: admin-connected\n\n`
      );

      return () => {
        clients = clients.filter((c) => c !== controller);
      };
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}

/* helper used by reservation API */
export function notifyAdmins(payload: any) {
  const data = `event: reservation\ndata: ${JSON.stringify(payload)}\n\n`;
  clients.forEach((client) => client.enqueue(data));
}
