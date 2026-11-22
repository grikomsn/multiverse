import { type LiveSettings, article, block, email, link } from "../../lib/live"
import { platformKind } from "@multiverse/sanity/constants"
import { stack } from "../v5/live"

const GROUPS = { writing: "Blogs", code: "Development", social: "Social" } as const

/** 2019–2020: a large h2 intro with framework names as colored links. */
export const live: LiveSettings = {
  group: (platform) => GROUPS[platformKind(platform)],
  requireProjectImages: true,
  pages: [
    {
      slug: "works",
      title: "Creations and Works",
      description:
        "Hand-picked collection of what I've done in the past and what I'm currently working on.",
    },
    {
      slug: "contact",
      title: "Contact",
      body: (f) => [
        block([
          "Get in touch via email at ",
          email(f),
          ". You can also contact or view my public accounts via these links below.",
        ]),
      ],
    },
  ],
  description: (f) =>
    `${f.name} is ${article(f.role)} ${f.role?.toLowerCase()} based in ${f.location}. Love working on web technologies like ${f.stack.map((item) => item.name).join(", ")}.`,
  intro: (f) => [
    block(
      [
        `Hello there. I am ${article(f.role)} ${f.role?.toLowerCase()} at `,
        link(f.organization),
        ". Love working on web technologies like ",
        ...stack(f),
        ".",
      ],
      "h2",
    ),
    block([
      "Get in touch via email at ",
      email(f),
      " or visit the ",
      { text: "contact page", href: "/contact" },
      " for more information.",
    ]),
  ],
}
