import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { readFileSync } from "node:fs";

/**
 * 站点身份来自仓库根的 site.json —— 全站 URL 的单一事实源。
 * GitHub Pages 项目站：url = https://<user>.github.io, base = /<repo>
 * 独立域名：       url = https://weedui.dev,          base = /
 */
const site = JSON.parse(
  readFileSync(new URL("../../site.json", import.meta.url), "utf8")
);

export default defineConfig({
  site: site.url,
  base: site.base,
  trailingSlash: "ignore",
  integrations: [react(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
