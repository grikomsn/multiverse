import * as React from "react";

import { ToggleWrap } from "@packages/hooks/toggle";
import clsx from "@sindresorhus/class-names";
import { RoughNotationGroup } from "react-rough-notation";

export type ProseProps<T = HTMLElement> = React.DetailedHTMLProps<React.HTMLAttributes<T>, T>;

export default function Prose({ className, ...props }: ProseProps) {
  return (
    <ToggleWrap delay={100} enableOnMount>
      {({ state }) => (
        <RoughNotationGroup show={state}>
          <section
            className={clsx(
              "p-4 max-w-none prose prose-sky prose-invert prose-sm md:prose-base",
              "prose-headings:tracking-tighter",
              "prose-ul:last:pb-4",
              className,
            )}
            {...props}
          />
        </RoughNotationGroup>
      )}
    </ToggleWrap>
  );
}
