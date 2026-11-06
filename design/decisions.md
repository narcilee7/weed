# 决策日志

> 记录"为什么是这样"，避免半年后有人把同一个坑再踩一遍。
> 状态：`accepted` 已生效 · `superseded` 被推翻 · `proposed` 在讨论 · `rejected` 否决。

格式：一行结论，一段理由，一句"什么时候该重新考虑"。

---

## D-001 · 站点用 Astro，不用 Next.js

**状态**：`accepted` · **时间**：2026-11-06

Astro + React islands。weed 的站点 18 个页面里只有组件 demo 需要 JS，其余全是静态 HTML。
Next 会为了不需要的路由和服务端运行时付费。

*何时重新考虑*：如果要做全站全文搜索（Pagefind 是静态的，够用）或用户态功能，
再评估是否需要 SSR 级别的能力。

---

## D-002 · 组件基座用 Radix，不用 Base UI

**状态**：`accepted` · **时间**：2026-11-06

Radix 的无样式 + 可组合模型更贴近"源码复制"的分发方式：消费方拿到的是可读的
`<DialogPrimitive.Root>` 结构，改起来知道自己改了什么。Base UI 更精致，但生态与
shadcn/ui 的既有心智不一致。

*何时重新考虑*：如果 Radix 的可访问性补丁（focus scope、pointer-events）在某个组件上
反复打补丁，换 Base UI。

---

## D-003 · namespace 用 `@weed-ui`

**状态**：`accepted` · **时间**：2026-11-06

GitHub 上 `weed-ui` 组织名可用；包名 `@weed-ui/*` 与 Radix 的 `@radix-ui/*`、
shadcn 的 `shadcn` 命名法同构。仓库暂挂在个人账号
[narcilee7/weed](https://github.com/narcilee7/weed)；org 注册后仓库迁过去。

*何时重新考虑*：组织名被别人抢注时。

---

## D-004 · 视觉方向：终端 / IDE 风

**状态**：`accepted` · **时间**：2026-11-07

v0.1 的"像素 mono × 衬线工程手册"方向被判定为**丑**并整体推翻。v0.2 转向终端 / IDE：
底更暗、面板实心、hairline 加实、网格降噪、衬线几乎清零、中文全走 mono 体系。

*何时重新考虑*：不。除非整个品牌定位换掉。

---

## D-005 · 中文不走衬线

**状态**：`accepted` · **时间**：2026-11-07

衬线只服务拉丁。中文在 mono 栈里回落系统黑体。原因：宋体和像素等宽放在一起会打架，
而且中文衬线在这个字号下（10.5–13.5px）会糊。

*何时重新考虑*：如果出现大量中文长文排版的场景，且明确要"读物"气质，
可以给正文单独开一条 sans 路线（不是 serif）。

---

## D-006 · token 单一事实源 = `packages/tokens/tokens.json`

**状态**：`accepted` · **时间**：2026-11-07

之前 CSS 是手写的，改色要同时改 `tokens.css` 和 tweakcn 导出，两边一定会漂。
现在 tokens.json 是 DTCG 源，`scripts/build-tokens.mjs` 编译出 CSS / Tailwind preset /
tweakcn JSON，`--check` 模式在 CI 里挡住过期产物。

*何时重新考虑*：如果 token 需要按组件分发成多个文件（registry 场景），要重新设计
编译目标。

---

## D-007 · 颜色用 OKLCH，保留 hex 锚点

**状态**：`accepted` · **时间**：2026-11-06

OKLCH 让"加亮一点"不用重新算感知均匀性；hex 锚点保留设计稿可追溯性
（`scripts/oklch-to-hex.mjs` 双向换算）。

*何时重新考虑*：不支持 OKLCH 的老浏览器占比超过阈值时（目前 Chrome 111+ / Safari 15.4+，
可接受）。

---

## D-008 · 每个组件自包含，单 URL 安装

**状态**：`accepted` · **时间**：2026-11-07

`npx shadcn add https://weedui.dev/r/button.json` 就能装，零配置。
为此 registry 构建时把共享文件（token CSS、`cn()`）注入进每个 item，
item 里不再声明 `registryDependencies`——因为裸名会解析到 shadcn 官方 registry。

*何时重新考虑*：组件数量涨到 30+，重复注入的体积开始难看时。

---

## D-009 · 文档同时服务人和 agent

**状态**：`accepted` · **时间**：2026-11-07

`llms.txt`（索引）、`llms-full.txt`（全文）、每页 `.md` 孪生、组件目录里的
`status` / `alsoCalled` / `whenToUse` / `insteadOf`——这些不是给搜索引擎看的，
是让 agent（和未来的自己）能直接读懂这个设计系统。

*何时重新考虑*：如果维护成本超过收益（比如每次改组件都要同步三处），先砍 `.md` 孪生。

---

## D-010 · 不做全站搜索（暂缓）

**状态**：`proposed` · **时间**：2026-11-07

11 个组件 + 4 篇文档，目录树式侧边栏已经够用。Pagefind 是静态的、零运行成本的，
但现在只有 18 个页面，加了也只是摆设。

*何时重新考虑*：页面数超过 40，或有人开始抱怨"找不到某个组件"。

---

## D-011 · 站点身份单一事实源 = 仓库根的 `site.json`

**状态**：`accepted` · **时间**：2026-11-07

站点先部署在 GitHub Pages（项目站，挂在 `/weed` 子路径下），域名 `weedui.dev`
还没买。为了让"换域名"和"换部署路径"都只动一处，加了根级 `site.json`：

```json
{ "url": "https://narcilee7.github.io", "base": "/weed" }
```

canonical、sitemap、robots、安装命令、registry item 的 `meta.docs`、
agent 索引（`llms.txt` / `llms-full.txt` / `.md` 孪生）全部从它推导。
Astro 的 `site` / `base`、registry 构建脚本、页面模板共用同一份。

子路径的坑：Astro 的 `base` **不会**自动改写模板里手写的 `href="/docs"`，
必须显式加前缀（`src/lib/site.ts` 的 `withBase()`）；RSS 的相对链接会绕开
base 解析到 origin 根，所以 item 链接必须是绝对 URL。

*何时重新考虑*：如果站点拆成多个域名（文档站独立），单一 origin 不再成立，
就把 `site.json` 拆成按用途的多个入口。
