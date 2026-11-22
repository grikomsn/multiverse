import { CogIcon } from "@sanity/icons/Cog"
import { defineField, defineType } from "sanity"

/**
 * nibras.co settings and its front page text; layout lives in code. The site title is the short
 * name from Profile, and the address comes from the app (`site` in astro.config).
 */
export const site = defineType({
  name: "site",
  type: "document",
  icon: CogIcon,
  fields: [
    defineField({
      name: "description",
      type: "text",
      rows: 3,
      description:
        "What the site offers, without facts that live elsewhere. Pages add the name, role and city from Profile.",
      validation: (rule) => rule.max(180).warning("Keep it under 180 characters"),
    }),
    defineField({
      name: "tagline",
      type: "string",
      description:
        'One line under the greeting on the front page. Put up to three highlighted words in square brackets: "I make [useful], [fast], and [friendly] things." Empty uses that example.',
      validation: (rule) =>
        rule.max(120).custom((value) => {
          const marks = value?.match(/\[[^[\]]+\]/g) ?? []
          if (/[[\]]/.test(value?.replace(/\[[^[\]]+\]/g, "") ?? ""))
            return "Close every [ with a ], with words between them and no [ inside."
          if (marks.length > 3) return "Highlight three words or fewer."
          return true
        }),
    }),
    defineField({
      name: "intro",
      type: "richText",
      description: "The front page intro. Empty uses the intro written in code.",
    }),
  ],
  preview: {
    select: { subtitle: "description" },
    prepare: ({ subtitle }) => ({ title: "Site", subtitle }),
  },
})
