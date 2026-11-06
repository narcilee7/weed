/**
 * weed token pipeline — tokens.json 是单一事实源，这里把它编译成：
 *
 *   src/tokens.css        三档 CSS 变量（primitive / semantic / component）
 *   src/fonts.css         字体栈与尺度
 *   src/tailwind.css      Tailwind v4 `@theme inline` 映射
 *   src/tweakcn/*.json    tweakcn 兼容主题导出
 *
 * 用法：
 *   node scripts/build-tokens.mjs           生成
 *   node scripts/build-tokens.mjs --check   只检查是否过期（CI 用），过期则 exit 1
 *
 * 改色流程：改 tokens.json → pnpm tokens:build → 提交生成物。
 * tokens.json 里每个 oklch 值都带 hex 锚点，可用 scripts/oklch-to-hex.mjs 复核。
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..");
const CHECK_ONLY = process.argv.includes("--check");

/* ------------------------------------------------------------------ */
/* 读取 + 展开                                                         */
/* ------------------------------------------------------------------ */

const source = JSON.parse(readFileSync(join(ROOT, "tokens.json"), "utf8"));

/** 扁平化 token 树 → [{ path, cssVar, value, description }] */
const entries = new Map();

function walk(node, path, inheritedType) {
  if (node === null || typeof node !== "object") return;
  if ("$value" in node) {
    entries.set(path, {
      path,
      cssVar: node.$cssVar ?? null,
      value: node.$value,
      type: node.$type ?? inheritedType,
    });
    return;
  }
  const type = node.$type ?? inheritedType;
  for (const [key, child] of Object.entries(node)) {
    if (key.startsWith("$")) continue;
    walk(child, path ? `${path}.${key}` : key, type);
  }
}
walk(source, "", undefined);

/* ------------------------------------------------------------------ */
/* 值格式化                                                            */
/* ------------------------------------------------------------------ */

const num = (n, digits) => String(Number(n.toFixed(digits)));

function formatColor(value) {
  if (typeof value === "string") return value;
  const { colorSpace, components, alpha = 1 } = value;
  if (colorSpace !== "oklch") {
    throw new Error(`只支持 oklch 色值，收到 ${colorSpace}`);
  }
  const [l, c, h] = components;
  const base = `oklch(${num(l, 3)} ${num(c, 3)} ${num(h, 1)})`;
  return alpha === 1 ? base : `${base} / ${alpha}`;
}

function formatDimension(value) {
  if (typeof value === "string") return value;
  const { value: v, unit = "" } = value;
  return `${v}${unit}`;
}

/** 值的 CSS 文本（不解引用别名） */
function formatValue(entry) {
  if (typeof entry.value === "string" && entry.value.startsWith("{")) {
    return `var(${resolveTarget(entry.value.slice(1, -1)).cssVar})`;
  }
  if (entry.type === "color") return formatColor(entry.value);
  if (entry.type === "dimension") return formatDimension(entry.value);
  return String(entry.value);
}

/** 值的字面量文本（解开全部别名，用于 tweakcn 导出） */
function literalValue(entry, seen = new Set()) {
  if (typeof entry.value === "string" && entry.value.startsWith("{")) {
    const path = entry.value.slice(1, -1);
    if (seen.has(path)) throw new Error(`别名成环: ${path}`);
    seen.add(path);
    return literalValue(resolveTarget(path), seen);
  }
  if (entry.type === "color") return formatColor(entry.value);
  if (entry.type === "dimension") return formatDimension(entry.value);
  return String(entry.value);
}

function resolveTarget(path) {
  const target = entries.get(path);
  if (!target) throw new Error(`别名指向不存在的 token: {${path}}`);
  return target;
}

/* ------------------------------------------------------------------ */
/* CSS 组装                                                            */
/* ------------------------------------------------------------------ */

const at = (path) => {
  const entry = entries.get(path);
  if (!entry) throw new Error(`缺少 token: ${path}`);
  return entry;
};

/** 组的子 key（跳过 $description / $type 这类元信息） */
const childKeys = (obj) => Object.keys(obj).filter((k) => !k.startsWith("$"));

const decl = (entry, indent = "  ") => {
  const cssVar = entry.cssVar;
  if (!cssVar) throw new Error(`token ${entry.path} 缺少 $cssVar`);
  const value = formatValue(entry);
  const hex = entry.value?.hex ? ` /* ${entry.value.hex} */` : "";
  return `${indent}${cssVar}: ${value};${hex}`;
};

const BANNER = `/**
 * GENERATED FILE — 请勿手改。
 * source: packages/tokens/tokens.json
 * build:  pnpm tokens:build
 */`;

/* --- tokens.css --- */

const PRIMITIVE_LABELS = {
  ink: "warm ink scale",
  bone: "bone scale",
  slate: "slate-blue panel scale",
  blue: "signal hues",
  ochre: "signal hues",
  wheat: "signal hues",
  sage: "signal hues",
};

function buildTokensCss() {
  const out = [];
  out.push(BANNER);
  out.push("");
  out.push("/* ------------------------------------------------------------------ */");
  out.push("/* Tier 1 · primitives — 原料色                                        */");
  out.push("/* ------------------------------------------------------------------ */");
  out.push(":root {");
  let lastLabel = null;
  for (const [family, label] of Object.entries(PRIMITIVE_LABELS)) {
    if (label !== lastLabel) {
      out.push(`  /* ${label} */`);
      lastLabel = label;
    }
    for (const step of childKeys(source.color.primitive[family])) {
      out.push(decl(at(`color.primitive.${family}.${step}`)));
    }
    out.push("");
  }
  out.push("}");
  out.push("");

  out.push("/* ------------------------------------------------------------------ */");
  out.push("/* Tier 2 · semantic — 双主题                                          */");
  out.push("/* ------------------------------------------------------------------ */");
  out.push("");

  out.push("/* dark（默认）—— IDE 感：底更暗，面板实心，hairline 看得见 */");
  out.push(":root,");
  out.push('[data-theme="dark"] {');
  out.push(`  color-scheme: ${at("css.schemeDark").value};`);
  out.push("");
  for (const path of childKeys(source.color.semantic.dark)) {
    out.push(decl(at(`color.semantic.dark.${path}`)));
  }
  out.push("");
  out.push("  /* 蓝图网格：降噪到「能感觉到但看不见」的密度 */");
  for (const path of ["gridMinorDark", "gridMajorDark", "gridDotDark", "gridFadeDark"]) {
    out.push(decl(at(`css.${path}`)));
  }
  out.push("}");
  out.push("");

  out.push("/* light：parchment（终端的「纸」模式） */");
  out.push('[data-theme="light"] {');
  out.push(`  color-scheme: ${at("css.schemeLight").value};`);
  out.push("");
  for (const path of childKeys(source.color.semantic.light)) {
    out.push(decl(at(`color.semantic.light.${path}`)));
  }
  out.push("");
  for (const path of ["gridMinorLight", "gridMajorLight", "gridDotLight"]) {
    out.push(decl(at(`css.${path}`)));
  }
  out.push("}");
  out.push("");

  out.push("/* ------------------------------------------------------------------ */");
  out.push("/* Tier 3 · component — 组件层                                         */");
  out.push("/* ------------------------------------------------------------------ */");
  out.push(":root {");
  for (const group of childKeys(source.color.component)) {
    const node = source.color.component[group];
    if ("$value" in node) {
      out.push(decl(at(`color.component.${group}`)));
      out.push("");
      continue;
    }
    out.push(`  /* ${group} */`);
    for (const path of childKeys(node)) {
      out.push(decl(at(`color.component.${group}.${path}`)));
    }
    out.push("");
  }
  for (const path of ["selection", "hairline", "hairlineStrong"]) {
    out.push(decl(at(`css.${path}`)));
  }
  out.push("");
  out.push("  /* radius — IDE 风：更方 */");
  out.push(decl(at("dimension.radius.default")));
  out.push(decl(at("dimension.radius.sm")));
  out.push("}");
  out.push("");

  return out.join("\n");
}

/* --- fonts.css --- */

function buildFontsCss() {
  const out = [];
  out.push(BANNER);
  out.push("");
  out.push("/* mono 是主字体，不是配角 —— 界面、数据、标签、正文（中文）全走 mono 体系 */");
  out.push("/* 中文永不落到宋体：Latin 用 Departure Mono，中文回落 PingFang SC 等系统黑体 */");
  out.push("/* 衬线只做一件事：少量拉丁引文与 hero 强调词 */");
  out.push("");
  out.push(":root {");
  out.push(decl(at("css.fontMono")));
  out.push(decl(at("css.fontSerif")));
  out.push("");
  out.push("  /* 终端 / IDE 型尺度：紧凑、小字号、高密度 */");
  for (const path of childKeys(source.dimension.text)) {
    out.push(decl(at(`dimension.text.${path}`)));
  }
  out.push("");
  out.push(decl(at("dimension.tracking.label")));
  out.push(decl(at("dimension.leading.prose")));
  out.push(decl(at("dimension.leading.ui")));
  out.push("}");
  out.push("");
  return out.join("\n");
}

/* --- tailwind.css --- */

function buildTailwindCss() {
  const out = [];
  out.push(BANNER);
  out.push("");
  out.push("/* Usage:");
  out.push(' *   @import "tailwindcss";');
  out.push(' *   @import "@weed/tokens/tailwind.css";   ← this file');
  out.push(" * 颜色全部指向语义变量，data-theme 切换零配置。");
  out.push(" */");
  out.push("");
  out.push("@theme inline {");
  out.push("  /* shadcn-compatible surface */");
  for (const path of [
    "background",
    "foreground",
    "card",
    "cardForeground",
    "popover",
    "popoverForeground",
    "primary",
    "primaryForeground",
    "secondary",
    "secondaryForeground",
    "muted",
    "mutedForeground",
    "accent",
    "accentForeground",
    "destructive",
    "destructiveForeground",
    "border",
    "input",
    "ring",
  ]) {
    out.push(decl(at(`tailwind.${path}`)));
  }
  out.push("");
  out.push("  /* weed extensions */");
  for (const path of [
    "panel",
    "panelSoft",
    "panelForeground",
    "line",
    "lineStrong",
    "ochre",
    "wheat",
    "sage",
  ]) {
    out.push(decl(at(`tailwind.${path}`)));
  }
  out.push("");
  out.push("  /* fonts */");
  out.push(decl(at("tailwind.fontMono")));
  out.push(decl(at("tailwind.fontSerif")));
  out.push("");
  out.push("  /* radii — small, engineering-manual */");
  out.push(decl(at("tailwind.radiusSm")));
  out.push(decl(at("tailwind.radiusMd")));
  out.push(decl(at("tailwind.radiusLg")));
  out.push("}");
  out.push("");
  return out.join("\n");
}

/* --- tweakcn 导出 --- */

function buildTweakcn(theme) {
  const radius = at("dimension.radius.default").value;
  const rem = `${Number((radius.value / 16).toFixed(4))}rem`;
  const cssVars = {};
  for (const [name, node] of Object.entries(source.theme[theme])) {
    if (!node || typeof node !== "object" || !("$value" in node)) continue;
    const entry = entries.get(`theme.${theme}.${name}`);
    cssVars[name] = literalValue(entry);
  }
  return {
    name: at(`theme.meta.${theme}.name`).value,
    label: at(`theme.meta.${theme}.label`).value,
    radius: rem,
    cssVars: { [theme]: cssVars },
  };
}

/* --- themes.json — 站点与 agent 共用的机器可读视图 --- */

/** 顺着别名链找到最后的字面量 token */
function resolveChain(entry, seen = new Set()) {
  if (typeof entry.value === "string" && entry.value.startsWith("{")) {
    const path = entry.value.slice(1, -1);
    if (seen.has(path)) throw new Error(`别名成环: ${path}`);
    seen.add(path);
    return resolveChain(resolveTarget(path), seen);
  }
  return entry;
}

function buildThemes() {
  const themes = {};
  for (const theme of ["dark", "light"]) {
    const list = {};
    for (const name of childKeys(source.color.semantic[theme])) {
      const entry = at(`color.semantic.${theme}.${name}`);
      const terminal = resolveChain(entry);
      list[name] = {
        cssVar: entry.cssVar,
        value: literalValue(entry),
        hex: terminal.value?.hex ?? null,
      };
    }
    themes[theme] = list;
  }

  const type = {};
  for (const name of childKeys(source.dimension.text)) {
    type[name] = formatDimension(at(`dimension.text.${name}`).value);
  }

  const radius = at("dimension.radius.default").value;

  return {
    $description:
      "weed 主题的机器可读视图。由 packages/tokens/tokens.json 生成，供站点与 agent 共用。",
    radius: { value: radius.value, unit: radius.unit },
    type,
    themes,
  };
}

/* ------------------------------------------------------------------ */
/* 写出                                                                */
/* ------------------------------------------------------------------ */

const outputs = [
  ["src/tokens.css", buildTokensCss()],
  ["src/fonts.css", buildFontsCss()],
  ["src/tailwind.css", buildTailwindCss()],
  ["src/themes.json", `${JSON.stringify(buildThemes(), null, 2)}\n`],
  ["src/tweakcn/dark.json", `${JSON.stringify(buildTweakcn("dark"), null, 2)}\n`],
  ["src/tweakcn/light.json", `${JSON.stringify(buildTweakcn("light"), null, 2)}\n`],
];

let stale = 0;
for (const [rel, content] of outputs) {
  const path = join(ROOT, rel);
  const current = existsSync(path) ? readFileSync(path, "utf8") : null;
  if (current === content) {
    console.log(`  ✓ ${rel}`);
    continue;
  }
  if (CHECK_ONLY) {
    console.log(`  ✗ ${rel} — 已过期，跑 pnpm tokens:build`);
    stale++;
    continue;
  }
  writeFileSync(path, content);
  console.log(`  ✓ ${rel} ${current === null ? "(新建)" : "(更新)"}`);
}

if (stale > 0) {
  console.error(`\n${stale} 个生成物过期。`);
  process.exit(1);
}
