import { UserIcon } from "@sanity/icons/User"
import { defineArrayMember, defineField, defineType } from "sanity"

/** The one person behind every site; resume, web and media all read from here. */
export const profile = defineType({
  name: "profile",
  type: "document",
  icon: UserIcon,
  groups: [
    { name: "identity", title: "Identity", default: true },
    { name: "about", title: "About" },
    { name: "contact", title: "Contact" },
  ],
  fields: [
    defineField({
      name: "name",
      title: "Full name",
      type: "string",
      group: "identity",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "givenName", type: "string", group: "identity" }),
    defineField({ name: "familyName", type: "string", group: "identity" }),
    defineField({
      name: "handle",
      type: "string",
      group: "identity",
      description: "e.g. grikomsn",
    }),
    defineField({
      name: "headline",
      type: "string",
      group: "identity",
      description:
        "What you do now, in a few words, e.g. “Engineering Manager”. Site descriptions and every archived version show it.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "avatar",
      type: "reference",
      to: [{ type: "portrait" }],
      group: "identity",
      description: "Shown on the resume.",
    }),
    defineField({
      name: "icon",
      type: "reference",
      to: [{ type: "portrait" }],
      group: "identity",
      description:
        "The mascot: the small avatar in site headers, footers, the home page and archived versions.",
    }),
    defineField({ name: "location", type: "string", group: "identity" }),
    defineField({
      name: "timeZone",
      type: "string",
      group: "identity",
      description:
        "The IANA name of the time zone at the location, e.g. Asia/Jakarta. The home page shows the local time from it.",
      validation: (rule) =>
        rule.regex(/^[A-Za-z_]+(\/[A-Za-z0-9_+-]+)+$/, { name: "IANA time zone" }),
    }),
    defineField({
      name: "countryCode",
      type: "string",
      group: "identity",
      description: "ISO 3166-1 alpha-2, e.g. ID.",
      validation: (rule) => rule.length(2).uppercase(),
    }),
    defineField({
      name: "languages",
      type: "array",
      group: "identity",
      of: [defineArrayMember({ type: "string" })],
      options: { layout: "tags" },
    }),
    defineField({
      name: "summary",
      type: "text",
      rows: 4,
      group: "about",
      description: "Plain-text professional summary for the resume, meta tags and llms.txt.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "email",
      type: "string",
      group: "contact",
      validation: (rule) => rule.required().email(),
    }),
    defineField({ name: "scheduleUrl", title: "Scheduling URL", type: "url", group: "contact" }),
    defineField({
      name: "socialLinks",
      type: "array",
      group: "contact",
      of: [defineArrayMember({ type: "socialLink" })],
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "headline" },
  },
})
