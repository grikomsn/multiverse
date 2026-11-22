import { CalendarIcon } from "@sanity/icons/Calendar"
import { defineType } from "sanity"

const PARTIAL_DATE = /^\d{4}(?:-(?:0[1-9]|1[0-2])(?:-(?:0[1-9]|[12]\d|3[01]))?)?$/

/** Résumé-style dates where precision varies: `2024`, `2024-06` or `2024-06-03`. */
export const partialDate = defineType({
  name: "partialDate",
  title: "Date",
  type: "string",
  icon: CalendarIcon,
  description: "YYYY, YYYY-MM or YYYY-MM-DD",
  validation: (rule) =>
    rule.custom((value) => {
      if (!value) return true
      return PARTIAL_DATE.test(value) || "Use YYYY, YYYY-MM or YYYY-MM-DD"
    }),
})
