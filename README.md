# weed · 野草

> Components that grow anywhere.
> 野火烧不尽，春风吹又生。

终端 / IDE 风的 shadcn/ui registry：像素等宽、暖暗大地色、蓝图网格、1px 内描边。
以源码复制的方式分发，长进你的代码库。

仓库：[github.com/narcilee7/weed](https://github.com/narcilee7/weed) · 站点：<https://narcilee7.github.io/weed/>（域名 `weedui.dev` 上线中）

## 安装

```sh
npx shadcn add https://narcilee7.github.io/weed/r/button.json
```

或者先添加 namespace，再按官方姿势安装：

```sh
# components.json → "registries": { "@weed-ui": "https://narcilee7.github.io/weed/r/{name}.json" }
npx shadcn add @weed-ui/button
```

每个组件自包含：主题 token、`cn()` 工具随组件一起落地，单 URL 安装零配置。

## 组件（11 个）

Button · Input · Card · Badge · Tabs · Table · Dialog · Tooltip · CodeBlock · ThemeToggle

**签名组件**：`BlueprintGrid` —— 蓝图网格背景容器（20px 小格 / 100px 双档线 / accent 交叉点 / 径向渐隐）。

Live demo: [narcilee7.github.io/weed/components](https://narcilee7.github.io/weed/components)（本地 `pnpm dev`）。

## 设计语言

- **等宽字面**：Departure Mono（像素等宽，OFL）负责拉丁与数据；中文回落系统黑体，**永不落到宋体**。Source Serif 4 只留给拉丁引文。
- **暖暗大地色**：暖黑 `#0b0a08` / 灰蓝实底面板 `#1e2530` / 赭石 · 麦黄 · 鼠尾草 / 低饱和蓝 accent；浅色主题为羊皮纸。
- **工程肌理**：blueprint 网格、hairline（box-shadow 实现）、3px 圆角上限。
- **Token**：OKLCH 三档（primitive → semantic → component），`data-theme` 双主题。

单一事实源在 [`packages/tokens/tokens.json`](packages/tokens/tokens.json)（DTCG 格式），
`pnpm tokens:build` 编译出 CSS / Tailwind preset / tweakcn JSON。

原则与决策记录：[`design/principles.md`](design/principles.md) · [`design/decisions.md`](design/decisions.md)。

## Monorepo

```
weed/                 pnpm monorepo
├── apps/web/         Astro：产品页 + 文档站 + registry JSON 输出
├── design/           设计原则 + 决策日志
├── packages/tokens/  设计语言单一事实源（tokens.json → CSS / Tailwind preset / tweakcn JSON）
├── registry/         组件源码 + catalog.json（组件目录）+ registry.json（shadcn registry 格式）
├── site.json         站点身份单一事实源（origin + base），全站 URL 从这里推导
└── apps/web/src/     文档内容（docs 页面 + changelog 集合 + 组件目录）
```

```sh
pnpm install
pnpm dev              # http://localhost:4321
pnpm build            # tokens:build + registry:build + 全量构建
pnpm tokens:build     # 重新生成 token 产物
pnpm tokens:check     # 检查 token 产物是否过期（CI 用）
pnpm registry:build   # 重建 registry JSON → apps/web/public/r/
```

## 部署

站点部署在 GitHub Pages：push 到 `master`（或 `feat/init`）→ `.github/workflows/pages.yml`
构建并发布到 `https://narcilee7.github.io/weed/`。

**换域名只改一处**：仓库根的 `site.json`。

```json
{
  "url": "https://narcilee7.github.io",
  "base": "/weed"
}
```

canonical、sitemap、安装命令、registry 元数据、agent 索引全部从这里推导。
域名 `weedui.dev` 上线后改成 `"url": "https://weedui.dev"`、`"base": "/"`，重新构建即可。

## 站点结构

```
/                    产品页：审美宣言 + hero demo + 安装命令
/docs                文档站：概述 / 安装 / 主题与 Token + 每组件一页（live demo + 完整源码）
/components          组件总览（11 个组件一页看完）
/changelog           更新日志（RSS: /changelog.xml）
/r/{name}.json       registry item（shadcn CLI 直接消费）
/llms.txt            agent 索引（由组件目录生成）
/llms-full.txt       全文文档（给人与 agent 同一份事实）
/{path}.md           每页的纯文本孪生
/robots.txt · /sitemap-index.xml
```

## License

MIT（组件代码与站点）。字体各自遵守其许可：Departure Mono（SIL OFL 1.1，Helena Zhang）、Source Serif 4（OFL）。
