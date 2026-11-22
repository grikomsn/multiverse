import { UsersIcon } from "@sanity/icons/Users"
import { defineField, defineType } from "sanity"

/** Companies, communities and schools; career entries point here for the name and URL. */
export const organization = defineType({
  name: "organization",
  type: "document",
  icon: UsersIcon,
  orderings: [{ title: "Name", name: "nameAsc", by: [{ field: "name", direction: "asc" }] }],
  fields: [
    defineField({ name: "name", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "url", title: "URL", type: "url" }),
  ],
  preview: {
    select: { title: "name", subtitle: "url" },
  },
})
