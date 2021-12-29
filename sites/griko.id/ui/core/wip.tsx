import * as React from "react";

import clsx from "@sindresorhus/class-names";
import { AlertTriangle } from "lucide-react";

export type WipProps<T = HTMLDivElement> = Omit<React.DetailedHTMLProps<React.HTMLAttributes<T>, T>, "children">;

export default function Wip({ className, ...rest }: WipProps) {
  return (
    <div
      className={clsx(
        "flex flex-col sm:flex-row items-center p-4 space-y-2 sm:space-y-0 sm:space-x-4 text-center sm:text-left bg-opacity-50 rounded-md bg-amber-500",
        className,
      )}
      {...rest}
    >
      <div className="flex-shrink-0">
        <AlertTriangle size={24} />
      </div>
      <div className="space-y-1">
        <h3 className="text-xl font-bold tracking-tighter">Under Construction</h3>
        <p>Sorry for the inconvenience, this page is still a work in progress.</p>
      </div>
    </div>
  );
}
