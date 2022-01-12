import * as React from "react";

export type ReferenceProps = React.PropsWithChildren<{}>;

export default function Reference({ children }: ReferenceProps) {
  return (
    <blockquote data-reference>
      {children}
      {/*  */}
    </blockquote>
  );
}
