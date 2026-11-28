import type { LiveSite } from "../../lib/live"

import { type Entry, type LiveSettings, aboutText, article, block } from "../../lib/live"

/** The plug cards: the 2018 copy, with the profiles each one links to today. */
const PLUGS = [
  {
    title: "Development Articles",
    subtitle: "Writing dev stuff on dev.to or Medium",
    description:
      "From writing tutorials to sharing my thoughts on a specific topic, I sometimes write on dev.to or Medium. Not my forte, but I do try to increase my writing skills.",
    image: "plug-writing",
    platforms: ["devto", "medium"],
  },
  {
    title: "Gadget Wallpapers",
    subtitle: "Creating minimalist backgrounds",
    description:
      "I started making wallpapers as a hobby since 2012 and publish them on DeviantArt. Nowadays it's just for killing time or when I'm on the mood.",
    image: "plug-wallpapers",
    platforms: ["deviantart"],
  },
]

/** How the 2018 plug cards named each site. */
const PLUG_LABELS: Record<string, string> = {
  devto: "dev.to",
  medium: "Medium",
  deviantart: "DeviantArt Gallery",
}

/** The two specialty cards, as 2018 wrote them; both still describe the work. */
const SPECIALTIES = [
  {
    title: "Front-end Developer",
    description: "I design responsive and friendly user interfaces.",
    tags: [":paintbrush:", ":man_artist_tone1:", ":crayon:"],
  },
  {
    title: "Back-end Developer",
    description: "I develop website logics and information systems.",
    tags: [":keyboard:", ":man_technologist_tone1:", ":mouse_three_button:"],
  },
]

const profile = (live: LiveSite, platform: string) =>
  live.profile?.socialLinks?.find((link) => link.platform === platform && link.url)

const entry = (fields: Partial<Entry> & Pick<Entry, "title" | "category">): Entry => ({
  _key: `${fields.category}-${fields.title}`,
  subtitle: null,
  description: null,
  date: null,
  url: null,
  tags: null,
  image: null,
  ...fields,
})

/**
 * 2018: the intro is read as plain text; featured profiles are the navbar's "Primary" buttons and
 * the rest join them as colored tiles on /socials. "Recent works" are the featured projects and
 * "Open Source" every project with a repository.
 */
export const live: LiveSettings = {
  group: (_, featured) => (featured ? "Primary" : "Socials"),
  pages: [
    {
      slug: "contact",
      title: "Interested in working together? Let's talk.",
      body: () => [
        block(["Contact me via email for business inquiries, or say hello via social medias."]),
      ],
    },
    {
      slug: "works",
      title: "Recent works :lollipop:",
      body: () => [
        block([
          "Here and the current and past projects, you can request via email for the full list.",
        ]),
      ],
    },
    {
      slug: "plugs",
      title: "Shameless plug :electric_plug:",
      description: "Here are the things I do on my spare time.",
    },
    {
      slug: "open-source",
      title: "Open Source",
      description: "Here are my GitHub repos, from project playgrounds to open-source projects.",
    },
    {
      slug: "socials",
      title: "Socials",
      description: "I am available (virtually) anywhere on the interwebs.",
    },
  ],
  // The email buttons, and each plug card's footer links under the card's title.
  links: (f, live) => [
    ...(f.email ? [{ label: f.email, url: `mailto:${f.email}`, group: "Email" }] : []),
    ...PLUGS.flatMap((plug) =>
      plug.platforms.flatMap((platform) => {
        const link = profile(live, platform)
        return link?.url
          ? [{ label: PLUG_LABELS[platform] ?? platform, url: link.url, group: plug.title }]
          : []
      }),
    ),
  ],
  intro: (f) => [
    block([
      `Hello there! I'm ${article(f.role)} ${f.role?.toLowerCase()} at ${f.organization?.name}.`,
    ]),
  ],
  // The 2018 tagline, still true, over two short paragraphs from today's about page.
  bio: (_, live) => [
    block(["Converting coffee :coffee: to code :terminal: since 2014"]),
    ...aboutText(live).slice(1, 3),
  ],
  transform: (edition) => {
    const asset = (name: string) => edition.extras?.find((item) => item.category === name)?.image
    return {
      ...edition,
      projects: [
        ...(edition.projects ?? [])
          .filter((project) => project.category === "featured")
          .map((project) => ({ ...project, _key: `work-${project._key}`, category: "work" })),
        ...(edition.projects ?? [])
          .filter((project) => project.repoUrl)
          .map((project) => ({ ...project, _key: `repo-${project._key}`, category: "repo" })),
      ],
      extras: [
        ...(edition.extras ?? []),
        ...SPECIALTIES.map((specialty) => entry({ ...specialty, category: "specialty" })),
        ...PLUGS.map(({ title, subtitle, description, image }) =>
          entry({ title, subtitle, description, category: "plug", image: asset(image) ?? null }),
        ),
      ],
    }
  },
}
