import * as React from "react";

import { HEADER_ROUTES } from "@/ui/header";

import Nav from "./nav";

import { Home } from "lucide-react";

export default function MobileMenuBar() {
  return (
    <div className="h-[64px] md:hidden">
      <div className="grid overflow-x-auto overflow-y-hidden fixed inset-x-0 bottom-0 grid-flow-col w-screen h-[64px] text-center bg-body bg-opacity-80 border-t border-t-neutral-700 backdrop-blur-sm">
        <Nav Icon={Home} content="Home" exact href="/" />
        {HEADER_ROUTES.map(([href, content, Icon]) => (
          <Nav key={href} Icon={Icon} content={content} href={href} />
        ))}
      </div>
    </div>
  );
}
