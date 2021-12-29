import * as React from "react";

import { withLayoutType } from "@/utils/layout";

function EmptyPage() {
  return <span>this is an empty page</span>;
}

export default withLayoutType(EmptyPage, "empty");
