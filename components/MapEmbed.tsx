"use client";

const MAP_EMBED_URL =
  "https://www.google.com/maps?q=Level%20Four%20Rooftop%20Restaurant&output=embed";

export default function MapEmbed() {
  return (
    <div className="w-full aspect-[4/3] min-h-[280px] rounded-xl border border-neutral-800 overflow-hidden bg-neutral-900">
      <iframe
        src={MAP_EMBED_URL}
        title="L4 Rooftop Restaurant on Google Maps"
        className="w-full h-full border-0"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}
