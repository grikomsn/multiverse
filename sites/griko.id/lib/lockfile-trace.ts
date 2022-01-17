import traceFlow from "@packages/lockfile-trace/flow";
import dagre from "dagre";
import { Elements, isNode, Position } from "react-flow-renderer";

export const NODE_HEIGHT = 50;
export const NODE_WIDTH = 150;

export type GetLayoutedElementsOpts = {
  direction?: "TB" | "LR";
};

export function getLayoutedElements({ direction = "TB" }: GetLayoutedElementsOpts = {}): Elements {
  const elements = traceFlow;

  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({
    rankdir: direction,
  });

  elements.forEach((el) => {
    if (isNode(el)) {
      dagreGraph.setNode(el.id, {
        width: NODE_WIDTH,
        height: NODE_HEIGHT,
      });
    } else {
      dagreGraph.setEdge(el.source, el.target);
    }
  });

  dagre.layout(dagreGraph);

  const layoutedElements = elements.map((el) => {
    if (isNode(el)) {
      const nodeWithPosition = dagreGraph.node(el.id);

      const isHorizontal = direction == "LR";
      el.targetPosition = isHorizontal ? Position.Left : Position.Top;
      el.sourcePosition = isHorizontal ? Position.Right : Position.Bottom;

      el.position = {
        x: nodeWithPosition.x - NODE_WIDTH / 2 + Math.random() / 1000,
        y: nodeWithPosition.y - NODE_HEIGHT / 2,
      };
    }

    return el;
  });

  return layoutedElements;
}
