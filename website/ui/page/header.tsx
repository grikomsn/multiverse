import clsx from "clsx";
import type { ComponentProps } from "react";
import type { OmitChildren } from "utils/react";

export interface PageHeaderProps extends OmitChildren<ComponentProps<"div">> {
  title: string;
  description: string;
}

export function PageHeader({ title, description, className, ...rest }: PageHeaderProps) {
  return (
    <div className={clsx("prose prose-invert mb-16", className)} {...rest}>
      <h1>{title}</h1>
      <p className="lead">{description}</p>
    </div>
  );
}
