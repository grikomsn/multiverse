import { type LiveSettings, block, email, link, list } from "../../lib/live"
import { web } from "../../lib/web"

/** Bear Blog: the current site's own data, in its sidebar layout. */
export const live: LiveSettings = {
  links: () =>
    [
      ["Home", "/"],
      ["About", "/about"],
      ["Blog", "/blog"],
      ["Now", "/now"],
      ["Schedule", "/schedule"],
      ["Uses", "/uses"],
    ].map(([label, url]) => ({ label: label!, url: url!, group: "nav" })),
  pages: [
    {
      slug: "about",
      title: "About Me",
      description: "Get to know more about myself",
      from: "about",
    },
    {
      slug: "now",
      title: "Now Page",
      description: "Current state of mind of what's happening now",
      from: "now",
    },
    {
      slug: "schedule",
      title: "Schedule A Call",
      description: "Book a slot on my calendar",
      body: (f) => [
        block([
          "Book a slot on my calendar at ",
          f.scheduleUrl
            ? { text: f.scheduleUrl.replace(/^https?:\/\//, ""), href: f.scheduleUrl }
            : "",
          ".",
        ]),
      ],
    },
    {
      slug: "uses",
      title: "Uses Page",
      description: "What I'm currently using, from workstations to softwares and other stuff",
      from: "uses",
    },
    {
      slug: "uses-2024",
      title: "Uses Page (2024)",
      description: "What I'm currently using, from workstations to softwares and other stuff",
      from: "uses-2024",
    },
  ],
  intro: (f) => [
    // "Creative technologist. Senior Product Engineer at Wayfindr, previously worked at …"; when
    // the headline already names the employer, the role clause would repeat it.
    block(
      f.headlineNamesEmployer
        ? [`${f.headline}. Previously worked at `, ...list(f.previous), "."]
        : [
            f.headline ? `${f.headline}. ` : "",
            `${f.role} at `,
            link(f.organization),
            ", previously worked at ",
            ...list(f.previous),
            ".",
          ],
    ),
    block([
      "View my ",
      { text: "resume", href: web("https://nibras.co/resume") },
      ", ",
      ...(f.scheduleUrl ? ["book my ", { text: "calendar", href: f.scheduleUrl }, ", "] : []),
      "or email me at ",
      email(f),
      ".",
    ]),
  ],
}
