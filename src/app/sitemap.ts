import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://qrcode.caetano.pt/",
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
