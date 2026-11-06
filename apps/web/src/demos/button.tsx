import { Button } from "@weed-ui/button";

export default function Demo() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="default">Deploy</Button>
      <Button variant="outline">Cancel</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="default" size="sm">Small</Button>
      <Button variant="default" size="lg">Large</Button>
      <Button variant="outline" disabled>Disabled</Button>
    </div>
  );
}
