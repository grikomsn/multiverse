import {
  type Block,
  type LiveSettings,
  block,
  email,
  link,
  list,
  profileBullets,
  textOf,
} from "../../lib/live"

/**
 * 2022: a `!@…@!` paragraph is the small lead above the h2, both in the intro and the about page;
 * the footer shows the featured profiles.
 */
const TAGLINE = "Creating delightful web experiences using frontend technologies"

export const live: LiveSettings = {
  postUrl: (slug) => `https://griko.id/blog/${slug}`,
  pages: [
    { slug: "about", title: "About Me", description: "Get to know more about myself" },
    {
      slug: "contact",
      title: "Contact Me",
      description: "Here's how to reach me, looking forward to talk with y'all!",
      body: (f, live) => [
        block(["Inquiries via email at ", email(f), " or via socials below:"]),
        ...profileBullets(live),
      ],
    },
    {
      slug: "work",
      title: "Recent Projects",
      description: "Curated handcrafted projects I have made in the past",
    },
    {
      slug: "talk",
      title: "Recent Appearances",
      description: "Talks, meetups, and other appearances from various events",
    },
    {
      slug: "blog",
      title: "Writings",
      description: "My blog posts covering web development, personal thoughts, and various things",
    },
    {
      slug: "playground/time",
      title: "Time",
      description: "Track what's my current time and somewhere else",
    },
    {
      slug: "playground/seat-selector",
      title: "Seat Selector",
      description: "A friend asked how to make a seat selector UI, soooo yeah",
    },
  ],
  description: () => TAGLINE,
  bio: (_, live) => {
    const [lead, ...rest] =
      textOf(live.pages.find((page) => page.slug === "about")?.body as Block[]) ?? []
    const text = lead && "children" in lead ? lead.children?.map((c) => c.text).join("") : ""
    return [block([`!@${text}@!`]), block(["About Myself"], "h2"), ...rest]
  },
  // The 2022 tagline: how the site described the work, not a job title.
  headline: () => TAGLINE,
  intro: (f) => [
    block([`!@${f.name}@!`]),
    block([TAGLINE], "h2"),
    block([
      `Currently working as ${f.role?.toLowerCase()} at `,
      link(f.organization),
      ". Previously at ",
      ...list(f.previous),
      ".",
    ]),
    block([
      "Inquiries via email at ",
      email(f),
      ...(f.scheduleUrl
        ? [
            " or book a call at ",
            { text: f.scheduleUrl.replace(/^https?:\/\//, ""), href: f.scheduleUrl },
          ]
        : []),
      ".",
    ]),
  ],
}
