import { FaBolt, FaChalkboard, FaGlobeAsia, FaMicrophone, FaRegCommentAlt } from "react-icons/fa";
import { IconType } from "react-icons/lib";

const icons = {
  "lightning-talk": FaBolt,
  podcast: FaMicrophone,
  talk: FaRegCommentAlt,
  workshop: FaChalkboard,
  fallback: FaGlobeAsia,
} as const;

export function getIcon(type: unknown = "fallback"): IconType {
  if (typeof type == "string" && type in icons) {
    return icons[type];
  }
  return icons.fallback;
}

export default icons;
