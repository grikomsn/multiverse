import * as React from "react";

import { RoughNotation, RoughNotationProps } from "react-rough-notation";

export type StrikeProps = Omit<RoughNotationProps, "type">;

export default function Strike(props: StrikeProps) {
  return <RoughNotation animationDelay={1000} multiline type="strike-through" {...props} />;
}
