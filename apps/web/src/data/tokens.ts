import themes from "@weed/tokens/themes.json";

/**
 * 语义 token 的展示层封装。
 * 数据来自 @weed/tokens/themes.json —— 与 packages/tokens/tokens.json 同源，
 * 站点展示的色值不可能与 CSS 漂移。
 */

export interface SemanticRow {
  name: string;
  cssVar: string;
  usage: string;
  dark: { value: string; hex: string | null };
  light: { value: string; hex: string | null };
}

/** 展示顺序 = 语义层级，不是字母序 */
const SEMANTIC_ORDER: [string, string][] = [
  ["background", "页面底色"],
  ["foreground", "正文"],
  ["panel", "实心面板"],
  ["panelSoft", "面板内次级表面"],
  ["popover", "浮层"],
  ["line", "1px 分隔线"],
  ["lineStrong", "输入框 / 可点击边界"],
  ["muted", "次级填充"],
  ["mutedForeground", "次要文字"],
  ["primary", "accent 蓝，主操作"],
  ["primaryForeground", "主操作上的文字"],
  ["accent", "高亮"],
  ["secondary", "次级填充"],
  ["destructive", "危险操作"],
  ["input", "输入框描边"],
  ["ring", "focus 光晕"],
  ["ochre", "警告信号"],
  ["wheat", "提示信号"],
  ["sage", "成功信号"],
];

export const SEMANTIC_ROWS: SemanticRow[] = SEMANTIC_ORDER.map(
  ([name, usage]) => {
    const dark = themes.themes.dark[name as keyof typeof themes.themes.dark];
    const light = themes.themes.light[name as keyof typeof themes.themes.light];
    return {
      name,
      cssVar: dark?.cssVar ?? light?.cssVar ?? `--${name}`,
      usage,
      dark: { value: dark?.value ?? "", hex: dark?.hex ?? null },
      light: { value: light?.value ?? "", hex: light?.hex ?? null },
    };
  }
);

export interface TypeRow {
  token: string;
  size: string;
  usage: string;
}

/** 字号阶梯：终端 / IDE 型尺度 */
const TYPE_ORDER: [string, string][] = [
  ["2xl", "hero 标题"],
  ["xl", "页面标题"],
  ["lg", "区块标题"],
  ["base", "正文"],
  ["sm", "界面 / 表格"],
  ["xs", "标签 / 元信息"],
];

export const TYPE_ROWS: TypeRow[] = TYPE_ORDER.map(([name, usage]) => ({
  token: `--w-text-${name}`,
  size: themes.type[name as keyof typeof themes.type],
  usage,
}));

export const RADIUS = themes.radius;
export const FONT_MONO =
  '"Departure Mono", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", ui-monospace, SFMono-Regular, Menlo, monospace';
export const FONT_SERIF =
  '"Source Serif 4", Georgia, "Times New Roman", "PingFang SC", "Noto Sans CJK SC", serif';
