import { EmojiRegExp } from "@packages/utils/regex.mjs";
import twemoji from "twemoji";
import { visit } from "unist-util-visit";

export default function remarkTwemoji() {
  return function transformer(tree) {
    visit(tree, "text", (node) => {
      if (EmojiRegExp.test(node.value)) {
        const parsedNode = twemoji.parse(node.value, {
          attributes: (icon) => ({ title: icon }),
          base: twemoji.base.replace("twemoji.maxcdn.com", "twemoji-cdn.griko.id"),
          className: "twemoji",
        });
        node.type = "html";
        node.value = `<span className="not-prose">${parsedNode.replace(/class/g, "className")}</span>`;
      }
    });
  };
}
