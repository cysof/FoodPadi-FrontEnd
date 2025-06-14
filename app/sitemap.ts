import { MetadataRoute } from "next";

export default function sitemap():MetadataRoute.Sitemap{
  return [{
    url: `https://foodbank-theta.vercel.app/`,
    lastModified: new Date(),
  }]
}