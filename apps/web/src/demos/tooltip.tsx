import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@weed-ui/tooltip";
import { Button } from "@weed-ui/button";

export default function Demo() {
  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost">Hover me</Button>
        </TooltipTrigger>
        <TooltipContent>hairline + mono, that's it</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
