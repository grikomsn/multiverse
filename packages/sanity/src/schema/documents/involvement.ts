import { HeartIcon } from "@sanity/icons/Heart"
import { orderRankOrdering } from "@sanity/orderable-document-list"
import { defineField, defineType } from "sanity"

import {
  dateRangeFields,
  highlightsField,
  onResumeField,
  orderField,
  organizationField,
} from "../shared/fields"

/** Community roles: organizing, mentoring, maintaining a community project. */
export const involvement = defineType({
  name: "involvement",
  type: "document",
  icon: HeartIcon,
  orderings: [orderRankOrdering],
  fields: [
    orderField("involvement"),
    organizationField({ required: true }),
    defineField({
      name: "role",
      type: "string",
      description: "e.g. “Core organizer”, “Mentor”.",
      validation: (rule) => rule.required(),
    }),
    ...dateRangeFields(),
    defineField({ name: "summary", type: "text", rows: 3 }),
    highlightsField,
    defineField({
      name: "url",
      title: "URL",
      type: "url",
      description: "Only if it differs from the organization's URL, e.g. an event page.",
    }),
    onResumeField,
  ],
  preview: {
    select: {
      org: "organization.name",
      role: "role",
      start: "startDate",
    },
    prepare: ({ org, role, start }) => ({
      title: org,
      subtitle: [role, start].filter(Boolean).join(" · "),
    }),
  },
})
