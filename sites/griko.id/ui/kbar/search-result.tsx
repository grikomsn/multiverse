import * as React from "react";

import clsx from "@sindresorhus/class-names";
import { ActionImpl } from "kbar/lib/action";

interface SearchResultProps {
  active: boolean;
  item: string | ActionImpl;
}

export default function SearchResult({ active, item }: SearchResultProps) {
  if (typeof item == "string") {
    return (
      <div className="py-2 px-4">
        <h4 className="font-bold tracking-tighter text-neutral-500">{item}</h4>
      </div>
    );
  }

  return (
    <div
      className={clsx(
        "py-2 px-4 border-l-2 cursor-pointer",
        active ? "bg-gray-500 bg-opacity-20 border-primary" : "border-transparent",
      )}
      role="button"
    >
      <div className="flex space-x-4">
        {item.icon && <div className="flex flex-col justify-center items-center">{item.icon}</div>}
        <div className="flex flex-col flex-grow">
          <h4>{item.name}</h4>
          {item.subtitle && <p className="text-xs truncate text-neutral-400">{item.subtitle}</p>}
        </div>
        {item.shortcut && (
          <div className="flex items-center space-x-1 font-mono text-xs text-gray-500 uppercase">
            {item.shortcut.map((key, i) => (
              <span
                key={`${item.id}-shortcut-key-${i}`}
                className="rounded border border-gray-500 border-opacity-50 py-[2px] px-[4px]"
              >
                {key}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
