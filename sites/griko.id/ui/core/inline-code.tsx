import * as React from "react";

import type { Property } from "csstype";

export type InlineCodeProps<T = HTMLSpanElement> = React.DetailedHTMLProps<React.HTMLAttributes<T>, T> & {
  "data-mdx-pretty-code"?: boolean;
  "data-color"?: Property.Color;
};

export default function InlineCode(props: InlineCodeProps) {
  if (props["data-mdx-pretty-code"] != null) {
    return (
      <code style={{ color: props["data-color"] }}>
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/no-unsafe-member-access */}
        {(props.children as any)?.props.children}
      </code>
    );
  }

  return <span {...props} />;
}
