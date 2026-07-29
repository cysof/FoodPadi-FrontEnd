import { MetadataRoute } from "next";

export default function sitemap():MetadataRoute.Sitemap{
  return [{
    url: `https://farmride.com.ng/`,
    lastModified: new Date(),
  }]
}