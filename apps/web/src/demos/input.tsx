import { Input } from "@weed-ui/input";

export default function Demo() {
  return (
    <div className="grid w-full max-w-md gap-3">
      <Input placeholder="~/weed $" />
      <Input type="email" placeholder="you@example.com" />
      <Input disabled placeholder="disabled" />
    </div>
  );
}
