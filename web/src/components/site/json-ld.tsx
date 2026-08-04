import { getTranslations } from "next-intl/server";
import { site } from "@/lib/site-config";

export async function JsonLd() {
  const t = await getTranslations("JsonLd");
  const data = {
    "@context": "https://schema.org",
    "@type": t("businessType"),
    name: site.name,
    url: site.url,
    telephone: site.phoneTel,
    email: site.email,
    address: {
      "@type": "PostalAddress",
      addressLocality: site.city,
      addressCountry: site.country,
    },
    areaServed: site.coverage.map((c) => ({ "@type": "City", name: c })),
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "00:00",
      closes: "23:59",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "180",
    },
    sameAs: [site.socials.instagram, site.socials.tiktok],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
