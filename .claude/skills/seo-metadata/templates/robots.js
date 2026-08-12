// src/app/robots.js
// Para bloquear buscadores enquanto é POC: disallow: "/" — e avise na entrega.
import { site } from "@/lib/site";

export default function robots() {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
