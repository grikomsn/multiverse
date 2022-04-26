import clsx from "clsx";
import type { LucideProps } from "lucide-react";
import { AlertCircle, CheckCircle, Info, Slash } from "lucide-react";
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
        "flex sticky inset-x-0 top-0 z-20 justify-center items-center p-4 space-x-4",
        "shadow-neutral-900/90 backdrop-blur-sm transition-colors",
        {
          "bg-blue-800/80 hover:bg-blue-800": type === "info",
          "bg-green-800/80 hover:bg-green-800": type === "success",
          "bg-yellow-800/80 hover:bg-yellow-800": type === "warning",
          "bg-red-800/80 hover:bg-red-800": type === "error",
        },
        className,
      )}
      {...rest}
    >
      <div>
        <Icon className="w-7 h-7" />
      </div>
      <div className="flex-grow max-w-4xl">{children}</div>
    </div>
  );
}

const ICON_MAP: Record<NotifyBarType, (props: LucideProps) => JSX.Element> = {
  info: Info,
  success: CheckCircle,
  warning: AlertCircle,
  error: Slash,
};
