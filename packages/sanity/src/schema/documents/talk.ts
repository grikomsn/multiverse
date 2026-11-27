import { MicrophoneIcon } from "@sanity/icons/Microphone"
import { defineField, defineType } from "sanity"

import { onResumeField } from "../shared/fields"

/** Talks, workshops and other appearances. */
export const talk = defineType({
  name: "talk",
  type: "document",
  icon: MicrophoneIcon,
  orderings: [
    { title: "Date, newest first", name: "dateDesc", by: [{ field: "date", direction: "desc" }] },
  ],
  fields: [
    defineField({ name: "title", type: "string", validation: (rule) => rule.required() }),
    defineField({
      name: "kind",
      type: "string",
      options: {
        list: [
          { title: "Talk", value: "talk" },
          { title: "Workshop", value: "workshop" },
          { title: "Panel", value: "panel" },
          { title: "Podcast", value: "podcast" },
          { title: "Interview", value: "interview" },
          { title: "Livestream", value: "livestream" },
        ],
      },
      initialValue: "talk",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "event",
      type: "string",
      description: "Event or series name, e.g. “SurabayaJS Meetup #12”.",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "date", type: "date", validation: (rule) => rule.required() }),
    defineField({ name: "summary", type: "text", rows: 3 }),
    defineField({
      name: "url",
      title: "URL",
      type: "url",
      description: "The slides, a recording or the event page.",
    }),
    defineField({ name: "cover", type: "figure" }),
    onResumeField,
  ],
  preview: {
    select: { title: "title", event: "event", date: "date", media: "cover" },
    prepare: ({ title, event, date, media }) => ({
      title,
      subtitle: [event, date].filter(Boolean).join(" · "),
      media,
    }),
  },
})
