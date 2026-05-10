import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog";
import { site } from "@/lib/site-config";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${site.url}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${site.url}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    ...getAllPosts().map((p) => ({
      url: `${site.url}/blog/${p.slug}`,
      lastModified: new Date(p.date),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
