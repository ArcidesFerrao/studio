import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/login",
        "/admin",
        "/api/",
      ],
    },
    sitemap: "https://webstudio.evolurelabs.com/sitemap.xml",
  };
}