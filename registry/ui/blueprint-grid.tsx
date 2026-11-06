import * as React from "react";

import { cn } from "@/lib/utils";

interface BlueprintGridProps extends React.ComponentProps<"div"> {
  /** flat 变体：网格覆盖整个元素、自顶部向下渐隐 */
  flat?: boolean;
}

/**
 * 蓝图网格背景容器 — weed 签名组件。
 * 视觉实现在 theme 的 blueprint.css（20px 小格 / 100px 双档线 /
 * accent 交叉点 / 径向渐隐），安装 `weed-ui/theme` 即可使用。
 */
function BlueprintGrid({
  className,
  flat,
  children,
  ...props
}: BlueprintGridProps) {
  return (
    <div
      data-slot="blueprint-grid"
      className={cn("w-blueprint relative", flat && "w-blueprint--flat", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export { BlueprintGrid };
