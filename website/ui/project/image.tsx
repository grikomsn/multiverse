import clsx from "clsx";
import type { ComponentProps } from "react";
import type { OmitChildren } from "utils/react";

export interface ProjectImageProps extends OmitChildren<ComponentProps<"div">> {
  src: string;
  alt?: string;
}

export function ProjectImage({ src, alt, className, ...rest }: ProjectImageProps) {
  return (
    <div
      className={clsx(
        "overflow-hidden rounded bg-neutral-800",
        "transition-colors sm:group-hover:bg-neutral-700",
        className,
      )}
      {...rest}
    >
      <img
        alt={alt}
        className={clsx(
          "aspect-video h-full w-full",
          "translate-x-6 translate-y-6 scale-110 transform-gpu transition-transform",
          "sm:motion-safe:group-hover:translate-y-5",
        )}
        src={src}
      />
    </div>
  );
}
