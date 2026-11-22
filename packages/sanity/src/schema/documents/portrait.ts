import { ImageIcon } from "@sanity/icons/Image"
import { orderRankOrdering } from "@sanity/orderable-document-list"
import { defineField, defineType } from "sanity"

import { orderField } from "../shared/fields"

/** Photos and illustrations of Griko; the nibras.co/media gallery and avatars. */
export const portrait = defineType({
  name: "portrait",
  type: "document",
  icon: ImageIcon,
  orderings: [orderRankOrdering],
  fields: [
    orderField("portrait"),
    defineField({ name: "title", type: "string", validation: (rule) => rule.required() }),
    defineField({
      name: "image",
      type: "image",
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "alt",
      title: "Alternative text",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "caption", type: "text", rows: 2 }),
    defineField({
      name: "kind",
      type: "string",
      options: {
        list: [
          { title: "Photo", value: "photo" },
          { title: "Illustration", value: "illustration" },
        ],
        layout: "radio",
        direction: "horizontal",
      },
      initialValue: "photo",
    }),
    defineField({
      name: "credit",
      type: "string",
      description: "Photographer or illustrator.",
    }),
    defineField({ name: "creditUrl", title: "Credit URL", type: "url" }),
  ],
  preview: { select: { title: "title", subtitle: "credit", media: "image" } },
})
