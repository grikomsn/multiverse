import { readingMinutes } from "@multiverse/content/format"

import { type LiveSettings, block, email, profileBullets } from "../../lib/live"

/**
 * Ghost (2022): post rows carry the reading time and Ghost's trailing-slash URLs; the newest is
 * featured. The author card shows today's name, city, picture and featured profiles. The work
 * and talk pages were "TODO" in 2022; they list today's projects and talks.
 */
export const live: LiveSettings = {
  group: (_, featured) => (featured ? "author" : null),
  postUrl: (slug) => `/${slug}/`,
  links: (f) => [
    { label: "About", url: "https://nibras.co/about/", group: "nav" },
    { label: "Contact", url: "https://nibras.co/contact/", group: "nav" },
    { label: "Resume", url: "https://nibras.co/resume", group: "nav" },
    ...(f.scheduleUrl ? [{ label: "Schedule", url: f.scheduleUrl, group: "nav" }] : []),
    { label: "/media", url: "https://nibras.co/media", group: "footer" },
    { label: "/now", url: "https://nibras.co/now/", group: "footer" },
    { label: "/uses", url: "https://nibras.co/uses/", group: "footer" },
  ],
  pages: [
    { slug: "about", title: "About Myself", from: "about" },
    {
      slug: "contact",
      title: "Contact Me",
      body: (f, live) => [
        block(["Inquiries via email at ", email(f), " or via socials below:"]),
        ...profileBullets(live),
      ],
    },
    { slug: "now", title: "/now", from: "now" },
    {
      slug: "talk",
      title: "Recent Appearances",
      body: (_, live) =>
        live.talks.map((talk) =>
          block(
            [
              talk.url ? { text: talk.title, href: talk.url } : talk.title,
              talk.event ? ` - ${talk.event}` : "",
              talk.date ? ` (${talk.date.slice(0, 4)})` : "",
            ],
            "normal",
            "bullet",
          ),
        ),
    },
    { slug: "uses", title: "What I Use", from: "uses" },
    {
      slug: "work",
      title: "Recent Projects",
      body: (_, live) =>
        live.projects.map((project) =>
          block(
            [
              project.url || project.repoUrl
                ? { text: project.name, href: project.url ?? project.repoUrl }
                : project.name,
              project.summary ? ` - ${project.summary}` : "",
            ],
            "normal",
            "bullet",
          ),
        ),
    },
  ],
  description: (f) => f.headline,
  transform: (edition, live, f) => ({
    ...edition,
    extras: [
      {
        _key: "author",
        title: f.name,
        subtitle: null,
        description: f.location,
        category: "author",
        date: null,
        url: null,
        tags: null,
        image: live.portrait ?? live.avatar,
      },
      ...(edition.extras ?? []).map((entry, index) => {
        if (entry.category !== "post") return entry
        const post = live.posts.find((item) => item._id === entry.ref)
        const first = index === edition.extras!.findIndex((item) => item.category === "post")
        return {
          ...entry,
          category: first ? "post featured" : "post",
          subtitle: `${readingMinutes(post?.body)} min read`,
          description: post?.excerpt ?? null,
        }
      }),
    ],
  }),
}
