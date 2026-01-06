export default function StructuredData() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "name": "L4 – Level Four Rooftop Restaurant",
    "image": "https://l4rooftop.com/gallery/ambience/a1.jpg",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Power House Quarter Complex",
      "addressLocality": "Dharmanagar",
      "addressRegion": "Tripura",
      "postalCode": "799250",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "24.3792",
      "longitude": "92.1627"
    },
    "servesCuisine": [
      "Indian",
      "Continental",
      "Chinese"
    ],
    "priceRange": "₹₹",
    "openingHours": "Mo-Su 17:30-23:30",
    "url": "https://l4rooftop.com",
    "acceptsReservations": true
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd),
      }}
    />
  );
}
