import { DocumentIcon } from "@sanity/icons/Document"
import { defineField, defineType } from "sanity"

import { aliasesField, excerptField, slugField, visibilityField } from "../shared/fields"

/** Standalone pages such as /about, /uses or /schedule; nested slugs allowed. */
export const page = defineType({
  name: "page",
  type: "document",
  icon: DocumentIcon,
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "meta", title: "Meta" },
  ],
  fields: [
    defineField({
      name: "title",
      type: "string",
      group: "content",
      validation: (rule) => rule.required(),
    }),
    { ...slugField("title", { allowNested: true }), group: "content" },
    { ...excerptField, group: "content" },
    defineField({
      name: "cover",
      type: "figure",
      group: "content",
      description: "The social preview image.",
    }),
    defineField({ name: "body", type: "richText", group: "content" }),
    defineField({
      name: "updatedAt",
      title: "Last reviewed",
      type: "date",
      group: "content",
      description: "Shown on pages that age, like /uses.",
    }),
    { ...visibilityField, group: "meta" },
    { ...aliasesField, group: "meta" },
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
    select: { title: "title", slug: "slug.current", visibility: "visibility", media: "cover" },
    prepare: ({ title, slug, visibility, media }) => ({
      title,
      media,
      subtitle: [slug ? `/${slug}` : null, visibility === "unlisted" ? "unlisted" : null]
        .filter(Boolean)
        .join(" · "),
    }),
  },
})
