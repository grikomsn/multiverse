import Anchor from "@/ui/core/anchor";
import ImgFigure from "@/ui/core/img-figure";
import InlineCode from "@/ui/core/inline-code";
import Paragraph from "@/ui/core/paragraph";
import Prose from "@/ui/core/prose";
import Reference from "@/ui/core/reference";
import Stabilo from "@/ui/core/stabilo";
import Strike from "@/ui/core/strike";
import Underline from "@/ui/core/underline";

import { MDXComponents } from "mdx/types";
import { NextSeo } from "next-seo";

export const defaultComponents: MDXComponents = {
  a: Anchor,
  img: ImgFigure,
  span: InlineCode,
  p: Paragraph,

  A: Anchor,
  Seo: NextSeo,
  Prose,
  Reference,
  Stabilo,
  Strike,
  Underline,
};
