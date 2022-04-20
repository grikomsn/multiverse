import { Tooltip, TooltipArrow, TooltipContent, TooltipTrigger } from "@radix-ui/react-tooltip";
import type { ReactNode } from "react";

export interface LabelTooltipProps {
  label: string;
  children: ReactNode;
}

export function LabelTooltip({ label, children }: LabelTooltipProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent
        className="py-2 px-4 text-xs text-center bg-neutral-800 rounded shadow-lg animate-slide-up-fade"
        sideOffset={8}
      >
        <span>{label}</span>
        <TooltipArrow className="fill-neutral-800" />
      </TooltipContent>
    </Tooltip>
  );
}
