import * as React from "react";

import trimHttp from "@packages/utils/trim-http.cjs";
import Link from "next/link";

const RedirectRegEx = /^\/(github|polywork|timeline|twitter)/;

export type AnchorProps<T = HTMLAnchorElement> = React.DetailedHTMLProps<React.AnchorHTMLAttributes<T>, T>;

export default function Anchor({ children, ...rest }: AnchorProps) {
  const isApi = rest.href?.startsWith("/api") ?? false;
  const isRelative = (rest.href?.startsWith("/") && !isApi) ?? false;
  const isRedirect = rest.href && RedirectRegEx.test(rest.href);

  const Wrap = (isRelative ? Link : React.Fragment) as React.ComponentType;
  const wrapProps = isRelative ? { href: rest.href } : {};
  const linkProps = isRedirect || !isRelative ? { target: "_blank", rel: "noopener noreferrer" } : {};

  return (
    <Wrap {...wrapProps}>
      <a {...rest} {...linkProps}>
        {children ?? (rest.href ? trimHttp(rest.href) : null)}
      </a>
    </Wrap>
  );
}

export const A = Anchor;
