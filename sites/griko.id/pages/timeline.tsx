import * as React from "react";

import meta from "@/config/meta.cjs";
import { withLayoutType } from "@/utils/layout";

import Head from "next/head";

function TimelinePage() {
  return (
    <Head>
      <meta content={`0;url=${meta.links.Polywork}`} httpEquiv="refresh" />
    </Head>
  );
}

export default withLayoutType(TimelinePage, "empty");
