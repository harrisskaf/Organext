import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const lastModified = new Date();
  return [
    { url: base, lastModified, changeFrequency: "monthly", priority: 1 },
    { url: `${base}/politiki-aporritou`, lastModified, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/oroi-chrisis`, lastModified, changeFrequency: "yearly", priority: 0.3 },
  ];
}
