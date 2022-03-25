import * as React from "react";

import SearchResult from "./search-result";

import { KBarResults, useMatches } from "kbar";

export default function SearchResults() {
  const { results } = useMatches();

  return <KBarResults items={results} onRender={SearchResult} />;
}
