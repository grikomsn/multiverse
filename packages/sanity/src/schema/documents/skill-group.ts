import { TagIcon } from "@sanity/icons/Tag"
import { orderRankOrdering } from "@sanity/orderable-document-list"
import { defineArrayMember, defineField, defineType } from "sanity"

import { onResumeField, orderField } from "../shared/fields"

export const skillGroup = defineType({
  name: "skillGroup",
  title: "Skill group",
  type: "document",
  icon: TagIcon,
  orderings: [orderRankOrdering],
  fields: [
    orderField("skillGroup"),
    defineField({ name: "name", type: "string", validation: (rule) => rule.required() }),
    defineField({
      name: "skills",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      options: { layout: "tags" },
      validation: (rule) => rule.required().min(1).unique(),
    }),
    onResumeField,
  ],
  preview: {
    select: { title: "name", skills: "skills" },
    prepare: ({ title, skills }) => ({
      title,
      subtitle: (skills as string[] | undefined)?.join(", "),
    }),
  },
})
