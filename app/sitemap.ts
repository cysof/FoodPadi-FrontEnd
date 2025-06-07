import { MetadataRoute } from "next";

export default function sitemap():MetadataRoute.Sitemap{
  return [{
    url: `https://iucglobalchambers.com`,
    lastModified: new Date(),
  }]
}