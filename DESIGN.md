# weed · 野草 — 产品需求文档

> 版本：v0.2 · 日期：2026-11-07 · 状态：设计语言已重定（终端 / IDE 风），M3 待上线

---

## 0. 一句话定位

**weed 是一个终端 / IDE 风的 shadcn/ui 组件库：像素等宽、暖暗大地色、蓝图网格、1px 内描边，以源码复制的方式分发，像野草一样长进用户的代码库。**

品牌叙事（slogan）：

> *"Components that grow anywhere."*
> 野火烧不尽，春风吹又生。

野草隐喻与 shadcn 分发哲学同构：不依附、可复制、落地生根后归用户所有、除不掉也不想除。

> **v0.2 变更记录**：v0.1 的「像素等宽 × 衬线排版」方向被判定为丑并整体推翻，转向终端 / IDE 风
> （底更暗、面板实底、hairline 加实、网格降噪、衬线近乎清零、中文全走 mono 体系）。
> 详见 `design/decisions.md` 的 D-004 / D-005。

---

## 1. 为什么是现在（Why）

1. **时机窗口**：shadcn 在 2025 年底开放了 namespaced registry 体系（`npx shadcn add @weed/button`）并推出 `npx shadcn create` 五风格骨架，其中 Lyra（boxy + mono）与目标美学天然契合。基础设施刚铺好，生态位还空。
2. **审美空位**：shadcn 主题生态里主流是"现代 SaaS 风"和 neo-brutalism，pi.dev 代表的「terminal editorial」（衬线正文 + 像素等宽 + 暖暗大地色 + 蓝图网格）尚无组件库占位。
3. **个人杠杆**：对作者（前端 + AI Infra 背景）而言，这是一个"设计语言 + 分发工程 + 内容 SEO"三合一的作品集项目，比单一仓库更有叙事纵深。

**北极星**：weed 卖的不是组件，是一套审美体系的代码所有权。资产优先级：设计语言 > 分发管道 > 展示面 > 组件实现。

---

## 2. 目标用户

| 人群 | 诉求 | 触达渠道 |
|---|---|---|
| 独立开发者 / 独立黑客 | 产品需要辨识度，不要千篇一律 SaaS 脸 | shadcn registry 索引、X/即刻 |
| dev tool / AI 工具初创 | 工程感 + 编辑感的品牌气质（pi.dev 同审美人群） | 文档站 SEO、llms.txt |
| 前端工程师（求职者视角） | 能读源码、能抄 tokens 的高质量参考 | GitHub、技术社区 |

**非目标用户**：企业级中后台团队（要的是 antd 式的完备，不是风格）。

---

## 3. 设计语言（Design Language）

这是产品的地基，先于一切组件代码，独立为单一事实源（`packages/tokens`），产品站、文档站、组件三方共用。

### 3.1 签名三件套（识别度来源）

1. **等宽字面**：Departure Mono（像素等宽，OFL 开源可商用）负责拉丁与数据；中文回落系统黑体，**永不落到宋体**。Source Serif 4 只留给拉丁引文与 hero 强调词。
2. **暖暗大地色**：暖黑底（#0b0a08 系）+ 灰蓝实底面板（#1e2530 系）+ 赭石 / 麦黄 / 鼠尾草绿点缀，主 accent 低饱和蓝（#6a9fcc 系）。浅色主题为"羊皮纸"纸感。
3. **工程肌理**：blueprint 蓝图网格背景（20px 格、双档线重 + 交叉点、径向渐隐）、hairline 分隔线（box-shadow 实现，非 border）、圆角上限 3px。

### 3.2 Token 体系

- **单一事实源**：`packages/tokens/tokens.json`（DTCG 2025.10 格式）。CSS / Tailwind preset / tweakcn JSON 都是生成物，`scripts/build-tokens.mjs --check` 在 CI 里挡住过期产物。
- OKLCH 三档：primitive（原料色）→ semantic（bg/panel/line/text/accent）→ component（button-bg 等）。每个 oklch 值带 hex 锚点，双向可换算。
- 双主题：dark（默认）/ light（parchment），`data-theme` + localStorage + system 跟随。组件层零主题判断。
- 输出四种形态：CSS variables、Tailwind preset、tweakcn 兼容 JSON（主题市场是免费流量入口）、`themes.json`（站点与 agent 共用的机器可读视图）。

### 3.3 文案语气（Voice）

工程手册腔：零营销话术、短句、命令行优先。README 即官网，官网即文档。

---

## 4. 产品范围（MVP）

### 4.1 首发组件（10 + 1，宁缺毋滥）

Button · Input · Card · Badge · Tabs · Table · Dialog · Tooltip · CodeBlock · ThemeToggle

**签名组件**：`BlueprintGrid`（蓝图网格背景容器，别家没有，安装命令里最常被分享的那个）

每个组件交付三件套：安装命令、完整源码、variants 实时演示。

### 4.2 不做什么（Non-goals）

- ❌ 不发 npm 包（反 shadcn 哲学，维护黑洞）
- ❌ 不做全量组件矩阵（首批不做 DatePicker / Combobox 等重型组件）
- ❌ 不做 Storybook（文档站 live demo 替代）
- ❌ 不做 Figma 套件（v1.0 之后再评估）
- ❌ 不做中文特化排版组件（语言层保证 CJK 不破版即可）

---

## 5. 分发策略

| 渠道 | 机制 | 优先级 |
|---|---|---|
| shadcn 官方 registry 索引 | 开源后提 PR 进 directory，进入 `npx shadcn search` 结果 | P0 |
| GitHub repo | 即分发渠道，README 是第二张落地页 | P0 |
| tweakcn 主题市场 | 发布 weed 主题 JSON | P1 |
| X / 即刻 / V2EX | showcase 截图传播 | P1 |
| Product Hunt | v1.0 时冲一波 | P2 |

namespace：`@weed-ui`（2026-11-06 拍板）。仓库暂挂在个人账号 **[narcilee7/weed](https://github.com/narcilee7/weed)**（已公开）；GitHub org `weed-ui` 名仍未被占用，后续注册以承载 registry 与官方 PR。域名 **`weedui.dev`**（拍板，RDAP 确认可注册，需尽快购买；备选 `weed-ui.dev` / `weeds.sh` 均可注册；`weed-ui.com` 已被占）。

---

## 6. 站点架构（单域双区，一域三职）

```
weed.dev/         产品站：审美宣言 + hero demo + 安装命令 + OG 图
weed.dev/docs     文档站：每组件一页，SSG 全静态，可全文检索
weed.dev/r/*      registry JSON 输出（与站同域，零额外基建）
weed.dev/changelog.xml   RSS
weed.dev/llms.txt        AI 爬虫入口
```

**为什么是单域**：域名权重集中、一套基建、维护成本减半。产品站与文档站职责分离但同栈。

**技术选型**：Astro + React islands。三个硬需求：SSG/SEO 完整（默认零 JS）、React island 渲染组件 live demo（按需水合）、llms.txt / RSS / sitemap 生态标配。产品页 `/` 脱离模板手写，可无限 fancy。文档站不用 Fumadocs（其绑死 Next.js），M3 时评估 Starlight 或手搓 mdx 集合。

**SEO 三件套**：全页面 SSG + sitemap；每页 OG 图（组件渲染截图自动生成）；changelog 带 RSS。

---

## 7. 技术架构

```
weed/                     pnpm monorepo
├── apps/web/             Astro：产品页 + docs + registry JSON 构建输出
├── design/               设计原则（principles.md）+ 决策日志（decisions.md）
├── packages/tokens/      设计语言单一事实源（tokens.json → CSS / Tailwind preset / tweakcn JSON）
├── registry/             组件源码（shadcn registry 格式，registry:build 产物进 apps/web/public/r）
└── apps/web/src/         文档内容（docs 页面 + changelog 集合 + 组件目录 + markdown 生成器）
```

**关键选型（建议默认，待拍板）**：

| 决策点 | 建议 | 理由 |
|---|---|---|
| 单域双区 vs 双站 | **单域** | 权重集中、基建一套 |
| 组件基座 | **Radix**（2026-11-06 拍板） | 生态成熟、文档全、shadcn 现网组件的事实基线 |
| Radix vs Base UI | **Radix**（2026-11-06 拍板） | 同上 |
| 文档框架 | **Astro + React islands**（2026-11-06 拍板） | SSG/SEO 完整、默认零 JS、live demo 按需水合 |
| token 单一事实源 | **DTCG JSON + 生成器**（2026-11-07 拍板） | 手写 CSS 与 tweakcn 导出必然漂移，`--check` 挡住 |

### 7.1 人与 agent 共用一份事实

站点不止是给人看的：

- `/llms.txt` —— agent 索引，**由组件目录生成**，不是手写文件。
- `/llms-full.txt` —— 全文文档（概述 + 安装 + token + 11 个组件的完整 API 与源码）。
- 每页的 `.md` 孪生 —— `/index.md`、`/docs/index.md`、`/docs/components/button.md`……
  与网页版同源（`src/data/markdown.ts` 生成），agent 读到的东西人也能读到。
- `registry/catalog.json` 目录里带 `status` / `alsoCalled` / `whenToUse` / `insteadOf`，
  让 agent 判断"该用哪个"而不是只看到 API 表；同一份目录也写进 registry item 的
  `categories` / `meta` 字段，`npx shadcn` 客户端也能读到。

---

## 8. 里程碑

| 阶段 | 交付物 | 验收标准 | 状态 |
|---|---|---|---|
| M1 设计语言 | tokens 规范 + 字体接入 + 双主题 | 一份 token 文档 + 一个能切主题的 demo 页 | ✅ 2026-11-06 |
| M2 组件基座 | 10+1 组件 + registry 可安装 | `npx shadcn add` 从本地 registry 装上 Button | ✅ 2026-11-06 |
| M3 站点 | 产品页 + 文档站 + registry 同域服务 | 线上可访问、组件页可索引 | ✅ 2026-11-07（待上线） |
| M4 收录分发 | 官方 directory PR + tweakcn 上架 | `npx shadcn search` 能搜到 weed | ⏳ 待域名/上线 |

M3 补充说明：产品页 `/`（审美宣言 + hero demo + 安装命令）、文档站 `/docs`（概述 / 安装 / 主题与 Token + 每组件一页 live demo 与完整源码）、组件总览 `/components`、changelog 页 + RSS（`/changelog.xml`）、`/llms.txt`、`/robots.txt`、sitemap。

**v0.2 补齐项**（2026-11-07）：设计语言整体转向终端 / IDE 风并全站重做；token 单一事实源改为 DTCG JSON + 生成器（`pnpm tokens:check` 挡住漂移）；新增 `design/principles.md` + `design/decisions.md`；新增 `/llms-full.txt` 与每页 `.md` 孪生（由 `src/data/markdown.ts` 生成）。

**待补**：每页 OG 图（组件渲染截图自动生成）、站内全文检索（Pagefind，D-010 暂缓）、域名购买与 GitHub org 注册（仓库暂挂在 narcilee7/weed）。

---

## 9. 成功指标

- **采用**：registry 安装量（shadcn CLI 无遥测，用 GitHub registry JSON 的下载/访问估算）、GitHub stars
- **收录**：进入 shadcn 官方索引（二元指标）
- **传播**：showcase 截图在 X/即刻的自发转发
- **作品集价值**：面试中能完整讲出"语言 → 基座 → 分发 → 增长"全链路

---

## 10. 风险与对冲

| 风险 | 对冲 |
|---|---|
| pi.dev 美学被快速模仿，窗口关闭 | 速度优先，M1-M3 压在两-三周内；签名组件做深 |
| Departure Mono 等宽字体 CJK 缺字 | mono 仅用于 Latin/代码槽位，CJK 回落系统栈，规范里写死 |
| Base UI 生态不成熟 | 组件基座层与 token 层解耦，最坏情况平移回 Radix，语言层零损失 |
| 一人精力 | Non-goals 就是护城河：不做 npm 包、不做全量矩阵 |

---

## 11. 待拍板清单

1. ~~namespace~~ → **`@weed-ui`**（已查证：GitHub org 可用）
2. ~~Radix vs Base UI~~ → **Radix**（不赌新，赌生态成熟度）
3. ~~首发组件清单~~ → 维持 10+1（Button · Input · Card · Badge · Tabs · Table · Dialog · Tooltip · CodeBlock · ThemeToggle + BlueprintGrid）
4. ~~域名~~ → **`weedui.dev`**（已查证可注册）；备选 `weed-ui.dev` / `weeds.sh` 可注册，`weed-ui.com` 已被占
