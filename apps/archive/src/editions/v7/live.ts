import { type LiveSettings, article, block, capitalize, link, list } from "../../lib/live"

/** 2021: the h1 is a greeting; the paragraph under it is the description. */
export const live: LiveSettings = {
  postUrl: (slug) => `https://griko.id/blog/${slug}`,
  pages: [
    { slug: "about", title: "About me", description: "Get to know more about myself" },
    {
      slug: "blog",
      title: "Blog posts",
      description:
        "Sometimes I write about web development, other times about random interesting stuff.",
    },
    {
      slug: "appearances",
      title: "Appearances",
      description: "Talks, meetups, and other appearances from various events.",
    },
    {
      slug: "projects",
      title: "Creations and projects",
      description: "Here are some of my past works from personal projects and open source ones.",
    },
    {
      slug: "uses",
      title: "What I'm Using",
      description:
        "Source of all things what I'm currently using, from workstations to softwares and other stuff",
      from: "uses",
    },
  ],
  headline: (f) => `Hey! I'm ${f.name}.`,
  description: (f) =>
    `${capitalize(article(f.role))} ${f.role?.toLowerCase()} at ${f.organization?.name}. Currently based in ${f.location}.`,
  intro: (f) => [
    block(["Previously at ", ...list(f.previous), "."]),
    block([link(f.organization)]),
  ],
}
