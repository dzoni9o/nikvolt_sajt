import type { MetadataRoute } from "next";
import { site } from "@/lib/site-config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // The admin area is already auth-gated and carries a noindex meta tag;
      // this is belt and braces so the URLs never enter the crawl queue.
      disallow: ["/uvid", "/uvid/", "/api/"],
    },
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
