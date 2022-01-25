import * as React from "react";

import Anchor from "@/ui/core/anchor";

import clsx from "classnames";
import { Icon as IconType } from "lucide-react";
import { useRouter } from "next/router";

export type NavProps = {
  content: React.ReactNode;
  exact?: boolean;
  href: string;
  Icon: IconType;
};

export default function Nav({ Icon, content, exact, href }: NavProps) {
  const router = useRouter();

  return (
    <Anchor
      className={clsx("flex flex-col justify-between items-center p-4 space-y-1", {
        "text-primary": exact ? router.route == href : router.route.startsWith(href),
      })}
      href={href}
    >
      <div>
        <Icon size={16} />
      </div>
      <span className="text-xs">
        {content}
        {/*  */}
      </span>
    </Anchor>
  );
}
