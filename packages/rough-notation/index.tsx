/* eslint-disable @typescript-eslint/no-shadow */

import * as React from "react";

import { useGroupContext } from "./group";
import { Annotation, RoughNotationProps } from "./types";

import { annotate } from "rough-notation";

export * from "./group";
export * from "./types";

export const RoughNotation: React.FunctionComponent<RoughNotationProps> = ({
  animate = true,
  animationDelay = 0,
  animationDuration = 800,
  brackets,
  children,
  color,
  customElement = "span",
  getAnnotationObject,
  iterations = 2,
  multiline = false,
  order,
  padding = 5,
  show = false,
  strokeWidth = 1,
  type = "underline",
  ...rest
}) => {
  const element = React.useRef<HTMLElement>(null);
  const annotation = React.useRef<Annotation>();
  const innerVars = React.useRef<{
    playing: boolean;
    timeout: null | number;
  }>({
    playing: false,
    timeout: null,
  });
  const initialOptions = React.useRef({
    animate,
    animationDuration,
    brackets,
    color,
    getAnnotationObject,
    iterations,
    multiline,
    padding,
    strokeWidth,
    type,
  });

  useGroupContext(annotation, typeof order === "string" ? parseInt(order, 10) : order);

  React.useEffect(() => {
    const options = initialOptions.current;
    const { getAnnotationObject } = options;

    annotation.current = annotate(element.current, options);

    if (getAnnotationObject) {
      getAnnotationObject(annotation.current);
    }

    return () => {
      annotation.current?.remove?.();
    };
  }, []);

  React.useEffect(() => {
    if (show) {
      if (!innerVars.current.timeout) {
        innerVars.current.timeout = window.setTimeout(() => {
          innerVars.current.playing = true;

          annotation.current?.show?.();

          window.setTimeout(() => {
            innerVars.current.playing = false;
            innerVars.current.timeout = null;
          }, animationDuration);
        }, animationDelay);
      }
    } else {
      annotation.current?.hide?.();
      innerVars.current.playing = false;

      if (innerVars.current.timeout) {
        clearTimeout(innerVars.current.timeout);
        innerVars.current.timeout = null;
      }
    }
  }, [annotation, show, animationDelay, innerVars, animationDuration]);

  React.useEffect(() => {
    if (annotation.current) {
      annotation.current.animate = animate;
      annotation.current.animationDuration = animationDuration;
      annotation.current.color = color;
      annotation.current.strokeWidth = strokeWidth;
      annotation.current.padding = padding;
    }
  }, [annotation, animate, animationDuration, color, strokeWidth, padding]);

  return React.createElement(
    customElement,
    {
      ref: element,
      ...rest,
    },
    children,
  );
};
