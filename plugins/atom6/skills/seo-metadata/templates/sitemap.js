// src/app/sitemap.js
import { site } from "@/lib/site";

const routes = ["", "/quem-somos", "/servicos", "/contato"];

export default function sitemap() {
  return routes.map((route) => ({
    url: `${site.url}${route}`,
    changeFrequency: "monthly",
    priority: route === "" ? 1 : 0.8,
  }));
}
