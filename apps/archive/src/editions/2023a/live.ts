import { type LiveSettings, block, email, profileBullets } from "../../lib/live"
import { web } from "../../lib/web"

/** 2023 one-pager: the featured profiles as icons; projects need screenshots. */
export const live: LiveSettings = {
  requireProjectImages: true,
  links: (f) => [
    { label: "Resume", url: web("https://nibras.co/resume"), group: "nav" },
    ...(f.scheduleUrl ? [{ label: "Schedule", url: f.scheduleUrl, group: "nav" }] : []),
  ],
  pages: [
    {
      slug: "about",
      title: "About Myself",
      description: "Get to know more about myself",
      from: "about",
    },
    {
      slug: "contact",
      title: "Contact Me",
      description: "Here's how to reach me, looking forward to talk with y'all!",
      body: (f, live) => [
        block([
          "Inquiries via email at ",
          email(f),
          ...(f.scheduleUrl
            ? [" or schedule a meeting at ", { text: f.scheduleUrl, href: f.scheduleUrl }]
            : []),
          ".",
        ]),
        block(["You can also reach me on socials below:"]),
        ...profileBullets(live),
      ],
    },
    {
      slug: "media",
      title: "Media Assets",
      description: "Various media assets for referencing yours truly",
      body: (f) => [
        block([
          "Here are publicly available assets for referencing yours truly. Just right-click or hold and save images, or click available links to download.",
        ]),
        block(["If you require specific assets, send your inquiries at ", email(f), "."]),
      ],
    },
  ],
  description: (f) => f.headline,
  intro: (f) => [block([`${f.role} at ${f.organization?.name}.`])],
}
