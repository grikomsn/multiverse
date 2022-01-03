import * as React from "react";

import Loading from "@/ui/utils/loading";

import { useFocusTrap } from "@mantine/hooks";
import { KBarAnimator, KBarPortal, KBarPositioner, KBarSearch } from "kbar";
import dynamic from "next/dynamic";

const SearchResults = dynamic(() => import("./search-results"), { loading: Loading });
const WindowControls = dynamic(() => import("./window-controls"));

export default function KBar() {
  const trap = useFocusTrap();
  return (
    <KBarPortal>
      <KBarPositioner className="z-50 bg-black bg-opacity-50 backdrop-blur-sm nightwind-prevent">
        <KBarAnimator className="overflow-hidden w-screen max-w-md rounded-lg shadow-xl bg-neutral-900">
          <WindowControls />
          <div className="p-4" ref={trap}>
            <KBarSearch
              className="py-2 px-4 w-full bg-transparent rounded focus:border-primary transition outline-none"
              type="text"
            />
          </div>
          <SearchResults />
          <div className="h-4" />
        </KBarAnimator>
      </KBarPositioner>
    </KBarPortal>
  );
}
