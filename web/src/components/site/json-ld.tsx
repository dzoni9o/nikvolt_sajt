import { site } from "@/lib/site-config";

export function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Electrician",
    name: site.name,
    url: site.url,
    telephone: site.phoneTel,
    email: site.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address,
      addressLocality: site.city,
      addressCountry: site.country,
    },
    areaServed: site.coverage.map((c) => ({ "@type": "City", name: c })),
    openingHours: ["Mo-Fr 08:00-22:00", "Sa 09:00-20:00"],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "180",
    },
    sameAs: [site.socials.instagram, site.socials.facebook],
  };

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
