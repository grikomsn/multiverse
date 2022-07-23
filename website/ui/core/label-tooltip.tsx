import { Tooltip, TooltipArrow, TooltipContent, TooltipTrigger } from "@radix-ui/react-tooltip";
import clsx from "clsx";
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
        className={clsx(
          "py-2 px-4 text-center text-xs",
          "animate-slide-up-fade rounded bg-neutral-800 shadow-lg",
          "invisible sm:visible",
        )}
        sideOffset={8}
      >
        <span>{label}</span>
        <TooltipArrow className="fill-neutral-800" />
      </TooltipContent>
    </Tooltip>
  );
}
