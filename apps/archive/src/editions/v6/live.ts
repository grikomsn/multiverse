import {
  type LiveSettings,
  aboutText,
  article,
  block,
  capitalize,
  link,
  list,
} from "../../lib/live"

/** 2020–2021: the footer shows the featured profiles; the about page lists them all. */
export const live: LiveSettings = {
  postUrl: (slug) => `https://griko.id/blog/${slug}`,
  featured: 6,
  pages: [
    {
      slug: "blog",
      title: "Blog Posts",
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
      title: "Projects",
      description: "Here are some of my past works from personal projects and open source ones.",
    },
    { slug: "about", title: "About Me" },
  ],
  description: (f) => f.headline,
  // The 2020 about page had one short paragraph under "Hi, I'm …"; two from today's page.
  bio: (_, live) => aboutText(live).slice(1, 3),
  intro: (f) => [
    block([
      `${capitalize(article(f.role))} ${f.role?.toLowerCase()} at `,
      link(f.organization),
      ", doing web dev things. Previously at ",
      ...list(f.previous),
      ".",
    ]),
  ],
}
