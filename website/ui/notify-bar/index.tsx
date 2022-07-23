import clsx from "clsx";
import {
  CheckCircledOutline as CheckCircle,
  InfoEmpty as Info,
  Prohibition as Slash,
  WarningCircledOutline as AlertCircle,
} from "iconoir-react";
import type { ComponentProps } from "react";

export type NotifyBarType = "info" | "success" | "warning" | "error";

export type NotifyBarProps = ComponentProps<"div"> & {
  type?: NotifyBarType;
};

export function NotifyBar({ children, className, type = "info", ...rest }: NotifyBarProps) {
  const Icon = ICON_MAP[type];
  return (
    <div
      className={clsx(
        "sticky inset-x-0 top-0 z-20 flex items-center justify-center space-x-4 p-4",
        "shadow-neutral-900/90 backdrop-blur-sm transition-colors",
        {
          "bg-blue-800/80 hover:bg-blue-800": type === "info",
          "bg-green-800/80 hover:bg-green-800": type === "success",
          "bg-primary-800/80 hover:bg-primary-800": type === "warning",
          "bg-red-800/80 hover:bg-red-800": type === "error",
        },
        className,
      )}
      {...rest}
    >
      <div>
        <Icon className="h-7 w-7" />
      </div>
      <div className="max-w-4xl flex-grow">{children}</div>
    </div>
  );
}

const ICON_MAP = {
  info: Info,
  success: CheckCircle,
  warning: AlertCircle,
  error: Slash,
};
