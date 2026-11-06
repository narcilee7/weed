import { CodeBlock } from "@weed-ui/code-block";

export default function Demo() {
  return (
    <CodeBlock
      className="w-full max-w-xl"
      filename="app/globals.css"
      language="CSS"
      code={`@import "./styles/weed-ui/tokens.css";
@import "./styles/weed-ui/fonts.css";
@import "./styles/weed-ui/blueprint.css";`}
    />
  );
}
