import clsx from "clsx";
import { Anchor } from "ui/core/anchor";

import { NavigationLink } from "./link";
import { routes } from "./routes";

export function Navigation() {
  return (
    <div
      className={clsx(
        "fixed inset-x-0 bottom-0 z-10 flex justify-center",
        "pointer-events-none motion-safe:animate-slide-up-fade",
        "bg-gradient-to-t from-neutral-900/50 to-transparent",
      )}
    >
      <nav
        className={clsx(
          "container relative m-4 flex max-w-xl items-stretch overflow-x-auto overflow-y-hidden p-1",
          "rounded-xl bg-neutral-800/80 shadow-lg shadow-black/50",
          "pointer-events-auto backdrop-blur-sm",
          "snap-x sm:snap-none",
        )}
        data-navigation-container=""
      >
        <Anchor className="rounded-lg p-1 md:hover:bg-white/10" href="/">
          <div className="h-8 w-8">
            <img alt="home" src="/icon.png" />
          </div>
        </Anchor>
        <div className="min-w-[2ch] flex-grow" />
        {routes.map((route) => (
          <NavigationLink key={`navigation-link-${route.href}`} href={route.href}>
            {route.text}
          </NavigationLink>
        ))}
      </nav>
    </div>
  );
}
