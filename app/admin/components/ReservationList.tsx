"use client";

type Reservation = {
  _id: string;
  name: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  note?: string;
};

type Props = {
  title: string;
  color: string;
  reservations: Reservation[];
  onRefresh?: () => void;
};

export default function ReservationList({
  title,
  color,
  reservations,
  onRefresh,
}: Props) {
  async function confirmReservation(r: Reservation) {
    await fetch("/api/reservations", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: r._id }),
    });

    const msg = encodeURIComponent(
      `Hello ${r.name}, your reservation at L4 Rooftop is confirmed.\n\n📅 ${r.date}\n⏰ ${r.time}\n👥 Guests: ${r.guests}${
        r.note ? `\n📝 Request: ${r.note}` : ""
      }`
    );

    window.open(`https://wa.me/91${r.phone}?text=${msg}`, "_blank");
    onRefresh?.();
  }

  async function deleteReservation(id: string) {
    if (!window.confirm("Delete this reservation?")) return;

    await fetch("/api/reservations", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    onRefresh?.();
  }

  return (
    <section>
      <h2 className={`text-2xl mb-6 ${color}`}>{title}</h2>

      {reservations.length === 0 ? (
        <p className="text-neutral-500">No records</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {reservations.map((r) => (
            <div
              key={r._id}
              className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 space-y-3"
            >
              <div>
                <p className="text-lg font-semibold">{r.name}</p>
                <p className="text-sm text-neutral-400">
                  {r.date} • {r.time}
                </p>
                <p className="text-sm">Guests: {r.guests}</p>
              </div>

              {r.note && (
                <div className="bg-black/40 border border-neutral-700 rounded-lg p-3 text-sm">
                  <p className="text-neutral-400 mb-1">Special Request</p>
                  <p className="italic">{r.note}</p>
                </div>
              )}

              {onRefresh && (
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => confirmReservation(r)}
                    className="flex-1 bg-green-600 hover:bg-green-700 py-2 rounded font-medium"
                  >
                    Confirm & WhatsApp
                  </button>

                  <button
                    onClick={() => deleteReservation(r._id)}
                    className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
