import clsx from "clsx";
import { Anchor } from "ui/core/anchor";

import { NavigationLink } from "./link";
import { routes } from "./routes";

export function Navigation() {
  return (
    <div
      className={clsx(
        "flex fixed inset-x-0 bottom-0 z-10 justify-center",
        "motion-safe:animate-slide-up-fade pointer-events-none",
        "bg-gradient-to-t from-neutral-900/50 to-transparent",
      )}
    >
      <nav
        className={clsx(
          "container flex overflow-x-auto overflow-y-hidden relative items-stretch p-1 m-4 max-w-xl",
          "bg-neutral-800/80 rounded-xl shadow-lg shadow-black/50",
          "backdrop-blur-sm pointer-events-auto",
          "snap-x sm:snap-none",
        )}
        data-navigation-container=""
      >
        <Anchor className="p-1 rounded-lg md:hover:bg-white/10" href="/">
          <div className="w-8 h-8">
            <img alt="home" src="/icon.png" />
          </div>
        </Anchor>
        <div className="flex-grow min-w-[2ch]" />
        {routes.map((route) => (
          <NavigationLink key={`navigation-link-${route.href}`} href={route.href}>
            {route.text}
          </NavigationLink>
        ))}
      </nav>
    </div>
  );
}
