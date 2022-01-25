import * as React from "react";

import Prose from "@/ui/core/prose";
import Wip from "@/ui/core/wip";
import { useSeo } from "@/utils/seo";

export default function ProjectsPage() {
  const { Seo, title, description } = useSeo({
    title: "Creations and Projects",
    description: `Here are some of my selected works. Commisions, personal projects, open source libraries, community contributions, etc.`,
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
