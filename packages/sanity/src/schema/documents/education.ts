import { BookIcon } from "@sanity/icons/Book"
import { orderRankOrdering } from "@sanity/orderable-document-list"
import { defineField, defineType } from "sanity"

import {
  dateRangeFields,
  highlightsField,
  onResumeField,
  orderField,
  organizationField,
} from "../shared/fields"

export const education = defineType({
  name: "education",
  type: "document",
  icon: BookIcon,
  orderings: [orderRankOrdering],
  fields: [
    orderField("education"),
    organizationField({ required: true, description: "The school." }),
    defineField({ name: "degree", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "field", title: "Field of study", type: "string" }),
    ...dateRangeFields(),
    highlightsField,
    onResumeField,
  ],
  preview: {
    select: {
      org: "organization.name",
      degree: "degree",
      field: "field",
    },
    prepare: ({ org, degree, field }) => ({
      title: org,
      subtitle: [degree, field].filter(Boolean).join(", "),
    }),
  },
})
