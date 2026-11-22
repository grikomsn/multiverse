import { DocumentTextIcon } from "@sanity/icons/DocumentText"
import { defineArrayMember, defineField, defineType } from "sanity"

import { aliasesField, excerptField, slugField, visibilityField } from "../shared/fields"

export const post = defineType({
  name: "post",
  type: "document",
  icon: DocumentTextIcon,
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "meta", title: "Meta" },
  ],
  orderings: [
    {
      title: "Published, newest first",
      name: "publishedAtDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
  fields: [
    defineField({
      name: "title",
      type: "string",
      group: "content",
      validation: (rule) => rule.required(),
    }),
    { ...slugField("title"), group: "content" },
    defineField({
      name: "publishedAt",
      type: "datetime",
      group: "content",
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
    { ...excerptField, group: "content" },
    defineField({
      name: "cover",
      type: "figure",
      group: "content",
      description: "Also the social preview image.",
    }),
    defineField({
      name: "tags",
      type: "array",
      group: "content",
      description:
        'Topics as shown, for example "Web Development". Older site versions show them as tag pages.',
      of: [defineArrayMember({ type: "string" })],
      options: { layout: "tags" },
      validation: (rule) => rule.unique(),
    }),
    defineField({ name: "body", type: "richText", group: "content" }),
    { ...visibilityField, group: "meta" },
    { ...aliasesField, group: "meta" },
    defineField({
      name: "originalUrl",
      title: "Original URL",
      type: "url",
      group: "meta",
      description: "Set for cross-posts (Medium, DEV, Typefully); used as the canonical URL.",
    }),
    defineField({
      name: "lang",
      title: "Language",
      type: "string",
      group: "meta",
      initialValue: "en",
      validation: (rule) => rule.regex(/^[a-z]{2}(?:-[A-Z]{2})?$/),
    }),
  ],
  preview: {
    select: { title: "title", date: "publishedAt", visibility: "visibility", media: "cover" },
    prepare: ({ title, date, visibility, media }) => ({
      title,
      subtitle: [date?.slice(0, 10), visibility === "unlisted" ? "unlisted" : null]
        .filter(Boolean)
        .join(" · "),
      media,
    }),
  },
})
