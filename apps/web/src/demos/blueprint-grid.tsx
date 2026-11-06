import { BlueprintGrid } from "@weed-ui/blueprint-grid";

export default function Demo() {
  return (
    <BlueprintGrid className="h-48 w-full rounded-md shadow-[0_0_0_1px_var(--line-strong)]">
      <div className="absolute right-4 bottom-3 font-mono text-xs text-muted-foreground">
        20px minor / 100px major
      </div>
    </BlueprintGrid>
  );
}
