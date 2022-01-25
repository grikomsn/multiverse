import * as React from "react";

export type ParagraphProps<T = HTMLParagraphElement> = React.DetailedHTMLProps<React.HTMLAttributes<T>, T>;

const TAG_TRANSFORM_LIST = [
  "ImgFigure",
  //
];

export default function Paragraph({ children, ...props }: ParagraphProps) {
  const shouldUseFragment = React.useMemo(() => {
    let result = false;
    React.Children.forEach(children as React.ReactChild[], (child: React.ReactChild) => {
      if (typeof child == "object") {
        const tag = typeof child.type == "function" ? child.type.name : child.type;
        result = TAG_TRANSFORM_LIST.some((item) => item == tag);
      }
    });
    return result;
  }, [children]);

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return shouldUseFragment ? <>{children}</> : <p {...props}>{children}</p>;
}
