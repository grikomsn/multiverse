import clsx from "clsx";
import type { ComponentProps } from "react";
import type { OmitChildren } from "utils/react";

export interface PageHeaderProps extends OmitChildren<ComponentProps<"div">> {
  title: string;
  description: string;
}

export function PageHeader({ title, description, className, ...rest }: PageHeaderProps) {
  return (
    <div className={clsx("mb-16 prose prose-invert", className)} {...rest}>
      <h1>{title}</h1>
      <p className="lead">{description}</p>
    </div>
  );
}
