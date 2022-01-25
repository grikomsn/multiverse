import * as React from "react";

import { useKBar } from "kbar";

export default function WindowControls() {
  const { query } = useKBar();

  return (
    <div className="flex items-center px-4 pt-4 space-x-2">
      <button onClick={query.toggle}>
        <div className="w-3 h-3 bg-red-500 rounded-full hover:opacity-80" />
      </button>
      <button onClick={query.toggle}>
        <div className="w-3 h-3 bg-yellow-500 rounded-full hover:opacity-80" />
      </button>
      <button onClick={query.toggle}>
        <div className="w-3 h-3 bg-green-500 rounded-full hover:opacity-80" />
      </button>
    </div>
  );
}
