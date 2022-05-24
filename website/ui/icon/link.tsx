import { el } from "utils/markdown";

export function LinkIcon() {
  return (
    <svg {...LinkIconHast.properties}>
      {LinkIconHast.children.map((node, i) => (
        <path key={i} {...node.properties} />
      ))}
    </svg>
  );
}

export const LinkIconHast = el({
  type: "element",
  tagName: "svg",
  properties: {
    xmlns: "http://www.w3.org/2000/svg",
    width: 24,
    height: 24,
    stroke: "currentColor",
    "stroke-width": 2,
    "stroke-linecap": "round",
    "stroke-linejoin": "round",
  },
  children: [
    {
      type: "element",
      tagName: "path",
      properties: { d: "M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" },
      children: [],
    },
    {
      type: "element",
      tagName: "path",
      properties: { d: "M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" },
      children: [],
    },
  ],
});
