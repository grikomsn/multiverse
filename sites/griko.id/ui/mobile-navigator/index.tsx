import * as React from "react";

import { HEADER_ROUTES } from "@/ui/header";

import Nav from "./nav";

import { Home } from "lucide-react";

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
