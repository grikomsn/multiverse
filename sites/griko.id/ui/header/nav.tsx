import * as React from "react";

import A from "@/ui/core/anchor";

import clsx from "clsx";
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
    <A
      key={href}
      className={clsx("flex items-center p-4 space-x-2 hover:text-primary transition-colors", {
        "text-primary": exact ? router.route == href : router.route.startsWith(href),
      })}
      href={href}
    >
      <Icon size={16} />
      <span>
        {content}
        {/*  */}
      </span>
    </A>
  );
}
