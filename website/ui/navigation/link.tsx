import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/router";
import type { ReactNode } from "react";
import { Anchor } from "ui/core/anchor";

export interface NavigationLinkProps {
  children: ReactNode;
  href: string;
}

export function NavigationLink({ children, href }: NavigationLinkProps) {
  const router = useRouter();
  const isActive = router.asPath.startsWith(href);

  return (
    <Link href={href} passHref>
      <Anchor
        className={clsx(
          "flex relative justify-center items-center py-1 px-2 rounded-lg transition-colors snap-end md:px-4",
          "before:absolute before:inset-x-2 before:rounded-t-full before:border-b before:pointer-events-none",
          "before:shadow motion-safe:before:transition-all",
          isActive ? "before:bottom-[-4px]" : "before:bottom-[-8px] hover:before:bottom-[-4px]",
          isActive ? "before:shadow-primary-500" : "hover:before:shadow-neutral-400",
          isActive
            ? "text-primary-500 before:border-primary-500 before:border-opacity-100"
            : "before:border-neutral-400 before:border-opacity-0 hover:before:border-opacity-100",
        )}
        data-navigation-link=""
      >
        {children}
      </Anchor>
    </Link>
  );
}
