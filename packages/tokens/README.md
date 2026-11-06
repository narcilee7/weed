# @weed/tokens — 设计语言单一事实源

> weed 的地基，先于一切组件代码。产品站、文档站、组件三方共用这一份。

## 单一事实源：`tokens.json`

`tokens.json`（DTCG 2025.10 格式）是唯一的源。CSS、Tailwind preset、tweakcn 导出
都是**生成物**，由 `scripts/build-tokens.mjs` 编译出来：

```sh
pnpm tokens:build    # 生成
pnpm tokens:check    # 只检查是否过期（CI 用），过期则 exit 1
```

生成物：

| 产物 | 用途 |
|---|---|
| `src/tokens.css` | 三档 CSS 变量 |
| `src/fonts.css` | 字体栈与尺度 |
| `src/tailwind.css` | Tailwind v4 `@theme inline` 映射 |
| `src/themes.json` | 机器可读的主题视图（站点与 agent 共用） |
| `src/tweakcn/{dark,light}.json` | tweakcn 主题市场导出 |

改色流程：**改 `tokens.json` → `pnpm tokens:build` → 提交生成物**。
生成物顶部有 GENERATED 标记，不要手改。

## 签名三件套（识别度来源）

1. **等宽字面** — Departure Mono（像素等宽）负责拉丁与数据，中文回落系统黑体（PingFang SC / 微软雅黑），**永不落到宋体**。Source Serif 4 只留给拉丁引文与 hero 强调词。
2. **暖暗大地色** — 暖黑底 `#0b0a08` + 灰蓝实底面板 `#1e2530` + 赭石/麦黄/鼠尾草绿点缀，主 accent 低饱和蓝 `#6a9fcc`。浅色主题为羊皮纸纸感 `#f4eee3`。
3. **工程肌理** — blueprint 蓝图网格（20px 小格 + 100px 双档粗线 + 交叉点 accent 点 + 径向渐隐）、hairline 用 box-shadow 实现（非 border）、圆角上限 3px。

## Token 三档

| 层 | 前缀 | 内容 | 说明 |
|---|---|---|---|
| primitive | `--w-` | `ink-*` `bone-*` `slate-*` 色阶 + `ochre` `wheat` `sage` `blue` 原料色 | 主题无关，纯原料 |
| semantic | shadcn 标准名 | `background` `foreground` `panel` `line` `primary` `muted` … | 双主题各一套；与 shadcn/tailwind 生态直接互通 |
| component | `--w-c-` | `button-*` `input-*` `badge-*` `code-*` `chrome` `prompt` `caret` | 组件层组合，随组件库增长 |

## OKLCH + hex 锚点

色值用 OKLCH 存，但每个值都带 hex 锚点，双向可换算：

```sh
node scripts/hex-to-oklch.mjs '#13110f' '#252f3d' '#6a9fcc'
# → oklch(0.179 0.005 67.5) / oklch(0.302 0.029 256.8) / oklch(0.683 0.087 245.2)

node scripts/oklch-to-hex.mjs 'oklch(0.179 0.005 67.5)'
# → #13110f
```

改色永远走「改锚点 → 跑脚本 → 回填」，保证色值可追溯到设计稿。

## 双主题机制

- dark 为默认（`:root` + `[data-theme="dark"]`），light 走 `[data-theme="light"]`（parchment）。
- 切换由消费方在 `<html data-theme>` 上驱动，配合 localStorage 与 `prefers-color-scheme`；参考 `apps/web/src/layouts/Base.astro`（无闪烁内联 bootstrap）。
- `color-scheme` 属性随主题同步，保证原生控件（滚动条、表单）跟色。
- 组件代码里不允许出现任何主题判断——切主题只换变量。

## 用法

```css
@import "@weed/tokens/tokens.css";
@import "@weed/tokens/fonts.css";
@import "@weed/tokens/blueprint.css";
/* 可选：Tailwind v4 项目 */
@import "tailwindcss";
@import "@weed/tokens/tailwind.css";
```

字体文件由消费方自管：

- **Departure Mono**（SIL OFL 1.1，作者 Helena Zhang）：不在 fontsource/Google Fonts，从 [GitHub releases](https://github.com/rektdeckard/departure-mono/releases) 下载 woff2 自托管，需随附 OFL 许可文件（参考 `apps/web/src/fonts/`）。
- **Source Serif 4**：`pnpm add @fontsource-variable/source-serif-4`。

## BlueprintGrid（签名组件的语言层）

```html
<main class="w-blueprint">
  <!-- 20px minor grid + 100px major lines + cross dots + radial fade -->
</main>
```

hairline 工具类：`.w-hairline` / `.w-hairline-strong`（box-shadow 实现，见 `blueprint.css` 内注释）。
