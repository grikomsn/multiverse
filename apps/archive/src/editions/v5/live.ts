import { type Facts, type LiveSettings, block, email, link, textOf } from "../../lib/live"
import { platformKind } from "@multiverse/sanity/constants"

const GROUPS = { writing: "Blog", code: "Development", social: "Social" } as const

/** v4b and v5 share their home page: a two-block intro with framework names as colored links. */
export const live: LiveSettings = {
  group: (platform) => GROUPS[platformKind(platform)],
  postUrl: (slug) => `/blog/${slug}`,
  requireProjectImages: true,
  talkCategory: (kind) =>
    kind === "workshop" ? "FiCode" : kind === "talk" ? "FiFeather" : "FiBookmark",
  pages: [
    {
      slug: "works",
      title: "Creations and Projects",
      description:
        "Hand-picked collection of what I've done in the past and what I'm currently working on.",
    },
    {
      slug: "appearances",
      title: "Appearances and Talks",
      description: "List of appearances from various events such as meetups and workshops.",
    },
    {
      slug: "contact",
      title: "Contact Me",
      body: (f) => [
        block([
          "Get in touch via email at ",
          email(f),
          ". You can also contact or view my public accounts via these links below.",
        ]),
      ],
    },
    {
      slug: "blog",
      title: "Blog Posts",
      description: "Thoughts, shareables, anything that I'd like to write and publish.",
    },
  ],
  description: (f) => f.headline,
  bio: (_, live) => [
    block(["About Me"]),
    ...(textOf(live.pages.find((page) => page.slug === "about")?.body as never) ?? []),
  ],
  intro: (f: Facts) => [
    block(
      [
        "Hey there.\nI make ",
        ...stack(f),
        ` things.\nBusy with ${f.role?.toLowerCase()} work at ${f.organization?.name}.\nHave a great day.`,
      ],
      "h2",
    ),
    block(["Drop a mail at", email(f), "and let's talk business."]),
  ],
}

/** "A, B, and C", each linked to its homepage so the design colors it. */
export const stack = (f: Facts) =>
  f.stack.flatMap((item, index) => [
    link(item),
    index < f.stack.length - 2 ? ", " : index === f.stack.length - 2 ? ", and " : "",
  ])
