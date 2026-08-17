import type { MetadataRoute } from "next";
import { readdirSync } from "node:fs";
import { join, relative } from "node:path";

const SITE_URL = "https://moyomoyo.vercel.app";
const LAST_MODIFIED = new Date("2026-08-14T00:00:00+09:00");

function findPageFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = join(directory, entry.name);
    if (entry.isDirectory()) return findPageFiles(entryPath);
    return entry.isFile() && entry.name === "page.tsx" ? [entryPath] : [];
  });
}

function routeFromPagePath(pagePath: string): string | null {
  const segments = pagePath
    .replace(/^\.\//, "")
    .replace(/(^|\/)page\.tsx$/, "")
    .split("/")
    .filter(Boolean)
    .filter((segment) => !(segment.startsWith("(") && segment.endsWith(")")));

  if (segments.some((segment) => segment.startsWith("[") || segment.startsWith("@") || segment.startsWith("_"))) {
    return null;
  }

  const route = `/${segments.join("/")}`;
  return route === "/" || (!route.startsWith("/admin") && !route.startsWith("/api")) ? route : null;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const appDirectory = join(process.cwd(), "app");
  const routes = findPageFiles(appDirectory)
    .map((pagePath) => `./${relative(appDirectory, pagePath)}`)
    .map(routeFromPagePath)
    .filter((route): route is string => route !== null)
    .sort();

  return routes.map((route) => ({
    url: new URL(route, SITE_URL).toString(),
    lastModified: LAST_MODIFIED,
  }));
}
