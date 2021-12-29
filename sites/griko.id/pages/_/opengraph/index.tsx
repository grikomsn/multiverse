import * as React from "react";

import Prose from "@/ui/core/prose";
import Wip from "@/ui/core/wip";
import { useSeo } from "@/utils/seo";

export default function OpenGraphPlaygroundPage() {
  const { Seo, title, description } = useSeo({
    title: "OpenGraph Playground",
    description: "Helper playground create and preview opengraph images for this site",
  });

  return (
    <section>
      <Seo />

      <Wip className="mb-4" />

      <Prose>
        <h1>{title}</h1>
        <p className="lead">{description}</p>
        <br />
      </Prose>
    </section>
  );
}
