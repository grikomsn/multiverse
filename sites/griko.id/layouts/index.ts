import dynamic from "next/dynamic";

const layouts = {
  default: dynamic(() => import("./default")),
  empty: dynamic(() => import("./empty")),
  "empty-body": dynamic(() => import("./empty-body")),
};

export type LayoutType = keyof typeof layouts;

export default layouts;
