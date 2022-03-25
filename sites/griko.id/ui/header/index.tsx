import * as React from "react";

import meta from "@/config/meta.json";
import A from "@/ui/core/anchor";

import Nav from "./nav";

import { Activity, Icon as IconType, Navigation, Pencil } from "lucide-react";
import { useRouter } from "next/router";

export const HEADER_ROUTES: [string, React.ReactNode, IconType][] = [
  ["/about", "About", Navigation],
  // ["/projects", "Projects", Axe],
  ["/blog", "Writings", Pencil],
  //
];

export default function Header() {
  const router = useRouter();

  return (
    <nav>
      {/* desktop header */}
      <div className="hidden justify-end items-center py-4 md:flex">
        {router.route != "/" && (
          <A className="py-2 px-4 text-xl font-bold tracking-tighter hover:text-primary transition-colors" href="/">
            {meta.name}
          </A>
        )}
        <div className="flex-grow" />
        {HEADER_ROUTES.map(([href, content, Icon]) => (
          <Nav key={href} Icon={Icon} content={content} href={href} />
        ))}
        <Nav Icon={Activity} content="Timeline" href={meta.links.Polywork} />
      </div>

      {/* mobile header */}
      {router.route != "/" && (
        <div className="flex justify-center items-center p-4 md:hidden">
          <A className="text-xl font-bold tracking-tighter hover:text-primary transition-colors" href="/">
            {meta.name}
          </A>
        </div>
      )}
    </nav>
  );
}
