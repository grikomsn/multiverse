import * as React from "react";

import { RoughNotation, RoughNotationProps } from "react-rough-notation";

export type UnderlineProps = Omit<RoughNotationProps, "type">;

export default function Underline(props: UnderlineProps) {
  return <RoughNotation animationDelay={1000} multiline type="underline" {...props} />;
}
