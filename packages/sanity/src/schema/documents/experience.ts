import { CaseIcon } from "@sanity/icons/Case"
import { orderRankOrdering } from "@sanity/orderable-document-list"
import { defineArrayMember, defineField, defineType } from "sanity"

import {
  dateRangeFields,
  highlightsField,
  onResumeField,
  orderField,
  organizationField,
  technologiesField,
} from "../shared/fields"

export const experience = defineType({
  name: "experience",
  type: "document",
  icon: CaseIcon,
  orderings: [
    orderRankOrdering,
    {
      title: "Start date, newest first",
      name: "startDesc",
      by: [{ field: "startDate", direction: "desc" }],
    },
  ],
  fields: [
    orderField("experience"),
    organizationField({ required: true }),
    defineField({ name: "role", type: "string", validation: (rule) => rule.required() }),
    defineField({
      name: "workMode",
      type: "string",
      options: {
        list: [
          { title: "Remote", value: "remote" },
          { title: "Hybrid", value: "hybrid" },
          { title: "On-site", value: "onsite" },
        ],
        layout: "radio",
        direction: "horizontal",
      },
    }),
    ...dateRangeFields(),
    highlightsField,
    technologiesField,
    defineField({
      name: "links",
      type: "array",
      description: "Products or sites built in this role. Pages show each one by its host name.",
      of: [defineArrayMember({ type: "url" })],
      validation: (rule) => rule.unique(),
    }),
    onResumeField,
  ],
  preview: {
    select: {
      role: "role",
      org: "organization.name",
      start: "startDate",
      end: "endDate",
    },
    prepare: ({ role, org, start, end }) => ({
      title: role,
      subtitle: [org, [start, end ?? "now"].filter(Boolean).join(" – ")]
        .filter(Boolean)
        .join(" · "),
    }),
  },
})
