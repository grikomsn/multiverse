import { orderRankField } from "@sanity/orderable-document-list"
import { defineArrayMember, defineField, type SlugOptions } from "sanity"

/** Lowercase, hyphenated; `/` allowed only when `allowNested` (e.g. `dijual/macbook`). */
export function slugField(source = "title", { allowNested = false } = {}) {
  const pattern = allowNested ? /^[a-z0-9]+(?:[-/][a-z0-9]+)*$/ : /^[a-z0-9]+(?:-[a-z0-9]+)*$/
  return defineField({
    name: "slug",
    type: "slug",
    options: { source, maxLength: 96 } satisfies SlugOptions,
    validation: (rule) =>
      rule.required().custom((slug) => {
        if (!slug?.current) return true
        return pattern.test(slug.current) || "Use lowercase letters, numbers and hyphens"
      }),
  })
}

/**
 * Earlier addresses of a post or page. nibras.co redirects each one to the current slug, so the
 * old address is kept where the new one is set.
 */
export const aliasesField = defineField({
  name: "aliases",
  title: "Old addresses",
  type: "array",
  description:
    "Paths that redirect here, without the leading slash, e.g. “about-me”. Add the old slug when you change the slug.",
  of: [
    defineArrayMember({
      type: "string",
      validation: (rule) =>
        rule.regex(/^[\w\-.%~:@+]+(?:\/[\w\-.%~:@+]+)*$/, { name: "path without a leading slash" }),
    }),
  ],
  options: { layout: "tags" },
  validation: (rule) =>
    rule.unique().custom((aliases: string[] | undefined, context) => {
      const slug = (context.document as { slug?: { current?: string } } | undefined)?.slug?.current
      return slug && aliases?.includes(slug) ? "An old address cannot be the current slug" : true
    }),
})

/** The description in lists, feeds and meta tags. */
export const excerptField = defineField({
  name: "excerpt",
  type: "text",
  rows: 3,
  validation: (rule) => rule.max(280),
})

/** Published-but-unlisted replaces Bear Blog's "discoverable" flag; drafts stay Sanity drafts. */
export const visibilityField = defineField({
  name: "visibility",
  type: "string",
  description:
    "Unlisted documents are reachable by URL but left out of indexes, feeds and sitemaps.",
  options: {
    list: [
      { title: "Listed", value: "listed" },
      { title: "Unlisted", value: "unlisted" },
    ],
    layout: "radio",
    direction: "horizontal",
  },
  initialValue: "listed",
  validation: (rule) => rule.required(),
})

/** Where the resume and the site should surface a career entry. */
export const onResumeField = defineField({
  name: "onResume",
  title: "Show on resume",
  type: "boolean",
  initialValue: true,
})

export const technologiesField = defineField({
  name: "technologies",
  type: "array",
  of: [defineArrayMember({ type: "string" })],
  options: { layout: "tags" },
  validation: (rule) => rule.unique(),
})

export const highlightsField = defineField({
  name: "highlights",
  type: "array",
  description: "One achievement per item. Rendered as resume bullets and plain-text exports.",
  of: [defineArrayMember({ type: "text", rows: 2 })],
})

export function organizationField(options: { required?: boolean; description?: string } = {}) {
  return defineField({
    name: "organization",
    type: "reference",
    to: [{ type: "organization" }],
    description: options.description,
    validation: (rule) => (options.required ? rule.required() : rule),
  })
}

/** Start/end pair using the shared `partialDate` type; empty end means ongoing. */
export function dateRangeFields({ requireStart = true } = {}) {
  return [
    defineField({
      name: "startDate",
      type: "partialDate",
      validation: (rule) => (requireStart ? rule.required() : rule),
    }),
    defineField({
      name: "endDate",
      type: "partialDate",
      description: "Leave empty if ongoing.",
      validation: (rule) =>
        rule.custom((end: string | undefined, context) => {
          const start = (context.document as { startDate?: string } | undefined)?.startDate
          if (!end || !start) return true
          return end >= start.slice(0, end.length) || "End date is before the start date"
        }),
    }),
  ]
}

export function orderField(type: string) {
  return orderRankField({ type, newItemPosition: "before" })
}
