import { COMPONENTS, type ComponentDoc } from "./components";
import { SEMANTIC_ROWS, TYPE_ROWS, RADIUS } from "./tokens";

/**
 * 站点的纯文本孪生。
 *
 * 每个页面都有一份 .md 版本（/docs/index.md、/docs/components/button.md …），
 * 内容由这里生成，和网页版同源——网页上写的和 agent 读到的是同一份事实。
 */

const SITE = "https://weedui.dev";

const sources = import.meta.glob<string>("../../../../registry/ui/*.tsx", {
  query: "?raw",
  import: "default",
  eager: true,
});

function sourceOf(slug: string): string {
  return sources[`../../../../registry/ui/${slug}.tsx`] ?? "";
}

/** 表格单元格里的 `|` 会截断列，转义掉 */
const cell = (value: string) => value.replace(/\|/g, "\\|");

function table(headers: string[], rows: string[][]): string {
  if (rows.length === 0) return "";
  const head = `| ${headers.join(" | ")} |`;
  const sep = `| ${headers.map(() => "---").join(" | ")} |`;
  const body = rows
    .map((r) => `| ${r.map((v) => cell(v)).join(" | ")} |`)
    .join("\n");
  return `${head}\n${sep}\n${body}\n`;
}

/* ------------------------------------------------------------------ */

export function componentMarkdown(c: ComponentDoc): string {
  const out: string[] = [];

  out.push(`# ${c.title}`);
  out.push("");
  out.push(`> ${c.summary}`);
  out.push("");
  out.push(`**状态**：${c.status} · **分类**：${c.category}`);
  if (c.alsoCalled?.length) {
    out.push(`**也叫**：${c.alsoCalled.join(" / ")}`);
  }
  out.push("");
  out.push(c.description);
  out.push("");

  out.push("## 安装");
  out.push("");
  out.push("```bash");
  out.push(`npx shadcn add ${SITE}/r/${c.slug}.json`);
  out.push("```");
  out.push("");
  out.push(`页面：${SITE}/docs/components/${c.slug}`);
  out.push("");

  out.push("## 什么时候用");
  out.push("");
  for (const line of c.whenToUse) out.push(`- ${line}`);
  out.push("");

  if (c.insteadOf?.length) {
    out.push("## 什么时候别用");
    out.push("");
    out.push(
      table(
        ["别这么用", "改用"],
        c.insteadOf.map(([wrong, right]) => [wrong, right])
      )
    );
  }

  out.push("## 解剖");
  out.push("");
  for (const part of c.anatomy) out.push(`- \`${part}\``);
  out.push("");

  if (c.variants?.length) {
    out.push("## 变体");
    out.push("");
    out.push(
      table(
        ["变体", "说明"],
        c.variants.map((v) => [v.name, v.description])
      )
    );
  }

  if (c.api?.length) {
    out.push("## API");
    out.push("");
    out.push(
      table(
        ["prop", "type", "默认"],
        c.api.map((a) => [a.prop, `\`${a.type}\``, a.default ? `\`${a.default}\`` : "—"])
      )
    );
  }

  if (c.npmDeps?.length) {
    out.push("## npm 依赖");
    out.push("");
    for (const dep of c.npmDeps) out.push(`- \`${dep}\``);
    out.push("");
  }

  const src = sourceOf(c.slug);
  if (src) {
    out.push("## 源码");
    out.push("");
    out.push("```tsx");
    out.push(src.trimEnd());
    out.push("```");
    out.push("");
  }

  return out.join("\n");
}

/* ------------------------------------------------------------------ */

export function catalogMarkdown(): string {
  const out: string[] = [];
  out.push("# weed components");
  out.push("");
  out.push(
    "11 个组件，一页看完。终端 / IDE 风的 shadcn/ui registry —— 源码复制进你的仓库，落地生根。"
  );
  out.push("");
  out.push(
    table(
      ["组件", "分类", "状态", "一句话"],
      COMPONENTS.map((c) => [
        `[${c.title}](${SITE}/docs/components/${c.slug})`,
        c.category,
        c.status,
        c.summary,
      ])
    )
  );
  out.push("## 安装");
  out.push("");
  out.push("```bash");
  out.push(`npx shadcn add ${SITE}/r/button.json`);
  out.push("```");
  out.push("");
  return out.join("\n");
}

/* ------------------------------------------------------------------ */

export function installationMarkdown(): string {
  return `# 安装

## 01 · 单 URL 安装

\`\`\`bash
npx shadcn add ${SITE}/r/button.json
\`\`\`

组件自带主题 token（styles/weed-ui/*.css）、cn()（lib/utils.ts）与 npm 依赖。
前提：项目已跑 Tailwind CSS v4 并配好 @ alias。

## 02 · namespace

装三个以上再用这个。在 components.json 里加 registry：

\`\`\`json
{
  "registries": {
    "@weed-ui": "${SITE}/r/{name}.json"
  }
}
\`\`\`

\`\`\`bash
npx shadcn add @weed-ui/button
npx shadcn add @weed-ui/tabs @weed-ui/dialog
\`\`\`

## 03 · 主题

\`\`\`css
@import "tailwindcss";
@import "./styles/weed-ui/tailwind.css";   /* 或把 @theme 映射写进你的 globals */
@import "./styles/weed-ui/tokens.css";
@import "./styles/weed-ui/fonts.css";
@import "./styles/weed-ui/blueprint.css";
\`\`\`

字体文件自管：

- Departure Mono（SIL OFL 1.1，不在 fontsource / Google Fonts）——
  从 GitHub releases 下载 woff2 并随附许可文件。
- Source Serif 4（OFL）—— \`@fontsource-variable/source-serif-4\`。
- 中文走系统黑体，无需额外字体。

## 04 · 无闪烁 bootstrap

token 由 \`<html data-theme="dark|light">\` 驱动。把这段内联进 \`<head>\`，
首帧即正确主题（存过偏好则跟随偏好，否则跟随系统）：

\`\`\`js
<script>
  (function () {
    var t;
    try { t = localStorage.getItem("weed-theme"); } catch (e) {}
    if (t !== "light" && t !== "dark") {
      t = window.matchMedia("(prefers-color-scheme: light)")
        .matches ? "light" : "dark";
    }
    document.documentElement.dataset.theme = t;
  })();
</script>
\`\`\`

然后放上 ThemeToggle，完事。深浅主题语义 token 全覆盖，组件层零改动。
`;
}

/* ------------------------------------------------------------------ */

export function themingMarkdown(): string {
  const out: string[] = [];
  out.push("# 主题与 Token");
  out.push("");
  out.push(
    "单一事实源在 packages/tokens/tokens.json（DTCG 格式）。OKLCH 三档，双主题，三种输出形态（CSS vars / Tailwind v4 preset / tweakcn JSON）。"
  );
  out.push("");

  out.push("## 字号阶梯");
  out.push("");
  out.push(table(["token", "size", "用途"], TYPE_ROWS.map((r) => [r.token, r.size, r.usage])));
  out.push(
    "字体栈：拉丁用 Departure Mono（像素等宽），中文回落 PingFang SC 等系统黑体——永不落到宋体。Source Serif 4 只留给引文与 hero 强调词。"
  );
  out.push("");

  out.push("## 语义 token");
  out.push("");
  out.push(
    table(
      ["token", "CSS 变量", "dark", "light", "用途"],
      SEMANTIC_ROWS.map((r) => [
        r.name,
        `\`${r.cssVar}\``,
        r.dark.hex ?? r.dark.value,
        r.light.hex ?? r.light.value,
        r.usage,
      ])
    )
  );

  out.push("## 三档结构");
  out.push("");
  out.push("```css");
  out.push("/* 1. primitive — 原料色，主题无关 */");
  out.push(":root {");
  out.push("  --w-ink-900: oklch(0.179 0.005 67.5);   /* #13110f 暖黑 */");
  out.push("  --w-slate-950: oklch(0.263 0.023 259.3); /* #1e2530 灰蓝 */");
  out.push("  --w-blue: oklch(0.683 0.087 245.2);      /* #6a9fcc accent */");
  out.push("}");
  out.push("");
  out.push("/* 2. semantic — shadcn 标准名，双主题 */");
  out.push(':root, [data-theme="dark"] { --background: oklch(0.145 0.004 67.5); ... }');
  out.push('[data-theme="light"]        { --background: oklch(0.951 0.016 82.8); ... }');
  out.push("");
  out.push("/* 3. component — 组件层组合 */");
  out.push(":root {");
  out.push("  --w-c-button-bg: var(--panel);");
  out.push("  --w-c-prompt: var(--sage);");
  out.push(`  --w-radius: ${RADIUS.value}${RADIUS.unit};`);
  out.push("}");
  out.push("```");
  out.push("");
  out.push(
    "OKLCH 值由锚点 hex 经 scripts/hex-to-oklch.mjs 换算，改色永远走「改锚点 → 跑脚本 → 回填」，可追溯到设计稿。Tailwind v4 项目在 tailwind.css 有完整的 @theme inline 映射。"
  );
  out.push("");
  out.push("## tweakcn");
  out.push("");
  out.push(
    "只薅主题不装组件也完全可以——tweakcn 兼容 JSON 已备好（packages/tokens/src/tweakcn/ 下的 dark / light 两份）。野草不挑土。"
  );
  out.push("");
  return out.join("\n");
}

/* ------------------------------------------------------------------ */

export function overviewMarkdown(): string {
  const out: string[] = [];
  out.push("# 野草使用手册");
  out.push("");
  out.push(
    "weed 不发 npm 包。源码通过 shadcn registry 复制进你的仓库，落地之后归你所有——想删组件直接删文件，想改样式直接改源码。这就是全部的 API。"
  );
  out.push("");
  out.push("## quick start");
  out.push("");
  out.push("```bash");
  out.push(`npx shadcn add ${SITE}/r/button.json`);
  out.push("```");
  out.push("");
  out.push(
    "每个组件自包含：主题 token 与 cn() 工具随组件一起落地，单 URL 安装零配置。装三个以上建议改用 namespace，见 installation。"
  );
  out.push("");
  out.push("## components");
  out.push("");
  out.push(
    table(
      ["组件", "分类", "状态", "一句话"],
      COMPONENTS.map((c) => [
        `[${c.title}](${SITE}/docs/components/${c.slug})`,
        c.category,
        c.status,
        c.summary,
      ])
    )
  );
  out.push("## design language");
  out.push("");
  out.push(
    "等宽字面、暖暗大地色、蓝图网格——识别度的来源与定制入口见 theming。改动原则记录在仓库的 design/principles.md。"
  );
  out.push("");
  return out.join("\n");
}

/* ------------------------------------------------------------------ */

export function llmsFullMarkdown(): string {
  const out: string[] = [];
  out.push("# weed-ui — full documentation");
  out.push("");
  out.push(
    "components that grow anywhere. 终端 / IDE 风的 shadcn/ui registry。等宽字面、暖暗大地色、蓝图网格、1px 内描边。源码复制进你的仓库，落地生根，归你所有。"
  );
  out.push("");
  out.push("## 安装");
  out.push("");
  out.push("```bash");
  out.push(`npx shadcn add ${SITE}/r/button.json`);
  out.push("```");
  out.push("");
  out.push("每个组件自包含：主题 token、cn()、npm 依赖随组件一起落地，单 URL 安装零配置。");
  out.push("");

  out.push("---");
  out.push("");
  out.push(overviewMarkdown().replace(/^# .*\n\n/, ""));
  out.push("---");
  out.push("");
  out.push(installationMarkdown().replace(/^# .*\n\n/, ""));
  out.push("---");
  out.push("");
  out.push(themingMarkdown().replace(/^# .*\n\n/, ""));
  out.push("---");
  out.push("");
  out.push("## 组件");
  out.push("");
  for (const c of COMPONENTS) {
    out.push(componentMarkdown(c).replace(/^# .*\n\n/, "### "));
    out.push("---");
    out.push("");
  }
  return out.join("\n");
}
