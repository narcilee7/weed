import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@weed-ui/card";
import { Button } from "@weed-ui/button";

export default function Demo() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>野草的生长协议</CardTitle>
        <CardDescription>
          不依附、可复制、落地生根后归用户所有。除不掉，也不想除。
        </CardDescription>
      </CardHeader>
      <CardContent className="flex gap-3">
        <Button variant="outline" size="sm">Read source</Button>
        <Button variant="ghost" size="sm">Copy</Button>
      </CardContent>
    </Card>
  );
}
