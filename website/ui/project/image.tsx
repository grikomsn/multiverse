import clsx from "clsx";
import type { ComponentProps } from "react";
import type { OmitChildren } from "utils/react";

export interface WorkImageProps extends OmitChildren<ComponentProps<"div">> {
  src: string;
  alt?: string;
}

export function WorkImage({ src, alt, className, ...rest }: WorkImageProps) {
  return (
    <div
      className={clsx("overflow-hidden bg-neutral-800 group-hover:bg-neutral-700 rounded transition-colors", className)}
      {...rest}
    >
      <img
        alt={alt}
        className={clsx(
          "aspect-video w-full h-full",
          "transition-transform transform-gpu scale-110 translate-x-6 translate-y-6",
          "motion-safe:group-hover:translate-y-5 motion-safe:hover:translate-y-5",
        )}
        src={src}
      />
    </div>
  );
}
