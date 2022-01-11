import * as React from "react";

import meta from "@/config/meta.json";
import A from "@/ui/core/anchor";

import clsx from "classnames";
import { Activity, Icon as IconType, Navigation, Pencil } from "lucide-react";
import { useRouter } from "next/router";

export const HEADER_ROUTES: [string, React.ReactNode, IconType][] = [
  ["/about", "About", Navigation],
  // ["/projects", "Projects", Axe],
  ["/writings", "Writings", Pencil],
  [meta.links.Polywork, "Timeline", Activity],
  //
];

export default function Header() {
  const router = useRouter();

  return (
    <nav>
      {/* desktop header */}
      <div className="hidden md:flex justify-end items-center py-4">
        {router.route != "/" && (
          <A className="py-2 px-4 text-xl font-bold tracking-tighter hover:text-primary transition-colors" href="/">
            {meta.name}
          </A>
        )}
        <div className="flex-grow" />
        {HEADER_ROUTES.map(([href, content, Icon]) => (
          <A
            key={href}
            className={clsx("flex items-center p-4 space-x-2 hover:text-primary transition-colors", {
              "text-primary": router.route.startsWith(href),
            })}
            href={href}
          >
            <Icon size={16} />
            <span>{content}</span>
          </A>
        ))}
      </div>

      {/* mobile header */}
      {router.route != "/" && (
        <div className="flex md:hidden justify-center items-center p-4">
          <A className="text-xl font-bold tracking-tighter hover:text-primary transition-colors" href="/">
            {meta.name}
          </A>
        </div>
      )}
    </nav>
  );
}
