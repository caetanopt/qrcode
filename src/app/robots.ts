import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/gerador", "/edit"] },
    ],
    sitemap: "https://qrcode.caetano.pt/sitemap.xml",
  };
}
