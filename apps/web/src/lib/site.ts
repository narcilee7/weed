import site from "../../../../site.json";

/**
 * 站点身份 —— 来自仓库根的 `site.json`。
 *
 * 全站所有绝对 URL（canonical / sitemap / 安装命令 / registry 元数据 /
 * agent 索引）都从这里推导。换域名或换部署路径，只改 site.json 一处。
 */

/** origin，不含 base */
export const ORIGIN = site.url as string;

/** base 前缀：GitHub Pages 项目站是 "/weed"，独立域名是 "" */
export const BASE = site.base === "/" ? "" : (site.base as string);

/** 站内路径 → 带 base 的站内路径 */
export const withBase = (path: string): string => `${BASE}${path}`;

/** 带 base 的路径 → 干净的站内路径（用于比对路由） */
export const stripBase = (path: string): string => {
  if (!BASE) return path;
  if (path === BASE) return "/";
  return path.startsWith(`${BASE}/`) ? path.slice(BASE.length) : path;
};

/** 站内路径 → 绝对 URL */
export const absolute = (path: string): string => `${ORIGIN}${withBase(path)}`;

/** registry item 的绝对 URL */
export const registryUrl = (name: string): string => absolute(`/r/${name}.json`);

/** `npx shadcn add <url>` */
export const installCmd = (name: string): string =>
  `npx shadcn add ${registryUrl(name)}`;

/** namespace registry 模板（components.json 的 registries 字段） */
export const registryTemplate = absolute("/r/{name}.json");

/** 站点根的绝对 URL（registry homepage 用） */
export const SITE_ROOT = `${ORIGIN}${BASE}`;
