import { Badge } from "@weed-ui/badge";

export default function Demo() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Badge>outline</Badge>
      <Badge variant="default">blue</Badge>
      <Badge variant="ochre">ochre</Badge>
      <Badge variant="sage">sage</Badge>
      <Badge variant="wheat">wheat</Badge>
    </div>
  );
}
