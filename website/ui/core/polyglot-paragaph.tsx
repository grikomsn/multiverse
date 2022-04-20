import clsx from "clsx";
import type { ComponentProps, ReactNode } from "react";
import { Children } from "react";

export type PolyglotParagraphProps = ComponentProps<"p">;

export function PolyglotParagraph({ children, ...rest }: PolyglotParagraphProps) {
  const isLead = checkChildrenLead(children);
  return (
    <p {...rest} className={clsx(rest.className, isLead && "lead")}>
      {isLead ? trimChildrenLead(children) : children}
    </p>
  );
}

function checkChildrenLead(children: ReactNode) {
  const arr = Children.toArray(children);
  if (arr.length === 1) {
    return typeof arr[0] === "string" && /^!@.+@!$/.test(arr[0]);
  }
  if (arr.length > 1) {
    const [first, last] = [arr[0], arr[arr.length - 1]];
    return typeof first === "string" && typeof last === "string" && first.startsWith("!@") && last.endsWith("@!");
  }
  return false;
}

function trimChildrenLead(children: ReactNode) {
  const arr = Children.toArray(children);
  return arr.map((node: string, i) => {
    if (i === 0) return node.replace("!@", "");
    if (i === arr.length - 1) return node.replace("@!", "");
    return node;
  });
}
