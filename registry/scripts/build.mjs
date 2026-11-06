/**
 * registry:build — embed source file contents into registry item JSONs
 * and emit them to apps/web/public/r/ (served at <site>/r/*).
 *
 * Equivalent to `npx shadcn registry:build`, but monorepo-aware and
 * deterministic: single script, no interactive CLI, correct output dir.
 *
 * Every registry:ui item is made SELF-CONTAINED: utils + the four theme
 * css files are injected alongside the component, so
 * `npx shadcn add <site>/r/button.json` works with zero
 * pre-configuration. Files are idempotent — installing multiple
 * components re-writes identical shared files, no drift.
 *
 * <site> comes from the repo-root site.json — the single source of truth
 * for every URL in this project.
 */
import { readFileSync, writeFileSync, mkdirSync, rmSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const outDir = resolve(root, "apps/web/public/r");

/** 站点身份 —— 单一事实源 */
const site = JSON.parse(readFileSync(resolve(root, "site.json"), "utf8"));
const SITE_ROOT = `${site.url}${site.base === "/" ? "" : site.base}`;
const abs = (p) => `${SITE_ROOT}${p}`;

const registry = JSON.parse(
  readFileSync(resolve(root, "registry/registry.json"), "utf8")
);

/** 组件目录 —— registry/catalog.json 是单一事实源 */
const catalog = JSON.parse(
  readFileSync(resolve(root, "registry/catalog.json"), "utf8")
);
const bySlug = new Map(catalog.items.map((c) => [c.slug, c]));

/** 从目录里取出 title / description / categories / meta */
function docMeta(item) {
  if (item.type !== "registry:ui") return {};
  const doc = bySlug.get(item.name);
  if (!doc) return {};
  return {
    title: doc.title,
    description: doc.description,
    categories: [doc.category.toLowerCase()],
    meta: {
      status: doc.status,
      category: doc.category,
      signature: doc.signature ?? false,
      alsoCalled: doc.alsoCalled ?? [],
      whenToUse: doc.whenToUse ?? [],
      insteadOf: doc.insteadOf ?? [],
      anatomy: doc.anatomy ?? [],
      variants: doc.variants ?? [],
      api: doc.api ?? [],
      docs: abs(`/docs/components/${doc.slug}`),
      markdown: abs(`/docs/components/${doc.slug}.md`),
    },
  };
}

const read = (p) => readFileSync(resolve(root, p), "utf8");

// shared files injected into every registry:ui item (self-contained installs)
const SHARED = [
  {
    path: "registry/lib/utils.ts",
    target: "lib/utils.ts",
    type: "registry:lib",
  },
  {
    path: "packages/tokens/src/tokens.css",
    target: "styles/weed-ui/tokens.css",
    type: "registry:theme",
  },
  {
    path: "packages/tokens/src/fonts.css",
    target: "styles/weed-ui/fonts.css",
    type: "registry:theme",
  },
  {
    path: "packages/tokens/src/blueprint.css",
    target: "styles/weed-ui/blueprint.css",
    type: "registry:theme",
  },
  {
    path: "packages/tokens/src/tailwind.css",
    target: "styles/weed-ui/tailwind.css",
    type: "registry:theme",
  },
];

rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });

const built = [];

for (const item of registry.items) {
  const extra = item.type === "registry:ui" ? SHARED : [];
  const files = [...(item.files ?? []), ...extra].map((f) => ({
    ...f,
    content: read(f.path),
  }));

  const meta = docMeta(item);

  const json = {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: item.name,
    type: item.type,
    ...(meta.title ?? item.title ? { title: meta.title ?? item.title } : {}),
    ...(meta.description ?? item.description
      ? { description: meta.description ?? item.description }
      : {}),
    ...(meta.categories ? { categories: meta.categories } : {}),
    ...(meta.meta ? { meta: meta.meta } : {}),
    ...(item.dependencies
      ? {
          dependencies: item.dependencies,
        }
      : {}),
    files,
  };

  writeFileSync(resolve(outDir, `${item.name}.json`), JSON.stringify(json, null, 2));
  built.push(item.name);
}

// full index (for `npx shadcn search http://localhost:4321/r/registry.json`)
const index = {
  $schema: "https://ui.shadcn.com/schema/registry.json",
  name: registry.name,
  homepage: SITE_ROOT,
  items: registry.items.map((item) => {
    const meta = docMeta(item);
    return {
      $schema: "https://ui.shadcn.com/schema/registry-item.json",
      name: item.name,
      type: item.type,
      title: meta.title ?? item.title,
      description: meta.description ?? item.description,
      ...(meta.categories ? { categories: meta.categories } : {}),
      ...(meta.meta ? { meta: meta.meta } : {}),
      ...(item.dependencies ? { dependencies: item.dependencies } : {}),
      files: [
        ...(item.files ?? []),
        ...(item.type === "registry:ui" ? SHARED : []),
      ].map((f) => ({ ...f, content: read(f.path) })),
    };
  }),
};
writeFileSync(resolve(outDir, "registry.json"), JSON.stringify(index, null, 2));

console.log(`registry:build → ${built.length} items → apps/web/public/r/`);
for (const name of built) console.log(`  ✓ /r/${name}.json`);
