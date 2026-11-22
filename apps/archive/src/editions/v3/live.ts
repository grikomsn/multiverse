import { type LiveSettings, article, block, link } from "../../lib/live"
import { platformKind } from "@multiverse/sanity/constants"
import { stack } from "../v5/live"

const GROUPS = { writing: "Blogs", code: "Development", social: "Social" } as const

/** 2019, the first blog: profiles in Blogs, Development and Social; projects authored or contributed. */
export const live: LiveSettings = {
  group: (platform) => GROUPS[platformKind(platform)],
  links: () => [
    {
      label: "Legacy landing page",
      url: `${import.meta.env.BASE_URL.replace(/\/$/, "")}/v2/`,
      group: "Useful Links",
    },
  ],
  pages: [
    {
      slug: "blog",
      title: "Blog Posts :pencil:",
      description: "Posts about the programming-verse and various interesting things",
    },
    {
      slug: "open-source",
      title: "Open Source :sparkles:",
      description: "Here are GitHub repositories that I authored, contribute, and maintain",
    },
    {
      slug: "socials",
      title: "Social Links :link:",
      body: () => [block(["Here is a list of various social medias and other links"])],
    },
  ],
  postUrl: (slug) => `/blog/${slug}`,
  projectCategory: (project) =>
    /creator|author/i.test(project.role ?? "") ? "Authored" : "Contributed",
  intro: (f) => [
    block([`Hey there, I am ${f.name}.`], "h2"),
    block([
      `I am ${article(f.role)} ${f.role?.toLowerCase()} at `,
      link(f.organization),
      ". Love working on web technologies like ",
      ...stack(f),
      ".",
    ]),
    block(["Say hello via email at ", { text: f.email ?? "", href: `mailto:${f.email}` }, "."]),
  ],
}
