import { createFileRoute } from "@tanstack/react-router";
import { SERVICES } from "@/lib/services-data";

const SITE_URL = "https://www.maidforliving.com";

const STATIC_PATHS = [
  { path: "/", priority: "1.0", freq: "weekly" },
  { path: "/services", priority: "0.9", freq: "weekly" },
  { path: "/pricing", priority: "0.9", freq: "weekly" },
  { path: "/book", priority: "0.9", freq: "monthly" },
  { path: "/about", priority: "0.7", freq: "monthly" },
  { path: "/service-areas", priority: "0.8", freq: "monthly" },
  { path: "/cleaning-checklist", priority: "0.6", freq: "monthly" },
  { path: "/faq", priority: "0.6", freq: "monthly" },
  { path: "/contact", priority: "0.7", freq: "monthly" },
  { path: "/privacy-policy", priority: "0.3", freq: "yearly" },
  { path: "/terms", priority: "0.3", freq: "yearly" },
];

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const entries = [
          ...STATIC_PATHS,
          ...SERVICES.map((s) => ({ path: `/services/${s.slug}`, priority: "0.8", freq: "monthly" })),
        ];
        const body =
          `<?xml version="1.0" encoding="UTF-8"?>\n` +
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
          entries
            .map(
              (e) =>
                `  <url><loc>${SITE_URL}${e.path}</loc><changefreq>${e.freq}</changefreq><priority>${e.priority}</priority></url>`,
            )
            .join("\n") +
          `\n</urlset>\n`;
        return new Response(body, {
          headers: { "content-type": "application/xml; charset=utf-8", "cache-control": "public, max-age=3600" },
        });
      },
    },
  },
});
