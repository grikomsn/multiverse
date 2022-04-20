import Link from "next/link";
import type { ComponentProps, ComponentType } from "react";
import { forwardRef, Fragment } from "react";

export type AnchorProps = ComponentProps<"a">;

export const Anchor = forwardRef<HTMLAnchorElement, AnchorProps>(
  //
  function Anchor({ children, href = "", ...rest }, ref) {
    const isApi = href.startsWith("/api");
    const isRelative = href.startsWith("/") && !isApi;

    const Wrap = (isRelative ? Link : Fragment) as ComponentType<any>;
    const wrapProps = isRelative ? { href } : {};
    const linkProps = !isRelative ? { target: "_blank", rel: "noopener noreferrer" } : {};

    return (
      <Wrap {...wrapProps}>
        <a {...rest} {...linkProps} href={href} ref={ref}>
          {children ?? (href ? trimHttp(href) : null)}
        </a>
      </Wrap>
    );
  },
);

export function AnchorCompat(props) {
  // eslint-disable-next-line jsx-a11y/anchor-has-content
  return <Anchor {...props} />;
}

function trimHttp(str: string) {
  return str.replace(/https?:\/\//, "");
}
