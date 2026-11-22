import { ImageIcon } from "@sanity/icons/Image"
import { defineField, defineType } from "sanity"

/** Image with required alt text; used for covers, galleries and inline images. */
export const figure = defineType({
  name: "figure",
  type: "image",
  icon: ImageIcon,
  options: { hotspot: true },
  fields: [
    defineField({
      name: "alt",
      title: "Alternative text",
      type: "string",
      description: "Describe the image for screen readers.",
      validation: (rule) =>
        rule.custom((alt, context) => {
          const parent = context.parent as { asset?: unknown } | undefined
          return !parent?.asset || alt ? true : "Alt text is required"
        }),
    }),
    defineField({ name: "caption", type: "string" }),
  ],
  preview: {
    select: { title: "alt", subtitle: "caption", media: "asset" },
  },
})
