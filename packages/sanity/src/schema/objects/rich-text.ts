import { BlockContentIcon } from "@sanity/icons/BlockContent"
import { CodeBlockIcon } from "@sanity/icons/CodeBlock"
import { InlineIcon } from "@sanity/icons/Inline"
import { LinkIcon } from "@sanity/icons/Link"
import { UsersIcon } from "@sanity/icons/Users"
import { defineArrayMember, defineField, defineType } from "sanity"

export const codeBlock = defineType({
  name: "codeBlock",
  type: "object",
  icon: CodeBlockIcon,
  fields: [
    defineField({ name: "language", type: "string", initialValue: "text" }),
    defineField({ name: "filename", type: "string" }),
    defineField({
      name: "code",
      type: "text",
      rows: 12,
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { language: "language", filename: "filename", code: "code" },
    prepare: ({ language, filename, code }) => ({
      title: filename ?? `Code (${language ?? "text"})`,
      subtitle: typeof code === "string" ? code.slice(0, 80) : undefined,
    }),
  },
})

/** Escape hatch for raw HTML: third-party iframes and the odd table carried over from Bear Blog. */
export const embed = defineType({
  name: "embed",
  type: "object",
  icon: InlineIcon,
  fields: [
    defineField({ name: "label", type: "string", validation: (rule) => rule.required() }),
    defineField({
      name: "html",
      title: "HTML",
      type: "text",
      rows: 6,
      validation: (rule) => rule.required(),
    }),
  ],
  preview: { select: { title: "label" } },
})

/**
 * Stands in for the profile links from Profile, so a page never copies them. Pages render the
 * list where this block sits.
 */
export const profileLinks = defineType({
  name: "profileLinks",
  title: "Profile links",
  type: "object",
  icon: UsersIcon,
  fields: [
    defineField({
      name: "featuredOnly",
      type: "boolean",
      description: "Only the featured links. Off lists every link and the email address.",
      initialValue: false,
    }),
  ],
  preview: {
    select: { featuredOnly: "featuredOnly" },
    prepare: ({ featuredOnly }) => ({
      title: "Profile links",
      subtitle: featuredOnly ? "Featured links" : "Every link and the email address",
    }),
  },
})

export const richText = defineType({
  name: "richText",
  type: "array",
  icon: BlockContentIcon,
  of: [
    defineArrayMember({
      type: "block",
      styles: [
        { title: "Normal", value: "normal" },
        { title: "Heading 2", value: "h2" },
        { title: "Heading 3", value: "h3" },
        { title: "Heading 4", value: "h4" },
        { title: "Quote", value: "blockquote" },
      ],
      lists: [
        { title: "Bullet", value: "bullet" },
        { title: "Numbered", value: "number" },
      ],
      marks: {
        decorators: [
          { title: "Strong", value: "strong" },
          { title: "Emphasis", value: "em" },
          { title: "Code", value: "code" },
          { title: "Strike", value: "strike-through" },
        ],
        annotations: [
          defineArrayMember({
            name: "link",
            type: "object",
            icon: LinkIcon,
            description: "Pick a post or page on this site, or enter a URL.",
            fields: [
              // A reference keeps working when the post or page gets a new address.
              defineField({
                name: "internal",
                title: "Post or page",
                type: "reference",
                to: [{ type: "post" }, { type: "page" }],
              }),
              defineField({
                name: "href",
                title: "URL",
                type: "url",
                hidden: ({ parent }) => Boolean(parent?.internal),
                validation: (rule) =>
                  rule
                    .uri({ scheme: ["http", "https", "mailto", "tel"], allowRelative: true })
                    .custom((href, context) => {
                      const parent = context.parent as { internal?: unknown } | undefined
                      return href || parent?.internal ? true : "Pick a post or page, or add a URL"
                    }),
              }),
            ],
          }),
        ],
      },
    }),
    defineArrayMember({ type: "figure" }),
    defineArrayMember({ type: "codeBlock" }),
    defineArrayMember({ type: "embed" }),
    defineArrayMember({ type: "profileLinks" }),
  ],
})
