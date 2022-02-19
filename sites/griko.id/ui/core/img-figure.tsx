/* eslint-disable jsx-a11y/alt-text */

import * as React from "react";

import { useMediumZoom } from "@/lib/medium-zoom";

import clsx from "clsx";

export type ImgFigureProps<T = HTMLImageElement> = React.DetailedHTMLProps<React.ImgHTMLAttributes<T>, T>;

export default function ImgFigure({ className, ...rest }: ImgFigureProps) {
  const isNormalImage = Boolean(className?.includes("twemoji")) || !rest.alt;

  const attach = useMediumZoom();

  if (isNormalImage) {
    return <img {...rest} className={className} ref={attach} />;
  }

  return (
    <figure className="text-center">
      <img {...rest} className={clsx("z-10 mx-auto w-full max-w-2xl", className)} ref={attach} />
      {rest.alt && <figcaption>{rest.alt}</figcaption>}
    </figure>
  );
}
