import catalog from "../../../../registry/catalog.json";

/**
 * 组件目录 —— 数据在 registry/catalog.json（单一事实源）。
 * 这里只做类型化与便捷导出：站点、registry 元数据、agent 索引读的是同一份。
 */

export interface VariantDoc {
  name: string;
  description: string;
}

export interface ApiDoc {
  prop: string;
  type: string;
  default?: string;
}

export interface ComponentDoc {
  /** url slug, also the registry item name */
  slug: string;
  title: string;
  /** one-line summary, shown under the title */
  summary: string;
  /** longer description */
  description: string;
  /** group in the sidebar */
  category: "Actions" | "Forms" | "Display" | "Overlays" | "Feedback" | "Layout";
  /** maturity */
  status: "stable" | "beta";
  /** alternative names people search for */
  alsoCalled?: string[];
  /** when to use / when not to use */
  whenToUse: string[];
  /** wrong choice → right choice */
  insteadOf?: [string, string][];
  /** exported parts */
  anatomy: string[];
  variants?: VariantDoc[];
  npmDeps?: string[];
  signature?: boolean;
  api?: ApiDoc[];
}

export const COMPONENTS = catalog.items as ComponentDoc[];

export const getComponent = (slug: string) =>
  COMPONENTS.find((c) => c.slug === slug);

export const CATEGORIES = [
  "Actions",
  "Forms",
  "Display",
  "Layout",
  "Overlays",
  "Feedback",
] as const;
