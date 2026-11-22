import { UsersIcon } from "@sanity/icons/Users"
import { defineField, defineType } from "sanity"

import { SOCIAL_PLATFORMS, platformLabel } from "../../constants"

export const socialLink = defineType({
  name: "socialLink",
  type: "object",
  icon: UsersIcon,
  fields: [
    defineField({
      name: "platform",
      type: "string",
      options: { list: SOCIAL_PLATFORMS.map(({ title, value }) => ({ title, value })) },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "label",
      type: "string",
      description:
        "Only when the platform's own name is wrong for this link. Leave empty otherwise.",
    }),
    defineField({
      name: "url",
      title: "URL",
      type: "url",
      validation: (rule) => rule.required().uri({ scheme: ["http", "https", "mailto"] }),
    }),
    defineField({
      name: "featured",
      type: "boolean",
      description: "Featured links show in headers and footers; the rest only on contact pages.",
      initialValue: false,
    }),
  ],
  preview: {
    select: { platform: "platform", label: "label", url: "url", featured: "featured" },
    prepare: ({ platform, label, url, featured }) => ({
      title: platformLabel(platform, label),
      subtitle: [featured ? "★" : null, url].filter(Boolean).join(" "),
    }),
  },
})
