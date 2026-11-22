import { type LiveSettings, block, link, list } from "../../lib/live"

/** 2022: the headline is the full name; the last intro paragraph underlines what follows "based on ". */
export const live: LiveSettings = {
  postUrl: (slug) => `https://griko.id/blog/${slug}`,
  pages: [
    { slug: "about", title: "About Me", description: "Get to know more about myself" },
    {
      slug: "blog",
      title: "Writings",
      description: "My blog posts covering web development, personal thoughts, and various things",
    },
    {
      slug: "uses",
      title: "/uses",
      description: "What I'm currently using, from workstations to softwares and other stuff",
      from: "uses",
    },
    { slug: "time", title: "Time", description: "Track what's my current time and somewhere else" },
    {
      slug: "playground/seat-selector",
      title: "Seat Selector",
      description: "A friend asked how to make a seat selector UI, soooo yeah",
    },
  ],
  headline: (f) => f.fullName,
  description: (f) => f.headline,
  intro: (f) => [
    block([`${f.headline}.`]),
    block(
      f.headlineNamesEmployer
        ? ["Previously at ", ...list(f.previous), "."]
        : [`${f.role} at `, link(f.organization), ". Previously at ", ...list(f.previous), "."],
    ),
    block([`Currently based on 🇮🇩 ${f.location}.`]),
  ],
}
