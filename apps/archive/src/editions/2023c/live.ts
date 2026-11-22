import { type LiveSettings, aboutText, article, block, email, link, list } from "../../lib/live"
import { web } from "../../lib/web"

/** Keystatic era: "Currently working at … Previously at …", an icon per featured profile. */
export const live: LiveSettings = {
  featuredOnly: true,
  links: (f) => (f.scheduleUrl ? [{ label: "Schedule", url: f.scheduleUrl, group: "nav" }] : []),
  pages: [
    {
      slug: "about",
      // "I'm Griko, a frontend developer based in Indonesia", with today's role and city.
      title: (f) =>
        `I'm ${f.name.split(" ")[0]}, ${article(f.role)} ${f.role?.toLowerCase()} based in ${f.location}`,
      // The text of today's about page; the 2023 page had no photos in its body.
      body: (_, live) => aboutText(live),
    },
    {
      slug: "now",
      title: "Now Page",
      description: "Current state of mind of what's happening now",
      from: "now",
    },
    {
      slug: "articles",
      title: "Writing on software development and random personal tidbits.",
      description:
        "All of my long-form thoughts on programming and probably about life, collected in chronological order.",
    },
    {
      slug: "projects",
      title: "Things I've made trying to put my dent in the universe.",
      description:
        "I've worked on tons of little projects over the years but these are the ones that I'm most proud of. Many of them are open-source, so if you see something that piques your interest, check out the code and contribute if you have ideas for how it can be improved.",
    },
  ],
  intro: (f) => [
    // The headline above already names the employer when it says "… at Wayfindr".
    block(
      f.headlineNamesEmployer
        ? ["Previously at ", ...list(f.previous), "."]
        : [
            `${f.role}. Currently working at `,
            link(f.organization),
            ". Previously at ",
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
