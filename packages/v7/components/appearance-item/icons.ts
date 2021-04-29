import {
  FaBolt,
  FaChalkboard,
  FaMicrophone,
  FaRegCommentAlt,
} from "react-icons/fa";
import { IconType } from "react-icons/lib";

export default <Record<string, IconType>>{
  "lightning-talk": FaBolt,
  podcast: FaMicrophone,
  talk: FaRegCommentAlt,
  workshop: FaChalkboard,
};
