import * as React from "react";

import Anchor from "@/ui/core/anchor";
import { HEADER_ROUTES } from "@/ui/header";

import clsx from "@sindresorhus/class-names";
import { Home, Icon as IconType } from "lucide-react";
import { useRouter } from "next/router";

type NavProps = {
  content: React.ReactNode;
  exact?: boolean;
  href: string;
  Icon: IconType;
};

function Nav({ Icon, content, exact, href }: NavProps) {
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

export default function MobileNavigator() {
  return (
    <div className="md:hidden h-[64px]">
      <div className="grid overflow-x-auto overflow-y-hidden fixed inset-x-0 bottom-0 grid-flow-col w-screen text-center bg-body bg-opacity-80 border-t backdrop-blur-sm border-t-neutral-700 h-[64px]">
        <Nav Icon={Home} content="Home" exact href="/" />
        {HEADER_ROUTES.map(([href, content, Icon]) => (
          <Nav key={href} Icon={Icon} content={content} href={href} />
        ))}
      </div>
    </div>
  );
}
