/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { useMemo } from "react";

import layouts, { LayoutType } from "@/layouts";

export function useComponentLayout(component: any) {
  const type = useMemo<LayoutType>(() => component?.layout || "default", [component]);
  const Layout = useMemo(() => layouts[type], [type]);

  return Layout;
}

export function withLayoutType(element: React.ComponentType<any>, layout: LayoutType) {
  return Object.assign(element, { layout });
}
