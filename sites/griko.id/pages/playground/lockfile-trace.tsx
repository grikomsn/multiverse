import * as React from "react";

import { withLayoutType } from "@/utils/layout";
import { useSeo } from "@/utils/seo";

import { useElementSize } from "@mantine/hooks";
import ReactFlow, { Background, Controls, Elements } from "react-flow-renderer";
import toast from "react-hot-toast";

function LockfileTracePage() {
  const { ref, height, width } = useElementSize();

  const { Seo } = useSeo({
    title: "Lockfile Trace",
    description: "Visualize my monorepo yarn.lock dependencies",
  });

  const [elements, setElements] = React.useState<Elements>([]);

  React.useEffect(() => {
    function fetcher() {
      const { search } = new URL(document.URL);
      return fetch(`/api/data/lockfile-trace?${search}`).then((res) => res.json());
    }

    if (elements.length == 0) {
      void toast.promise(fetcher().then(setElements), {
        loading: "Fetching traces...",
        success: "Fetching finished!",
        error: "Fetching failed!",
      });
    }
  }, [elements.length]);

  return (
    <section className="absolute inset-0" ref={ref}>
      <Seo />

      <div style={{ height, width }}>
        <ReactFlow elements={elements} nodesConnectable={false} onlyRenderVisibleElements>
          <Background />
          <Controls />
        </ReactFlow>
      </div>
    </section>
  );
}

export default withLayoutType(LockfileTracePage, "empty-body");
