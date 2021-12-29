import * as React from "react";

import { RoughNotation, RoughNotationProps } from "react-rough-notation";

export type StabiloProps = Omit<RoughNotationProps, "type">;

export default function Stabilo(props: StabiloProps) {
  return <RoughNotation animationDelay={1000} multiline type="highlight" {...props} />;
}
