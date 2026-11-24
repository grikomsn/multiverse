/** A card with made-up facts, for the tests and for a build with no network (`--fixture`). */
import { CARD_VERSION, type Card } from "@multiverse/content/card"

export const FIXTURE: Card = {
  version: CARD_VERSION,
  website: "https://example.com",
  name: "Ada Example",
  givenName: "Ada",
  headline: "Engineer at Example Works",
  location: "Lisbon, Portugal",
  timeZone: "Europe/Lisbon",
  tagline: "I make [useful], [fast], and [friendly] things.",
  email: "ada@example.com",
  scheduleUrl: "https://example.com/call",
  profiles: [
    { platform: "github", label: "GitHub", url: "https://github.com/example", featured: true },
    { platform: "steam", label: "Steam", url: "https://steam.example/ada", featured: false },
  ],
  experience: [
    {
      organization: "Example Works",
      url: "https://works.example",
      roles: ["Engineering Manager", "Engineer"],
      start: "2025-01-01",
    },
    { organization: "Example School", roles: ["Lecturer"], start: "2025-03-01" },
    { organization: "Old Place", roles: ["Developer"], start: "2019-01-01", end: "2019-12-01" },
    // A second time at the same organization: the same name and address as the first entry.
    {
      organization: "Example Works",
      url: "https://works.example",
      roles: ["Founding Engineer"],
      start: "2016-01-01",
      end: "2018-12-01",
    },
  ],
  projects: [
    {
      name: "Widget",
      summary: "A small widget.",
      url: "https://github.com/example/widget",
      technologies: ["TypeScript"],
    },
  ],
  posts: [
    {
      title: "Hello, terminal",
      url: "https://example.com/hello-terminal",
      date: "2026-01-02T03:04:05Z",
      summary: "A first post.",
    },
  ],
  talks: [{ title: "Dots", event: "Example Conf", date: "2025-05-06" }],
  versions: 12,
}
