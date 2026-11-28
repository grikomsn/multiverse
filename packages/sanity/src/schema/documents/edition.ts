import { ArchiveIcon } from "@sanity/icons/Archive"
import { defineArrayMember, defineField, defineType } from "sanity"

import { EDITION_STATUSES } from "../../constants"
import { dateRangeFields, slugField } from "../shared/fields"

/**
 * An image or file a past design is drawn with: a wordmark, a favicon, a texture, a 404 GIF.
 * Facts never go here; every version reads those from current documents.
 */
export const editionAsset = defineType({
  name: "editionAsset",
  title: "Design asset",
  type: "object",
  fields: [
    defineField({
      name: "name",
      type: "string",
      description: "What the edition code looks it up by, e.g. “wordmark”, “icon” or “noise”.",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "image", type: "figure" }),
    defineField({
      name: "url",
      title: "URL",
      type: "url",
      description: "For an asset served from elsewhere, e.g. a GIF.",
    }),
  ],
  preview: { select: { title: "name", subtitle: "url", media: "image" } },
})

/**
 * One past version of the personal site, served at archive.nibras.co/<key>. Every version shows
 * today's content in its old design: this document holds only what the index lists and the
 * design assets. The version's interface copy lives in its code (`apps/archive/src/editions`).
 */
export const edition = defineType({
  name: "edition",
  title: "Archive edition",
  type: "document",
  icon: ArchiveIcon,
  groups: [
    { name: "meta", title: "Meta", default: true },
    { name: "design", title: "Design" },
  ],
  orderings: [
    {
      title: "Oldest first",
      name: "startDateAsc",
      by: [{ field: "startDate", direction: "asc" }],
    },
  ],
  fields: [
    defineField({
      name: "title",
      type: "string",
      description: "e.g. “Version 4”.",
      group: "meta",
      validation: (rule) => rule.required(),
    }),
    defineField({
      ...slugField("title"),
      name: "key",
      title: "Key",
      description: "Path on archive.nibras.co, e.g. “v4” or “2023a”.",
      group: "meta",
    }),
    defineField({
      name: "status",
      type: "string",
      options: {
        list: EDITION_STATUSES.map(({ title, value }) => ({ title, value })),
        layout: "radio",
        direction: "horizontal",
      },
      initialValue: "rebuilt",
      group: "meta",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "domain", type: "string", description: "e.g. griko.id.", group: "meta" }),
    ...dateRangeFields().map((field) => ({ ...field, group: "meta" })),
    defineField({
      name: "stack",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      options: { layout: "tags" },
      group: "meta",
    }),
    defineField({ name: "summary", type: "text", rows: 3, group: "meta" }),
    defineField({ name: "sourceUrl", title: "Source URL", type: "url", group: "meta" }),
    defineField({ name: "waybackUrl", title: "Wayback URL", type: "url", group: "meta" }),
    defineField({
      name: "screenshots",
      type: "array",
      description: "The rebuilt version first. The index shows it. Then the original, if captured.",
      of: [defineArrayMember({ type: "figure" })],
      options: { layout: "grid" },
      group: "meta",
    }),
    defineField({
      name: "assets",
      type: "array",
      of: [defineArrayMember({ type: "editionAsset" })],
      group: "design",
    }),
  ],
  preview: {
    select: {
      title: "title",
      key: "key.current",
      domain: "domain",
      start: "startDate",
      status: "status",
      media: "screenshots.0",
    },
    prepare: ({ title, key, domain, start, status, media }) => ({
      title: `${title}${key ? ` (${key})` : ""}`,
      subtitle: [domain, start, EDITION_STATUSES.find((s) => s.value === status)?.title]
        .filter(Boolean)
        .join(" · "),
      media,
    }),
  },
})
