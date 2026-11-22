import { ComposeIcon } from "@sanity/icons/Compose"
import { defineField, defineType } from "sanity"

import { organizationField, slugField } from "../shared/fields"

/** Served unlisted at nibras.co/resume/cover-letters/<slug>. */
export const coverLetter = defineType({
  name: "coverLetter",
  type: "document",
  icon: ComposeIcon,
  fields: [
    defineField({ name: "title", type: "string", validation: (rule) => rule.required() }),
    slugField("title"),
    organizationField({ required: true }),
    defineField({ name: "jobPostUrl", title: "Job post URL", type: "url" }),
    defineField({ name: "body", type: "richText", validation: (rule) => rule.required() }),
  ],
  preview: { select: { title: "title", subtitle: "organization.name" } },
})
