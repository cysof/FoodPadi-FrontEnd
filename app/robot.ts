import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/"],
      disallow: [],
    },
    sitemap: `https://foodbank-theta.vercel.app/sitemap.xml`,
  };
}
